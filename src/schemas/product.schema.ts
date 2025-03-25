import { z } from 'zod';

enum Size {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export const ProductSchema = z.object({
  name: z.string().min(4, 'nama produk minimal 4 karakter'),
  description: z.string().min(10, 'deskripsi produk harus dijelaskan minimal 10 karakter'),
  quantity: z.number().positive('jumlah produk tidak boleh minus'),
  price: z.number().min(100).positive('harga tidak boleh minus'),
  weight: z.number().positive('berat produk tidak boleh minus'),
  size: z.nativeEnum(Size).default(Size.S),
  product_category: z.array(z.string().min(3, 'karakter')).nonempty(),
  product_images: z.array(z.string().url()),
});