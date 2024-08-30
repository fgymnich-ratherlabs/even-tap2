'use client';

import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

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

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = React.useState(new FormData());

  const [createEvent, { data, loading, error }] = useMutation(CREATE_EVENT_MUTATION, {
    onCompleted: (data) => {
      console.log('Event created:', data.createEvent);
      router.refresh();
      router.push('/dashboard');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createEvent({
        variables: {
          name: formData.get('name'),
          description: formData.get('description'),
          location: formData.get('location'),
          date: formData.get('date'),
          maxCapacity: parseInt(formData.get('maxCapacity'), 10),
        },
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      prevData.set(name, value);
      return prevData;
    });
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
            Maximum Capacity
          </label>
          <input
            type="number"
            name="maxCapacity"
            id="maxCapacity"
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
        {error && <p className="mt-2 text-red-500">Error: {error.message}</p>}
        {data && <p className="mt-2 text-green-500">Evento creado exitosamente</p>}
      </form>
    </div>
  );
}
