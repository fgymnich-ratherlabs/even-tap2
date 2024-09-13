const { events } = require('../resolvers/resolvers');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Resolvers - events', () => {
  it('should fetch a list of events with pagination', async () => {
    const mockEvents = [
      { name: 'Event 1', organizer: { name: 'Organizer 1' } },
      { name: 'Event 2', organizer: { name: 'Organizer 2' } },
    ];

    prisma.event.findMany.mockResolvedValue(mockEvents);
    prisma.event.count.mockResolvedValue(2);

    const result = await events({ skip: 0, take: 10 });

    expect(result.events).toHaveLength(2);
    expect(result.totalEvents).toBe(2);
    expect(prisma.event.findMany).toHaveBeenCalled();
    expect(prisma.event.count).toHaveBeenCalled();
  });

  it('should throw an error if fetching events fails', async () => {
    prisma.event.findMany.mockRejectedValue(new Error('DB error'));

    await expect(events({ skip: 0, take: 10 })).rejects.toThrow('No se pudieron obtener los eventos.');
  });
});
