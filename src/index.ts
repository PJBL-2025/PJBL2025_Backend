import express from 'express';
import cors from 'cors';
import { PORT } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/account/profile', userRoute);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
