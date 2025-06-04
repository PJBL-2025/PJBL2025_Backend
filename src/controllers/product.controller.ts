import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../utils/db';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { BadRequestException, ErrorCode } from '../exceptions/http.exception';

export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prismaClient.products.findMany({
      include: {
        product_category: {
          select: {
            category: {
              select: {
                category: true,
              },
            },
          },
        },
        product_images: true,
        review: {
          omit: {
            id: true,
            product_id: true,
          },
        },
        product_checkout: true,
      },
      omit: {
        description: true,
        weight: true,
        quantity: true,
        created_at: true,
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak diteemukan' });
    }

    const formattedResponse = products.map((product) => {
      const imageArray = product.product_images.map(img => img.image_path);
      const reviewArray = product.review.map((review) => review.star);

      const avgRating = reviewArray.length > 0 ? Math.round(reviewArray.reduce((total, num) => total + num, 0) / reviewArray.length * 10) / 10 : 0;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        product_images: imageArray[0],
        star: avgRating,
        sold: product.product_checkout.length,
        product_category: product.product_category.map(pc => pc.category.category),
      };
    });

    res.json({ success: true, products: formattedResponse });
  } catch (err) {
    next(err);
  }
};

export const getSearchProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.query;

    if (typeof query !== 'string' || query.trim() === '') {
      return res.status(404).json({ success: false, message: 'Produk belum dicari' });
    }

    const products = await prismaClient.products.findMany({
      where: {
        name: {
          contains: query.trim().toLowerCase(),
        },
      },
      include: {
        product_category: {
          select: {
            category: {
              select: {
                category: true,
              },
            },
          },
        },
        product_images: true,
        review: {
          omit: {
            id: true,
            product_id: true,
          },
        },
        product_checkout: true,
      },
      omit: {
        description: true,
        weight: true,
        quantity: true,
        created_at: true,
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const formattedResponse = products.map((product) => {
      const imageArray = product.product_images.map(img => img.image_path);
      const reviewArray = product.review.map((review) => review.star);

      const avgRating = reviewArray.length > 0 ? Math.round(reviewArray.reduce((total, num) => total + num, 0) / reviewArray.length * 10) / 10 : 0;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        product_images: imageArray[0],
        star: avgRating,
        sold: product.product_checkout.length,
        product_category: product.product_category.map(pc => pc.category.category),
      };
    });

    res.json({ success: true, query: query, products: formattedResponse });
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
          select: {
            category: {
              select: {
                category: true,
              },
            },
          },
        },
        product_images: true,
        product_size: {
          select: {
            size: true,
          },
        },
        review: {
          omit: {
            id: true,
            product_id: true,
          },
        },
      },
    });

    const productCheckout = await prismaClient.product_checkout.findMany({
      where: { product_id: productId },
    });

    if (!products) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const reviewArray = products.review.map((review) => review.star);
    const avgRating = reviewArray.length > 0 ? Math.round(reviewArray.reduce((total, num) => total + num, 0) / reviewArray.length * 10) / 10 : 0;

    const formattedCategory = {
      ...products,
      product_images: products.product_images.map(img => img.image_path),
      star: avgRating,
      sold: productCheckout?.length || 0,
      product_category: products.product_category.map(pc => pc.category.category),
      product_size: products.product_size.map(sz => sz.size.size),
    };

    res.json({ success: true, products: formattedCategory });
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
        review: true,
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
        review: true,
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