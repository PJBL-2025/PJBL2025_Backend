import express from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import addressRoute from './routes/address.route';
import productRouter from './routes/product.route';
import categoryRoute from './routes/category.route';
import reviewRoute from './routes/review.route';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/images', express.static('images'));

app.use('/api/auth', authRoute);
app.use('/api/account/profile', userRoute);
app.use('/api/account/address', addressRoute);
app.use('/api/product', productRouter);
app.use('/api/product', reviewRoute);
app.use('/api/category', categoryRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
