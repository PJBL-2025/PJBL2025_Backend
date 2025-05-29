import { z } from 'zod';

export const checkoutSchema = z.object({
  status: z.enum(['pending', 'success', 'cancel']).default('pending'),
  quantity: z.number().min(1, 'jumlah barang harus lebih dari 1'),  
});

