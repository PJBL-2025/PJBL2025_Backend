import { Router } from 'express';
import { getAllUser, getOneUser, updateUser } from '../controllers/user.controller';
import { adminAuth, authorize } from '../middlewares/auth.middleware';

const userRoute = Router();

userRoute.get('/all', authorize, adminAuth, getAllUser);
userRoute.get('/', authorize, getOneUser);
userRoute.patch('/', authorize, updateUser);

export default userRoute;