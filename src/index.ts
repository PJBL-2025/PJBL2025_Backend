import express from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(cors());

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
