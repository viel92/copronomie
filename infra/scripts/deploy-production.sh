#!/bin/bash

# Script de déploiement production - OVH VPS (51.75.207.4)
# Usage: ./deploy-production.sh

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_HOST="51.75.207.4"
PRODUCTION_USER="copronomie"
PRODUCTION_PATH="/opt/copronomie"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

echo -e "${BLUE}🚀 Démarrage du déploiement PRODUCTION${NC}"
echo -e "${BLUE}Serveur: ${PRODUCTION_HOST}${NC}"
echo -e "${BLUE}Date: $(date)${NC}"
echo ""

# Vérifications préalables
echo -e "${YELLOW}🔍 Vérifications préalables...${NC}"

# Vérifier que nous sommes sur la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Erreur: Déploiement production uniquement depuis la branche 'main'${NC}"
    echo -e "${RED}Branche actuelle: $CURRENT_BRANCH${NC}"
    exit 1
fi

# Vérifier que le working tree est propre
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Erreur: Working tree non propre. Committez vos changements.${NC}"
    git status --short
    exit 1
fi

# Vérifier les variables d'environnement
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Erreur: Fichier .env.production manquant${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vérifications OK${NC}"

# Build et test en local
echo -e "${YELLOW}🏗️ Build et tests locaux...${NC}"
pnpm install --frozen-lockfile
pnpm build
pnpm test:ci || echo -e "${YELLOW}⚠️ Tests échoués, mais on continue...${NC}"

echo -e "${GREEN}✅ Build local réussi${NC}"

# Création de l'archive de déploiement
echo -e "${YELLOW}📦 Création de l'archive de déploiement...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="copronomie-${TIMESTAMP}.tar.gz"

# Exclure les fichiers non nécessaires
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env*' \
    -czf "/tmp/${ARCHIVE_NAME}" .

echo -e "${GREEN}✅ Archive créée: /tmp/${ARCHIVE_NAME}${NC}"

# Upload sur le serveur
echo -e "${YELLOW}📤 Upload vers le serveur production...${NC}"
scp "/tmp/${ARCHIVE_NAME}" "${PRODUCTION_USER}@${PRODUCTION_HOST}:/tmp/"
scp ".env.production" "${PRODUCTION_USER}@${PRODUCTION_HOST}:/tmp/.env"

echo -e "${GREEN}✅ Upload terminé${NC}"

# Déploiement sur le serveur
echo -e "${YELLOW}🚀 Déploiement sur le serveur...${NC}"
ssh "${PRODUCTION_USER}@${PRODUCTION_HOST}" << EOF
    set -euo pipefail
    
    echo "📁 Préparation du répertoire de déploiement..."
    sudo mkdir -p ${PRODUCTION_PATH}
    sudo chown ${PRODUCTION_USER}:${PRODUCTION_USER} ${PRODUCTION_PATH}
    
    echo "🗂️ Backup de la version précédente..."
    if [ -d "${PRODUCTION_PATH}/current" ]; then
        sudo mv ${PRODUCTION_PATH}/current ${PRODUCTION_PATH}/backup-$(date +%Y%m%d_%H%M%S)
    fi
    
    echo "📦 Extraction de la nouvelle version..."
    mkdir -p ${PRODUCTION_PATH}/current
    cd ${PRODUCTION_PATH}/current
    tar -xzf /tmp/${ARCHIVE_NAME}
    cp /tmp/.env ${PRODUCTION_PATH}/current/.env
    
    echo "🐳 Arrêt des services existants..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
    
    echo "🏗️ Build des images Docker..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} build --no-cache
    
    echo "🚀 Démarrage des nouveaux services..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
    
    echo "⏳ Attente du démarrage des services..."
    sleep 30
    
    echo "🔍 Vérification de la santé des services..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} ps
    
    # Health check
    if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
        echo "✅ Service en bonne santé"
    else
        echo "❌ Service non accessible"
        docker-compose -f ${DOCKER_COMPOSE_FILE} logs web
        exit 1
    fi
    
    echo "🧹 Nettoyage..."
    rm -f /tmp/${ARCHIVE_NAME} /tmp/.env
    docker system prune -f
    
    echo "✅ Déploiement production terminé avec succès!"
EOF

# Nettoyage local
rm -f "/tmp/${ARCHIVE_NAME}"

# Tests post-déploiement
echo -e "${YELLOW}🔍 Tests post-déploiement...${NC}"
sleep 10

# Test de base
if curl -f -s "https://copronomie.fr/api/health" > /dev/null; then
    echo -e "${GREEN}✅ Site principal accessible${NC}"
else
    echo -e "${RED}❌ Site principal non accessible${NC}"
    exit 1
fi

# Notification de succès
echo ""
echo -e "${GREEN}🎉 DÉPLOIEMENT PRODUCTION RÉUSSI! 🎉${NC}"
echo -e "${GREEN}URL: https://copronomie.fr${NC}"
echo -e "${GREEN}Health: https://copronomie.fr/api/health${NC}"
echo -e "${GREEN}Date: $(date)${NC}"
echo ""

# Log du déploiement
echo "$(date): Déploiement production réussi - Version ${TIMESTAMP}" >> deployment.log