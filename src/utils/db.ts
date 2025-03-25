import { PrismaClient } from '@prisma/client';
import { ProductSchema } from '../schemas/product.schema';

export const dbClient = new PrismaClient({
  log: ['query'],
}).$extends({
  query: {
    products: {
      create({ args, query }) {
        const validatedData = ProductSchema.parse(args.data);

        const images = validatedData.product_images.map((img) => ({
          image: img,
        }));

        const categories = validatedData.product_category.map((category) => ({
          id: category,
        }));

        args.data = {
          ...validatedData,
          product_images: { create: images },
          product_category: { connect: categories },
        };

        return query(args);
      },
    },
  },
});