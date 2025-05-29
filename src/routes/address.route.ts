import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import { createAddress, deleteAddress, getAddressByUser, updateAddress } from '../controllers/address.controller';

const addressRoute = Router();

addressRoute.get('/', authorize, getAddressByUser);
addressRoute.post('/', authorize, createAddress);
addressRoute.patch('/:id', authorize, updateAddress);
addressRoute.delete('/:id', authorize, deleteAddress);

export default addressRoute;