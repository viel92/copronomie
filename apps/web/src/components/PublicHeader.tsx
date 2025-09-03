'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Copronomie
            </Link>
          </div>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className="text-slate-600 hover:text-slate-900">À propos</Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Tarifs</Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900">Contact</Link>
          </nav>
          
          {/* CTA buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login"
              className="text-slate-600 hover:text-slate-900"
            >
              Se connecter
            </Link>
            <Link 
              href="/auth/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Essayer gratuitement
            </Link>
          </div>
          
          {/* Menu mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Menu mobile ouvert */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/about" className="text-slate-600 hover:text-slate-900">À propos</Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900">Tarifs</Link>
              <Link href="/contact" className="text-slate-600 hover:text-slate-900">Contact</Link>
              <Link href="/auth/login" className="text-slate-600 hover:text-slate-900">Se connecter</Link>
              <Link 
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Essayer gratuitement
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}