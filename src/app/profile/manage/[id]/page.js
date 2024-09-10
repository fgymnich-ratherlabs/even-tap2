"use client"
import { gql, useQuery, useMutation } from '@apollo/client';
import React, {useState} from 'react';

// Definir la consulta para obtener las aplicaciones de un evento específico
const GET_EVENT_APPLICATIONS_QUERY = gql`
  query GetEventApplications($eventId: ID!) {
    event(id: $eventId) {
      id
      name
      version
      applications {
        id
        status
        version
        user {
          id
          name
        }
      }
    }
  }
`;

const UPDATE_APPLICATION_STATUS_MUTATION = gql`
  mutation UpdateApplicationStatus($applicationId: ID!, $status: String!, $version: Int!, $eventVersion: Int!) {
    manageApplication(applicationId: $applicationId, status: $status, version: $version, eventVersion: $eventVersion) {
      id
      status
      version
    }
  }
`;

export default function EventApplications({ params }) {
    const  eventId  = params.id;
    // Ejecutar la query para obtener las aplicaciones del evento
    const { loading, error, data, refetch } = useQuery(GET_EVENT_APPLICATIONS_QUERY, {
      variables: { eventId },
    });

    // Mutación para actualizar el estado de la aplicación
    const [updateApplicationStatus, {data: dataApplication,loading: loadingApplication,error: errorApplication }] = useMutation(UPDATE_APPLICATION_STATUS_MUTATION);

    // Estado para manejar el mensaje de éxito
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdateStatus = async (applicationId, newStatus, version, eventVersion) => {
      try{
        updateApplicationStatus({
          variables: {
            applicationId,
            status: newStatus,
            version,
            eventVersion,
          },
          refetchQueries: [
            {
              query: GET_EVENT_APPLICATIONS_QUERY,
              variables: { eventId },
            },
          ],
          // Actualiza el cache de Apollo después de la mutación
          optimisticResponse: {
            __typename: 'Mutation',
            updateApplicationStatus: {
              __typename: 'Application',
              id: applicationId,
              status: newStatus,
              version: version + 1, // Incrementa la versión para mantener la consistencia
              eventVersion: eventVersion + 1,
            },
          },
          
        });


        // Configurar el mensaje de éxito después de la mutación exitosa
        setSuccessMessage(`La aplicación del usuario ha sido ${newStatus === 'ACCEPTED' ? 'aceptada' : 'rechazada'}.`);
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => setSuccessMessage(''), 3000);

      }catch(error){
        console.error('Error updating application status:', error);
      }; 
      
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    // Obtener la lista de aplicaciones del evento desde los datos de la consulta
    const applications = data.event.applications.filter(application => application.status === 'PENDING');
  
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Aplicaciones al Evento {data.event.name}</h3>
          </div>

          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {applications.length > 0 ? ( //si no hay applications pending no muestra nada
                applications.map((application) => (
                  <li key={application.id} className="px-4 py-4 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-gray-900 font-medium">Usuario: {application.user.name}</p>
                        <p className="text-gray-500">Estado: {application.status}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => {
                          handleUpdateStatus(application.id, 'ACCEPTED', application.version, data.event.version);
                        }}
                        className="mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        disabled={errorApplication||loadingApplication}
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateStatus(application.id, 'REJECTED', application.version, data.event.version);
                        }}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        disabled={errorApplication||loadingApplication}
                      >
                        Rechazar
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-sm text-gray-500">
                  No hay aplicaciones pendientes para este evento.
                </li>
              )}
            </ul>
          </div>
        </div>
        {errorApplication && <p className="text-red-500 font-medium mt-1">Error: {errorApplication.cause.result.errors[0].message}</p>}
        {successMessage && !errorApplication && (
            <div className="bg-indigo-100 border border-indigo-400 text-black-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
      </div>
    );
  };