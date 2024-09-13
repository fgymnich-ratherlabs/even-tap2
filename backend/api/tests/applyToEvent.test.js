const { applyToEvent } = require('../resolvers/resolvers');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../resolvers/authenticate');

jest.mock('../resolvers/authenticate', () => ({
    authenticate: jest.fn(),
  })); // Mock de autenticación
  

const prisma = new PrismaClient();


describe('Resolvers - applyToEvent', () => {
  it('should allow a user to apply to an event', async () => {
    authenticate.mockResolvedValue({ userId: 1 });
    
    const mockEvent = {
      id: 1,
      name: 'Event 1',
      maxCapacity: 100,
      applications: [],
    };

    prisma.event.findUnique.mockResolvedValue(mockEvent);
    prisma.application.findUnique.mockResolvedValue(null);
    prisma.application.create.mockResolvedValue({ id: 1 });

    const result = await applyToEvent({ eventId: 1 }, { headers: { authorization: 'Bearer token' } });

    expect(result.id).toBe(1);
    expect(prisma.application.create).toHaveBeenCalled();
  });

  it('should throw an error if event does not exist', async () => {
    authenticate.mockResolvedValue({ userId: 1 });
    prisma.event.findUnique.mockResolvedValue(null);

    await expect(applyToEvent({ eventId: 999 }, { headers: { authorization: 'Bearer token' } })).rejects.toThrow('El evento no existe.');
  });

  it('should throw an error if the user has already applied', async () => {
    authenticate.mockResolvedValue({ userId: 1 });

    const mockEvent = {
      id: 1,
      name: 'Event 1',
      maxCapacity: 100,
      applications: [],
    };

    prisma.event.findUnique.mockResolvedValue(mockEvent);
    prisma.application.findUnique.mockResolvedValue({ id: 1 });

    await expect(applyToEvent({ eventId: 1 }, { headers: { authorization: 'Bearer token' } })).rejects.toThrow('Ya has aplicado a este evento.');
  });
});
