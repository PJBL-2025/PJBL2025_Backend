import { Router } from 'express';
import { signIn, signUp } from '../controllers/auth.controller';

const authRoute = Router();

authRoute.post('/signup', signUp);
authRoute.post('/signin', signIn);

export default authRoute;