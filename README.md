# Proyecto de Página Web para Fotógrafo

Este repositorio contiene el desarrollo de una página web para un fotógrafo, diseñada para mostrar su portafolio y permitir la venta de fotos de eventos.

## Tecnologías Utilizadas

- **Frontend**: React.js
- **Backend**: Node.js con Express
- **Comunicación**: Axios para solicitudes HTTP

## Estructura del Proyecto

- **frontend/**: Contiene el código del cliente (React).
- **backend/**: Contiene el código del servidor (Node.js).

## Configuración del Proyecto

### Requisitos Previos

- Node.js instalado en el sistema.

### Instalación

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Instala las dependencias del frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Instala las dependencias del backend:
   ```bash
   cd ../backend
   npm install
   ```

### Ejecución

1. Inicia el servidor backend:
   ```bash
   cd backend
   node index.js
   ```

2. Inicia el servidor frontend:
   ```bash
   cd ../frontend
   npm start
   ```

### Uso

- Accede a `http://localhost:3000` para ver la aplicación.
- El backend está configurado para responder en `http://localhost:5000`.

## Próximos Pasos

- Implementar autenticación para el fotógrafo y los clientes.
- Crear una galería de fotos con opción de compra.
- Integrar un sistema de pagos.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio importante.

## Licencia

Este proyecto está bajo la Licencia MIT.
