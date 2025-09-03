#!/bin/bash

# Script de configuration initiale des serveurs VPS
# Usage: ./setup-server.sh [production|staging]

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SERVER_TYPE=${1:-"staging"}
USER="copronomie"

if [ "$SERVER_TYPE" == "production" ]; then
    SERVER_HOST="51.75.207.4"
    SERVER_NAME="production"
    DOMAIN="copronomie.fr"
elif [ "$SERVER_TYPE" == "staging" ]; then
    SERVER_HOST="46.62.158.59"
    SERVER_NAME="staging"
    DOMAIN="staging.copronomie.fr"
else
    echo -e "${RED}❌ Type de serveur invalide. Utilisez: production ou staging${NC}"
    exit 1
fi

echo -e "${BLUE}🖥️ Configuration du serveur ${SERVER_NAME}${NC}"
echo -e "${BLUE}Host: ${SERVER_HOST}${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo ""

# Connexion et configuration du serveur
ssh root@${SERVER_HOST} << EOF
    set -euo pipefail
    
    echo -e "${YELLOW}🔄 Mise à jour du système...${NC}"
    apt update && apt upgrade -y
    
    echo -e "${YELLOW}👤 Création de l'utilisateur ${USER}...${NC}"
    if ! id "${USER}" &>/dev/null; then
        adduser --disabled-password --gecos "" ${USER}
        usermod -aG sudo ${USER}
        
        # Configuration SSH pour l'utilisateur
        mkdir -p /home/${USER}/.ssh
        cp /root/.ssh/authorized_keys /home/${USER}/.ssh/authorized_keys
        chown -R ${USER}:${USER} /home/${USER}/.ssh
        chmod 700 /home/${USER}/.ssh
        chmod 600 /home/${USER}/.ssh/authorized_keys
        
        echo "${USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
    fi
    
    echo -e "${YELLOW}🐳 Installation de Docker...${NC}"
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        usermod -aG docker ${USER}
        systemctl enable docker
        systemctl start docker
        rm get-docker.sh
    fi
    
    echo -e "${YELLOW}🐳 Installation de Docker Compose...${NC}"
    if ! command -v docker-compose &> /dev/null; then
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    echo -e "${YELLOW}🛠️ Installation des outils système...${NC}"
    apt install -y curl wget git htop nano ufw fail2ban logrotate
    
    echo -e "${YELLOW}🔥 Configuration du firewall...${NC}"
    ufw allow ssh
    ufw allow 80
    ufw allow 443
    echo 'y' | ufw enable
    
    echo -e "${YELLOW}🛡️ Configuration de fail2ban...${NC}"
    cat > /etc/fail2ban/jail.local << 'FAIL2BAN'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s

[caddy-limit]
enabled = true
port = http,https
logpath = /var/log/caddy/*.log
maxretry = 10
findtime = 10m
bantime = 1h
FAIL2BAN
    systemctl enable fail2ban
    systemctl start fail2ban
    
    echo -e "${YELLOW}📁 Création des répertoires...${NC}"
    mkdir -p /opt/copronomie${SERVER_TYPE == "staging" && "-staging" || ""}
    mkdir -p /var/log/caddy
    chown -R ${USER}:${USER} /opt/copronomie${SERVER_TYPE == "staging" && "-staging" || ""}
    chown -R ${USER}:${USER} /var/log/caddy
    
    echo -e "${YELLOW}⚙️ Configuration de logrotate...${NC}"
    cat > /etc/logrotate.d/copronomie << 'LOGROTATE'
/var/log/caddy/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
LOGROTATE
    
    echo -e "${YELLOW}📊 Installation de monitoring...${NC}"
    if ! command -v htop &> /dev/null; then
        apt install -y htop iotop nethogs
    fi
    
    echo -e "${YELLOW}🔧 Optimisations système...${NC}"
    # Optimisations pour Node.js
    echo "fs.file-max = 1000000" >> /etc/sysctl.conf
    echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
    echo "vm.swappiness = 10" >> /etc/sysctl.conf
    sysctl -p
    
    # Limites pour l'utilisateur Node.js
    echo "${USER} soft nofile 1000000" >> /etc/security/limits.conf
    echo "${USER} hard nofile 1000000" >> /etc/security/limits.conf
    
    echo -e "${GREEN}✅ Configuration du serveur ${SERVER_NAME} terminée!${NC}"
EOF

echo -e "${GREEN}🎉 Serveur ${SERVER_NAME} configuré avec succès!${NC}"
echo ""
echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo -e "${BLUE}1. Configurer les DNS pour pointer vers ${SERVER_HOST}${NC}"
echo -e "${BLUE}2. Copier les clés SSH dans GitHub Secrets${NC}"
echo -e "${BLUE}3. Créer les variables d'environnement${NC}"
echo -e "${BLUE}4. Lancer le déploiement${NC}"
echo ""

# Affichage des informations de connexion
echo -e "${YELLOW}🔐 Connexion SSH:${NC}"
echo "ssh ${USER}@${SERVER_HOST}"
echo ""
echo -e "${YELLOW}📊 Monitoring:${NC}"
echo "htop, docker ps, docker-compose logs"