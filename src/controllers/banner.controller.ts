import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../utils/db';
import { faker } from '@faker-js/faker';

export const getBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prismaClient.products.findMany({
      include: {
        product_images: true,
      },
      omit: {
        description: true,
        quantity: true,
        weight: true,
        created_at: true,
      },
    });

    const today = new Date();
    const dateSeed = parseInt(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`);
    faker.seed(dateSeed);

    const randomProduct = faker.helpers.arrayElements(products, 5);

    const formattedResponse = randomProduct.map((product) => {
      const imageArray = product?.product_images.map(img => img.image_path);

      return {
        ...product,
        product_images: imageArray[0],
      };
    });

    res.json({ success: true, data: formattedResponse });
  } catch (err) {
    next(err);
  }
};