# Arquitectura del sistema

![arquitectura](architecture.png)

# Guía de instalación

Para instalar el proyecto se necesita un servidor con un entorno con Docker Compose y Git instalado. Posteriormente, seguir estos pasos:

1. Clonar repositorio
```sh
git clone https://github.com/RomAbreu/quantum-stock.git
```
2. Configurar permisos de carpetas para los servicios de Keycloak y Grafana
```sh
mkdir -p ./keycloak/data && chmod -R 777 ./keycloak/data
mkdir -p ./grafana/data && chmod -R 777 ./grafana/data
mkdir -p ./grafana/dashboards && chmod -R 777 ./grafana/dashboards
```
3. Configurar variables de entorno en un archivo .env
```
<!-- Localización del Docker Compose y principales servicios -->
cd quantum-stock/backend

<!-- Crear .env -->
[...]
```
4. Subir el perfil de producción de Docker Compose para correr el sistema
```sh
docker compose --profile prod up -d
```

# APIs principales

## Productos
Estos endpoints están disponibles para la API de integración también.

- GET /api/v1/products/all
- POST /api/v1/products/create
- PUT /api/v1/products/update/{id}
- DELETE /api/v1/products/delete/{id}

## Movimientos de stock, dashboard y notificación

- GET /api/v1/min-quantity-notifications
- GET /api/v1/inventory-movements