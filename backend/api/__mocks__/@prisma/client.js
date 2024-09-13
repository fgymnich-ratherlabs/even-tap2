const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    event: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    application: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
};
  
module.exports = {
  PrismaClient: jest.fn(() => mockPrisma),
};