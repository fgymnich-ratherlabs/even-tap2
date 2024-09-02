//esto es un borrador para tratar de implementar validaciones de entrada
const Joi = require('joi');

export const eventValidationSchema = Joi.object({
    id: Joi.string().min(1).max(6).required()
});

const eventValidation = async (parent, args, context, info) => {
    const { error } = eventValidationSchema.validate(args);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Procesar...
};

export const signupValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
});

const signupValidation = async (parent, args, context, info) => {
    const { error } = signupValidationSchema.validate(args);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Procesar el registro del usuario...
};

export const signinValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
});

const loginValidation = async (parent, args, context, info) => {
    const { error } = signinValidationSchema.validate(args);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Procesar el inicio de sesión del usuario...
};

export const createEventValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(10).max(500).required(),
    location: Joi.string().min(3).max(100).required(),
    date: Joi.date().iso().required(),
    maxCapacity: Joi.number().integer().min(1).required()
});

const createEventValidation = async (parent, args, context, info) => {
    const { error } = createEventValidationSchema.validate(args);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Procesar la creación del evento...
};

export const applyToEventValidationSchema = Joi.object({
    eventId: Joi.string().uuid().required()
});

const applyToEventValidation = async (parent, args, context, info) => {
    const { error } = applyToEventValidationSchema.validate(args);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Procesar la aplicación al evento...
};

export const manageApplicationValidationSchema = Joi.object({
    applicationId: Joi.string().uuid().required(),
    status: Joi.string().valid('PENDING', 'ACCEPTED', 'REJECTED').required()
});

const manageApplicationValidation = async (parent, args, context, info) => {
    const { error } = manageApplicationValidationSchema.validate(args);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Procesar la gestión de la aplicación...
};

module.exports = {signupValidationSchema, signinValidationSchema, createEventValidationSchema, applyToEventValidationSchema, manageApplicationValidationSchema }
