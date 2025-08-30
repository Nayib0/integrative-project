# 🗄️ Guía de Bases de Datos - Learnex v2.0

## 📋 **Resumen**

Learnex v2.0 soporta **dos sistemas de base de datos**:
- **SQLite** - Portátil y fácil de usar
- **PostgreSQL** - Empresarial y robusto

Ambos tienen **exactamente los mismos datos y funcionalidades**.

---

## 🚀 **Comandos Rápidos**

### **Iniciar con SQLite (Recomendado)**
```bash
npm start
```

### **Iniciar con PostgreSQL**
```bash
npm run start-postgres
```

### **Configurar bases de datos**
```bash
# SQLite (automático)
npm run setup-sqlite

# PostgreSQL (requiere servidor activo)
npm run seed
```

---

## 📊 **Comparación Detallada**

| Característica | SQLite | PostgreSQL |
|----------------|--------|------------|
| **🚀 Facilidad** | ✅ Plug & Play | ❌ Requiere instalación |
| **📦 Portabilidad** | ✅ Un solo archivo | ❌ Requiere servidor |
| **⚡ Velocidad** | ✅ Muy rápido | ✅ Rápido |
| **👥 Usuarios concurrentes** | ⚠️ Limitado | ✅ Miles |
| **🔒 Seguridad** | ⚠️ Básica | ✅ Avanzada |
| **📈 Escalabilidad** | ⚠️ Pequeña/Mediana | ✅ Empresarial |
| **💾 Tamaño DB** | ✅ Hasta 281 TB | ✅ Ilimitado |
| **🛠️ Mantenimiento** | ✅ Cero | ❌ Requiere DBA |

---

## 🎯 **¿Cuándo usar cada una?**

### **🟢 Usa SQLite cuando:**
- ✅ Desarrollo y prototipado
- ✅ Aplicaciones pequeñas/medianas
- ✅ Necesitas portabilidad
- ✅ Pocos usuarios concurrentes (<100)
- ✅ No tienes experiencia con bases de datos
- ✅ Quieres simplicidad

### **🔵 Usa PostgreSQL cuando:**
- ✅ Aplicaciones empresariales
- ✅ Muchos usuarios concurrentes (>100)
- ✅ Necesitas alta disponibilidad
- ✅ Requieres funciones avanzadas
- ✅ Tienes equipo de DBA
- ✅ Aplicación crítica de negocio

---

## 🔧 **Configuración**

### **SQLite Setup**
```bash
# 1. Instalar dependencias (ya incluidas)
npm install

# 2. Configurar base de datos
npm run setup-sqlite

# 3. Iniciar servidor
npm start
```

**✅ Listo! No requiere más configuración.**

### **PostgreSQL Setup**
```bash
# 1. Instalar PostgreSQL en tu sistema
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# 2. Crear base de datos
createdb learnex

# 3. Crear tablas
psql -d learnex -f docs/script.sql

# 4. Cargar datos
npm run seed

# 5. Iniciar servidor
npm run start-postgres
```

---

## 📁 **Archivos de Configuración**

### **SQLite**
- **Servidor:** `backend/js/server-sqlite.js`
- **Conexión:** `database/sqlite-connection.js`
- **Base de datos:** `database/learnex.db`
- **Setup:** `database/sqlite-setup.js`

### **PostgreSQL**
- **Servidor:** `backend/js/server-postgres.js`
- **Conexión:** `server/conexion_db.js`
- **Schema:** `docs/script.sql`
- **Seeders:** `server/seeders/`

---

## 🔄 **Migración entre Bases de Datos**

### **De SQLite a PostgreSQL**
```bash
# 1. Detener servidor SQLite
Ctrl+C

# 2. Configurar PostgreSQL (ver setup arriba)
npm run seed

# 3. Iniciar servidor PostgreSQL
npm run start-postgres
```

### **De PostgreSQL a SQLite**
```bash
# 1. Detener servidor PostgreSQL
Ctrl+C

# 2. Configurar SQLite (automático)
npm run setup-sqlite

# 3. Iniciar servidor SQLite
npm start
```

---

## 🧪 **Testing**

### **Probar Conexiones**
```bash
# Test SQLite
node test-db-connection.js

# Test PostgreSQL
node server/conexion_db.js
```

### **Probar Login**
```bash
# Test endpoints
node test-login.js
```

---

## 🔐 **Credenciales (Ambas DB)**

**Las mismas credenciales funcionan en ambas bases de datos:**

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | carlos.gomez@mail.com | pass123 |
| **Profesor** | pedro.sanchez@mail.com | ped987 |
| **Estudiante** | ana.rodriguez@mail.com | ana456 |
| **Padre** | roberto.rodriguez@mail.com | rob888 |

---

## 🚨 **Troubleshooting**

### **SQLite Issues**
```bash
# Error: Database locked
rm database/learnex.db
npm run setup-sqlite

# Error: Module not found
npm install sqlite3 sqlite
```

### **PostgreSQL Issues**
```bash
# Error: Connection refused
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql start  # Linux
brew services start postgresql # Mac

# Error: Database doesn't exist
createdb learnex

# Error: Permission denied
# Verificar credenciales en server/conexion_db.js
```

---

## 📊 **Datos Incluidos**

**Ambas bases de datos contienen:**
- 👨🎓 **88 estudiantes**
- 👨🏫 **11 profesores**
- 👨👩👧👦 **9 padres**
- 👨💼 **2 administradores**
- 📚 **11 cursos** (Grados 1-11)
- 📖 **15 materias**
- 📊 **9 calificaciones**
- 🔗 **88 inscripciones estudiante-curso**

---

## 🎯 **Recomendación Final**

### **Para Desarrollo/Demo:**
```bash
npm start  # SQLite
```

### **Para Producción:**
```bash
npm run start-postgres  # PostgreSQL
```

---

## 📞 **Soporte**

Si tienes problemas:
1. Verifica que las dependencias estén instaladas
2. Revisa que el puerto 3000 esté libre
3. Confirma que la base de datos esté configurada
4. Usa las credenciales correctas

**¡Ambas opciones funcionan perfectamente!** 🎉