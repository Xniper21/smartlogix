# SmartLogix - Plataforma de Gestión Logística Moderna

## 📌 Descripción del Proyecto

SmartLogix es una plataforma integral de gestión logística basada en arquitectura de microservicios, desarrollada con Spring Boot y React. Está diseñada para automatizar la sincronización de inventarios, procesamiento de pedidos y coordinación de envíos en PyMEs y empresas medianas.

## 🎯 Objetivo

Resolver los desafíos de las soluciones logísticas tradicionales mediante:
- ✅ Sincronización de inventarios en tiempo real
- ✅ Automatización de validación y procesamiento de pedidos
- ✅ Coordinación eficiente de envíos
- ✅ Integración escalable con nuevas tecnologías
- ✅ Arquitectura flexible y modular

## 🏗️ Arquitectura General

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React - Vite)                    │
│              Interfaz responsiva y moderna                  │
│                    (Puerto 3000)                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    HTTP/REST API
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              API GATEWAY (Spring Cloud)                      │
│  • Enrutamiento centralizado                                │
│  • Circuit Breaker                                          │
│  • CORS configuration                                       │
│                    (Puerto 8000)                            │
└─────────────────────────┬───────────────────────────────────┘
       │                  │                  │
   ▼               ▼                  ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│   BFF    │  │Inventario│  │ Pedidos  │
│(8090)    │  │(8081)    │  │(8082)    │
└──────────┘  └──────────┘  └──────────┘
       │           │             │
       └───────────┼─────────────┘
                   │
         ┌─────────▼──────────┐
         │  MYSQL DATABASE    │
         │  (3 bases de datos)│
         └────────────────────┘
