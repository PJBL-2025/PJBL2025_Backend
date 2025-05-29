import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategory,
  getOneCategory,
  updateCategory,
} from '../controllers/category.controller';
import { adminAuth, authorize } from '../middlewares/auth.middleware';

const categoryRoute = Router();

categoryRoute.get('/', getCategory);
categoryRoute.get('/:slug', getOneCategory);
categoryRoute.post('/', authorize, adminAuth, createCategory);
categoryRoute.patch('/:id', authorize, adminAuth, updateCategory);
categoryRoute.delete('/:id', authorize, adminAuth, deleteCategory);

export default categoryRoute;