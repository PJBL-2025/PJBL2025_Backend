import { Router } from 'express';
import { getAllUser, getOneUser, updateUser } from '../controllers/user.controller';

const userRoute = Router();

userRoute.get('/', getAllUser);
userRoute.get('/:id', getOneUser);
userRoute.patch('/:id', updateUser);

export default userRoute;