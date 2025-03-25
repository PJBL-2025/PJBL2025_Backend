import type { Request, Response, NextFunction } from 'express';
import { dbClient } from '../utils/db';

export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await dbClient.categories.findMany({});

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryData = req.body;
    const category = await dbClient.categories.create({
      data: categoryData,
    });

    res.json({ message: 'Category created!' });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.id);
    const categoryData = req.body;
    const category = await dbClient.categories.update({
      where: { id: categoryId },
      data: categoryData,
    });

    res.json({ message: 'Category updated!' });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await dbClient.categories.delete({
      where: { id: categoryId },
    });

    res.json({ message: 'Category deleted!' });
  } catch (error) {
    next(error);
  }
};