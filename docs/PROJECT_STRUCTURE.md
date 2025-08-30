# 📁 Estructura del Proyecto - Learnex v2.0

## 🏗️ Organización Mejorada

```
📁 INTEGRATIVE-PROJECT/
├── 📄 index.html                    # Archivo principal de la aplicación
├── 📄 package.json                  # Dependencias y configuración npm
├── 📄 README.md                     # Documentación principal
├── 📄 .env                          # Variables de entorno
├── 📄 .gitignore                    # Archivos ignorados por Git
│
├── 📁 backend/                      # Lógica del servidor y APIs
│   ├── 📁 js/                       # Módulos JavaScript del backend
│   │   ├── 📄 server.js             # Servidor principal
│   │   ├── 📄 auth.js               # Sistema de autenticación
│   │   ├── 📄 app.js                # Lógica principal de la aplicación
│   │   ├── 📄 basic-functions.js    # Funciones utilitarias básicas
│   │   ├── 📄 chatbot.js            # Integración del chatbot IA
│   │   ├── 📄 dynamic-data-loader.js # Cargador dinámico de datos
│   │   ├── 📄 student-grade-fix.js  # Endpoints para calificaciones
│   │   ├── 📄 enhanced-server.js    # Servidor con funcionalidades avanzadas
│   │   ├── 📄 routes.js             # Definición de rutas API
│   │   └── 📄 tests.js              # Utilidades de testing
│   └── 📄 index.js                  # Punto de entrada del backend
│
├── 📁 css/                          # Estilos y temas
│   ├── 📄 styles.css                # Estilos principales
│   ├── 📄 modern-interface.css      # Interfaz moderna
│   ├── 📄 responsive.css            # Diseño responsivo
│   ├── 📄 chatbot.css               # Estilos del chatbot
│   ├── 📄 enhanced-v2.css           # Funcionalidades v2.0
│   ├── 📄 messaging-v2.css          # Sistema de mensajería
│   ├── 📄 enterprise-styles.css     # Estilos empresariales
│   └── 📄 loading.css               # Animaciones de carga
│
├── 📁 scripts/                      # Scripts utilitarios y fixes
│   ├── 📄 fix-navigation.js         # Fix del sistema de navegación
│   ├── 📄 force-messaging.js        # Forzar mensajería dinámica
│   ├── 📄 clean-fix.js              # Limpieza de sesiones
│   ├── 📄 fix-session-messaging.js  # Fix de sesiones de mensajería
│   └── 📄 init-messaging.js         # Inicialización de mensajería
│
├── 📁 utils/                        # Utilidades y herramientas
│   ├── 📄 test-db-connection.js     # Test de conexión a BD
│   ├── 📄 test-endpoints.js         # Test de endpoints API
│   ├── 📄 test-login.js             # Test del sistema de login
│   ├── 📄 test-sqlite-endpoints.js  # Test de endpoints SQLite
│   ├── 📄 check_users_csv.js        # Verificación de usuarios CSV
│   ├── 📄 generate-grades.js        # Generador de calificaciones
│   ├── 📄 load-extended-users.js    # Carga de usuarios extendidos
│   ├── 📄 complete-assignments.js   # Completar asignaciones
│   ├── 📄 create-teacher-parent-chats.js # Crear chats profesor-padre
│   ├── 📄 debug_foreign_keys.js     # Debug de claves foráneas
│   ├── 📄 fix_duplicates.js         # Corrección de duplicados
│   └── 📄 verify-assignments.js     # Verificación de asignaciones
│
├── 📁 server/                       # Configuración del servidor
│   ├── 📁 data/                     # Datos de prueba CSV
│   │   ├── 📄 01_users.csv          # Usuarios del sistema (110)
│   │   ├── 📄 02_curses.csv         # Cursos académicos
│   │   ├── 📄 03_subjects.csv       # Materias
│   │   ├── 📄 04_curse_subject_teacher.csv # Relaciones curso-materia-profesor
│   │   ├── 📄 05_notes.csv          # Calificaciones
│   │   └── 📄 06_students_curses.csv # Relación estudiante-curso
│   ├── 📁 seeders/                  # Scripts de población de BD
│   │   ├── 📄 load_users.js         # Cargar usuarios
│   │   ├── 📄 load_curses.js        # Cargar cursos
│   │   ├── 📄 load_subjects.js      # Cargar materias
│   │   └── 📄 run_seeders.js        # Ejecutar todos los seeders
│   └── 📄 conexion_db.js            # Configuración de conexión BD
│
├── 📁 docs/                         # Documentación técnica
│   ├── 📄 DOCUMENTACION.md          # Documentación técnica completa
│   ├── 📄 GUIA_USUARIO.md           # Manual de usuario por roles
│   ├── 📄 CHANGELOG.md              # Historial de cambios
│   ├── 📄 INSTALLATION.md           # Guía de instalación
│   ├── 📄 API_DOCUMENTATION.md      # Documentación de APIs
│   ├── 📄 ENDPOINTS.md              # Lista de endpoints
│   ├── 📄 TECHNICAL_DOCUMENTATION.md # Documentación técnica adicional
│   ├── 📄 script.sql                # Esquema de base de datos
│   ├── 📄 extended-schema.sql       # Esquema extendido
│   ├── 📄 estructura-navegacion.txt # Estructura de navegación
│   └── 🖼️ modelo-entidad-relacion.png # Diagrama ER
│
├── 📁 database/                     # Base de datos alternativa
│   ├── 📄 learnex.db                # Base de datos SQLite
│   ├── 📄 sqlite-connection.js      # Conexión SQLite
│   └── 📄 sqlite-setup.js           # Configuración SQLite
│
└── 📁 config/                       # Archivos de configuración
    └── (Reservado para configuraciones futuras)
```

