"use client";

import { gql, useQuery, useMutation, ApolloError } from '@apollo/client';
import Link from 'next/link';
import { useTranslation } from './../../../../i18n/client';

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

export default function EventPage({ params }) {
  const { t } = useTranslation(params.lang, 'event'); // Hook para traducción
  const id = params.id;
  const { loading, error, data } = useQuery(GET_EVENT_QUERY, {
    variables: { id },
  });

  const [applyToEvent, { data: dataApplication, loading: loadingApplication, error: errorApplication }] = useMutation(
    APPLY_TO_EVENT_MUTATION
  );

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('error_loading')} {error.message}</p>;

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await applyToEvent({ variables: { eventId: params.id } });
    } catch (error) {
      if (error instanceof ApolloError) {
        console.error('Error al aplicar al evento:', error.message);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };

  const event = data?.event;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('event_details')}</h1>
        </div>
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-gray-900 font-medium">{t('description')}</p>
            <p className="text-gray-500">{event.description}</p>

            <p className="text-gray-900 font-medium mt-4">{t('location')}</p>
            <p className="text-gray-500">{event.location}</p>

            <p className="text-gray-900 font-medium mt-4">{t('date')}</p>
            <p className="text-gray-500">{new Date(parseInt(event.date)).toLocaleDateString()}</p>

            <p className="text-gray-900 font-medium mt-4">{t('max_capacity')}</p>
            <p className="text-gray-500">{event.maxCapacity}</p>

            <p className="text-gray-900 font-medium mt-4">{t('organizer')}</p>
            <p className="text-gray-500">{event.organizer.name}</p>
          </div>
          <div>
            <button
              onClick={handleApply}
              disabled={loadingApplication || dataApplication || errorApplication}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50"
            >
              {loadingApplication ? t('applying') : t('apply')}
            </button>
            {errorApplication && <p className="text-red-500 font-medium mt-1">{t('application_error')}{errorApplication.message}</p>}
            {dataApplication && <p className="text-green-500 font-medium mt-1">{t('application_success')}</p>}
          </div>
        </div>
        <div className="mt-6">
          <Link href="/dashboard">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              {t('back_to_dashboard')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
