import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;
export default {
  getInstance: (): PrismaClient => {
    if (prismaInstance === undefined || prismaInstance === null) {
      prismaInstance = new PrismaClient();
    }
    return prismaInstance;
  },
};
