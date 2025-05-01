import { prismaClient } from '../../src/utils/db';
import { faker } from '@faker-js/faker';

export const reviewSeeder = async () => {
  const checkout = await prismaClient.checkouts.findMany({
    where: { status: 'success' },
    include: {
      product_checkout: true,
    }
  })

  for(const c of checkout) {
    const userId = c.user_id

    for(const pc of c.product_checkout) {
      const shouldReview = faker.datatype.boolean()

      if (!shouldReview) continue

      await prismaClient.review.create({
        data: {
          star: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),

          user_id: userId,
          product_id: pc.product_id,
        }
      })
    }
  }
}