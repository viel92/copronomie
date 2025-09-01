# Guide de Déploiement - Copronomie SaaS

## 🚀 Déploiement sur Vercel

### 1. Prérequis
- Compte Vercel connecté à votre repository GitHub
- Base de données Supabase configurée
- Clé API OpenAI active

### 2. Configuration des Variables d'Environnement

Dans l'interface Vercel, configurez ces variables d'environnement :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Next.js
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 3. Migrations Supabase

Avant le déploiement, assurez-vous que toutes les migrations sont appliquées :

1. Connectez-vous à votre dashboard Supabase
2. Allez dans SQL Editor
3. Exécutez les migrations dans l'ordre :
   - `20250901160000_create_companies_contracts_reports.sql`
   - `20250901170000_create_comparisons.sql`

### 4. Configuration RLS (Row Level Security)

Vérifiez que les politiques RLS sont bien configurées dans Supabase :
- Accès aux données par organisation
- Sécurité des fichiers uploadés
- Restrictions d'accès par utilisateur

### 5. Déploiement

1. **Push vers GitHub** :
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Déploiement automatique Vercel** :
   - Vercel détecte automatiquement les changements
   - Build et déploiement automatiques
   - URL de production fournie

### 6. Tests Post-Déploiement

Testez ces fonctionnalités critiques :

- [ ] Authentification (login/register)
- [ ] Comparateur IA (upload PDF + analyse)
- [ ] Dashboard dynamique
- [ ] Navigation entre modules
- [ ] Export PDF
- [ ] Sauvegarde comparaisons

### 7. Optimisations Performance

Le projet inclut déjà :
- ✅ Compression gzip
- ✅ Optimisation images WebP/AVIF
- ✅ Headers de sécurité
- ✅ Caching optimisé pour PDF.js
- ✅ Lazy loading des composants IA

### 8. Monitoring

Pour surveiller l'application en production :

1. **Vercel Analytics** : Activé automatiquement
2. **Erreurs** : Consultez les logs Vercel
3. **Performance** : Utilisez Lighthouse
4. **Coûts OpenAI** : Surveillez l'usage API

## 🔧 Configuration DNS

Si vous utilisez un domaine personnalisé :

1. Ajoutez le domaine dans Vercel
2. Configurez les enregistrements DNS :
   ```
   CNAME www your-app.vercel.app
   A @ 76.76.19.61
   ```

## 📱 URLs de Production

Une fois déployé :
- **App principale** : `https://your-domain.vercel.app`
- **Comparateur** : `https://your-domain.vercel.app/comparator-v2`
- **Dashboard** : `https://your-domain.vercel.app/dashboard`

## 🛡️ Sécurité

- Headers de sécurité configurés
- HTTPS forcé
- Protection CORS
- Variables sensibles chiffrées
- RLS activé sur Supabase

## 📈 Scalabilité

L'architecture est conçue pour :
- Montée en charge automatique (Vercel)
- Base de données distribuée (Supabase)
- Optimisation des coûts OpenAI
- CDN global pour les assets

---

**✨ L'application est maintenant prête pour la production !**