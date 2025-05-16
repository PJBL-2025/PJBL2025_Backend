import { prismaClient } from '../../src/utils/db';
import { faker } from '@faker-js/faker';

export const checkoutSeed = async () => {
  const user = await prismaClient.users.findMany({
    include: { address: true }
  })
  const product = await prismaClient.products.findMany()

  for(const u of user) {
    const randomAddress = faker.helpers.arrayElement(u.address)
    const selectedProducts = faker.helpers.arrayElements(product, 2)

    const statusCheckout = faker.helpers.arrayElement(["pending", "processing", "success", "failed"])

    const productCheckoutData = selectedProducts.map((product) => {
      const randomQuantity = faker.number.int({ min: 1, max: 5 })
      const randomType = faker.helpers.arrayElement(['custom', 'reguler'])

      const baseData: any = {
        quantity: randomQuantity,
        size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        color: faker.color.rgb(),
        price: product.price * randomQuantity,
        type: randomType,
        product_id: product.id,
      }

      if (randomType === 'custom') {
        baseData.product_custom = {
          create: {
            front_image_path: faker.image.url(),
            back_image_path: faker.image.url(),
            front_width: faker.number.int({ min: 1, max: 900 }),
            back_width: faker.number.int({ min: 1, max: 900 }),
          }
        }
      }

      return baseData
    })

    const totalPrice = productCheckoutData.reduce((acc, item) => acc + item.price, 0)

    await prismaClient.checkouts.create({
      data: {
        order_id: faker.string.uuid(),
        status: statusCheckout,
        total_price: totalPrice,
        user_id: u.id,
        address_id: randomAddress.id,

        product_checkout: { 
          create: productCheckoutData,
        },

        ...(statusCheckout === 'processing' && {
          delivery: {
            create: {
              send_start_time: faker.date.future(),
              send_end_time: faker.date.future({ years: 1 }),

              status: {
                create: Array.from({ length: faker.number.int({ max: 8 }) }, () => ({
                  status: faker.lorem.words({ min: 3, max: 5 })
                }))
              }
            }
          }
        })
      }
    })
  }
}

