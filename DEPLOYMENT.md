# 🚀 Deployment-Anleitung für support.zubenko.de

Diese Anleitung erklärt, wie Sie Ihre OmniCRM & Support Hub Anwendung auf einem Ubuntu Server deployen und über die Domain **support.zubenko.de** verfügbar machen.

## 📋 Voraussetzungen

### Auf Ihrem lokalen Windows-Rechner:
- Node.js installiert
- SSH-Zugriff auf Ihren Ubuntu Server
- Git (optional, aber empfohlen)

### Auf Ihrem Ubuntu Server:
- Ubuntu 20.04 oder höher
- Root- oder Sudo-Zugriff
- Mindestens 1 GB freier Speicherplatz
- Port 80 und 443 offen (für HTTP/HTTPS)

### DNS-Konfiguration:
- **WICHTIG:** Die Domain `support.zubenko.de` muss auf die IP-Adresse Ihres Servers zeigen
- Erstellen Sie einen A-Record: `support.zubenko.de → [Server-IP-Adresse]`
- Warten Sie, bis die DNS-Änderungen propagiert sind (kann 1-24 Stunden dauern)

## 🎯 Deployment-Optionen

### Option 1: Automatisches Deployment (Empfohlen)

#### Schritt 1: Lokale Vorbereitung (Windows)

1. Öffnen Sie PowerShell im Projektverzeichnis

2. Setzen Sie Ihren Gemini API Key in `.env.production`:
   ```bash
   notepad .env.production
   ```
   Ersetzen Sie `your_gemini_api_key_here` mit Ihrem echten API-Key

3. Führen Sie das Vorbereitungsskript aus:
   ```bash
   .\deploy-prepare.bat
   ```

   Dies wird:
   - Dependencies installieren
   - Production Build erstellen
   - Deployment-Paket in `deploy-package/` erstellen

#### Schritt 2: Upload zum Server

Übertragen Sie die Dateien mit SCP (ersetzen Sie die Platzhalter):
```bash
scp -r deploy-package/* username@ihre-server-ip:/home/username/support-app/
```

Beispiel:
```bash
scp -r deploy-package/* markus@192.168.1.100:/home/markus/support-app/
```

#### Schritt 3: Deployment auf dem Server

1. Verbinden Sie sich mit dem Server:
   ```bash
   ssh username@ihre-server-ip
   ```

2. Navigieren Sie zum Upload-Verzeichnis:
   ```bash
   cd /home/username/support-app
   ```

3. Machen Sie das Deployment-Skript ausführbar:
   ```bash
   chmod +x deploy.sh
   ```

4. Führen Sie das Deployment aus:
   ```bash
   sudo ./deploy.sh
   ```

5. Folgen Sie den Anweisungen auf dem Bildschirm:
   - Geben Sie Ihre E-Mail-Adresse ein (für SSL-Zertifikat-Benachrichtigungen)
   - Bestätigen Sie die Let's Encrypt Nutzungsbedingungen

Das Skript wird automatisch:
- ✅ Nginx installieren und konfigurieren
- ✅ SSL-Zertifikate mit Let's Encrypt einrichten
- ✅ Die Anwendung deployen
- ✅ Firewall konfigurieren
- ✅ Automatische SSL-Erneuerung einrichten

#### Schritt 4: Fertig! 🎉

Ihre Anwendung ist jetzt verfügbar unter:
**https://support.zubenko.de**

---

### Option 2: Manuelles Deployment

Falls Sie mehr Kontrolle wünschen oder etwas schief geht:

#### 1. Build lokal erstellen

```bash
npm install
npm run build
```

#### 2. Server vorbereiten

Auf dem Ubuntu Server:

```bash
# Nginx installieren
sudo apt update
sudo apt install -y nginx

# Certbot für SSL installieren
sudo apt install -y certbot python3-certbot-nginx

# App-Verzeichnis erstellen
sudo mkdir -p /var/www/support.zubenko.de
```

#### 3. Build-Dateien hochladen

Von Ihrem Windows-Rechner:
```bash
scp -r dist/* username@server-ip:/tmp/support-build/
```

Auf dem Server:
```bash
sudo mv /tmp/support-build/* /var/www/support.zubenko.de/
sudo chown -R www-data:www-data /var/www/support.zubenko.de
sudo chmod -R 755 /var/www/support.zubenko.de
```

#### 4. Nginx konfigurieren

Erstellen Sie eine Konfigurationsdatei:
```bash
sudo nano /etc/nginx/sites-available/support.zubenko.de
```

Fügen Sie folgenden Inhalt ein:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name support.zubenko.de;

    root /var/www/support.zubenko.de;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ /\. {
        deny all;
    }
}
```

Aktivieren Sie die Konfiguration:
```bash
sudo ln -s /etc/nginx/sites-available/support.zubenko.de /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL-Zertifikat einrichten

```bash
sudo certbot --nginx -d support.zubenko.de
```

