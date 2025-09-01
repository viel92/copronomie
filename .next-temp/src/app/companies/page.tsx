'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Shield, 
  Phone,
  Mail,
  Building,
  Award,
  Plus,
  Eye,
  Euro,
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react'

interface Company {
  id: number
  name: string
  specialty: string
  siret: string
  rating: number
  reviews: number
  zone: string
  phone: string
  email: string
  certifications: string[]
  insurance: string
  insuranceExpiry: string
  projects: number
  averageAmount: string
  verified: boolean
}

export default function CompaniesPage() {
  const { profile, loading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedZone, setSelectedZone] = useState('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [minRating, setMinRating] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('name')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const companies: Company[] = [
    {
      id: 1,
      name: 'BTP Solutions',
      specialty: 'Façade et ravalement',
      siret: '12345678901234',
      rating: 4.5,
      reviews: 28,
      zone: 'Paris (75)',
      phone: '01 42 33 44 55',
      email: 'contact@btpsolutions.fr',
      certifications: ['RGE', 'Qualibat'],
      insurance: 'Valide',
      insuranceExpiry: '2025-06-30',
      projects: 156,
      averageAmount: '45,000€',
      verified: true
    },
    {
      id: 2,
      name: 'Réno Expert',
      specialty: 'Travaux généraux',
      siret: '23456789012345',
      rating: 4.2,
      reviews: 45,
      zone: 'Île-de-France',
      phone: '01 55 66 77 88',
      email: 'info@reno-expert.fr',
      certifications: ['Qualibat'],
      insurance: 'Valide',
      insuranceExpiry: '2025-03-15',
      projects: 203,
      averageAmount: '32,000€',
      verified: true
    },
    {
      id: 3,
      name: 'Ascenseurs Plus',
      specialty: 'Maintenance ascenseurs',
      siret: '34567890123456',
      rating: 4.8,
      reviews: 67,
      zone: 'Paris (75)',
      phone: '01 77 88 99 00',
      email: 'contact@ascenseursplus.fr',
      certifications: ['CACES', 'Qualibat'],
      insurance: 'Expire bientôt',
      insuranceExpiry: '2024-12-31',
      projects: 89,
      averageAmount: '8,500€',
      verified: true
    },
    {
      id: 4,
      name: 'Clean Services',
      specialty: 'Nettoyage et entretien',
      siret: '45678901234567',
      rating: 4.0,
      reviews: 34,
      zone: 'Île-de-France',
      phone: '01 88 99 00 11',
      email: 'admin@cleanservices.fr',
      certifications: [],
      insurance: 'Valide',
      insuranceExpiry: '2025-09-30',
      projects: 112,
      averageAmount: '1,800€',
      verified: false
    },
    {
      id: 5,
      name: 'Électric Expert',
      specialty: 'Électricité générale',
      siret: '56789012345678',
      rating: 4.3,
      reviews: 52,
      zone: 'Boulogne (92)',
      phone: '01 99 00 11 22',
      email: 'contact@electricexpert.fr',
      certifications: ['Qualifelec'],
      insurance: 'Valide',
      insuranceExpiry: '2025-04-20',
      projects: 134,
      averageAmount: '15,000€',
      verified: true
    },
    {
      id: 6,
      name: 'Plomberie Plus',
      specialty: 'Plomberie et chauffage',
      siret: '67890123456789',
      rating: 4.1,
      reviews: 38,
      zone: 'Neuilly (92)',
      phone: '01 00 11 22 33',
      email: 'info@plomberieplus.fr',
      certifications: ['PGN'],
      insurance: 'Valide',
      insuranceExpiry: '2025-08-15',
      projects: 98,
      averageAmount: '12,000€',
      verified: true
    }
  ]

  const zones = [...new Set(companies.map(c => c.zone))]
  const specialties = [...new Set(companies.map(c => c.specialty))]

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = selectedZone === 'all' || company.zone === selectedZone
    const matchesSpecialty = selectedSpecialty === 'all' || company.specialty === selectedSpecialty
    const matchesRating = company.rating >= minRating
    const matchesVerified = !verifiedOnly || company.verified
    
    return matchesSearch && matchesZone && matchesSpecialty && matchesRating && matchesVerified
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'projects':
        return b.projects - a.projects
      case 'zone':
        return a.zone.localeCompare(b.zone)
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedZone('all')
    setSelectedSpecialty('all')
    setMinRating(0)
    setVerifiedOnly(false)
    setSortBy('name')
  }

  const getInsuranceColor = (insurance: string) => {
    switch (insurance) {
      case 'Valide':
        return 'text-green-700 bg-green-100'
      case 'Expire bientôt':
        return 'text-orange-700 bg-orange-100'
      default:
        return 'text-red-700 bg-red-100'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Base entreprises</h1>
          <p className="mt-1 text-sm text-slate-600">
            Gérez votre réseau de partenaires et prestataires - {profile?.organization?.name}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Ajouter une entreprise
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{companies.length}</p>
              <p className="text-sm text-slate-600">Entreprises référencées</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{Math.round((companies.filter(c => c.verified).length / companies.length) * 100)}%</p>
              <p className="text-sm text-slate-600">Assurances à jour</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{(companies.reduce((sum, c) => sum + c.rating, 0) / companies.length).toFixed(1)}</p>
              <p className="text-sm text-slate-600">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche principale */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Filtres rapides et bouton filtres avancés */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Trier par nom</option>
              <option value="rating">Trier par note</option>
              <option value="projects">Trier par expérience</option>
              <option value="zone">Trier par zone</option>
            </select>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres {showFilters ? '▲' : '▼'}
            </button>
            {(selectedZone !== 'all' || selectedSpecialty !== 'all' || minRating > 0 || verifiedOnly) && (
              <button 
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Effacer
              </button>
            )}
          </div>
        </div>
          
        {/* Filtres avancés */}
        {showFilters && (
          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes les zones</option>
                  {zones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Spécialité</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes spécialités</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Note minimum</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>Toutes les notes</option>
                  <option value={4}>4+ étoiles</option>
                  <option value={4.5}>4.5+ étoiles</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Vérifiées uniquement</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Résultats et pagination */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>
          {filteredCompanies.length} entreprise(s) trouvée(s) sur {companies.length}
        </p>
        <div className="flex items-center gap-2">
          <span>Affichage:</span>
          <select className="px-2 py-1 border border-slate-300 rounded text-xs">
            <option value="10">10 par page</option>
            <option value="25">25 par page</option>
            <option value="50">50 par page</option>
          </select>
        </div>
      </div>

      {/* Companies grid */}
      <div className="grid gap-4">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{company.name}</h3>
                      {company.verified && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <Shield className="h-3 w-3" />
                          Vérifiée
                        </div>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInsuranceColor(company.insurance)}`}>
                        {company.insurance}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 mb-3">{company.specialty}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{company.rating}/5</span>
                        <span className="text-slate-500">({company.reviews} avis)</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-700">{company.zone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-700">{company.projects} projets</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-700">Moy: {company.averageAmount}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-600">{company.phone}</span>
                      </div>
                    </div>
                    
                    {company.certifications.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">Certifications:</span>
                          {company.certifications.map((cert, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Eye className="h-4 w-4" />
                  Voir profil
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus className="h-4 w-4" />
                  Consulter
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredCompanies.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Building className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune entreprise trouvée</h3>
            <p className="text-slate-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}