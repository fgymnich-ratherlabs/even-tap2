"use client"

import { useQuery, gql } from '@apollo/client';

// Definimos la query para obtener el usuario autenticado y sus eventos aplicados
const CURRENT_USER_APPLIED_EVENTS_QUERY = gql`
  query {
    user {
      id
      name
      events {
        id
        name
        description
        location
        date
        maxCapacity
      }
      applications {
        id
        status
        event {
          id
          name
          description
          location
          date
          maxCapacity
        }
      }
    }
  }
`;


export default function ProfilePage() {

  const { loading, error, data } = useQuery(CURRENT_USER_APPLIED_EVENTS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const {user} = data;

  console.log(user);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900">Perfil de {user.name}</h1>
        
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Eventos Creados</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {user.events.map(event => (
                <li key={event.id} className="px-4 py-4 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">{event.name}</p>
                      <p className="text-gray-500">{new Date(parseInt(event.date)).toLocaleDateString()}</p>
                      <p className="text-gray-500">{event.location}</p>
                      <p className="text-gray-500">Aplicaciones: / {event.maxCapacity}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href={`/events/${event.id}`} className="text-indigo-600 hover:text-indigo-500">Ver detalles</a>
                  </div>
                  <div>
                    <a href={`/profile/manage/${event.id}`} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Gestionar aplicaciones</a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Eventos Aplicados</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {user.applications.map(application => (
                <li key={application.id} className="px-4 py-4 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">{application.event.name}</p>
                      <p className="text-gray-500">{new Date(parseInt(application.event.date)).toLocaleDateString()}</p>
                      <p className="text-gray-500">{application.event.location}</p>
                      <p className="text-gray-500">Status: {application.status}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href={`/events/${application.event.id}`} className="text-indigo-600 hover:text-indigo-500">Ver detalles</a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
