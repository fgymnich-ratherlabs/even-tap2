const { signin } = require('../resolvers/resolvers');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const prisma = new PrismaClient();


describe('Resolvers - signin', () => {
  it('should sign in a user and return a JWT token', async () => {
    const mockUser = { id: 1, email: 'john@example.com', password: 'hashedPassword', role: 'USER' };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fakeToken');

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };

    const result = await signin({ email: 'john@example.com', password: '123456' }, context);

    expect(result).toBe('fakeToken');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashedPassword');
  });

  it('should throw an error if user is not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };

    await expect(signin({ email: 'john@example.com', password: '123456' }, context)).rejects.toThrow('Usuario o Contraseña incorrectos.');
  });

  it('should throw an error if password is incorrect', async () => {
    const mockUser = { id: 1, email: 'john@example.com', password: 'hashedPassword' };

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(signin({ email: 'john@example.com', password: 'wrongpassword' }, context)).rejects.toThrow('Usuario o Contraseña incorrectos.');
  });
});
