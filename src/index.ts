import express from 'express';
import cors from 'cors';
import { PORT } from './config/env';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
