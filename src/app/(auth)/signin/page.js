"use client"

import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const SIGNIN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signin(email: $email, password: $password) 
  }
`;

export default function SigninForm() {
  const [signin, { data, loading, error }] = useMutation(SIGNIN_MUTATION);
  const router = useRouter();

  const handleSignin = async (e) => {
    e.preventDefault();

    // Crear una instancia de FormData para obtener los valores del formulario
    const formData = new FormData(e.target);

    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await signin({ variables: { email, password } });
      if(response?.data?.signin){ 
        // Almacenar el token que devuelve signin en localStorage o cookies
        //localStorage.setItem('authToken', response.data.signin);
        Cookies.set('authToken', response.data.signin, { expires: 1, secure: true, sameSite: 'Strict' });
        router.push('/dashboard'); // Redirigir al dashboard u otra página tras iniciar sesión

      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa con tu correo y contraseña para continuar.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">¿No tienes una cuenta?</p>
          <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Regístrate
          </a>
        </div>
      </div>
    </div>
  );
}
