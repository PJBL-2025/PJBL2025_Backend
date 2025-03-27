import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'nama minimal 2 karakter'),
  username: z.string().min(6, 'username minimal 6 karakter'),
  password: z.string().min(6, 'password minimal 6 karakter'),
});