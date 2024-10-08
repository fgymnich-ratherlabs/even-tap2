import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';


// Configura el enlace HTTP a tu servidor GraphQL
const httpLink = createHttpLink({
  uri: 'https://even-tap2.onrender.com/graphql', // Cambia esta URL según sea necesario
  //uri: 'http://localhost:10000/graphql',
});

// Configura el enlace de autenticación (opcional)
const authLink = setContext((_, { headers }) => {
  // Obtén el token de autenticación desde localStorage o cookies
  const token = Cookies.get('authToken');//localStorage.getItem('auth-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Configura el enlace de error para manejar errores de autenticación
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (typeof window !== 'undefined') {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions }) => {
        if (extensions && extensions.code === 'FORBIDDEN') {
          // Si el código de error es 403, redirige al usuario al signin
          Cookies.remove('authToken'); // Eliminar el token de las cookies
          window.location.href = '/';
        }
      });
    }

    if (networkError && networkError.statusCode === 403) {
      // Manejar errores de red 403
      Cookies.remove('authToken'); // Eliminar el token de las cookies
      window.location.href = '/';
    }

    if (networkError && networkError.statusCode === 401) {
      // Manejar errores de red 403
      Cookies.remove('authToken'); // Eliminar el token de las cookies
      window.location.href = '/';
    }
  }
});

// Combina todos los enlaces en una cadena
const link = errorLink.concat(authLink.concat(httpLink));

// Crea la instancia de Apollo Client
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default client;
