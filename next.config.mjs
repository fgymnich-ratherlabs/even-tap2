/** @type {import('next').NextConfig} */

const nextConfig = {

    redirects: async () => {
        return [
          {
            source: '/',
            destination: '/signin',
            permanent: false, //this redirect is not cached by the browser
          },
          {
            source: '/en',
            destination: '/signin',
            permanent: false, //this redirect is not cached by the browser 
          },
          {
            source: '/es',
            destination: '/signin',
            permanent: false, //this redirect is not cached by the browser
          },
        ];
      },  
};

export default nextConfig;
