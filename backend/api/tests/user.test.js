const { user } = require('../resolvers/resolvers'); 
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../resolvers/authenticate'); 

jest.mock('../resolvers/authenticate', () => ({
  authenticate: jest.fn(),
})); // Mock de autenticación

const prisma = new PrismaClient();

describe('Resolvers - user', () => {
  it('should return a user with events and applications', async () => {
    // Mock del resultado de authenticate
    authenticate.mockResolvedValue({ userId: 1 });

    // Mock del comportamiento de Prisma para buscar el usuario
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      events: [],
      applications: [],
    });

    const result = await user({}, {});

    expect(result).toEqual({
      id: 1,
      name: 'John Doe',
      events: [],
      applications: [],
    });
  });

  it('should throw an error if user is not found', async () => {
    authenticate.mockResolvedValue({ userId: 1 });

    // Mock del comportamiento de Prisma para devolver null si no encuentra al usuario
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(user({}, {})).rejects.toThrow('Usuario no encontrado');
  });
});
