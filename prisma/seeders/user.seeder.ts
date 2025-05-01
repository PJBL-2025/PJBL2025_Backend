import { prismaClient } from '../../src/utils/db';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export const userSeeder = async () => {
  for(let i = 0; i < 10; i++) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(faker.internet.password(), salt);

    await prismaClient.users.create({
      data: {
        name: faker.person.fullName(),
        username: faker.internet.username(),
        password: hashPassword,

        address: {
          create: Array.from({ length: 3 }, () => ({
            address: faker.location.streetAddress(),
            zip_code: parseInt(faker.location.zipCode()),
            destination_code: faker.location.countryCode('alpha-3'),
            receiver_area: `${faker.location.countryCode('alpha-3')}-${faker.location.countryCode('numeric')}`,
          }))
        }
      }
    })
  }
}
