import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../utils/db';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { ErrorCode } from '../exceptions/http.exception';


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
    const { name, description, quantity, price, weight, size, categoryIds } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid product images' });
    }

    await prismaClient.products.create({
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        price: parseInt(price),
        weight: parseInt(weight),
        size,

        product_images: {
          create: files.map((file) => ({
            image: file.originalname,
            image_path: file.path,
          })),
        },

        product_category: {
          create: categoryIds.map((ids: number) => ({
            category: {
              connect: { id: ids },
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
    const { name, description, quantity, price, weight, size, categoryIds } = req.body;
    const files = req.files as Express.Multer.File[];

    await prismaClient.products.update({
      where: { id: productId },
      data: {
        name,
        description,
        quantity,
        price,
        weight,
        size,

        product_images: {
          create: files.map((file) => ({
            image: file.originalname,
            image_path: file.path,
          })),
        },

        product_category: {
          deleteMany: {},
          create: categoryIds.map((ids: number) => ({
            category: {
              connect: { id: ids },
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