```

## 🔹 Microservicios

### 1. **API Gateway** (Puerto 8000)
- Punto de entrada único para todas las solicitudes
- Enrutamiento dinámico según rutas
- Manejo centralizado de errores
- CORS configurado para el frontend
- Implementación de Circuit Breaker

**Rutas:**
- `/api/inventario/**` → Inventario Service
- `/api/pedidos/**` → Pedidos Service
- `/api/bff/**` → BFF Service

### 2. **BFF Service** (Puerto 8090) - Backend For Frontend
- Agregador de datos para optimizar respuestas
- Validaciones previas antes de llamadas a servicios
- Gestión de sesiones de usuario
- Interfaz simplificada para el frontend

**Responsabilidades:**
- Combinar datos de múltiples microservicios
- Transformar datos para el frontend
- Caché de consultas frecuentes
- Validación de reglas de negocio

### 3. **Inventario Service** (Puerto 8081)
- Gestión centralizada de productos
- Sincronización en tiempo real de stock
- Soporte para múltiples bodegas (extensible)
- Validación de disponibilidad

**Entidades:**
- `Producto`: id, nombre, stock

**Endpoints:**
```
GET    /productos                    - Listar todos
POST   /productos                    - Crear nuevo
GET    /productos/stock/{id}/{qty}   - Verificar disponibilidad
```

### 4. **Pedidos Service** (Puerto 8082)
- Procesamiento de pedidos
- Validación con Inventario Service
- Integración con Factory Pattern para envíos
- Trazabilidad de estados

**Entidades:**
- `Pedido`: id, productoId, cantidad, tipoEnvio, estado, fechaCreacion

**Estados:**
- PENDIENTE → CONFIRMADO → ENVIADO → ENTREGADO
- RECHAZADO (si no hay stock)

**Endpoints:**
```
POST   /pedidos        - Crear pedido
GET    /pedidos        - Listar pedidos
GET    /pedidos/{id}   - Obtener detalle
```

### 5. **Envíos Service** (Puerto 8083)
- Gestión de envíos y entregas
- Integración con transportistas (extensible)
- Seguimiento de estados
- Asignación de rutas

**Entidades:**
- `Envio`: id, pedidoId, tipo, estado, transportista, fechaCreacion, fechaEntrega

**Endpoints:**
```
POST   /envios                       - Crear envío
GET    /envios                       - Listar
GET    /envios/{id}                  - Obtener
PUT    /envios/{id}/estado/{estado}  - Actualizar estado
```

## 🎨 Frontend (React + Vite)

Interfaz moderna y responsiva con:
- **Navegación:** React Router
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Styling:** CSS moderno

### Páginas Principales

1. **Dashboard de Productos**
   - Listado de productos disponibles
   - Stock en tiempo real

2. **Crear Pedido**
   - Formulario con validación
   - Selección de tipo de envío
   - Confirmación de disponibilidad

3. **Mis Pedidos**
   - Historial de pedidos
   - Estado actual
   - Detalles de envío

## 🗄️ Base de Datos (MySQL)

### Esquema

**Base de datos:** `inventario_db`
```sql
CREATE TABLE producto (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Base de datos:** `pedidos_db`
```sql
CREATE TABLE pedido (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  producto_id BIGINT NOT NULL,
  cantidad INT NOT NULL,
  tipo_envio VARCHAR(50) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  fecha_creacion TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Base de datos:** `envios_db`
```sql
CREATE TABLE envio (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  pedido_id BIGINT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  transportista VARCHAR(100),
  fecha_creacion TIMESTAMP,
  fecha_entrega TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🏭 Patrones de Diseño Implementados

### 1. **Repository Pattern**
Ubicación: Todas las capas de persistencia
```java
public interface ProductoRepository extends JpaRepository<Producto, Long> {}
```
Beneficios: Abstracción de la capa de datos, fácil testing, cambio de BD sin afectar lógica.

### 2. **Factory Method**
Ubicación: `pedidos-service/factory/EnvioFactory.java`
```java
public class EnvioFactory {
    public static Envio crearEnvio(String tipo) {
        if ("express".equalsIgnoreCase(tipo)) 
            return new EnvioExpress();
        return new EnvioNormal();
    }
}
```
Beneficios: Creación flexible de instancias, fácil extensión de nuevos tipos.

### 3. **Circuit Breaker**
Ubicación: Clientes de servicios (InventarioClient, etc.)
```java
public boolean verificarStock(Long id, int cantidad) {
    try {
        return restTemplate.getForObject(url, Boolean.class);
    } catch (Exception e) {
        return false;  // Fallback
    }
}
```
Beneficios: Resiliencia ante fallos, evita cascadas de errores.

### 4. **BFF (Backend For Frontend)**
Ubicación: `bff-service`
Beneficios: Separación de responsabilidades, optimización de respuestas.

### 5. **API Gateway**
Ubicación: `api-gateway`
Beneficios: Punto de control centralizado, enrutamiento, seguridad.

### 6. **Dependency Injection**
Ubicación: Spring Framework
```java
@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository repository;
}
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Spring Boot 3.2.0** - Framework principal
- **Spring Cloud Gateway** - API Gateway
- **Spring Data JPA** - ORM
- **MySQL 8.0** - Base de datos
- **Lombok** - Reducción de boilerplate
- **Maven** - Gestor de dependencias

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navegación
- **CSS3** - Estilos

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación local
- **Git** - Control de versiones

## 📊 Flujo de Datos - Crear Pedido

```
1. Usuario en Frontend ingresa datos del pedido
   ↓
2. Frontend envía POST /api/pedidos a API Gateway
   ↓
3. API Gateway enruta a Pedidos Service
   ↓
4. PedidoService llama InventarioClient
   ↓
5. InventarioClient consulta Inventario Service
   ↓
6. Inventario Service verifica stock en MySQL
   ↓
7. Si hay stock: EnvioFactory crea tipo de envío
   ↓
8. Pedido se guarda en MySQL (estado CONFIRMADO)
   ↓
9. Respuesta retorna al Frontend
   ↓
10. Frontend actualiza UI con confirmación
```

## 🔒 Seguridad (Extensible)

Actualmente implementado:
- ✅ CORS configurado
- ✅ Validación de entrada
- ✅ Manejo de errores
- ✅ Circuit Breaker para fallos

Por implementar:
- [ ] Autenticación JWT
- [ ] Autorización por roles
- [ ] Encriptación de datos sensibles
- [ ] Rate limiting avanzado
- [ ] Auditoría de operaciones

## 📈 Escalabilidad

La arquitectura permite:
- **Escalado horizontal** de servicios independientes
- **Replicación** de bases de datos
- **Caché** distribuido (Redis)
- **Message Queue** (RabbitMQ) para operaciones asincrónicas
- **Load Balancing** en Kubernetes

## 📦 Instalación y Ejecución

Ver [INSTRUCCIONES.md](./INSTRUCCIONES.md) para guía completa.

### Rápido Start con Docker Compose

```bash
# Compilar todos los servicios
cd api-gateway && ..\mvnw.cmd clean package && cd ..
cd bff-service && ..\mvnw.cmd clean package && cd ..
cd inventario-service && ..\mvnw.cmd clean package && cd ..
cd pedidos-service && ..\mvnw.cmd clean package && cd ..
cd envios-service && ..\mvnw.cmd clean package && cd ..

# Ejecutar
docker-compose up --build
```

Acceder en: `http://localhost:3000`

## 📝 Documentación Adicional

- [Arquitectura Detallada](./ARQUITECTURA.md)
- [Instrucciones de Ejecución](./INSTRUCCIONES.md)
- [Decisiones de Diseño](./DECISIONES_ARQUITECTONICAS.md)

## 👥 Estructura del Equipo

| Rol | Responsabilidad |
|-----|-----------------|
| Backend Lead | Microservicios y API |
| Frontend Lead | UI/UX React |
| DevOps | Docker, CI/CD |
| Database Admin | MySQL y optimizaciones |

## 📊 Métricas y Monitoreo

Endpoints de actuator (cuando se configure):
```
GET /actuator/health     - Estado de salud
GET /actuator/metrics    - Métricas de aplicación
```

## 🔄 Git Flow (Recomendado)

```
main (producción)
  ↓
release/* (versiones)
  ↓
develop (desarrollo)
  ↓
feature/* (nuevas características)
```

## 📚 Referencias

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Docker Documentation](https://docs.docker.com/)

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en el repositorio Git.

---

**SmartLogix v1.0** - Plataforma de Gestión Logística Moderna 🚀
