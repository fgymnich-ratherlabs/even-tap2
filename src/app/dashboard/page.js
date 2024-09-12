"use client"

import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import Cookies from 'js-cookie';


const EVENTS_QUERY = gql`
  query GetEvents($skip: Int, $take: Int) {
    events(skip: $skip, take: $take) {
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
      totalEvents
    }
  }
`;

export default function Dashboard() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const { data, loading, error, fetchMore } = useQuery(EVENTS_QUERY, {
    variables: { skip: page * itemsPerPage, take: itemsPerPage },
  });
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    if (data && data.events) {
      setEvents(data.events.events);
      setTotalEvents(data.events.totalEvents);
    }
  }, [data]);

  if (loading) return <p className="text-center text-gray-500">Cargando eventos...</p>;
  if (error) return <p className="text-center text-red-500">Error {error.message}</p>;

  // Calcular si estamos en la última página
  const isLastPage = page * itemsPerPage + itemsPerPage >= totalEvents;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Inicio</h1>
          <Link href="/create-event">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Crear Evento
            </span>
          </Link>
        </div>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-lg">
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
                      <p className="text-gray-500">{event.location}</p>
                      <p className="text-gray-500">{new Date(parseInt(event.date)).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Link href={`/events/${event.id}`}>
                      <span className="text-indigo-600 hover:text-indigo-900">Ver detalles o Aplicar</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-200 flex justify-between">
            <button 
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))} 
              disabled={page === 0}
              className="px-2 py-2 mt-2 ml-2 mb-2 text-black bg-indigo-300 rounded-md hover:bg-indigo-400 disabled:bg-indigo-50 disabled:text-slate-500 "
            >
               Anterior
            </button>
            <button 
              onClick={() => {
                setPage((prev) => prev + 1);
                fetchMore({
                  variables: { skip: (page + 1) * itemsPerPage, take: itemsPerPage }
                });
              }}
              disabled={isLastPage}
              className="px-1 py-2 mt-2 mr-2 mb-2 text-black bg-indigo-300 rounded-md hover:bg-indigo-400 disabled:bg-indigo-50 disabled:text-slate-500 "
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
