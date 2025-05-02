import { prismaClient } from '../../src/utils/db';
import { faker } from '@faker-js/faker';

export const chatsSeeder = async () => {
  const user = await prismaClient.users.findMany()

  for(const u of user) {
    await prismaClient.chats.create({
      data: {
        message: faker.lorem.words({ min: 5, max: 10 }),
        user_id: u.id,
      }
    })
  }
}