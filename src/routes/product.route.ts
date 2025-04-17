import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
} from '../controllers/product.controller';
import { adminAuth, authorize } from '../middlewares/auth.middleware';

const productRouter = Router();

productRouter.get('/', getAllProduct);
productRouter.get('/:id', getOneProduct);
productRouter.post('/', authorize, adminAuth, createProduct);
productRouter.patch('/:id', authorize, adminAuth, updateProduct);
productRouter.delete('/:id', authorize, adminAuth, deleteProduct);

export default productRouter;