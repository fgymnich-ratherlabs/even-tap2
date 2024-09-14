"use client"

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useTranslation } from './../../i18n/client';
import { useRouter, usePathname  } from 'next/navigation';



export default function Navbar({lang}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const { t } = useTranslation(lang, 'common'); // Usamos i18n para cambiar de idioma
    const router = useRouter();
    const pathname = usePathname();

   const currentPath = router.asPath; // Ruta actual del usuario

    // Función para cambiar el idioma y mantener la misma ruta
    const handleLanguageChange = (newLang) => {
        // Verificamos si la ruta actual ya tiene prefijo de idioma
        const pathParts = pathname.split('/').filter(Boolean); // Filtra para eliminar strings vacíos

        if (pathParts[0] === 'en' || pathParts[0] === 'es') {
            // Si la ruta tiene prefijo, lo reemplazamos
            pathParts[0] = newLang;
        } else {
            // Si no tiene prefijo, lo añadimos al inicio
            pathParts.unshift(newLang);
        }

        // Creamos la nueva ruta con el prefijo de idioma
        const newPath = `/${pathParts.join('/')}`;
        router.push(newPath); // Redirigimos a la nueva ruta
    };

    useEffect(() => { //Para mostrar botones is el user esta logged
        const token = Cookies.get('authToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
    }, []);

    return (
        <nav className="bg-indigo-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-2xl">
                    Even Tap
                </div>
                <div className="flex space-x-4 items-center">
                    {isAuthenticated && <Link href="/dashboard" className="text-white hover:text-black">
                        {t('home')} {/* Texto traducido para "Inicio" */}
                    </Link>}
                    {isAuthenticated && <Link href="/profile" className="text-white hover:text-black">
                        {t('my_profile')} {/* Texto traducido para "Mi Perfil" */}
                    </Link>}
                    {isAuthenticated && <button
                        onClick={(e) => {
                            e.preventDefault();
                            Cookies.remove('authToken');
                            window.location.href = '/';
                        }}
                        className="text-white hover:text-black"
                    >
                        {t('logout')} {/* Texto traducido para "Cerrar Sesión" */}
                    </button>}
                    
                    {/* Botón de cambio de idioma */}
                    <div className="flex space-x-2 border px-1 rounded-md">
                        <button
                            disabled={lang==='en'}
                            onClick={() => handleLanguageChange('en')}
                            className={`text-white font-bold enabled:hover:text-black ${lang === 'en' ? ' bg-indigo-600 rounded-xl' : ''}`}
                        >
                            EN
                        </button>
                        <button
                            disabled={lang==='es'}
                            onClick={() => handleLanguageChange('es')}
                            className={`text-white font-bold enabled:hover:text-black ${lang === 'es' ? ' bg-indigo-600 rounded-xl' : ''}`}
                        >
                            ES
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
