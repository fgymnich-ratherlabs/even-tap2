const { event } = require('../resolvers/resolvers');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Resolvers - event', () => {
  it('should fetch a single event by ID', async () => {
    const mockEvent = { id: 1, name: 'Event 1', organizer: { name: 'Organizer 1' } };

    prisma.event.findUnique.mockResolvedValue(mockEvent);

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };  

    const result = await event({ id: 1 }, context);

    expect(result).toEqual(mockEvent);
    expect(prisma.event.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { applications: { include: { user: true } }, organizer: true },
    });
  });

  it('should throw an error if event is not found', async () => {
    prisma.event.findUnique.mockResolvedValue(null);

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };

    await expect(event({ id: 999 }, context)).rejects.toThrow('Evento no encontrado');
  });

  it('should throw an error if event fetching fails', async () => {
    prisma.event.findUnique.mockRejectedValue(new Error('DB error'));

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };

    await expect(event({ id: 1 }, context)).rejects.toThrow('No se pudo obtener el evento');
  });
});
