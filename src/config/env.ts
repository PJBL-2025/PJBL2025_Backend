import { config } from 'dotenv';

config({ path: '.env' });

export const { PORT, JWT_SECRET } = process.env;