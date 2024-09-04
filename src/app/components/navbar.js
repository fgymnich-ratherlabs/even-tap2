"use client"

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';


export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });

    return (
        <nav className="bg-indigo-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-white font-bold text-2xl">
            Even Tap
            </div>
            <div className="flex space-x-4">
            {isAuthenticated && <Link href="/dashboard" className="text-white hover:text-black">
                Inicio
            </Link>}
            {isAuthenticated && <Link href="/profile" className="text-white hover:text-black">
                Mi Perfil
            </Link>}
            {isAuthenticated && <button
                onClick={(e) => {
                    e.preventDefault();
                    Cookies.remove('authToken');
                    window.location.href = '/signin';
                }}
                className="text-white hover:text-black"
            >
                Cerrar Sesión
            </button>}
            </div>
        </div>
        </nav>
    );
}
