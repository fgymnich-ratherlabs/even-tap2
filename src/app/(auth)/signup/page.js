'use client';

import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

const SIGNUP_MUTATION = gql`
  mutation SignUp($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) 
  }
`;

export default function SignupPage() {
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);
  const router = useRouter();

    const handleSignup = async (e) => {
      e.preventDefault();
      // Crear una instancia de FormData para obtener los valores del formulario
      const formData = new FormData(e.target);

      const name = formData.get('name');
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        const response = await signup({ variables: { name, email, password} });
        console.log('User signed up successfully:', response);
        router.push('/signin'); // Redirigir a la página de inicio de sesión después del registro
      } catch (err) {
        console.error('Error during sign up:', err);
      } 
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Even Tap</h2>
          <h4 className="mt-2 text-center text-xl font-bold text-gray-900">El lugar donde confluyen tus eventos</h4>
          <p className="mt-8 text-center text-sm text-gray-600">
            Bienvenido! Regístrate para acceder a la plataforma:
          </p>
        </div>
        <form className="mt-6 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre de usuario"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              Registrarse
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">¿Ya tienes una cuenta?</p>
          <a href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}
