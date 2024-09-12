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

    const result = await signup({ name: 'John Doe', email: 'john@example.com', password: '123456' });

    expect(result).toBe('John Doe');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('should throw an error if user already exists', async () => {
    SignupSchema.validate.mockResolvedValue();
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'john@example.com' }); // Usuario ya existe

    await expect(
      signup({ name: 'John Doe', email: 'john@example.com', password: '123456' })
    ).rejects.toThrow('Ya existe un usuario con ese email.');
  });
});
