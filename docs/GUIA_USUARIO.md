# 👥 Guía de Usuario - Learnex v2.0

## 🚀 Inicio Rápido

### 1. Acceso al Sistema
1. Abrir navegador web
2. Ir a: `http://localhost:3000`
3. Usar credenciales de prueba

### 2. Credenciales de Prueba
```
👨💼 Administrador
Email: carlos.gomez@mail.com
Contraseña: pass123

👨🏫 Profesor  
Email: pedro.sanchez@mail.com
Contraseña: ped987

🎓 Estudiante
Email: ana.rodriguez@mail.com
Contraseña: ana456

👨👩👧👦 Padre
Email: roberto.rodriguez@mail.com
Contraseña: rob888
```

---

## 👨💼 Panel de Administrador

### Dashboard Principal
- **Estadísticas generales** del sistema
- **Total de usuarios** por rol
- **Métricas institucionales**
- **Acciones rápidas** de gestión

### Funcionalidades
- ✅ **Gestión de Usuarios**: Crear, editar, eliminar usuarios
- ✅ **Analytics**: Reportes y métricas del sistema
- ✅ **Configuración**: Ajustes generales del sistema
- ✅ **Backup**: Respaldo y restauración de datos

### Navegación
```
📊 Dashboard
👥 Usuarios  
📈 Analytics
⚙️ Configuración
```

---

## 👨🏫 Panel de Profesor

### Dashboard del Profesor
- **Mis estudiantes**: Cantidad total asignada
- **Tareas pendientes**: Por calificar
- **Asistencia promedio**: De la clase
- **Promedio general**: De todos los estudiantes

### Gestión de Estudiantes
1. **Ver lista completa** de estudiantes asignados
2. **Revisar calificaciones** individuales
3. **Generar reportes IA** personalizados
4. **Exportar datos** a PDF

### Calificaciones
- **Registrar notas** por materia
- **Ver historial** académico
- **Calcular promedios** automáticamente
- **Análisis de rendimiento** con IA

### Navegación
```
📊 Dashboard
🎓 Mis Estudiantes
⭐ Calificaciones  
📋 Tareas
💬 Mensajería
🤖 IA Educativa
```

---

## 🎓 Panel de Estudiante

### Dashboard del Estudiante
- **Mi promedio**: Calificación general actual
- **Tareas completadas**: Contador de logros
- **Tareas pendientes**: Por entregar
- **Mi asistencia**: Porcentaje actual

### Mis Calificaciones
**Información mostrada:**
- 👤 **Datos personales** con foto de perfil
- 📚 **Grado actual** (ej: "Grado 1° (2024)")
- 📧 **Email** institucional
- 📊 **Promedio general** con color indicativo
- 📈 **Total de calificaciones** registradas

**Vista de calificaciones:**
```
┌─────────────────────────────────────┐
│ 👨🎓 Ana Rodriguez                   │
│ Grado: 1° (2024)                   │
│ Email: ana.rodriguez@mail.com       │
└─────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┐
│ Promedio    │ Total Notas │ Mi Grado    │
│ 4.2         │ 15          │ 1°          │
└─────────────┴─────────────┴─────────────┘

Historial de Calificaciones:
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Materia     │ Nota        │ Fecha       │ Profesor    │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Matemáticas │ 4.5         │ 15/01/2024  │ Prof. García│
│ Español     │ 4.0         │ 14/01/2024  │ Prof. López │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Chatbot IA Educativo
**Temas disponibles:**
- 📚 **Historia**: Segunda Guerra Mundial, eventos históricos
- 🔢 **Matemáticas**: Álgebra, geometría, fórmulas
- 🔬 **Ciencias**: Fotosíntesis, física, química
- 📖 **Técnicas de estudio**: Métodos de aprendizaje

**Ejemplos de uso:**
```
Estudiante: "¿Qué es la fotosíntesis?"
IA: "🌱 La fotosíntesis es el proceso por el cual las plantas..."

