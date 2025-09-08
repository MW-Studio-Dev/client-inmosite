"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-gray-600 dark:text-gray-400">Página no encontrada</p>
        <div className="mt-6">
          <Link href="/" className="text-purple-600 hover:text-purple-700 transition-colors">
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}