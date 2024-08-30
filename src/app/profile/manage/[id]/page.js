import { gql, useQuery } from '@apollo/client';
import React from 'react';


// Definir la consulta para obtener las aplicaciones de un evento específico
const GET_EVENT_APPLICATIONS_QUERY = gql`
  query GetEventApplications($eventId: ID!) {
    event(id: $eventId) {
      id
      name
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

export default EventApplications = ({ params }) => {
    const  eventId  = params.id;
    // Ejecutar la query para obtener las aplicaciones del evento
    const { loading, error, data } = useQuery(GET_EVENT_APPLICATIONS_QUERY, {
      variables: { eventId },
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    // Obtener la lista de aplicaciones del evento desde los datos de la consulta
    const applications = data.event.applications;
  
    const handleUpdateStatus = async (applicationId, newStatus, version) => {
      // Lógica para manejar la actualización del estado de la aplicación
      // Se desarrolló en la respuesta anterior
    };
  
    return (
      <div>
        {applications.map((application) => (
          <div key={application.id} className="application">
            <p>Usuario: {application.user.name}</p>
            <p>Estado: {application.status}</p>
            <button onClick={() => handleUpdateStatus(application.id, 'ACCEPTED', application.version)}>
              Aceptar
            </button>
            <button onClick={() => handleUpdateStatus(application.id, 'REJECTED', application.version)}>
              Rechazar
            </button>
          </div>
        ))}
      </div>
    );
  };