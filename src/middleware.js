import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { i18n } from './i18n/next-i18next.config';
const { defaultLocale, locales, cookieName } = i18n;

acceptLanguage.languages(locales)


// Función middleware que maneja cada solicitud entrante
export function middleware(request) {

  // handlear redirección a la ruta /[lang] correspondiente
  let lng //buscar lng en las cookies
  if (request.cookies.has(cookieName)) lng = acceptLanguage.get(request.cookies.get(cookieName).value)
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
  if (!lng) lng = defaultLocale

  // Redirect if lng in path is not supported
  if (
    !locales.some(loc => request.nextUrl.pathname.startsWith(`/${loc}`)) && //si el path no tiene /[lang]
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}/${request.nextUrl.pathname}`, request.url))
  }

  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer'))
    const lngInReferer = locales.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  // Obtener el token de las cookies de la solicitud
  const token = request.cookies.get('authToken');

  // Comprobar si el usuario está autenticado
  if (token) {
    // Si el usuario está autenticado y accede a /signin o /signup, redirigir al dashboard
    if (request.nextUrl.pathname === `/${lng}/signin` || request.nextUrl.pathname === `/${lng}/signup`) {
      return NextResponse.redirect(new URL(`/${lng}/dashboard`,request.url));
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
    '/signup',
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)' //matcher /lang
  ],
};