Estudiante: "Ayúdame con álgebra"
IA: "🔢 En álgebra trabajamos con ecuaciones como ax + b = 0..."
```

### Navegación
```
📊 Dashboard
⭐ Mis Calificaciones
📚 Mis Tareas
🏆 Logros
🤖 Tutor IA
```

---

## 👨👩👧👦 Panel de Padres

### Dashboard del Padre
- **Promedio del hijo**: Rendimiento académico
- **Asistencia**: Porcentaje de asistencia
- **Tareas pendientes**: Del estudiante
- **Mensajes nuevos**: De profesores

### Seguimiento Académico
- **Progreso detallado** del hijo
- **Calificaciones por materia**
- **Tendencias de rendimiento**
- **Alertas académicas**

### Comunicación
- **Chat directo** con profesores
- **Programar reuniones**
- **Recibir notificaciones**
- **Reportes periódicos**

### Navegación
```
📊 Dashboard
📈 Progreso del Hijo
⭐ Calificaciones
💬 Mensajes
📅 Reuniones
```

---

## 🎨 Interfaz de Usuario

### Diseño Responsivo
**Desktop (>768px):**
- Sidebar fijo a la izquierda
- Contenido principal amplio
- Navegación siempre visible

**Mobile (<768px):**
- Menú hamburguesa
- Navegación colapsible
- Diseño vertical optimizado

### Elementos Visuales
- **Cards estadísticas** con iconos coloridos
- **Tablas responsivas** con acciones
- **Modales informativos** para detalles
- **Botones de acción** claramente identificados

---

## 🔧 Funcionalidades Técnicas

### Sistema de Navegación
- **Menú dinámico** según rol de usuario
- **Protección de rutas** por permisos
- **Fallback automático** si hay errores
- **Indicador visual** de sección activa

### Carga de Datos
- **Conexión a PostgreSQL** para datos reales
- **Carga asíncrona** de calificaciones
- **Cache inteligente** para mejor rendimiento
- **Manejo de errores** con reintentos

### Seguridad
- **Autenticación obligatoria** para acceso
- **Sesiones encriptadas** en navegador
- **Timeout automático** por inactividad
- **Validación de permisos** en cada acción

---

## 🚨 Solución de Problemas Comunes

### No puedo iniciar sesión
1. ✅ Verificar credenciales exactas
2. ✅ Confirmar conexión a internet
3. ✅ Revisar que el servidor esté activo
4. ✅ Limpiar cache del navegador

### No veo mi grado como estudiante
1. ✅ El sistema carga automáticamente
2. ✅ Verificar en "Mis Calificaciones"
3. ✅ Refrescar la página
4. ✅ Contactar al administrador

### El menú no aparece
1. ✅ El sistema tiene auto-corrección
2. ✅ Esperar 2-3 segundos después del login
3. ✅ Refrescar página si es necesario
4. ✅ Verificar JavaScript habilitado

### Error de conexión
1. ✅ Verificar servidor PostgreSQL activo
2. ✅ Confirmar puerto 3000 disponible
3. ✅ Revisar configuración de red
4. ✅ Contactar soporte técnico

---

## 💡 Consejos de Uso

### Para Estudiantes
- 📚 **Revisa regularmente** tus calificaciones
- 🤖 **Usa el chatbot IA** para dudas académicas
- 🏆 **Completa tareas** para ganar logros
- 📊 **Monitorea tu promedio** constantemente

### Para Profesores
- 👥 **Actualiza calificaciones** frecuentemente
- 📊 **Usa analytics IA** para insights
- 💬 **Mantén comunicación** con padres
- 📄 **Genera reportes** periódicos

### Para Padres
- 📈 **Monitorea el progreso** semanalmente
- 💬 **Comunícate con profesores** regularmente
- 📅 **Programa reuniones** cuando sea necesario
- 🔔 **Mantén notificaciones** activas

### Para Administradores
- 👥 **Gestiona usuarios** proactivamente
- 📊 **Revisa métricas** del sistema
- 🔧 **Mantén configuraciones** actualizadas
- 💾 **Realiza backups** regulares

---

## 📞 Soporte y Ayuda

### Recursos Disponibles
- 📖 **Documentación técnica**: `DOCUMENTACION.md`
- 🛠️ **Guía de instalación**: `INSTALLATION.md`
- 🔧 **API Reference**: `docs/API_DOCUMENTATION.md`

### Contacto
- **Email**: soporte@learnex.com
- **Teléfono**: +1 (555) 123-4567
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

---

**Learnex v2.0** - Tu plataforma educativa integral con IA avanzada.

*Guía actualizada: Diciembre 2024*