import { prismaClient } from '../../src/utils/db';
import { faker } from '@faker-js/faker';

export const categorySeeder = async () => {
  const uniqueCategories = new Set<string>()

  while (uniqueCategories.size < 10){
    uniqueCategories.add(faker.commerce.productAdjective())
  }

  for(const category of uniqueCategories) {
    await prismaClient.categories.upsert({
      where: { category },
      update: {},
      create: { category },
    })
  }
}