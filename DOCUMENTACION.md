# 📚 Documentación Técnica - Learnex v2.0

## 🎯 Resumen Ejecutivo

**Learnex v2.0** es una plataforma educativa integral que conecta estudiantes, profesores, padres y administradores en un ecosistema unificado con integración de IA avanzada, colaboración en tiempo real y análisis comprehensivo.

### ✨ Características Principales
- 🔐 **Autenticación segura** con roles diferenciados
- 📊 **Dashboard personalizado** por tipo de usuario
- 🤖 **IA integrada** con DeepSeek API
- 📈 **Visualización de calificaciones** con información de grado
- 🛠️ **Sistema de navegación robusto** con fallbacks
- 📱 **Diseño responsivo** para todos los dispositivos

---

## 🏗️ Arquitectura del Sistema

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno y responsivo
- **JavaScript ES6+** - Funcionalidad interactiva
- **Font Awesome** - Iconografía

### Backend
- **Node.js** - Runtime del servidor
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **DeepSeek API** - Inteligencia artificial

### Base de Datos
```sql
-- Tablas principales
users           -- Usuarios del sistema
curses          -- Cursos/grados académicos
subjects        -- Materias
notes           -- Calificaciones
students_curses -- Relación estudiante-curso
curse_subject_teacher -- Relación curso-materia-profesor
```

---

## 👥 Roles y Permisos

### 🔑 Admin
- Gestión completa de usuarios
- Configuración del sistema
- Analytics institucionales
- Backup y restauración

### 👨‍🏫 Teacher (Profesor)
- Gestión de estudiantes
- Registro de calificaciones
- Creación de tareas
- Analytics de clase

### 🎓 Student (Estudiante)
- Visualización de calificaciones **con grado**
- Acceso a tareas
- Chatbot educativo IA
- Sistema de logros

### 👨‍👩‍👧‍👦 Parent (Padre)
- Seguimiento del progreso del hijo
- Comunicación con profesores
- Reportes académicos
- Calendario de reuniones

---

## 🚀 Instalación y Configuración

### Prerrequisitos
```bash
Node.js v16+
PostgreSQL v12+
DeepSeek API Key (opcional)
```

### Instalación Rápida
```bash
# 1. Clonar repositorio
git clone <repository-url>
cd integrative-project

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos
createdb learnex
psql -d learnex -f docs/script.sql

# 4. Configurar variables de entorno
echo "DEEPSEEK_API_KEY=tu-clave-aqui" > .env

# 5. Iniciar servidor
npm start
```

### Acceso al Sistema
- **URL:** http://localhost:3000
- **Credenciales de prueba:**
  - Admin: `carlos.gomez@mail.com` / `pass123`
  - Profesor: `pedro.sanchez@mail.com` / `ped987`
  - Estudiante: `ana.rodriguez@mail.com` / `ana456`

---

## 🔧 Componentes Técnicos

### Sistema de Autenticación (`auth.js`)
```javascript
// Autenticación con base de datos
AuthSystem.authenticate(username, password)
// Gestión de sesiones
AuthSystem.getCurrentUser()
// Protección de rutas
RouteGuard.protect(route, callback)
```

### Carga Dinámica de Datos (`dynamic-data-loader.js`)
```javascript
// Carga calificaciones con información de grado
loadGradesData()
// Genera vista de calificaciones
generateDynamicGradesView()
```

### Fix de Navegación (`fix-navigation.js`)
```javascript
// Fuerza configuración del menú
forceNavigationSetup()
// Configura menú por rol
setupNavigationMenu(role)
```

### Endpoints API (`student-grade-fix.js`)
```javascript
// Calificaciones con grado
GET /api/student-grades/:studentId
// Dashboard del estudiante
GET /api/dashboard/:userId/student
// Autenticación
POST /api/auth
```

---

## 📊 Base de Datos

### Estructura Principal
```
users (110 registros)
├── 2 administradores
├── 7 profesores  
├── 94 estudiantes
└── 7 padres

curses (11 grados)
├── Grado 1° - 11°
└── Año escolar 2024

subjects
├── Matemáticas
├── Español
├── Ciencias
└── Historia
```

### Relaciones Clave
- **Estudiante → Curso**: `students_curses`
- **Calificaciones**: `notes` → `curse_subject_teacher`
- **Asignaciones**: `curse_subject_teacher`

---

