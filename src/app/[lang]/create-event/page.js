'use client';

import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { CreateEventSchema } from '../../lib/validations';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from './../../../i18n/client'; // Importación para traducción

const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($name: String!, $description: String!, $location: String!, $date: String!, $maxCapacity: Int!) {
    createEvent(name: $name, description: $description, location: $location, date: $date, maxCapacity: $maxCapacity) {
      id
      name
      description
      location
      date
      maxCapacity
      organizer {
        id
        name
        email
        role
      }
    }
  }
`;

export default function CreateEvent({params}) {
  const { t } = useTranslation(params.lang, 'create-event'); // Hook de traducción

  const [createEvent, { data, loading, error }] = useMutation(CREATE_EVENT_MUTATION, {
    onCompleted: (data) => {
      console.log('Event created:', data.createEvent);
      window.location.href = '/dashboard';
    },
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const { name, description, location, date, maxCapacity } = values;
    
    try {
      await createEvent({
        variables: {
          name,
          description,
          location,
          date,
          maxCapacity: parseInt(maxCapacity, 10),
        },
      });
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    name: '',
    description: '',
    location: '',
    date: '',
    maxCapacity: '',
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto p-4">
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <h1 className="text-2xl font-bold m-4">{t('title')}</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={CreateEventSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-2 m-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('name')}
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    {t('description')}
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    {t('location')}
                  </label>
                  <Field
                    type="text"
                    name="location"
                    id="location"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    {t('date')}
                  </label>
                  <Field
                    type="date"
                    name="date"
                    id="date"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
                    {t('maxCapacity')}
                  </label>
                  <Field
                    type="number"
                    name="maxCapacity"
                    id="maxCapacity"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  />
                  <ErrorMessage name="maxCapacity" component="div" className="text-red-500 text-sm" />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-700"
                  disabled={loading || isSubmitting}
                >
                  {loading ? t('loading') : t('submit')}
                </button>
                {error && <p className="mt-2 text-red-500">{t('error')}: {error.message}</p>}
                {data && <p className="mt-2 text-green-500">{t('success')}</p>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
