#!/bin/bash

# Deployment-Skript für support.zubenko.de
# Dieses Skript muss auf dem Ubuntu Server ausgeführt werden

set -e

echo "🚀 Starte Deployment für support.zubenko.de..."

# Variablen
DOMAIN="support.zubenko.de"
APP_DIR="/var/www/$DOMAIN"
NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN"
USER=$(whoami)

# Farben für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funktion für farbige Ausgaben
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Prüfe ob das Skript als root oder mit sudo ausgeführt wird
if [ "$EUID" -ne 0 ]; then 
    print_error "Bitte mit sudo ausführen"
    exit 1
fi

# 1. Nginx installieren (falls nicht vorhanden)
echo "📦 Überprüfe Nginx Installation..."
if ! command -v nginx &> /dev/null; then
    echo "Installiere Nginx..."
    apt update
    apt install -y nginx
    print_success "Nginx installiert"
else
    print_success "Nginx ist bereits installiert"
fi

# 2. Certbot für SSL installieren (falls nicht vorhanden)
echo "🔒 Überprüfe Certbot Installation..."
if ! command -v certbot &> /dev/null; then
    echo "Installiere Certbot..."
    apt install -y certbot python3-certbot-nginx
    print_success "Certbot installiert"
else
    print_success "Certbot ist bereits installiert"
fi

# 3. Erstelle App-Verzeichnis
echo "📁 Erstelle App-Verzeichnis..."
mkdir -p "$APP_DIR"
print_success "Verzeichnis erstellt: $APP_DIR"

# 4. Kopiere Build-Dateien
echo "📋 Kopiere Build-Dateien..."
if [ -d "./dist" ]; then
    cp -r ./dist/* "$APP_DIR/"
    print_success "Build-Dateien kopiert"
else
    print_error "dist/ Verzeichnis nicht gefunden. Bitte erst 'npm run build' ausführen!"
    exit 1
fi

# 5. Setze Berechtigungen
echo "🔐 Setze Berechtigungen..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 755 "$APP_DIR"
print_success "Berechtigungen gesetzt"

# 6. Nginx-Konfiguration kopieren
echo "⚙️ Konfiguriere Nginx..."
if [ -f "./nginx.conf" ]; then
    # Erstelle temporäre Konfiguration ohne SSL für Certbot
    cat > "$NGINX_CONFIG" <<EOL
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root $APP_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~ /\. {
        deny all;
    }
}
EOL
    
    # Aktiviere Konfiguration
    ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
    
    # Teste Nginx-Konfiguration
    nginx -t
    
    # Starte Nginx neu
    systemctl reload nginx
    print_success "Nginx konfiguriert"
else
    print_warning "nginx.conf nicht gefunden, verwende manuelle Konfiguration"
fi

# 7. SSL-Zertifikat mit Certbot einrichten
echo "🔒 Richte SSL-Zertifikat ein..."
print_warning "Bitte geben Sie Ihre E-Mail-Adresse ein, wenn Certbot danach fragt"
certbot --nginx -d "$DOMAIN"

# 8. Finale Nginx-Konfiguration mit SSL
if [ -f "./nginx.conf" ]; then
    cp ./nginx.conf "$NGINX_CONFIG"
    nginx -t && systemctl reload nginx
    print_success "SSL-Konfiguration aktiviert"
fi

# 9. Firewall-Regeln (falls UFW aktiv ist)
if command -v ufw &> /dev/null && ufw status | grep -q "Status: active"; then
    echo "🔥 Konfiguriere Firewall..."
    ufw allow 'Nginx Full'
    print_success "Firewall konfiguriert"
fi

# 10. Automatische SSL-Erneuerung testen
echo "🔄 Teste automatische SSL-Erneuerung..."
certbot renew --dry-run
print_success "SSL-Erneuerung konfiguriert"

echo ""
print_success "========================================="
print_success "🎉 Deployment erfolgreich abgeschlossen!"
print_success "========================================="
echo ""
echo "Ihre App ist jetzt verfügbar unter:"
echo "👉 https://$DOMAIN"
echo ""
echo "Nützliche Befehle:"
echo "  - Nginx neustarten: sudo systemctl restart nginx"
echo "  - Nginx-Logs: sudo tail -f /var/log/nginx/$DOMAIN.access.log"
echo "  - SSL erneuern: sudo certbot renew"
echo ""
