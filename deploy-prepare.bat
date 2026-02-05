@echo off
REM Windows Deployment Helper für support.zubenko.de
REM Dieses Skript bereitet das Projekt für das Deployment vor und überträgt es zum Server

echo ========================================
echo Deployment-Vorbereitung
echo ========================================
echo.

REM 1. Dependencies installieren
echo [1/4] Installiere Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install fehlgeschlagen
    pause
    exit /b 1
)

REM 2. Production Build erstellen
echo [2/4] Erstelle Production Build...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build fehlgeschlagen
    pause
    exit /b 1
)

REM 3. Deployment-Dateien vorbereiten
echo [3/4] Bereite Deployment-Dateien vor...
if not exist "deploy-package" mkdir deploy-package
xcopy /E /I /Y dist deploy-package\dist
copy /Y nginx.conf deploy-package\
copy /Y deploy.sh deploy-package\
copy /Y .env.production deploy-package\.env

echo.
echo [4/4] Deployment-Paket erstellt in: deploy-package\
echo.
echo ========================================
echo Naechste Schritte:
echo ========================================
echo.
echo 1. Uebertragen Sie die Dateien auf Ihren Server:
echo    scp -r deploy-package/* username@your-server-ip:/home/username/support-app/
echo.
echo 2. Verbinden Sie sich mit Ihrem Server:
echo    ssh username@your-server-ip
echo.
echo 3. Fuehren Sie das Deployment-Skript aus:
echo    cd /home/username/support-app
echo    chmod +x deploy.sh
echo    sudo ./deploy.sh
echo.
echo Detaillierte Anleitung: siehe DEPLOYMENT.md
echo.
pause
