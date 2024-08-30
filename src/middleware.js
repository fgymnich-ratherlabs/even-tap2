import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');

// Función middleware que maneja cada solicitud entrante
export function middleware(request) {
  // Obtener el token de las cookies de la solicitud
  const token = request.cookies.get('authToken');

  // Comprobar si el usuario está autenticado
  if (token) {
    // Si el usuario está autenticado y accede a /signin o /signup, redirigir al dashboard
    if (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Permitir la solicitud si el token existe o si es una ruta pública
  return NextResponse.next();
}

// Configuración para especificar a qué rutas se aplica el middleware
export const config = {
  matcher: [
    '/dashboard/:path*', // Aplica a todas las rutas bajo /dashboard
    '/events/:path*',    // Aplica a todas las rutas bajo /events
    '/create-event',     // Aplica a la ruta /create-event
    '/profile',   
    '/signin',
    '/signup'
  ],
};
