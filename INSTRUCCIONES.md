# SmartLogix - Guía de Ejecución

## 🚀 Requisitos Previos

- Java 17 o superior
- Maven 3.8.1 o superior
- Node.js 18+ (para frontend)
- Docker y Docker Compose (opcional pero recomendado)
- MySQL 8.0 (si ejecutas sin Docker)

## 📦 Opción 1: Ejecución Local sin Docker

### 1. Configurar MySQL

```bash
# Crear las bases de datos
mysql -u root -p < init-db.sql
```

Credenciales:
- Usuario: `root`
- Contraseña: `smartlogix123`
- Host: `localhost:3306`

### 2. Compilar todos los servicios

```bash
# En la carpeta raíz smartlogix, compilar cada servicio
cd api-gateway && ..\mvnw.cmd clean package && cd ..
cd bff-service && ..\mvnw.cmd clean package && cd ..
cd inventario-service && ..\mvnw.cmd clean package && cd ..
cd pedidos-service && ..\mvnw.cmd clean package && cd ..
cd envios-service && ..\mvnw.cmd clean package && cd ..
```

### 3. Ejecutar los microservicios (en diferentes terminales)

**Terminal 1 - API Gateway (Puerto 8000):**
```bash
cd api-gateway
..\mvnw.cmd spring-boot:run
```

**Terminal 2 - BFF Service (Puerto 8090):**
```bash
cd bff-service
..\mvnw.cmd spring-boot:run
```

**Terminal 3 - Inventario Service (Puerto 8081):**
```bash
cd inventario-service
..\mvnw.cmd spring-boot:run
```

**Terminal 4 - Pedidos Service (Puerto 8082):**
```bash
cd pedidos-service
..\mvnw.cmd spring-boot:run
```

**Terminal 5 - Envíos Service (Puerto 8083):**
```bash
cd envios-service
..\mvnw.cmd spring-boot:run
```

### 4. Ejecutar Frontend (Terminal 6)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## 🐳 Opción 2: Ejecución con Docker Compose (Recomendado)

### 1. Compilar todos los servicios

```bash
cd api-gateway && ..\mvnw.cmd clean package && cd ..
cd bff-service && ..\mvnw.cmd clean package && cd ..
cd inventario-service && ..\mvnw.cmd clean package && cd ..
cd pedidos-service && ..\mvnw.cmd clean package && cd ..
cd envios-service && ..\mvnw.cmd clean package && cd ..
```

### 2. Ejecutar con Docker Compose

```bash
docker-compose up --build
```

O en segundo plano:
```bash
docker-compose up -d --build
```

### 3. Verificar que todos los servicios estén corriendo

```bash
docker-compose ps
```

## 📱 Acceso a la Aplicación

Una vez que todos los servicios estén corriendo:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **Inventario API**: http://localhost:8081
- **Pedidos API**: http://localhost:8082
- **Envíos API**: http://localhost:8083
- **BFF Service**: http://localhost:8090

## 📊 Endpoints Principales

### BFF Service (Recomendado para frontend)
```
GET  /api/bff/inventario/productos          - Listar productos
GET  /api/bff/inventario/disponible/{id}/{cantidad}  - Verificar disponibilidad
```

### Inventario Service
```
GET  /productos                              - Listar productos
POST /productos                              - Crear producto
GET  /productos/stock/{id}/{cantidad}        - Verificar stock
```

### Pedidos Service
```
POST /pedidos                                - Crear pedido
GET  /pedidos                                - Listar pedidos
GET  /pedidos/{id}                           - Obtener pedido por ID
```

### Envíos Service
```
POST /envios                                 - Crear envío
GET  /envios                                 - Listar envíos
GET  /envios/{id}                            - Obtener envío por ID
PUT  /envios/{id}/estado/{estado}            - Actualizar estado del envío
```

## 🧪 Pruebas

### Ejemplo: Crear un Producto

```bash
curl -X POST http://localhost:8000/api/inventario/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop",
    "stock": 20
  }'
```

### Ejemplo: Crear un Pedido

```bash
curl -X POST http://localhost:8000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "productoId": 1,
    "cantidad": 2,
    "tipoEnvio": "express"
  }'
```

### Ejemplo: Listar Productos (por BFF)

```bash
curl -X GET http://localhost:8000/api/bff/inventario/productos
```

## 🛑 Detener los servicios

### Local:
Presiona `Ctrl+C` en cada terminal

### Docker:
```bash
docker-compose down
```

Para eliminar también los volúmenes (MySQL data):
```bash
docker-compose down -v
```

## 🔧 Troubleshooting

### Puerto en uso
Si algún puerto ya está en uso, puedes cambiar los puertos en los archivos `application.properties` de cada servicio o en el `docker-compose.yml`.

### MySQL no se conecta
Verifica que MySQL esté corriendo y que las credenciales sean correctas (usuario: `root`, contraseña: `smartlogix123`).

### Frontend no se conecta a la API
Verifica que el API Gateway esté corriendo en el puerto 8000 y que CORS esté correctamente configurado.

## 📝 Estructura de Directorios

```
smartlogix/
├── api-gateway/              # Spring Cloud Gateway
├── bff-service/              # Backend For Frontend
├── inventario-service/       # Microservicio de Inventario
├── pedidos-service/          # Microservicio de Pedidos
├── envios-service/           # Microservicio de Envíos
├── frontend/                 # Aplicación React
├── docker-compose.yml        # Orquestación de servicios
├── init-db.sql              # Script de inicialización MySQL
└── ARQUITECTURA.md          # Documentación de arquitectura
```

## 🚀 Deploy a Producción

Para desplegar en producción, considera:
1. Usar variables de entorno para configuraciones sensibles
2. Implementar autenticación y autorización
3. Configurar SSL/TLS
4. Implementar logging centralizado
5. Configurar monitoreo y alertas
6. Usar orchestración con Kubernetes

---

**¡SmartLogix está listo para funcionar!** 🎉
