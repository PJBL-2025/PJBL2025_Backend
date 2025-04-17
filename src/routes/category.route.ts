import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategory,
  getOneCategory,
  updateCategory,
} from '../controllers/category.controller';

const categoryRoute = Router();

categoryRoute.get('/', getCategory);
categoryRoute.get('/:slug', getOneCategory);
categoryRoute.post('/', createCategory);
categoryRoute.patch('/:id', updateCategory);
categoryRoute.delete('/:id', deleteCategory);

export default categoryRoute;