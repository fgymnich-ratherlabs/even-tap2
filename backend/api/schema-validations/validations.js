const Yup = require('yup');

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede tener más de 50 caracteres')
        .required('El nombre es obligatorio'),
    email: Yup.string()
        .email('Debe ser un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    password: Yup.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .required('La contraseña es obligatoria'),
});

const SigninSchema = Yup.object({
    email: Yup.string()
        .required('Mail requerido'),
    password: Yup.string()
        .required('Constraseña requerida'),
});

const CreateEventSchema = Yup.object({
    name: Yup.string()
      .required('El nombre es requerido')
      .max(50, 'El nombre debe tener 50 caracteres o menos'),
    description: Yup.string()
      .required('La descripción es requerida')
      .max(500, 'La descripción debe tener 500 caracteres o menos'),
    location: Yup.string()
      .required('El lugar es requerido')
      .max(50, 'El lugar debe tener 50 caracteres o menos'),
    date: Yup.date()
      .required('La fecha es requerida')
      .min(new Date(), 'La fecha debe ser futura'),
    maxCapacity: Yup.number()
      .required('La capacidad máxima es requerida')
      .min(1, 'La capacidad mínima es 1')
      .max(100000, 'La capacidad máxima es 10,000'),
});

module.exports = {SignupSchema, SigninSchema, CreateEventSchema};