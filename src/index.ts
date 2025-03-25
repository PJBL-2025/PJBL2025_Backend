import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PORT } from './config/env';
import productRouter from './routes/product.route';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/product', productRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
