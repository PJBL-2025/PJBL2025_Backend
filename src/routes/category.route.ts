import { Router } from 'express';
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../controllers/category.controller';

const categoryRoute = Router();

categoryRoute.get('/', getAllCategory);
categoryRoute.post('/', createCategory);
categoryRoute.patch('/:id', updateCategory);
categoryRoute.delete('/:id', deleteCategory);

export default categoryRoute;