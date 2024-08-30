"use client"

import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import Cookies from 'js-cookie';


const EVENTS_QUERY = gql`
  query GetEvents {
    events {
      id
      name
      description
      location
      date
      maxCapacity
      organizer {
        id
        name
      }
    }
  }
`;

export default function Dashboard() {
  const { data, loading, error } = useQuery(EVENTS_QUERY);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (data && data.events) {
      setEvents(data.events);
    }
  }, [data]);

  if (loading) return <p className="text-center text-gray-500">Cargando eventos...</p>;
/*   if (error && error.networkError && error.networkError.statusCode !== 401) {
    return <ErrorMessage message="Error al cargar eventos:" details={error.message} />;
  } */
  if (error) return <p className="text-center text-red-500">Error {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
        </div>
        <div>
          <Link href="/create-event">
            <span className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Crear Evento
            </span>
          </Link>
          <Link href="/profile">
            <span className="mt-6 ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Mi Perfil
            </span>
          </Link>
        </div>
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Eventos Próximos</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {events.map(event => (
                <li key={event.id} className="px-4 py-4 flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">{event.name}</p>
                      <p className="text-gray-500">{event.description}</p>
                      <p className="text-gray-500">{event.location}</p>
                      <p className="text-gray-500">{new Date(parseInt(event.date)).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Link href={`/events/${event.id}`}>
                      <span className="text-indigo-600 hover:text-indigo-500">Ver detalles o Aplicar</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <button
              onClick={(e) => {
                e.preventDefault();
                Cookies.remove('authToken'); 
                window.location.href = '/signin';
              }}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
