const { signup } = require('../resolvers/resolvers');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { SignupSchema } = require('../schema-validations/validations');

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));//mock bcrypt

jest.mock('../schema-validations/validations',  () => ({
  SignupSchema: {
    validate: jest.fn(),
  }
}));//mock schema

const prisma = new PrismaClient();

describe('Resolvers - signup', () => {
  it('should create a new user', async () => {
    SignupSchema.validate.mockResolvedValue();
    bcrypt.hash.mockResolvedValue('hashedPassword');

    prisma.user.findUnique.mockResolvedValue(null); // No existe el usuario
    prisma.user.create.mockResolvedValue({ name: 'John Doe' });

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };

    const result = await signup({ name: 'John Doe', email: 'john@example.com', password: '123456' }, context);

    expect(result).toBe('John Doe');
    expect(prisma.user.create).toHaveBeenCalled();

    // Asegurarse de que rollbar no haya sido llamado porque no hubo error
    expect(rollbarMock.error).not.toHaveBeenCalled();
  });

  it('should throw an error if user already exists', async () => {
    SignupSchema.validate.mockResolvedValue();
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'john@example.com' }); // Usuario ya existe

    // Mockear rollbar
    const rollbarMock = { error: jest.fn() };
    // Crear un objeto context con rollbar
    const context = { rollbar: rollbarMock };

    await expect(
      signup({ name: 'John Doe', email: 'john@example.com', password: '123456' }, context)
    ).rejects.toThrow('Ya existe un usuario con ese email.');
  });
});