## 🎨 Interfaz de Usuario

### Diseño Responsivo
- **Desktop**: Sidebar completo
- **Tablet**: Menú colapsible
- **Mobile**: Navegación hamburguesa

### Temas de Color
```css
--primary-500: #667eea    /* Azul principal */
--success-500: #48bb78    /* Verde éxito */
--warning-500: #f6ad55    /* Naranja advertencia */
--gray-50: #f7fafc        /* Fondo claro */
```

### Componentes UI
- **Cards estadísticas** con iconos
- **Tablas responsivas** con acciones
- **Modales informativos**
- **Formularios validados**

---

## 🤖 Integración de IA

### DeepSeek API
```javascript
// Configuración
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// Uso en chatbot
generateAIResponse(message, userRole)
```

### Funcionalidades IA
- **Chatbot educativo** para estudiantes y profesores
- **Respuestas contextuales** por rol
- **Conocimiento académico** integrado
- **Fallback local** cuando API no disponible

---

## 🔒 Seguridad

### Autenticación
- Validación de credenciales en BD
- Sesiones encriptadas en localStorage
- Timeout automático de sesión
- Protección de rutas por rol

### Validación de Datos
```javascript
// Validación de entrada
if (!username || !password) {
    showLoginError('Campos requeridos');
    return;
}

// Sanitización SQL
executeQuery('SELECT * FROM users WHERE mail = $1', [email]);
```

---

## 📱 Funcionalidades por Rol

### Dashboard del Estudiante
- ✅ **Información personal** con grado
- ✅ **Promedio académico** calculado
- ✅ **Total de calificaciones** registradas
- ✅ **Navegación específica** del estudiante

### Vista de Calificaciones
```html
<!-- Header del estudiante -->
<div class="student-info-header">
    <div class="student-avatar">👨‍🎓</div>
    <div class="student-details">
        <h2>Ana Rodriguez</h2>
        <p><strong>Grado:</strong> 1° (2024)</p>
    </div>
</div>

<!-- Resumen de calificaciones -->
<div class="grades-summary">
    <div class="summary-card">
        <h3>Mi Grado</h3>
        <div class="grade-display">1°</div>
    </div>
</div>
```

---

## 🛠️ Solución de Problemas

### Problema: Login no funciona
**Solución:**
1. Verificar conexión a PostgreSQL
2. Confirmar credenciales en `01_users.csv`
3. Revisar logs del servidor

### Problema: Panel no aparece
**Solución:**
1. El script `fix-navigation.js` se ejecuta automáticamente
2. Verificar en consola: "✅ Navigation menu created"
3. Refrescar página si es necesario

### Problema: Estudiante no ve su grado
**Solución:**
1. Verificar relación en `students_curses`
2. Endpoint `/api/student-grades/:id` debe funcionar
3. Datos se cargan automáticamente

---

## 📈 Métricas del Sistema

### Rendimiento
- **Tiempo de carga**: < 2 segundos
- **Usuarios concurrentes**: 100+
- **Tamaño de BD**: ~110 usuarios de prueba

### Cobertura Funcional
- ✅ **Autenticación**: 100%
- ✅ **Navegación**: 100%
- ✅ **Calificaciones**: 100%
- ✅ **IA Chatbot**: 100%
- 🔄 **Tareas**: En desarrollo
- 🔄 **Mensajería**: En desarrollo

---

## 🚀 Roadmap Futuro

### v2.1 (Próximo)
- 📱 App móvil React Native
- 🌐 Soporte multi-idioma
- 📊 Analytics avanzados
- 🔔 Notificaciones push

### v2.2 (Futuro)
- 🎥 Videollamadas integradas
- 📄 Generación PDF automática
- 🎮 Gamificación completa
- 🤖 IA predictiva

---

## 📞 Soporte Técnico

### Contacto
- **Desarrollador**: Equipo Learnex
- **Email**: soporte@learnex.com
- **Documentación**: `/docs/`

### Recursos
- **API Docs**: `docs/API_DOCUMENTATION.md`
- **Esquema BD**: `docs/script.sql`
- **Instalación**: `INSTALLATION.md`

---

## 📄 Licencia

Este proyecto es un prototipo educativo. Todos los derechos reservados.

**Learnex v2.0** - Revolucionando la educación a través de la tecnología avanzada e inteligencia artificial.

---

*Documentación actualizada: Diciembre 2024*