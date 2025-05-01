import { prismaClient } from '../../src/utils/db';

export const sizeSeeder = async () => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  for(const s of sizes) {
    await prismaClient.size.upsert({
      where: { size: s as any },
      update: {},
      create: { size: s as any },
    })
  }
}