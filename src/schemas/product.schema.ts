import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'nama minimal 3 karakter'),
  description: z.string().min(10, 'deskripsi harus dijelsakan minimal 10 karakter'),
  quantity: z.number().min(1, 'jumlah barang harus lebih dari 1'),
  price: z.number().min(500, 'harga harus lebih dari 500'),
  weight: z.number(),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),

  product_images: z.array(z.string().url('URL gambar tidak valid')).optional(),
  product_category: z.array(z.string()).nonempty('setidaknya harus terdapat 1 kategori '),
});