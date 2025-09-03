# 🚀 Guide de Déploiement - Copronomie SaaS

## 📋 Vue d'ensemble

Ce guide couvre le déploiement automatisé de Copronomie SaaS sur l'infrastructure VPS avec Docker et CI/CD GitHub Actions.

### 🏗️ Architecture Infrastructure

```
Production (OVH)          Staging (Hetzner)
51.75.207.4              46.62.158.59
copronomie.fr            staging.copronomie.fr
                           
Docker Containers:
├── web (Next.js)
├── caddy (Reverse Proxy)
└── redis (Cache)
```

## 🔧 Prérequis

### Serveurs VPS
- **Production**: OVH VPS (51.75.207.4) - 4GB RAM, 2vCPU
- **Staging**: Hetzner VPS (46.62.158.59) - 2GB RAM, 1vCPU
- Ubuntu 22.04 LTS sur les deux serveurs

### Services Externes  
- **Supabase**: Base de données et auth
- **OpenAI**: API pour analyse IA
- **Domaines**: copronomie.fr + staging.copronomie.fr

## ⚡ Déploiement Rapide

### 1. Configuration des Serveurs

```bash
# Configuration serveur production
./infra/scripts/setup-server.sh production

# Configuration serveur staging  
./infra/scripts/setup-server.sh staging
```

### 2. Configuration GitHub Secrets

Dans GitHub → Settings → Secrets → Actions, ajouter:

#### Secrets Production
```
PRODUCTION_HOST=51.75.207.4
PRODUCTION_USER=copronomie
PRODUCTION_SSH_PRIVATE_KEY=<clé SSH privée>
PRODUCTION_SUPABASE_URL=<URL Supabase>
PRODUCTION_SUPABASE_ANON_KEY=<Clé publique Supabase>
PRODUCTION_SUPABASE_SERVICE_KEY=<Clé service Supabase>
PRODUCTION_DATABASE_URL=<URL base de données>
```

#### Secrets Staging
```
STAGING_HOST=46.62.158.59
STAGING_USER=copronomie
STAGING_SSH_PRIVATE_KEY=<clé SSH privée>
STAGING_SUPABASE_URL=<URL Supabase staging>
STAGING_SUPABASE_ANON_KEY=<Clé publique Supabase>
STAGING_SUPABASE_SERVICE_KEY=<Clé service Supabase>
STAGING_DATABASE_URL=<URL base de données staging>
```

#### Secrets Communs
```
OPENAI_API_KEY=<Clé OpenAI>
```

### 3. Configuration DNS

#### Production (copronomie.fr)
```
Type: A
Name: @
Value: 51.75.207.4
TTL: 300

Type: CNAME  
Name: www
Value: copronomie.fr
TTL: 300
```

#### Staging (staging.copronomie.fr)
```
Type: A
Name: staging
Value: 46.62.158.59
TTL: 300
```

### 4. Déploiement Automatique

Le déploiement se déclenche automatiquement via GitHub Actions:

- **Push sur `main`** → Déploiement production
- **Push sur `staging/develop`** → Déploiement staging

## 🛠️ Déploiement Manuel

### Staging
```bash
git checkout staging
git push origin staging
# Ou directement:
./infra/scripts/deploy-staging.sh
```

### Production  
```bash
git checkout main
git push origin main
# Ou directement:
./infra/scripts/deploy-production.sh
```

## 🔍 Surveillance et Debug

### Health Checks
```bash
# Production
curl https://copronomie.fr/api/health

# Staging
curl https://staging.copronomie.fr/api/health
```

### Logs Docker
```bash
# Sur le serveur
ssh copronomie@51.75.207.4
docker-compose -f docker-compose.prod.yml logs -f web
docker-compose -f docker-compose.prod.yml logs -f caddy
```

### Monitoring Système
```bash
# Connexion serveur
ssh copronomie@51.75.207.4

# Monitoring en temps réel
htop                    # CPU/RAM
docker ps              # Conteneurs
docker stats           # Utilisation ressources
```

