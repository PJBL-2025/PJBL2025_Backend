import { prismaClient } from '../../src/utils/db';
import { faker } from '@faker-js/faker';

export const productSeeder = async () => {
  const sizes = await prismaClient.size.findMany()
  const categories = await prismaClient.categories.findMany()

  for(let i = 0; i < 10; i++) {
    const productData = await prismaClient.products.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.commerce.price({ min: 10000, max: 500000 })),
        quantity: faker.number.int({ min: 1, max: 1000 }),
        weight: faker.number.int({ min: 100, max: 2000 }),

        product_images: {
          create: Array.from({ length: 5 }, () => ({
            image_path: faker.image.url(),
          }))
        },
      }
    })

    const selectedSize = faker.helpers.arrayElements(sizes, faker.number.int({ min: 4, max: 6 }))
    await Promise.all(selectedSize.map((s) => {
      return prismaClient.product_size.create({
        data: {
          product_id: productData.id,
          size_id: s.id
        }
      })
    }))

    const selectedCategory = faker.helpers.arrayElements(categories, faker.number.int({ min: 2, max: 5 }))
    await Promise.all(selectedCategory.map((c) => {
      return prismaClient.product_category.create({
        data: {
          product_id: productData.id,
          category_id: c.id,
        }
      })
    }))
  }
}
