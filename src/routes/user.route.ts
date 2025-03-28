import { Router } from 'express';
import { getAllUser, getOneUser, updateUser } from '../controllers/user.controller';
import { adminAuth, authorize, restrictToSelf } from '../middlewares/auth.middleware';

const userRoute = Router();

userRoute.get('/', authorize, adminAuth, getAllUser);
userRoute.get('/:id', authorize, getOneUser);
userRoute.patch('/:id', authorize, restrictToSelf, updateUser);

export default userRoute;