import type { Request, Response, NextFunction } from 'express';
import { dbClient } from '../utils/db';

export const getAllProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await dbClient.products.findMany({});
    const categories = await dbClient.categories.findMany({});

    res.json({ success: true, categories: categories, data: products });
  } catch (error) {
    next(error);
  }
};

export const getOneProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await dbClient.products.findUnique({
      where: { id: productId },
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProductWithCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const categoryData = await dbClient.categories.findFirst({
      where: { category },
      include: { product_category: true },
    });

    const products = await dbClient.products.findFirst({
      where: {
        product_category: {
          some: {
            category_id: categoryData?.id,
          },
        },
      },
      include: {
        product_category: {
          include: { category: true },
        },
      },
    });

    // const formattedProducts = products?.map((product) => ({
    //   ...product,
    //   product_category: product.product_category.map((pc) => pc.category.category),
    // }));

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body;
    const product = await dbClient.products.create({
      data: productData,
    });

    res.json({ success: true, message: 'produk berhasil ditambah', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    const productData = req.body;
    const product = await dbClient.products.update({
      where: { id: productId },
      data: productData,
    });

    res.json({ success: true, message: 'produk berhasil diedit' });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await dbClient.products.delete({
      where: { id: productId },
    });

    res.json({ success: true, message: 'produk berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};