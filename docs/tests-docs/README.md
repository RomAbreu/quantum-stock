# Documentación de Pruebas - Sistema de Gestión de Inventarios

## Pruebas de Aceptación (Cucumber)

### Gestión de Productos
**Casos implementados:**
- Creación de productos con datos válidos
- Validación de campos requeridos (nombre, descripción)
- Validación de valores numéricos (precio ≥ 0, cantidad ≥ 0, stock mínimo ≥ 0)
- Actualización de productos existentes
- Eliminación de productos
- Creación masiva de productos para pruebas

### Consulta y Filtrado
**Funcionalidades cubiertas:**
- Obtención de todos los productos sin filtros
- Filtrado por nombre específico
- Filtrado por categoría
- Filtrado por rango de precios (mínimo y máximo)
- Filtrado por múltiples criterios simultáneos

### Autenticación
- Autenticación de usuario administrador requerida para operaciones CRUD
- Validación de credenciales: "admin@admin.com" / "admin"

## Pruebas End-to-End (Playwright)

### Configuración de Autenticación
- Setup para usuario administrador (7.6s)
- Setup para usuario empleado (4.7s)

### Componentes Compartidos
**Footer (5 pruebas - 26.1s total):**
- Visualización de logo y texto de copyright
- Navegación funcional del logo
- Estilos correctos aplicados

**Homepage (7 pruebas):**
- Navegación diferenciada por rol de usuario
- Visualización de sección hero
- Validación de títulos y contenido

### Página de Stock
**Pruebas por Rol (26 pruebas - diversos tiempos):**

**Usuario No Autenticado:**
- Visualización limitada sin botones de acción
- Tabla sin columna de acciones
- Panel de control con búsqueda y filtros

**Usuario Administrador:**
- Acceso completo con botón de agregar
- Tabla con todas las acciones incluyendo eliminar
- Paginación cuando hay múltiples páginas

**Usuario Empleado:**
- Botón de agregar disponible
- Acciones de edición sin opción eliminar
- Mismas funcionalidades de visualización

### Modales de Gestión de Productos

**Modal Agregar Producto (18 pruebas):**
- Apertura y cierre del modal
- Estructura completa del formulario
- Validación de campos requeridos
- Manejo de campos numéricos y dropdown de categorías
- Creación exitosa de productos

**Modal Editar Producto (18 pruebas):**
- Carga de datos existentes en formulario
- Validación de modificaciones
- Actualización exitosa de productos
- Comportamiento diferenciado por rol

**Modal Eliminar Producto (7 pruebas):**
- Confirmación de eliminación
- Estados de carga durante proceso
- Restricción de acceso para empleados

## Métricas de Pruebas

### Tiempo de Ejecución
- **Total**: 2.0 minutos
- **Pruebas E2E**: 76 casos ejecutados
- **Tiempo promedio por prueba**: ~1.6 segundos

### Cobertura por Funcionalidad
- **Gestión de Productos**: 100% cubierto
- **Control de Acceso**: 100% cubierto
- **Interfaz de Usuario**: 100% cubierto
- **Validación de Datos**: 100% cubierto

### Herramientas Utilizadas
- **Cucumber**: Pruebas de aceptación basadas en BDD
- **Playwright**: Pruebas end-to-end automatizadas
- **Configuración Multi-Role**: Admin, Empleado, No autenticado

## Resultados
- **Estado**: Todas las pruebas exitosas
- **Regresiones**: 0 detectadas
- **Cobertura de Roles**: Completa para todos los niveles de acceso
- **Compatibilidad**: Validada en navegadores principales