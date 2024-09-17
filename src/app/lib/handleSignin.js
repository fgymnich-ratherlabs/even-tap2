import Cookies from 'js-cookie';

export const handleSignin = async (values, { setSubmitting, setFieldError }, signin, t) => {
    const { email, password } = values;
    try {
      const { data } = await signin({ variables: { email, password } });
      console.log(data);

      if (data?.signin) {
        // Guardar el token y redirigir si el inicio de sesión es exitoso
        Cookies.set('authToken', data.signin, { expires: 1, secure: true, sameSite: 'Strict' });
        window.location.href = '/dashboard';
      }
    } catch (err) {
      // Verificar si el error es de tipo ApolloError
      if (err.graphQLErrors?.[0]) {
        const graphQLError = err.graphQLErrors[0];

        // Manejar el error de autenticación específico
        if (graphQLError.extensions.code === 'UNAUTHENTICATED') {
          setFieldError('password', t('incorrect_credentials')); // Mensaje de credenciales incorrectas
        } else {
          // Otros errores de GraphQL
          setFieldError('password', t('error_credentials'));
        }
      } else {
        // Errores de red u otros tipos de errores
        console.error('Error:', err);
        setFieldError('password', t('error_credentials'));
      }
    } finally {
      setSubmitting(false);
    }
  };