## 🔄 Rollback d'Urgence

### Automatique
Le pipeline CI/CD inclut un rollback automatique en cas d'échec de déploiement.

### Manuel
```bash
ssh copronomie@51.75.207.4
cd /opt/copronomie

# Restaurer la version précédente
rm -rf current
mv backup-YYYYMMDD_HHMMSS current
cd current
docker-compose -f docker-compose.prod.yml up -d
```

## 🐳 Commandes Docker Utiles

### Gestion des Services
```bash
# Démarrer tous les services
docker-compose -f docker-compose.prod.yml up -d

# Arrêter tous les services  
docker-compose -f docker-compose.prod.yml down

# Restart un service spécifique
docker-compose -f docker-compose.prod.yml restart web

# Rebuild après changement de code
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Debug et Maintenance
```bash
# Shell dans le conteneur
docker-compose -f docker-compose.prod.yml exec web /bin/sh

# Logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Statistiques de performance
docker stats

# Nettoyage des images inutilisées
docker system prune -af
```

## 🔐 Sécurité

### Firewall (UFW)
```bash
sudo ufw status
# Ports ouverts: 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

### Fail2ban
```bash
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

### SSL/TLS  
Caddy gère automatiquement les certificats Let's Encrypt pour:
- https://copronomie.fr
- https://staging.copronomie.fr

## 🚨 Troubleshooting

### Service ne démarre pas
```bash
# Vérifier les logs
docker-compose logs web

# Vérifier la configuration
docker-compose config

# Tester le health check
curl http://localhost:3000/api/health
```

### Erreurs SSL  
```bash
# Vérifier les logs Caddy
docker-compose logs caddy

# Renouveler les certificats
docker-compose restart caddy
```

### Base de données non accessible
```bash
# Tester la connexion Supabase
curl -H "apikey: YOUR_ANON_KEY" "YOUR_SUPABASE_URL/rest/v1/"
```

### Problèmes de performance
```bash
# Monitoring ressources
htop
iotop
nethogs

# Logs détaillés
docker-compose logs --tail=100 web
```

## 📊 Métriques et Alertes

### URLs de Monitoring
- Production: https://copronomie.fr/api/health
- Staging: https://staging.copronomie.fr/api/health

### Métriques Incluses
- Uptime et timestamp
- Utilisation mémoire
- Version de l'application  
- Status des services externes

## 🔄 Pipeline CI/CD

### Workflow GitHub Actions
1. **Tests** - Lint, tests unitaires, build
2. **Build** - Images Docker optimisées  
3. **Deploy** - Selon la branche (staging/production)
4. **Health Check** - Vérification post-déploiement
5. **Rollback** - En cas d'échec

### Branches de Déploiement
- `main` → Production (OVH)
- `staging` → Staging (Hetzner)
- `develop` → Staging (Hetzner)

## 📞 Support

### Logs d'Application
```bash
# Sur le serveur
tail -f /var/log/caddy/copronomie.log
docker-compose logs -f web
```

### Contacts d'Urgence
- **Infrastructure**: OVH Support, Hetzner Support
- **Services**: Supabase Status, OpenAI Status
- **Monitoring**: GitHub Actions, Health endpoints

---

## ✅ Checklist de Déploiement

### Avant le Go-Live
- [ ] Serveurs configurés et sécurisés
- [ ] DNS configurés et propagés  
- [ ] Variables d'environnement définies
- [ ] Pipeline CI/CD testé sur staging
- [ ] Health checks fonctionnels
- [ ] Monitoring en place

### Go-Live Production
- [ ] Déploiement depuis branche `main`
- [ ] Vérification health check production
- [ ] Tests fonctionnels rapides
- [ ] Surveillance des logs 30min
- [ ] Communication équipe

### Post Go-Live
- [ ] Surveillance 24h continue
- [ ] Backup automatique configuré
- [ ] Documentation mise à jour
- [ ] Formation équipe sur maintenance

---

**🎯 Infrastructure Production-Ready avec 55€/mois tout compris!**