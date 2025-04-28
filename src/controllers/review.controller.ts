import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../utils/db';
import { ErrorCode } from '../exceptions/http.exception';
import { UnprocessableEntry } from '../exceptions/validation.exception';
import { AuthRequest } from '../types/AuthRequest';

export const getAllReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId);
    const review = await prismaClient.review.findMany({
      where: { product_id: productId },
      include: {
        user: {
          select: { id: true, name: true, username: true },
        },
      },
    });

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { star, comment } = req.body;
    const userId = req.user;
    const productData = parseInt(req.params.productId);

    await prismaClient.review.create({
      data: {
        star: parseInt(star),
        comment,

        product: {
          connect: {
            id: productData,
          },
        },

        user: {
          connect: {
            id: userId?.id,
          },
        },
      },
    });

    res.json({ success: true, message: 'review successfully added' });
  } catch (err: any) {
    return next(new UnprocessableEntry(err.cause?.issues || err.message, 'Unprocessable Entry', ErrorCode.UNPROCESSABLE_ENTITY));
  }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { star, comment } = req.body;
    const userId = req.user;
    const productData = parseInt(req.params.productId);

    const review = await prismaClient.review.findFirst({
      where: {
        product_id: productData,
        user_id: userId?.id,
      },
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await prismaClient.review.update({
      where: { id: review.id },
      data: {
        star: parseInt(star),
        comment,

        product: {
          connect: {
            id: productData,
          },
        },

        user: {
          connect: {
            id: userId?.id,
          },
        },
      },
    });

    res.json({ success: true, data: 'Review successfully Updated' });
  } catch (err) {
    next(err);
  }
};
