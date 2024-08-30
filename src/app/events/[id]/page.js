"use client"

import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
//import { format } from 'date-fns';

const GET_EVENT_QUERY = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      description
      location
      date
      maxCapacity
      organizer {
        name
      }
    }
  }
`;

const APPLY_TO_EVENT_MUTATION = gql`
  mutation ApplyToEvent($eventId: ID!) {
    applyToEvent(eventId: $eventId) {
      id
      user {
        id
        name
      }
      event {
        id
        name
      }
    }
  }
`;


export default function EventPage({params}) {
  const  id  = params.id;
  const { loading, error, data } = useQuery(GET_EVENT_QUERY, {
    variables: { id },
  });

  const [applyToEvent, {data: dataApplication,loading: loadingApplication,error: errorApplication }] = useMutation(
                                                                                      APPLY_TO_EVENT_MUTATION
                                                                                    ); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleApply = async (e) => {
    e.preventDefault();
    applyToEvent({ variables: { eventId: params.id, } });
  };

  const event = data?.event;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Detalles del Evento</h1>
        </div>
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-gray-900 font-medium">Descripción</p>
            <p className="text-gray-500">{event.description}</p>

            <p className="text-gray-900 font-medium mt-4">Ubicación</p>
            <p className="text-gray-500">{event.location}</p>

            <p className="text-gray-900 font-medium mt-4">Fecha</p>
            <p className="text-gray-500">{new Date(parseInt(event.date)).toLocaleDateString()}</p>

            <p className="text-gray-900 font-medium mt-4">Capacidad Máxima</p>
            <p className="text-gray-500">{event.maxCapacity}</p>

            <p className="text-gray-900 font-medium mt-4">Organizador</p>
            <p className="text-gray-500">{event.organizer.name}</p>
          </div>
            <div>
              <button
                  onClick={handleApply}
                  disabled={loadingApplication||dataApplication||errorApplication}
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 "
                >
                  {loadingApplication ? 'Aplicando...' : 'Aplicar al Evento'}
              </button>
              {errorApplication && <p className="text-red-500 font-medium mt-1">Error: {errorApplication.message}</p>}
              {dataApplication && <p className="text-green-500 font-medium mt-1">¡Solicitud de Aplicación Exitosa!
                <br />A la brevedad se tendrá la confirmación de aceptación. Puede volver a Inicio.  </p>}
            </div>
        </div>
        <div className="mt-6">
          <Link href="/dashboard">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Volver a Inicio
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
