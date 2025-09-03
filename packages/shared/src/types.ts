// Types métier principaux pour Copronomie

export interface DevisComparison {
  synthese_executive: {
    entreprise_recommandee: string
    justification: string
    economies_possibles: string
  }
  comparaison_detaillee: CompanyAnalysis[]
  cahier_des_charges: ProjectSpecification
  analyse_ecarts: GapAnalysis
  recommandations_negociation: string[]
}

export interface CompanyAnalysis {
  entreprise: string
  montant_total: number
  montant_ht?: number
  quantite_materiel: string
  prix_unitaire: string | null
  delai_realisation: string
  materiel_propose: string
  qualite_materiel: string
  prestations_incluses: string[]
  garanties: string[]
  points_forts: string[]
  points_faibles: string[]
  note_sur_10: number
}

export interface ProjectSpecification {
  titre: string
  description_generale: string
  postes_travaux: WorkItem[]
  criteres_evaluation: string[]
  delai_souhaite: string
  budget_previsionnel: {
    minimum: number
    maximum: number
  }
}

export interface WorkItem {
  intitule: string
  description: string
  specifications_techniques: string[]
  quantite_estimee: string
}

export interface GapAnalysis {
  ecart_prix_max_min: {
    montant: number
    pourcentage: number
  }
  ecart_delai_max_min: string
  postes_variables: string[]
}

// Types base de données Supabase
export interface Copropriete {
  id: string
  user_id: string
  nom: string
  adresse?: string
  nb_lots?: number
  created_at: string
  updated_at?: string
}

export interface Company {
  id: string
  nom: string
  siret?: string
  specialites: string[]
  adresse?: string
  contact_email?: string
  contact_phone?: string
  created_at: string
}

export interface Comparison {
  id: string
  user_id: string
  copropriete_id?: string
  data: DevisComparison
  files_count: number
  status: 'pending' | 'completed' | 'error'
  created_at: string
  updated_at?: string
}

export interface UserProfile {
  id: string
  email: string
  nom?: string
  prenom?: string
  role: 'admin' | 'syndic' | 'conseil_syndical'
  coproprietes: string[] // IDs des copropriétés gérées
  created_at: string
  last_login?: string
}

// Types API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

// Types de fichiers
export interface FileUpload {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
}

export interface PdfAnalysisResult {
  filename: string
  content: string
  metadata: {
    pages: number
    size: number
    type: string
  }
}