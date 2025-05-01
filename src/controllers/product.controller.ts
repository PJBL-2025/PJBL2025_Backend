import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../utils/db';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { BadRequestException, ErrorCode } from '../exceptions/http.exception';

export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prismaClient.products.findMany({
      include: {
        product_category: {
          include: { category: true },
        },
        product_images: true,
      },
    });

    res.json({ success: true, products: products });
  } catch (err) {
    next(err);
  }
};

export const getOneProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);

    const products = await prismaClient.products.findUnique({
      where: { id: productId },
      include: {
        product_category: {
          include: { category: true },
        },
        product_images: true,
      },
    });

    res.json({ success: true, products: products });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, description, quantity, price, weight, categoryIds, sizeIds } = req.body;
    const files = req.files as Express.Multer.File[];
    let categoriesid: number[] = [];
    let sizeValue: string[] = [];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid product images' });
    }

    if (Array.isArray(categoryIds)) {
      categoriesid = categoryIds.map((id: string) => parseInt(id));
    } else if (typeof categoryIds === 'string') {
      categoriesid = [parseInt(categoryIds)];
    } else {
      return next(new BadRequestException('Category harus berupa string atau array', ErrorCode.UNPROCESSABLE_ENTITY));
    }

    if (Array.isArray(sizeIds)) {
      sizeValue = sizeIds;
    } else if (typeof sizeIds === 'string') {
      sizeValue = [sizeIds];
    } else {
      return next(new BadRequestException('Size harus berupa string atau array', ErrorCode.UNPROCESSABLE_ENTITY));
    }

    await prismaClient.products.create({
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        price: parseInt(price),
        weight: parseInt(weight),

        product_images: {
          create: files.map((file) => ({
            image: file.originalname,
            image_path: file.path,
          })),
        },

        product_category: {
          create: categoriesid.map((id: number) => ({
            category: {
              connect: { id: id },
            },
          })),
        },

        product_size: {
          create: sizeValue.map((size: string) => ({
            size: {
              connect: { size: size as any },
            },
          })),
        },
      },

      include: {
        product_images: true,
        product_category: {
          include: { category: true },
        },
      },
    });

    res.json({ success: true, message: 'Product created successfully.' });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issue || err.message, 'Unprocessable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, description, quantity, price, weight, categoryIds, sizeIds } = req.body;
    const files = req.files as Express.Multer.File[];
    let categoriesid: number[] = [];
    let sizeValue: string[] = [];

    if (Array.isArray(categoryIds)) {
      categoriesid = categoryIds.map((id: string) => parseInt(id));
    } else if (typeof categoryIds === 'string') {
      categoriesid = [parseInt(categoryIds)];
    } else {
      return next(new BadRequestException('Category harus berupa string atau array', ErrorCode.UNPROCESSABLE_ENTITY));
    }

    if (Array.isArray(sizeIds)) {
      sizeValue = sizeIds;
    } else if (typeof sizeIds === 'string') {
      sizeValue = [sizeIds];
    } else {
      return next(new BadRequestException('Size harus berupa string atau array', ErrorCode.UNPROCESSABLE_ENTITY));
    }

    await prismaClient.products.update({
      where: { id: productId },
      data: {
        name,
        description,
        quantity,
        price,
        weight,

        product_images: {
          create: files.map((file) => ({
            image: file.originalname,
            image_path: file.path,
          })),
        },

        product_category: {
          deleteMany: {},
          create: categoriesid.map((ids: number) => ({
            category: {
              connect: { id: ids },
            },
          })),
        },

        product_size: {
          deleteMany: {},
          create: sizeValue.map((size: string) => ({
            size: {
              connect: { size: size as any },
            },
          })),
        },
      },

      include: {
        product_images: true,
        product_category: {
          include: { category: true },
        },
      },
    });

    res.json({ success: true, message: 'Product update successfully.' });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issue || err.message, 'Unprocessable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);

    await prismaClient.products.delete({
      where: { id: productId },
    });

    res.json({ success: true, message: 'Product delete successfully.' });
  } catch (err: any) {
    next(err);
  }
};