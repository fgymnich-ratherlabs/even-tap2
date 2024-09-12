const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server-express'); 
const {SignupSchema, SigninSchema, CreateEventSchema} = require('./../schema-validations/validations');

const authenticate = async (context) => {
    const authHeader = context.headers.authorization;
    if (!authHeader) throw new Error('Not authenticated');
    const token = authHeader.replace('Bearer ', '');
    try {
      decripted = jwt.verify(token, process.env.SECRET_KEY);
      //agregar expiry
      return decripted; //devuelve el token desencriptado
    } catch (e) {
      throw new Error('Invalid token');
    }
};

const prisma = new PrismaClient();

const root = {
  //get current user
  user: async (args, context) => {
    try {
      const Id = await authenticate(context);
      const userId = parseInt(Id.userId);

      const user = await prisma.user.findUnique({ // Buscar al usuario por su ID
        where: { id: userId },
        include: {
          events: true, // Incluye los eventos creados por el usuario
          applications: {  // Incluye las aplicaciones realizadas por el usuario
            include: {
              event: true,  // Incluye el evento al que se aplicó
            },
          },
        },
      });

      if (!user) {
        throw new ApolloError('Usuario no encontrado', 'USER_NOT_FOUND');
      }

      return user;

    } catch (error) {
      console.error("Error fetching user:", error);
      throw new ApolloError('No se pudo obtener la información del usuario.', 'USER_FETCH_ERROR', {
        internalData: error.message
      });
    }
  },

  events: async ( { skip=0 , take=10   }) => {
    try {
      const events = await prisma.event.findMany({ 
        include: { organizer: true },
        skip: parseInt(skip,10),
        take: parseInt(take,10),
        orderBy: {
          name: 'asc'
        },
      });

      const totalEvents = await prisma.event.count(); // Contar todos los eventos

      return { events, totalEvents};

    } catch (error) {
      console.error('Error fetching events:', error);
      throw new ApolloError('No se pudieron obtener los eventos.', 'EVENTS_FETCH_ERROR');
    }
  },

  event: async ({ id }) => {
    if (!id){
      throw new UserInputError('Id necesario.', { invalidArgs: ['id'] });
    }

    try {
      const event = await prisma.event.findUnique({ // Buscar el evento por su ID en la base de datos

        where: { id: parseInt(id) },
        include: {
          applications: {
            include: {
              user: true,
            },
          },
          organizer: true,
        },
      });

      if (!event) { // Verificar si se encontró el evento
        throw new ApolloError('Evento no encontrado', 'EVENT_NOT_FOUND');
      }

      return event;

    } catch (error) {
      console.error('Error al obtener el evento:', error);
      throw new ApolloError('No se pudo obtener el evento', 'EVENT_FETCH_ERROR', {
        internalData: error.message
      });
    }
  },

  signup: async ({ name, email, password }) => {
    try {
      await SignupSchema.validate({ name, email, password },{ abortEarly:false });//validar datos entrada

      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) { // Verificar si el usuario ya existe en la base de datos
        throw new ApolloError('Ya existe un usuario con ese email.', 'USER_ALREADY_EXISTS');
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return user.name;

    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new ApolloError('No se pudo crear el usuario.', 'USER_CREATION_ERROR');
    }
  },

  signin: async ({ email, password }) => {
    try {
      await SigninSchema.validate({ email, password },{ abortEarly:false });//validar datos entrada
      
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new AuthenticationError('Usuario no encontrado.');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new AuthenticationError('Clave incorrecta.');

      return jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw new ApolloError('Usuario o Contraseña incorrectos.', 'SIGNIN_ERROR');
    }
  },

  createEvent: async ({ name, description, location, date, maxCapacity }, context) => {
    const user = await authenticate(context);

    try { 
      await CreateEventSchema.validate({ name, description, location, date, maxCapacity },{ abortEarly:false });//validar datos entrada
      
      const event = await prisma.event.create({
        data: {
          name,
          description,
          location,
          date: new Date(date),
          maxCapacity,
          organizer: { connect: { id: user.userId } },
        },
        include: {
          organizer: true,
        },
      });

      return event;

    } catch (error) {
      console.error('Error al crear el evento:', error);
      throw new ApolloError('No se pudo crear el evento.', 'EVENT_CREATION_ERROR');
    }
  },

  applyToEvent: async ({ eventId }, context) => {
    const user = await authenticate(context);
    const userId = parseInt(user.userId);
    const parsedEventId = parseInt(eventId);

    try {
      const event = await prisma.event.findUnique({
        where: { id: parsedEventId },
        include: {
          applications: {
            where: { 
              OR: [ { status: 'ACCEPTED' }, { status: 'PENDING' } ]
            }
          }
        }
      });

      if (!event) {
        throw new ApolloError('El evento no existe.', 'EVENT_NOT_FOUND');
      }

      //Verificar que no se supere la capacidad max
      if (event.applications.length >= event.maxCapacity) {
        throw new ApolloError('El evento ya ha alcanzado su capacidad máxima.', 'EVENT_CAPACITY_REACHED');
      }

      // Verificar si ya existe una aplicación para el usuario y el evento
      const existingApplication = await prisma.application.findUnique({
        where: {
          userId_eventId: {
            userId: userId,
            eventId: parsedEventId,
          },
        },
      });

      if (existingApplication) {
        throw new UserInputError('Ya has aplicado a este evento.', {
          invalidArgs: { eventId },
        });
      }

      const application = await prisma.application.create({
        data: {
          user: { connect: { id: userId } },
          event: { connect: { id: parsedEventId } },
        },
        include: {
          user: true,
          event: true,
        }
      });

      return application;

    } catch (error) {
      if (error instanceof ApolloError){
        throw error;
      }
      else {
      console.error('Error al aplicar al evento:', error);
      throw new ApolloError('No se pudo aplicar al evento.', 'APPLICATION_ERROR');
      }
    }
  },

  manageApplication: async ({ applicationId, status, version, eventVersion }, context) => {
    const user = await authenticate(context);

    try {
      const application = await prisma.application.findUnique({
        where: { id: parseInt(applicationId) },
        include: { event: true },
      });

      if (!application) {
        throw new ApolloError('La aplicación no existe.', 'APPLICATION_NOT_FOUND');
      }

      // Verificar si el usuario es el organizador del evento
      if (application.event.organizerId !== user.userId) {
        throw new AuthenticationError('No autorizado.');
      }

      // Verificar que la versión del cliente coincida con la versión de la base de datos
      if (application.version !== version) {
        throw new ApolloError('La aplicación ha sido modificada por otro usuario. Actualiza la página e inténtalo de nuevo.', 'APPLICATION_CONFLICT');
      }

      const event = await prisma.event.findUnique({
        where: { id: parseInt(application.event.id) },
        select: { version: true },
      });

      if (!event) {
        throw new ApolloError('El evento no existe.', 'EVENT_NOT_FOUND');
      }

      if (event.version !== eventVersion) {
        throw new ApolloError('El evento ha sido modificado por otro usuario. Actualiza la página e inténtalo de nuevo.', 'EVENT_CONFLICT');
      }

      // Si la aplicación ya fue gestionada
      if (application.status !== 'PENDING') {
        throw new ApolloError('La aplicación ya ha sido gestionada.', 'APPLICATION_ALREADY_MANAGED');
      }

      // Comprobar la capacidad máxima del evento antes de aceptar la aplicación
      if (status === 'ACCEPTED') {
        const acceptedCount = await prisma.application.count({
          where: {
            eventId:  parseInt(application.event.id),
            status: 'ACCEPTED',
          },
        });

        if (acceptedCount >= application.event.maxCapacity) {
          throw new ApolloError('No hay suficiente capacidad para aceptar esta aplicación.', 'CAPACITY_REACHED');
        }
      }

      //Actualizar la version del evento
      const eventUpdated = await prisma.event.update({
        where: { id: parseInt(application.event.id) },
        data: { version: eventVersion + 1 },  // Incrementar la versión para el OCC
      });

      if (!eventUpdated) {
        throw new ApolloError('No se pudo actualizar la versión del evento.', 'EVENT_UPDATE_ERROR');
      }

      return await prisma.application.update({
        where: { id: parseInt(applicationId) },
        data: { 
          status,
          version: application.version + 1, // Incrementar la versión para el OCC
        },
      });

    } catch (error) {
      if (error instanceof ApolloError){
        throw error;
      }
      console.error('Error al gestionar la aplicación:', error);
      throw new ApolloError('No se pudo gestionar la aplicación.', 'APPLICATION_MANAGEMENT_ERROR', {
        internalData: error.message
      });
    }
  },
};

  module.exports = root;