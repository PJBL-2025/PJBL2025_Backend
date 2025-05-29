import { Response, Request, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import { prismaClient } from '../utils/db';

export const reviewMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user;
    const productId = parseInt(req.params.id);

    const hasCheckout = await prismaClient.product_checkout.findFirst({
      where: {
        product_id: productId,
        checkout: {
          user_id: userId?.id,
        },
      },
    });

    if (!hasCheckout) {
      return res.status(403).json({ message: 'You can only review your own product' });
    }

    const hasReview = await prismaClient.review.findFirst({
      where: {
        product_id: productId,
        user_id: userId?.id,
      },
    });

    if (hasReview) {
      return res.status(403).json({ message: 'You have already reviewed this product.' });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: 'You must checkout the product before you can review it.' });
  }
};
