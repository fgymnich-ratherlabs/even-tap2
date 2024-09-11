const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UserInputError } = require('apollo-server-express'); 

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

      // Buscar al usuario por su ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          events: true,  // Incluye los eventos creados por el usuario
          applications: {  // Incluye las aplicaciones realizadas por el usuario
            include: {
              event: true, // Incluye el evento al que se aplicó
            },
          },
        },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;

    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error('No se pudo obtener la información del usuario.');
    }
  },

  events: async () => {
    return await prisma.event.findMany({ include: { organizer: true } });
  },
  event: async ({ id }) => {
    if (!id){
      throw new Error('Id necesario.');
    }

    try {
      // Buscar el evento por su ID en la base de datos
      const event = await prisma.event.findUnique({
        where: { id: parseInt(id) }, // Convertir ID a entero si es necesario
        include: {
          applications: {
            include: {
              user: true, // Incluir información del usuario en cada aplicación
            },
          },
          organizer: true,
        },
      });

      // Verificar si se encontró el evento
      if (!event) {
        throw new Error('Evento no encontrado');
      }

      return event;

    } catch (error) {
      console.error('Error al obtener el evento:', error);
      throw new Error('No se pudo obtener el evento');
    }
  },

  signup: async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Signup called with:', { name, email, password });

    // 1. Validar si los campos existen y son válidos
    if (!name || !email || !password) {
      throw new Error('Todos los campos son obligatorios.');
    }

    // 2. Verificar si el usuario ya existe en la base de datos (ejemplo utilizando Prisma)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Ya existe un usuario con ese email.');
    }

    try{
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
    }
  },
  signin: async ({ email, password }) => {
    try{
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      return jwt.sign({ userId: user.id, role: user.role,  }, process.env.SECRET_KEY, { expiresIn: '1h' });
    }catch(error) {
      console.error('Usuario o Clave incorrectas');
    }  
  },
  createEvent: async ({ name, description, location, date, maxCapacity }, context) => {
    const user = await authenticate(context);

    try { 
        const event = await prisma.event.create({
          data: {
            name,
            description,
            location,
            date: new Date(date), //borrar?
            maxCapacity,
            organizer: { connect: { id: user.userId } },
          },
          include: {
            organizer: true, // Para incluir la información del organizador en la respuesta
          },
        });
        return event;
    }catch(error){
      console.error('Error al crear el evento:', error);
    }
  },

  applyToEvent: async ({ eventId }, context) => {
    const user = await authenticate(context);
    const userId = parseInt(user.userId);
    const parsedEventId = parseInt(eventId);

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: {
        applications: {
          where: { 
            OR: [ { status: 'ACCEPTED' },{ status: 'PENDING' } ]
          }
        }
      }
    });

    if (!event) {
      throw new Error('El evento no existe.');
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

    // Verificar que no se supere la capacidad
    if (event.applications.length >= event.maxCapacity) {
      throw new Error('No es posible aplicar. El evento ya ha alcanzado su capacidad máxima.');
    }

    if (existingApplication) {
      throw new UserInputError('Ya has aplicado a este evento.', {
        invalidArgs: { eventId },
      });
    }

    try{
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

    } catch(error){
      console.error('Error al aplicar al evento:', error); 
    }
  },

  manageApplication: async ({ applicationId, status, version, eventVersion }, context) => {
    const user = await authenticate(context);
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { event: true },
    });
    const event = await prisma.event.findUnique({
      where: { id: parseInt(application.event.id) },
      select: { version: true },
    });

    if (!application) {
      throw new Error('La aplicación no existe.');
    }

    if (!event) {
      throw new Error('El evento no existe.');
    }
    
    // Verificar si el usuario es el organizador del evento
    if (application.event.organizerId !== user.userId) throw new Error('Not authorized');

    // Verificar que la versión del cliente coincida con la versión de la base de datos
    if (application.version !== version) {
      throw new Error('La aplicación ha sido modificada por otro usuario. Actualiza la página e inténtalo de nuevo.');
    }

    if (event.version !== eventVersion) {
      throw new Error('El evento ha sido modificada por otro usuario. Actualiza la página e inténtalo de nuevo.');
    }

    // Si la aplicación ya fue gestionada
    if(application.status !== 'PENDING') throw new Error('Application already resolved.',{
      invalidArgs: { applicationId },
    });

    // Comprobar la capacidad máxima del evento antes de aceptar la aplicación
    if (status === 'ACCEPTED') {
      const acceptedCount = await prisma.application.count({
        where: {
          eventId:  parseInt(application.event.id),
          status: 'ACCEPTED',
        },
      });

      if (acceptedCount >= application.event.maxCapacity ) {
        throw new Error('No hay suficiente capacidad para aceptar esta aplicación.');
      }
    }

    //Actualizar la version del evento
    const eventUpdated = await prisma.event.update({
      where: { id: parseInt(application.event.id) },
      data: { version: eventVersion + 1}, // Incrementar la versión para el OCC
    });

    if(!eventUpdated){
      throw new Error("No se pudo actualizar la versión.")
    };

    return await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { 
        status,
        version: application.version + 1 // Incrementar la versión para el OCC
        },
    });
  },
};

module.exports = root;