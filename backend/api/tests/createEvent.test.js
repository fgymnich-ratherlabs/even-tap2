const { authenticate } = require('../resolvers/authenticate');
const { createEvent } = require('../resolvers/resolvers');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

jest.mock('../resolvers/authenticate', () => ({
    authenticate: jest.fn(),
  })); // Mock de autenticación
  

describe('createEvent resolver', () => {
  it('should create an event when authenticated', async () => {
    // Simular autenticación
    authenticate.mockResolvedValue({ userId: 1 });

    // Mockear prisma para devolver un evento simulado
    prisma.event.create.mockResolvedValue({
      name: 'My Event',
      description: 'An awesome event',
      location: 'Online',
      date: new Date(),
      maxCapacity: 100,
      organizer: { id: 1 },
    });

    const result = await createEvent(
      { name: 'My Event', description: 'An awesome event', location: 'Online', date: '2024-12-01', maxCapacity: 100 },
      { headers: { authorization: 'Bearer mockToken' } }
    );

    expect(result.name).toBe('My Event');
    expect(authenticate).toHaveBeenCalledWith(expect.any(Object));
  });
});
