# 🚀 Guía de Despliegue - solwed.es

## 📋 Información del Servidor de Producción

**Servidor:** `solwed.es`
**Usuario:** `ubuntu`
**Contraseña:** `Solwed8818`
**Acceso:** SSH `ssh ubuntu@solwed.es`

---

## 🛠️ Opciones de Despliegue

### Opción 1: Build Estático + Apache/Nginx (Recomendado para SSR)

El proyecto actualmente usa Astro con:
- `output: 'static'` en astro.config.mjs
- Adapter de Node.js en modo standalone
- Algunas páginas con SSR (`prerender: false`)

**⚠️ IMPORTANTE:** Hay páginas que requieren SSR:
- `/dominios` - Búsqueda de dominios con API
- Endpoints API en `/api/domains/*`

#### Pasos para despliegue:

```bash
# 1. Conectar al servidor
ssh ubuntu@solwed.es

# 2. Clonar o actualizar repositorio
cd /var/www/
git clone https://github.com/ivan95mq/solwed-web-astro.git
# o si ya existe:
cd /var/www/solwed-web-astro
git pull

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
nano .env
# Configurar:
# - SMTP_*
# - GOOGLE_PLACES_API_KEY
# - DONDOMINIO_API_KEY (para dominios)

# 5. Build de producción
npm run build

# 6. Configurar Apache/Nginx como reverse proxy para Node.js
# Ver "Configuración Apache" más abajo
```

---

### Opción 2: Servidor Node.js Standalone con PM2

Como el proyecto tiene el adapter de Node.js configurado, puede correr como servidor independiente.

```bash
# 1. Instalar PM2 globalmente
sudo npm install -g pm2

# 2. Después del build, crear archivo de configuración PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'solwed-web',
    script: './dist/server/entry.mjs',
    cwd: '/var/www/solwed-web-astro',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4321,
      HOST: '0.0.0.0'
    }
  }]
}
EOF

# 3. Iniciar con PM2
pm2 start ecosystem.config.js

# 4. Guardar configuración PM2
pm2 save
pm2 startup
```

---

### Opción 3: Docker + Docker Compose

```bash
# 1. Crear Dockerfile
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 4321
ENV HOST=0.0.0.0
ENV PORT=4321
CMD ["node", "./dist/server/entry.mjs"]
EOF

# 2. Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  solwed-web:
    build: .
    ports:
      - "4321:4321"
    environment:
      - NODE_ENV=production
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - SMTP_FROM=${SMTP_FROM}
      - GOOGLE_PLACES_API_KEY=${GOOGLE_PLACES_API_KEY}
      - GOOGLE_PLACE_ID=${GOOGLE_PLACE_ID}
      - DONDOMINIO_API_KEY=${DONDOMINIO_API_KEY}
      - DONDOMINIO_API_URL=${DONDOMINIO_API_URL}
    restart: unless-stopped
    volumes:
      - ./.env:/app/.env
EOF

# 3. Construir y arrancar
docker-compose up -d --build
```

---

## 🌐 Configuración de Apache como Reverse Proxy

```bash
# 1. Habilitar módulos necesarios
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo a2enmod headers

# 2. Crear configuración del sitio
sudo nano /etc/apache2/sites-available/solwed-web.conf
```

Contenido del archivo:

```apache
<VirtualHost *:80>
    ServerName solwed.es
    ServerAlias www.solwed.es

    # Redirigir a HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName solwed.es
    ServerAlias www.solwed.es

    # SSL Configuration (usar certbot para certificados Let's Encrypt)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/solwed.es/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/solwed.es/privkey.pem

    # Reverse Proxy al servidor Node.js
    ProxyPreserveHost On
    ProxyPass / http://localhost:4321/
    ProxyPassReverse / http://localhost:4321/

    # Headers de seguridad
    Header always set Strict-Transport-Security "max-age=31536000"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/solwed-error.log
    CustomLog ${APACHE_LOG_DIR}/solwed-access.log combined
</VirtualHost>
```

```bash
# 3. Habilitar sitio y reiniciar Apache
sudo a2ensite solwed-web.conf
sudo systemctl reload apache2

# 4. Configurar SSL con Let's Encrypt
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d solwed.es -d www.solwed.es
```

---