Folgen Sie den Anweisungen und wählen Sie die Option zur automatischen Umleitung auf HTTPS.

---

## 🔄 Updates deployen

Wenn Sie Änderungen an der Anwendung vornehmen:

1. Erstellen Sie einen neuen Build:
   ```bash
   npm run build
   ```

2. Laden Sie die neuen Dateien hoch:
   ```bash
   scp -r dist/* username@server-ip:/tmp/support-update/
   ```

3. Auf dem Server:
   ```bash
   sudo rm -rf /var/www/support.zubenko.de/*
   sudo mv /tmp/support-update/* /var/www/support.zubenko.de/
   sudo chown -R www-data:www-data /var/www/support.zubenko.de
   ```

Kein Nginx-Neustart erforderlich!

---

## 🛠 Nützliche Befehle

### Nginx-Verwaltung
```bash
# Status prüfen
sudo systemctl status nginx

# Neustarten
sudo systemctl restart nginx

# Konfiguration testen
sudo nginx -t

# Logs ansehen
sudo tail -f /var/log/nginx/support.zubenko.de.access.log
sudo tail -f /var/log/nginx/support.zubenko.de.error.log
```

### SSL-Zertifikat
```bash
# Zertifikat manuell erneuern
sudo certbot renew

# Zertifikat-Status prüfen
sudo certbot certificates

# Test der automatischen Erneuerung
sudo certbot renew --dry-run
```

### Firewall (UFW)
```bash
# Status prüfen
sudo ufw status

# Nginx-Traffic erlauben
sudo ufw allow 'Nginx Full'
```

---

## 🐛 Troubleshooting

### Problem: Domain nicht erreichbar

**Lösung:**
1. Prüfen Sie DNS-Einstellungen:
   ```bash
   nslookup support.zubenko.de
   ```
2. Prüfen Sie, ob Nginx läuft:
   ```bash
   sudo systemctl status nginx
   ```

### Problem: SSL-Zertifikat-Fehler

**Lösung:**
1. Stellen Sie sicher, dass Port 80 und 443 offen sind:
   ```bash
   sudo ufw status
   ```
2. Prüfen Sie Certbot-Logs:
   ```bash
   sudo tail -f /var/log/letsencrypt/letsencrypt.log
   ```

### Problem: 404-Fehler bei Routing

**Lösung:**
Die Nginx-Konfiguration enthält bereits `try_files $uri $uri/ /index.html;` für React-Routing.
Falls es nicht funktioniert, prüfen Sie:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Problem: API-Key funktioniert nicht

**Lösung:**
Der API-Key wird zur Build-Zeit eingebettet. Stellen Sie sicher, dass `.env.production` korrekt gesetzt ist, bevor Sie `npm run build` ausführen.

---

## 📊 Monitoring

### Log-Dateien überwachen

Echtzeit-Überwachung der Zugriffe:
```bash
sudo tail -f /var/log/nginx/support.zubenko.de.access.log
```

Fehler überwachen:
```bash
sudo tail -f /var/log/nginx/support.zubenko.de.error.log
```

### Nginx-Status

Status anzeigen:
```bash
sudo systemctl status nginx
```

---

## 🔒 Sicherheitshinweise

1. **API-Keys:** Teilen Sie niemals Ihren Gemini API Key öffentlich
2. **Server-Zugriff:** Verwenden Sie SSH-Keys statt Passwörter
3. **Firewall:** Lassen Sie nur notwendige Ports offen
4. **Updates:** Halten Sie Ubuntu und Nginx aktuell:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

---

## 📝 Checkliste

Vor dem Deployment:
- [ ] DNS A-Record erstellt (support.zubenko.de → Server-IP)
- [ ] Gemini API Key in `.env.production` gesetzt
- [ ] SSH-Zugriff zum Server getestet
- [ ] Port 80 und 443 auf dem Server offen

Nach dem Deployment:
- [ ] Website erreichbar unter https://support.zubenko.de
- [ ] SSL-Zertifikat aktiv (grünes Schloss im Browser)
- [ ] Alle Funktionen getestet
- [ ] Logs überprüft

---

## 💡 Tipps

- **Backup:** Erstellen Sie regelmäßig Backups Ihrer Konfiguration
- **Staging:** Testen Sie Updates erst auf einer Test-Domain
- **Monitoring:** Richten Sie ein Monitoring-Tool ein (z.B. UptimeRobot)
- **CDN:** Für bessere Performance können Sie ein CDN vorschalten (z.B. Cloudflare)

---

## 📞 Support

Bei Problemen:
1. Prüfen Sie die Nginx-Logs
2. Testen Sie die Nginx-Konfiguration: `sudo nginx -t`
3. Stellen Sie sicher, dass DNS korrekt konfiguriert ist
4. Prüfen Sie die Firewall-Einstellungen

---

**Viel Erfolg beim Deployment! 🚀**
