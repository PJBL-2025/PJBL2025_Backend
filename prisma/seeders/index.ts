import { productSeeder } from './product.seeder';
import { userSeeder } from './user.seeder';
import { prismaClient } from '../../src/utils/db';
import { checkoutSeed } from './checkout.seeder';
import { sizeSeeder } from './size.seeder';
import { categorySeeder } from './category.seeder';
import { reviewSeeder } from './review.seeder';
import { chatsSeeder } from './chats.seeder';

const main = async () => {
  console.log('seeder starting...');

  await categorySeeder()
  await sizeSeeder()
  await productSeeder()
  await userSeeder()
  await checkoutSeed()
  await reviewSeeder()
  await chatsSeeder()

  console.log('seeder finished');
};

main()
    .catch((err) => {
      console.log(err);
      process.exit(1);
    }).finally(async () => {
      await prismaClient.$disconnect();
} )