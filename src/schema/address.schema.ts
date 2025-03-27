import { z } from 'zod';

export const addressSchema = z.object({
  address: z.string().min(2, 'nama minimal 2 karakter'),
  zip_code: z.number().min(5, 'kode pos minimal 5 karakter'),
  destination_code: z.string().min(3, 'kode destinasi kota minimal 3 karakter').toUpperCase(),
  receiver_area: z.string().min(5, 'distrik kode destinasi kota miniamal 5 karakter').toUpperCase(),
});