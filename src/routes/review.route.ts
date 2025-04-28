import { Router } from 'express';
import { createReview, updateReview, getAllReview } from '../controllers/review.controller';
import { reviewMiddleware } from '../middlewares/review.middleware';
import { authorize } from '../middlewares/auth.middleware';

const reviewRoute = Router();

reviewRoute.get('/:productId/review', getAllReview);
reviewRoute.post('/:productId/review', authorize, reviewMiddleware, createReview);
reviewRoute.put('/:productId/review/', authorize, reviewMiddleware, updateReview);

export default reviewRoute;