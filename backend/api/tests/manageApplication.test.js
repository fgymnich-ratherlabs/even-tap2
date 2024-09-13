const { manageApplication } = require('../resolvers/resolvers');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../resolvers/authenticate');

jest.mock('../resolvers/authenticate', () => ({
    authenticate: jest.fn(),
  })); // Mock de autenticación
  
const prisma = new PrismaClient();


describe('Resolvers - manageApplication', () => {
  it('should manage an application and update its status', async () => {
    authenticate.mockResolvedValue({ userId: 1 });

    // Mock de la consulta de la aplicación y su evento asociado
    const mockApplication = {
        id: 1,
        status: 'PENDING',
        version: 1,
        event: {
          id: 1,
          organizerId: 1, 
          version: 1,
          maxCapacity: 100,
        },
      };

    prisma.application.findUnique.mockResolvedValue(mockApplication);
    prisma.event.findUnique.mockResolvedValue({ version: 1 });

    const mockApplicationUpdated = {
        id: 1,
        version: 2,
        status: 'ACCEPTED',
      };

    prisma.application.update.mockResolvedValue(mockApplicationUpdated);
    prisma.event.update.mockResolvedValue( { version: 2});

    const result = await manageApplication(
        { applicationId: 1, status: 'ACCEPTED', version: 1, eventVersion: 1 }, { headers: { authorization: 'Bearer token' } });

    expect(result.status).toBe('ACCEPTED');
    expect(prisma.application.update).toHaveBeenCalled();
  });

  it('should throw an error if application is not found', async () => {
    authenticate.mockResolvedValue({ userId: 1 });
    prisma.application.findUnique.mockResolvedValue(null);

    await expect(manageApplication({ applicationId: 999, status: 'ACCEPTED', version: 1, eventVersion: 1 }, { headers: { authorization: 'Bearer token' } })).rejects.toThrow('La aplicación no existe.');
  });

  it('should throw an error if application status is already updated', async () => {
    authenticate.mockResolvedValue({ userId: 1 });

    // Mock de la consulta de la aplicación y su evento asociado
    const mockApplication = {
    id: 1,
    status: 'ACCEPTED',
    version: 1,
    event: {
        id: 1,
        organizerId: 1, 
        version: 1,
        maxCapacity: 100,
    },
    };

    prisma.application.findUnique.mockResolvedValue(mockApplication);

    await expect(manageApplication({ applicationId: 1, status: 'ACCEPTED', version: 1, eventVersion: 1 }, { headers: { authorization: 'Bearer token' } })).rejects.toThrow('La aplicación ya ha sido gestionada.');
  });
});
