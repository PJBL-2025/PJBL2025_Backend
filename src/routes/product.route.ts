import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
} from '../controllers/product.controller';
import { adminAuth, authorize } from '../middlewares/auth.middleware';
import multer from 'multer';

const productRouter = Router();

const storage =  multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

productRouter.get('/', getAllProduct);
productRouter.get('/:id', getOneProduct);
productRouter.post('/', authorize, adminAuth, upload.array('product', 5), createProduct);
productRouter.patch('/:id', authorize, adminAuth, updateProduct);
productRouter.delete('/:id', authorize, adminAuth, deleteProduct);

export default productRouter;