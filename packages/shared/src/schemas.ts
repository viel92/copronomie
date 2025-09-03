import { z } from 'zod'

// Schémas de validation avec Zod

export const CompanyAnalysisSchema = z.object({
  entreprise: z.string().min(1, 'Nom d\'entreprise requis'),
  montant_total: z.number().positive('Montant doit être positif'),
  montant_ht: z.number().positive().optional(),
  quantite_materiel: z.string(),
  prix_unitaire: z.string().nullable(),
  delai_realisation: z.string(),
  materiel_propose: z.string(),
  qualite_materiel: z.string(),
  prestations_incluses: z.array(z.string()),
  garanties: z.array(z.string()),
  points_forts: z.array(z.string()),
  points_faibles: z.array(z.string()),
  note_sur_10: z.number().min(0).max(10, 'Note doit être entre 0 et 10')
})

export const WorkItemSchema = z.object({
  intitule: z.string().min(1, 'Intitulé requis'),
  description: z.string(),
  specifications_techniques: z.array(z.string()),
  quantite_estimee: z.string()
})

export const ProjectSpecificationSchema = z.object({
  titre: z.string().min(1, 'Titre requis'),
  description_generale: z.string(),
  postes_travaux: z.array(WorkItemSchema),
  criteres_evaluation: z.array(z.string()),
  delai_souhaite: z.string(),
  budget_previsionnel: z.object({
    minimum: z.number().positive('Budget minimum requis'),
    maximum: z.number().positive('Budget maximum requis')
  }).refine(data => data.maximum >= data.minimum, {
    message: 'Budget maximum doit être supérieur au minimum'
  })
})

export const DevisComparisonSchema = z.object({
  synthese_executive: z.object({
    entreprise_recommandee: z.string().min(1, 'Entreprise recommandée requise'),
    justification: z.string().min(1, 'Justification requise'),
    economies_possibles: z.string()
  }),
  comparaison_detaillee: z.array(CompanyAnalysisSchema).min(2, 'Minimum 2 entreprises requises'),
  cahier_des_charges: ProjectSpecificationSchema,
  analyse_ecarts: z.object({
    ecart_prix_max_min: z.object({
      montant: z.number(),
      pourcentage: z.number()
    }),
    ecart_delai_max_min: z.string(),
    postes_variables: z.array(z.string())
  }),
  recommandations_negociation: z.array(z.string())
})

// Schémas entités base
export const CoproprieteCreateSchema = z.object({
  nom: z.string().min(1, 'Nom de copropriété requis').max(200),
  adresse: z.string().max(500).optional(),
  nb_lots: z.number().int().positive().max(10000).optional()
})

export const CoproprieteUpdateSchema = CoproprieteCreateSchema.partial()

export const CompanyCreateSchema = z.object({
  nom: z.string().min(1, 'Nom d\'entreprise requis').max(200),
  siret: z.string().regex(/^\d{14}$/, 'SIRET doit contenir 14 chiffres').optional(),
  specialites: z.array(z.string()).min(1, 'Au moins une spécialité requise'),
  adresse: z.string().max(500).optional(),
  contact_email: z.string().email('Email invalide').optional(),
  contact_phone: z.string().max(20).optional()
})

export const CompanyUpdateSchema = CompanyCreateSchema.partial()

// Schémas authentification
export const UserRegistrationSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Mot de passe doit contenir au moins une minuscule')
    .regex(/\d/, 'Mot de passe doit contenir au moins un chiffre'),
  nom: z.string().min(1, 'Nom requis').max(100),
  prenom: z.string().min(1, 'Prénom requis').max(100),
  role: z.enum(['syndic', 'conseil_syndical'], {
    errorMap: () => ({ message: 'Rôle invalide' })
  })
})

export const UserLoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
})

// Schémas API
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).default(['application/pdf'])
}).refine(data => data.file.size <= data.maxSize, {
  message: 'Fichier trop volumineux'
}).refine(data => data.allowedTypes.includes(data.file.type), {
  message: 'Type de fichier non autorisé'
})

// Types inférés à partir des schémas
export type CompanyAnalysisInput = z.infer<typeof CompanyAnalysisSchema>
export type ProjectSpecificationInput = z.infer<typeof ProjectSpecificationSchema>
export type DevisComparisonInput = z.infer<typeof DevisComparisonSchema>
export type CoproprieteCreateInput = z.infer<typeof CoproprieteCreateSchema>
export type CoproprieteUpdateInput = z.infer<typeof CoproprieteUpdateSchema>
export type CompanyCreateInput = z.infer<typeof CompanyCreateSchema>
export type CompanyUpdateInput = z.infer<typeof CompanyUpdateSchema>
export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>
export type UserLoginInput = z.infer<typeof UserLoginSchema>
export type PaginationInput = z.infer<typeof PaginationSchema>
export type FileUploadInput = z.infer<typeof FileUploadSchema>