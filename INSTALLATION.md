# 🚀 Guía de Instalación - Learnex v2.0

## Requisitos del Sistema

### Software Requerido
- **Node.js** v16 o superior
- **PostgreSQL** v12 o superior
- **npm** v8 o superior

### APIs Opcionales
- **DeepSeek API Key** (para funcionalidades de IA)
- **Google Calendar API** (para sincronización de horarios)

## 📦 Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd integrative-project
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Base de Datos

#### Crear Base de Datos
```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE learnex;
\q
```

#### Ejecutar Schema Extendido
```bash
# Aplicar esquema básico
psql -d learnex -f docs/script.sql

# Aplicar esquema extendido con nuevas funcionalidades
psql -d learnex -f docs/extended-schema.sql
```

#### Cargar Datos de Prueba
```bash
npm run seed
```

### 4. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=learnex
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# Servidor
PORT=3000
NODE_ENV=development

# API de IA (Opcional)
DEEPSEEK_API_KEY=tu_api_key_aqui

# Configuración de Email (Opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_app

# JWT Secret (para autenticación avanzada)
JWT_SECRET=tu_jwt_secret_muy_seguro

# Google Calendar (Opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### 5. Inicializar Sistemas

```bash
# Inicializar logros por defecto
npm run init-achievements

# O usar el endpoint desde la aplicación
# POST /api/gamification/init-achievements
```

### 6. Ejecutar la Aplicación

#### Modo Desarrollo
```bash
npm run dev
```

#### Modo Producción
```bash
npm start
```

#### Servidor Original (sin funcionalidades avanzadas)
```bash
npm run original
```

### 7. Acceder a la Aplicación

Abrir navegador en: `http://localhost:3000`

## 🔐 Credenciales de Prueba

### Administrador
- **Email:** carlos.gomez@mail.com
- **Password:** pass123

### Profesor
- **Email:** pedro.sanchez@mail.com
- **Password:** ped987

### Estudiante
- **Email:** ana.rodriguez@mail.com
- **Password:** ana456

## 🛠️ Configuración Avanzada

### Configurar PostgreSQL

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configurar usuario
sudo -u postgres psql
ALTER USER postgres PASSWORD 'tu_password';
\q
```

#### Windows
1. Descargar PostgreSQL desde https://www.postgresql.org/download/windows/
2. Ejecutar instalador
3. Configurar password para usuario postgres
4. Agregar PostgreSQL al PATH

#### macOS
```bash
# Con Homebrew
brew install postgresql
brew services start postgresql

# Crear usuario
createuser -s postgres
```

### Configurar DeepSeek API

1. Registrarse en https://platform.deepseek.com/
2. Obtener API Key
3. Agregar al archivo `.env`

### Configurar Uploads y Reports

```bash
# Crear directorios necesarios
mkdir -p uploads/tasks
mkdir -p reports
chmod 755 uploads reports
```

## 🔧 Solución de Problemas

### Error de Conexión a Base de Datos

```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql

# Verificar conexión
psql -h localhost -U postgres -d learnex
```

### Error de Permisos en Uploads

```bash
# Dar permisos correctos
chmod -R 755 uploads/
chmod -R 755 reports/
```

### Error de Dependencias

```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de Socket.IO

Verificar que el puerto 3000 no esté en uso:

```bash
# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

## 📊 Verificar Instalación

### 1. Verificar Base de Datos
```bash
# Conectar y verificar tablas
psql -d learnex -c "\dt learnex.*"
```

### 2. Verificar APIs
```bash
# Test de conexión a base de datos
curl http://localhost:3000/api/test-db

# Test de autenticación
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"carlos.gomez@mail.com","password":"pass123"}'
```

### 3. Verificar Funcionalidades

Acceder a la aplicación y probar:
- ✅ Login con credenciales de prueba
- ✅ Navegación entre secciones
- ✅ Chatbot (con o sin API de IA)
- ✅ Sistema de tareas
- ✅ Mensajería
- ✅ Analytics
- ✅ Gamificación

## 🚀 Despliegue en Producción

### Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=80
DB_HOST=tu_servidor_db
DB_SSL=true
```

### Configurar HTTPS
```bash
# Con Let's Encrypt
sudo apt install certbot
sudo certbot --nginx -d tu-dominio.com
```

### Configurar Proxy Reverso (Nginx)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Configurar PM2 (Gestor de Procesos)
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start backend/js/enhanced-server.js --name learnex

# Configurar inicio automático
pm2 startup
pm2 save
```

## 📝 Mantenimiento

### Backup de Base de Datos
```bash
# Crear backup
pg_dump -U postgres -h localhost learnex > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres -h localhost learnex < backup_20241201.sql
```

### Limpiar Archivos Temporales
```bash
# Limpiar reportes antiguos (automático cada semana)
# O manualmente:
find reports/ -name "*.pdf" -mtime +30 -delete
```

### Actualizar Dependencias
```bash
# Verificar actualizaciones
npm outdated

# Actualizar dependencias
npm update
```

## 🆘 Soporte

Para problemas técnicos:
1. Revisar logs: `tail -f logs/app.log`
2. Verificar estado de servicios
3. Consultar documentación técnica en `/docs/`
4. Revisar issues en el repositorio

## 🎯 Próximos Pasos

Después de la instalación exitosa:
1. Personalizar configuración institucional
2. Importar datos reales de estudiantes
3. Configurar integraciones adicionales
4. Entrenar al personal en el uso del sistema
5. Configurar backups automáticos