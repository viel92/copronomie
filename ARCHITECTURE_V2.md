# Architecture Copronomie V2 - Production Ready

## 🎯 Objectif
Restructurer complètement copronomie en architecture production-ready basée sur les meilleures pratiques de Benjamin Code (stackultime.md) adaptée à vos VPS configurés.

## 🏗️ Architecture Technique

### Stack Technologique
```
Frontend: Next.js 15 (TypeScript)
Backend: API Routes Next.js + Services métier
Base de données: Supabase PostgreSQL
Infrastructure: Docker + Caddy sur VPS OVH/Hetzner
Monorepo: PNPM
CI/CD: GitHub Actions
```

### Structure Monorepo Proposée
```
copronomie/
├── apps/
│   ├── web/                 # Frontend Next.js
│   └── api/                 # Services API (optionnel)
├── packages/
│   ├── shared/              # Types partagés TypeScript
│   ├── ui/                  # Composants réutilisables
│   ├── supabase/           # Client et types Supabase
│   └── config/             # Configurations partagées
├── infra/
│   ├── docker/             # Dockerfiles et compose
│   ├── caddy/              # Configuration Caddy
│   └── ci/                 # Scripts CI/CD
└── docs/
    └── deployment/         # Documentation déploiement
```

## 🚀 Infrastructure VPS

### Environnements
- **Production**: OVH (51.75.207.4) → copronomie.fr
- **Staging**: Hetzner (46.62.158.59) → staging.copronomie.fr

### Services Docker
```yaml
# docker-compose.prod.yml
services:
  web:
    build: ./apps/web
    container_name: copronomie-web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`copronomie.fr`)"
  
  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/caddy/Caddyfile:/etc/caddy/Caddyfile
```

### Configuration Caddy
```
copronomie.fr, www.copronomie.fr {
    reverse_proxy web:3000
    encode gzip
    
    # Headers de sécurité
    header {
        X-Frame-Options DENY
        X-Content-Type-Options nosniff
    }
}
```

## 📱 Architecture Applicative

### Frontend (Next.js App Router)
```
src/
├── app/
│   ├── (auth)/             # Routes authentification
│   ├── dashboard/          # Interface utilisateur
│   ├── comparator/         # Comparateur principal
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Composants base (shadcn/ui style)
│   ├── forms/             # Formulaires métier
│   └── charts/            # Graphiques comparaison
├── lib/
│   ├── supabase/          # Client Supabase
│   ├── utils/             # Utilitaires
│   └── validations/       # Schémas Zod
└── hooks/                 # Hooks React personnalisés
```

### Intégration Supabase
```typescript
// packages/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Types Partagés
```typescript
// packages/shared/types.ts
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
```

## 🔧 Services Métier

### Comparateur IA (Service Principal)
```typescript
// apps/web/lib/services/comparator.ts
export class ComparatorService {
  async analyzeDevis(files: File[]): Promise<DevisComparison> {
    // 1. Extraction PDF via API
    // 2. Analyse IA OpenAI
    // 3. Structuration données
    // 4. Sauvegarde Supabase
  }
}
```

### Gestionnaire de Fichiers
```typescript
// apps/web/lib/services/file-manager.ts
export class FileManagerService {
  async uploadToSupabase(file: File): Promise<string>
  async extractPdfContent(file: File): Promise<string>
  async generateReport(comparison: DevisComparison): Promise<Buffer>
}
```

## 📊 Base de Données Supabase

### Tables Principales
```sql
-- Comparaisons
CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  data JSONB NOT NULL,
  files_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copropriétés
CREATE TABLE coproprietes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  nom VARCHAR NOT NULL,
  adresse TEXT,
  nb_lots INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entreprises
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR NOT NULL,
  siret VARCHAR,
  specialites TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Politique de sécurité pour comparisons
CREATE POLICY "Users can view own comparisons" 
  ON comparisons FOR SELECT 
  USING (auth.uid() = user_id);
```

## 🚀 Pipeline CI/CD

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS
on:
  push:
    branches: [main, staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup PNPM
        uses: pnpm/action-setup@v2
      - name: Build Docker images
        run: |
          docker build -t copronomie/web ./apps/web
      - name: Deploy to VPS
        run: |
          # SSH deployment to OVH/Hetzner
```

## 📈 Pages à Créer/Refactorer

### Pages Essentielles Manquantes
1. **Dashboard principal** - Vue d'ensemble utilisateur
2. **Gestion des copropriétés** - CRUD copropriétés
3. **Historique des comparaisons** - Archives et recherche
4. **Paramètres du compte** - Configuration utilisateur
5. **Page tarification** - Plans et abonnements
6. **Onboarding** - Guide première utilisation

### Pages à Refactorer
1. **Comparator-v2** - Corriger les bugs, améliorer UX
2. **Auth (login/register)** - Simplifier et sécuriser
3. **Landing page** - SEO et conversion

## 🔒 Sécurité et Performance

### Sécurité
- Headers CSP via Caddy
- Rate limiting API Routes
- Validation Zod toutes entrées
- RLS Supabase strict
- Logs d'audit

### Performance
- Images optimisées (WebP/AVIF)
- Bundle splitting Next.js
- Cache Caddy
- CDN pour assets statiques
- Monitoring via Docker stats

## 💸 Estimation Coûts Mensuels
- OVH VPS Production: ~20€/mois
- Hetzner VPS Staging: ~15€/mois  
- Supabase: 0-25€/mois selon usage
- Domaine: ~10€/an
- **Total: ~55€/mois** (très raisonnable pour un SaaS)

## ⚡ Migration Step-by-Step

### Phase 1: Restructuration (Semaine 1)
1. Setup monorepo PNPM
2. Migration code existant
3. Création packages partagés

### Phase 2: Backend robuste (Semaine 2)  
1. Services métier TypeScript
2. Integration Supabase propre
3. APIs production-ready

### Phase 3: Infrastructure (Semaine 3)
1. Dockerisation complète
2. Configuration Caddy
3. Pipeline CI/CD

### Phase 4: Déploiement (Semaine 4)
1. Tests staging Hetzner
2. Migration données
3. Mise en production OVH

Ce plan assure une transition vers une architecture scalable, maintenable et prête pour la croissance de votre SaaS.