'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { companiesService, type Company, type CompaniesFilters } from '@/services/companies.service'
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
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function CompaniesPage() {
  const { profile, loading: authLoading } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedZone, setSelectedZone] = useState('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [minRating, setMinRating] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    if (!authLoading) {
      loadCompanies()
    }
  }, [authLoading, searchTerm, selectedZone, selectedSpecialty, minRating, verifiedOnly, sortBy])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: CompaniesFilters = {
        search: searchTerm || undefined,
        specialty: selectedSpecialty !== 'all' ? selectedSpecialty : undefined,
        zone: selectedZone !== 'all' ? selectedZone : undefined,
        verified: verifiedOnly ? true : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        sortBy
      }

      const companiesData = await companiesService.getCompanies(filters)
      setCompanies(companiesData)
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error)
      setError('Erreur lors du chargement des entreprises')
      // Données de fallback en cas d'erreur (temporaire)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedZone('all')
    setSelectedSpecialty('all')
    setMinRating(0)
    setVerifiedOnly(false)
    setSortBy('name')
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Entreprises</h1>
          <p className="mt-1 text-sm text-slate-600">
            Annuaire des prestataires et entreprises partenaires
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Ajouter entreprise
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Spécialité</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Toutes</option>
                {companiesService.getSpecialties().map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Zone</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Toutes</option>
                {companiesService.getZones().map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Note minimum</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value={0}>Toutes</option>
                <option value={3}>3+ étoiles</option>
                <option value={4}>4+ étoiles</option>
                <option value={4.5}>4.5+ étoiles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tri</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="name">Nom</option>
                <option value="rating">Note</option>
                <option value="projects">Projets</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Vérifiées uniquement
              </label>
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Erreur</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Companies Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune entreprise trouvée</h3>
              <p className="text-slate-600">Essayez de modifier vos critères de recherche ou ajoutez une nouvelle entreprise.</p>
            </div>
          ) : (
            companies.map((company) => (
              <div key={company.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{company.name}</h3>
                      {company.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 capitalize">{company.specialty}</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getRatingStars(company.rating)}
                    </div>
                    <span className="text-sm text-slate-600">
                      {company.rating.toFixed(1)} ({company.reviews_count} avis)
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-1">
                    {company.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-3 w-3" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="h-3 w-3" />
                        <span>{company.email}</span>
                      </div>
                    )}
                    {company.zone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-3 w-3" />
                        <span>{company.zone}</span>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  {company.certifications && company.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {company.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          <Award className="h-3 w-3" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-slate-900">{company.projects_count}</div>
                      <div className="text-xs text-slate-600">Projets</div>
                    </div>
                    {company.average_amount && (
                      <div className="text-center">
                        <div className="text-sm font-semibold text-slate-900">
                          {company.average_amount.toLocaleString()}€
                        </div>
                        <div className="text-xs text-slate-600">Montant moy.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}