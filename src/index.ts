import express from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import productRouter from './routes/product.route';
import categoryRoute from './routes/category.route';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import addressRoute from './routes/address.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/product', productRouter);
app.use('/api/category', categoryRoute);
app.use('/api/auth', authRoute);
app.use('/api/account/profile', userRoute);
app.use('/api/account/address', addressRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
