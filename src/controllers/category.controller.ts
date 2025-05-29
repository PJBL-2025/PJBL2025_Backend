import { Request, Response, NextFunction } from 'express';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { ErrorCode } from '../exceptions/http.exception';
import { prismaClient } from '../utils/db';

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryData = await prismaClient.categories.findMany({
      omit: {
        id: true,
      },
    });

    const formattedResponse = categoryData.map(ct => ct.category);

    res.json({ success: true, data: formattedResponse });
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
          omit: {
            id: true,
            product_id: true,
            category_id: true,
          },
          include: {
            product: {
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
            },
          },
        },
      },
      omit: {
        id: true,
      },
    });

    const formattedResponse = {
      ...categoryData,
      product_category: categoryData?.product_category.map(pc => pc.product),
    };

    const formattedProduct = formattedResponse.product_category?.map(product => {
      const imageArray = product?.product_images.map(img => img.image_path);
      const reviewArray = product?.review.map((review) => review.star);

      const avgRating = reviewArray.length > 0 ? Math.round(reviewArray.reduce((total, num) => total + num, 0 ) / reviewArray.length * 10) / 10 : 0;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        product_images: imageArray[0],
        star: avgRating,
        sold: product?.product_checkout.length,
        product_category: product?.product_category.map(pc => pc.category.category),
      };
    });

    res.json({ success: true, category: category, data: formattedProduct });
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