"use client";

import {React, useContext} from 'react';
import Image from 'next/image';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useTranslation } from './../../../../i18n/client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SigninSchema } from '../../../lib/validations';

const SIGNIN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signin(email: $email, password: $password) 
  }
`;

export default function SigninForm({params}) {
  const { t } = useTranslation(params.lang, 'signin'); // Hook para traducción
  const [signin, { loading }] = useMutation(SIGNIN_MUTATION);
  const router = useRouter();

  const handleSignin = async (values, { setSubmitting, setFieldError }) => {
    const { email, password } = values;
    try {
      const response = await signin({ variables: { email, password } });

      if (response?.data?.signin) { 
        Cookies.set('authToken', response.data.signin, { expires: 1, secure: true, sameSite: 'Strict' });
        window.location.href ='/dashboard'; 
      } else {
        setFieldError('password', t('incorrect_credentials'));
      }
    } catch (err) {
      setFieldError('password', t('error_credentials'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <p className="mb-2 text-center text-xl font-bold text-gray-700">
            {t('welcome')}
          </p>
          <Image
            src="/logo.png"
            width={1792}
            height={720}
            alt="logo"
            priority={true}
          />
        </div>
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-800">
            {t('signin')}
          </h2>
          <p className="mt-2 text-center text-xl text-gray-600">
            {t('signin_prompt')}
          </p>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SigninSchema}
          onSubmit={handleSignin}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    {t('email')}
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder={t('email')}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    {t('password')}
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder={t('password')}
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? t('loading') : t('submit_button')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="text-sm text-center">
          <p className="text-gray-600">{t('register_prompt')}</p>
          <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            {t('register_link')}
          </a>
        </div>
      </div>
    </div>
  );
}
