#!/bin/bash

# Script de déploiement staging - Hetzner VPS (46.62.158.59)  
# Usage: ./deploy-staging.sh

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STAGING_HOST="46.62.158.59"
STAGING_USER="copronomie"
STAGING_PATH="/opt/copronomie-staging"
DOCKER_COMPOSE_FILE="docker-compose.staging.yml"

echo -e "${BLUE}🧪 Démarrage du déploiement STAGING${NC}"
echo -e "${BLUE}Serveur: ${STAGING_HOST}${NC}"
echo -e "${BLUE}Date: $(date)${NC}"
echo ""

# Vérifications préalables
echo -e "${YELLOW}🔍 Vérifications préalables...${NC}"

# Vérifier que nous sommes sur la branche staging ou develop
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "staging" && "$CURRENT_BRANCH" != "develop" && "$CURRENT_BRANCH" != "main" ]]; then
    echo -e "${RED}❌ Erreur: Déploiement staging depuis staging/develop/main uniquement${NC}"
    echo -e "${RED}Branche actuelle: $CURRENT_BRANCH${NC}"
    exit 1
fi

# Vérifier les variables d'environnement
if [ ! -f ".env.staging" ]; then
    echo -e "${RED}❌ Erreur: Fichier .env.staging manquant${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vérifications OK${NC}"

# Build en local (plus permissif pour staging)
echo -e "${YELLOW}🏗️ Build local...${NC}"
pnpm install
pnpm build || echo -e "${YELLOW}⚠️ Build échoué, mais on continue pour staging...${NC}"

echo -e "${GREEN}✅ Build local terminé${NC}"

# Création de l'archive de déploiement
echo -e "${YELLOW}📦 Création de l'archive de déploiement...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="copronomie-staging-${TIMESTAMP}.tar.gz"

tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env*' \
    -czf "/tmp/${ARCHIVE_NAME}" .

echo -e "${GREEN}✅ Archive créée: /tmp/${ARCHIVE_NAME}${NC}"

# Upload sur le serveur
echo -e "${YELLOW}📤 Upload vers le serveur staging...${NC}"
scp "/tmp/${ARCHIVE_NAME}" "${STAGING_USER}@${STAGING_HOST}:/tmp/"
scp ".env.staging" "${STAGING_USER}@${STAGING_HOST}:/tmp/.env"

echo -e "${GREEN}✅ Upload terminé${NC}"

# Déploiement sur le serveur
echo -e "${YELLOW}🚀 Déploiement sur le serveur staging...${NC}"
ssh "${STAGING_USER}@${STAGING_HOST}" << EOF
    set -euo pipefail
    
    echo "📁 Préparation du répertoire staging..."
    sudo mkdir -p ${STAGING_PATH}
    sudo chown ${STAGING_USER}:${STAGING_USER} ${STAGING_PATH}
    
    echo "🗂️ Backup rapide de la version précédente..."
    if [ -d "${STAGING_PATH}/current" ]; then
        rm -rf ${STAGING_PATH}/previous || true
        mv ${STAGING_PATH}/current ${STAGING_PATH}/previous || true
    fi
    
    echo "📦 Extraction de la nouvelle version..."
    mkdir -p ${STAGING_PATH}/current
    cd ${STAGING_PATH}/current
    tar -xzf /tmp/${ARCHIVE_NAME}
    cp /tmp/.env ${STAGING_PATH}/current/.env
    
    echo "🐳 Arrêt des services staging existants..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
    
    echo "🏗️ Build des images Docker staging..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} build
    
    echo "🚀 Démarrage des services staging..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
    
    echo "⏳ Attente du démarrage..."
    sleep 20
    
    echo "🔍 Vérification des services..."
    docker-compose -f ${DOCKER_COMPOSE_FILE} ps
    
    # Health check plus permissif
    if curl -f -s "http://localhost:3000/api/health" > /dev/null; then
        echo "✅ Service staging en bonne santé"
    else
        echo "⚠️ Service staging potentiellement non accessible, mais on continue..."
        docker-compose -f ${DOCKER_COMPOSE_FILE} logs web | tail -20
    fi
    
    echo "🧹 Nettoyage..."
    rm -f /tmp/${ARCHIVE_NAME} /tmp/.env
    
    echo "✅ Déploiement staging terminé!"
EOF

# Nettoyage local
rm -f "/tmp/${ARCHIVE_NAME}"

# Tests post-déploiement
echo -e "${YELLOW}🔍 Tests staging...${NC}"
sleep 5

# Test basique
if curl -f -s "https://staging.copronomie.fr/api/health" > /dev/null; then
    echo -e "${GREEN}✅ Site staging accessible${NC}"
else
    echo -e "${YELLOW}⚠️ Site staging pas encore accessible (normal)${NC}"
fi

# Notification de succès
echo ""
echo -e "${GREEN}🧪 DÉPLOIEMENT STAGING TERMINÉ! 🧪${NC}"
echo -e "${GREEN}URL: https://staging.copronomie.fr${NC}"
echo -e "${GREEN}Health: https://staging.copronomie.fr/api/health${NC}"
echo -e "${GREEN}Branch: ${CURRENT_BRANCH}${NC}"
echo -e "${GREEN}Date: $(date)${NC}"
echo ""

# Log du déploiement
echo "$(date): Déploiement staging terminé - Branch ${CURRENT_BRANCH} - Version ${TIMESTAMP}" >> deployment-staging.log