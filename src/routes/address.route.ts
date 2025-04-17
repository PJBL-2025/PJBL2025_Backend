import { Router } from 'express';
import { authorize, restrictToSelf } from '../middlewares/auth.middleware';
import { createAddress, deleteAddress, getAddressByUser, updateAddress } from '../controllers/address.controller';

const addressRoute = Router();

addressRoute.get('/:user_id', authorize, restrictToSelf, getAddressByUser);
addressRoute.post('/:user_id', authorize, createAddress);
addressRoute.patch('/:user_id/:id', authorize, updateAddress);
addressRoute.delete('/:user_id/:id', authorize, deleteAddress);

export default addressRoute;