## 🔐 Configuración de Variables de Entorno

```bash
# En el servidor de producción
cd /var/www/solwed-web-astro
nano .env
```

Variables críticas a configurar:

```env
# SMTP para envío de emails
SMTP_HOST=smtp.tuproveedor.com
SMTP_PORT=587
SMTP_USER=noreply@solwed.es
SMTP_PASS=tu_password_real
SMTP_FROM=noreply@solwed.es

# Google Places (para reseñas)
GOOGLE_PLACES_API_KEY=tu_api_key_real
GOOGLE_PLACE_ID=tu_place_id_real

# DonDominio API (para búsqueda de dominios)
DONDOMINIO_API_KEY=tu_api_key_dondominio
DONDOMINIO_API_URL=https://simple-api.dondominio.net
```

---

## 📝 Script de Despliegue Automatizado

```bash
# Crear script deploy.sh
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Iniciando despliegue de SOLWED..."

# Navegar al directorio
cd /var/www/solwed-web-astro

# Pull de cambios
echo "📥 Descargando cambios..."
git pull origin main

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Build
echo "🔨 Compilando proyecto..."
npm run build

# Reiniciar PM2
echo "♻️  Reiniciando aplicación..."
pm2 restart solwed-web || pm2 start ecosystem.config.js

echo "✅ Despliegue completado!"
pm2 status
EOF

chmod +x deploy.sh

# Para desplegar:
./deploy.sh
```

---

## ✅ Checklist de Despliegue

- [ ] Servidor accesible por SSH (ubuntu@solwed.es)
- [ ] Node.js v20+ instalado
- [ ] Git configurado
- [ ] Repositorio clonado en `/var/www/solwed-web-astro`
- [ ] Archivo `.env` configurado con todas las variables
- [ ] Build ejecutado sin errores (`npm run build`)
- [ ] PM2 instalado y aplicación corriendo
- [ ] Apache configurado como reverse proxy
- [ ] Certificado SSL configurado (Let's Encrypt)
- [ ] DNS apuntando correctamente a solwed.es
- [ ] Firewall permite puertos 80 y 443
- [ ] Pruebas de funcionalidad:
  - [ ] Página principal carga
  - [ ] Sistema de dominios funciona
  - [ ] Formularios envían emails
  - [ ] Todas las rutas cargan correctamente

---

## 🧪 Testing después del Despliegue

```bash
# Verificar que el servidor Node.js está corriendo
curl http://localhost:4321

# Verificar HTTPS
curl -I https://solwed.es

# Ver logs en tiempo real
pm2 logs solwed-web

# Ver logs de Apache
sudo tail -f /var/log/apache2/solwed-error.log
```

---

## 🔄 Actualizar el Sitio

```bash
# Opción rápida:
ssh ubuntu@solwed.es
cd /var/www/solwed-web-astro
./deploy.sh

# O manual:
git pull
npm install
npm run build
pm2 restart solwed-web
```

---

## 🆘 Troubleshooting

### La aplicación no inicia
```bash
pm2 logs solwed-web --lines 50
```

### Error de permisos
```bash
sudo chown -R ubuntu:ubuntu /var/www/solwed-web-astro
```

### Puerto 4321 ocupado
```bash
sudo lsof -i :4321
# Matar proceso si es necesario
```

### Apache no hace proxy correctamente
```bash
sudo apache2ctl configtest
sudo systemctl status apache2
sudo tail -f /var/log/apache2/error.log
```

---

## 📊 Monitoreo

```bash
# Ver estado PM2
pm2 status
pm2 monit

# Ver recursos del servidor
htop
df -h

# Ver logs de acceso Apache
sudo tail -f /var/log/apache2/solwed-access.log
```

---

## 🎯 Próximos Pasos

1. **Conectar al servidor de producción**
   ```bash
   ssh ubuntu@solwed.es
   ```

2. **Verificar requisitos del sistema**
   ```bash
   node --version  # Debería ser v20+
   npm --version
   git --version
   ```

3. **Clonar repositorio y configurar**

4. **Desplegar siguiendo la Opción 2 (Node + PM2)**

5. **Configurar Apache como reverse proxy**

6. **Probar sistema de dominios en producción**

---

**Documentación creada:** 2026-01-28
**Última actualización:** 2026-01-28
