import { Request, Response, NextFunction } from 'express';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { ErrorCode } from '../exceptions/http.exception';
import { prismaClient } from '../utils/db';

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryData = await prismaClient.categories.findMany();

    res.json({ success: true, data: categoryData });
  } catch (err: any) {
    next(err);
  }
};


export const getOneCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.params.slug;

    const categoryData = await prismaClient.categories.findUnique({
      where: { category: category },
      include: {
        product_category: {
          include: { product: true },
        },
      },
    });

    res.json({ success: true, data: categoryData });
  } catch (err: any) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.body;

    await prismaClient.categories.create({
      data: {
        category,
      },
    });

    res.json({ success: true, message: 'Category created' });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issue || err.message, 'Unprocesable entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.slug;
    const { category } = req.body;

    await prismaClient.categories.update({
      where: { category: categoryId },
      data: { category },
    });

    res.json({ success: true, message: 'Category updated' });
  } catch (err: any) {
    next(new UnprocessableEntry(err.cause?.issue || err.message, 'Unprocesable entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.slug;

    await prismaClient.categories.delete({
      where: { category: categoryId },
    });

    res.json({ success: true, message: 'Category deleted' });
  } catch (err: any) {
    next(err);
  }
};