## 🎯 Beneficios de la Nueva Estructura

### ✅ **Organización Clara**
- **Separación por funcionalidad**: Backend, frontend, scripts, utilidades
- **Fácil navegación**: Cada tipo de archivo en su carpeta correspondiente
- **Mantenimiento simplificado**: Ubicación predecible de archivos

### 🔧 **Desarrollo Mejorado**
- **Scripts organizados**: Fixes y utilidades en carpetas específicas
- **Documentación centralizada**: Todo en `/docs`
- **Configuración separada**: Variables y configs en `/config`

### 📚 **Documentación Estructurada**
- **Guías por tipo**: Técnica, usuario, instalación
- **APIs documentadas**: Endpoints y ejemplos
- **Historial completo**: Changelog detallado

## 🚀 Archivos Principales por Función

### 🔐 **Autenticación y Seguridad**
```
backend/js/auth.js              # Sistema de autenticación
backend/js/student-grade-fix.js # Endpoints seguros
scripts/clean-fix.js            # Limpieza de sesiones
```

### 🎨 **Interfaz de Usuario**
```
css/modern-interface.css        # Interfaz moderna
css/responsive.css              # Diseño responsivo
scripts/fix-navigation.js       # Navegación robusta
```

### 📊 **Datos y Base de Datos**
```
server/data/01_users.csv        # 110 usuarios de prueba
docs/script.sql                 # Esquema PostgreSQL
backend/js/dynamic-data-loader.js # Carga dinámica
```

### 🤖 **Inteligencia Artificial**
```
backend/js/chatbot.js           # Chatbot educativo
backend/js/ai-frontend.js       # Funcionalidades IA
```

### 🧪 **Testing y Utilidades**
```
utils/test-*.js                 # Tests automatizados
backend/js/tests.js             # Utilidades de testing
utils/generate-grades.js        # Generadores de datos
```

## 📋 Archivos Movidos en la Reorganización

### ✅ **Scripts → `/scripts`**
- `clean-fix.js`
- `force-messaging.js` 
- `fix-navigation.js`

### ✅ **Utilidades → `/utils`**
- `test-db-connection.js`
- `test-endpoints.js`
- `test-login.js`
- `check_users_csv.js`
- `generate-grades.js`
- `load-extended-users.js`
- `complete-assignments.js`

### ✅ **Documentación → `/docs`**
- Toda la documentación `.md` centralizada
- Esquemas SQL organizados
- Diagramas y recursos técnicos

## 🔄 Rutas Actualizadas

### **HTML Principal**
```html
<!-- Scripts organizados -->
<script src="scripts/force-messaging.js"></script>
<script src="scripts/clean-fix.js"></script>
<script src="scripts/fix-navigation.js"></script>
```

### **Imports en Backend**
```javascript
// Rutas relativas actualizadas
require('./scripts/fix-navigation.js')
require('./utils/test-db-connection.js')
```

## 🎯 Próximos Pasos

### 📁 **Carpetas Futuras**
- `/config` - Configuraciones del sistema
- `/assets` - Recursos estáticos (imágenes, fonts)
- `/tests` - Suite completa de testing
- `/build` - Archivos de construcción/deploy

### 🔧 **Mejoras Planificadas**
- Configuración centralizada en `/config`
- Assets organizados por tipo
- Pipeline de build automatizado
- Testing suite completa

---

**Estructura actualizada**: Diciembre 2024  
**Learnex v2.0** - Organización profesional para desarrollo escalable