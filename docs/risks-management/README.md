# Gestión de Riesgos - Sistema de Gestión de Inventarios

## Identificación y Mitigación de Riesgos

### Frontend y Compatibilidad
**Riesgo**: Problemas de compatibilidad en navegadores/dispositivos  
**Mitigación**: Pruebas automatizadas con Playwright en navegadores clave

### Infraestructura y Despliegue
**Riesgo**: Errores en configuración de Docker causando inconsistencias  
**Mitigación**: Dockerfile y docker-compose documentados, pruebas en entornos locales

**Riesgo**: Fallos en migraciones de BD con Flyway  
**Mitigación**: Migraciones en entornos de prueba, copias de seguridad regulares

### Calidad y Pruebas
**Riesgo**: Cobertura incompleta en pruebas de aceptación  
**Mitigación**: Cucumber exhaustivo para automatizar casos basados en requisitos

### Seguridad
**Riesgo**: Vulnerabilidades en implementación JWT de la API  
**Mitigación**: Seguir mejores prácticas JWT, pruebas de seguridad regulares

### Gestión de Proyecto
**Riesgo**: Incumplimiento del cronograma por subestimación  
**Mitigación**: Cronograma detallado con monitoreo periódico del progreso

**Riesgo**: Falta de experiencia con tecnologías
**Mitigación**: Investigación y documentación continua durante el proyecto

### Integración
**Riesgo**: Endpoints mal definidos causando fallos en integración externa  
**Mitigación**: Pruebas exhaustivas de cada endpoint de la API

## Matriz de Probabilidad/Impacto

- **Alto Riesgo**: Problemas de seguridad API, incumplimiento cronograma
- **Medio Riesgo**: Compatibilidad frontend, migraciones BD
- **Bajo Riesgo**: Contenedorización, auditoría datos