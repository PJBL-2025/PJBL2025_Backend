import express from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import productRouter from './routes/product.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/product', productRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
