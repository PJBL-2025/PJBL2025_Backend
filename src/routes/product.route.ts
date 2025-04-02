import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
} from '../controllers/product.controller';

const productRouter = Router();

productRouter.get('/', getAllProduct);
productRouter.get('/:id', getOneProduct);
productRouter.post('/', createProduct);
productRouter.patch('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;