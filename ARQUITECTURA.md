# SmartLogix - Arquitectura de Microservicios

## 📋 Descripción General

SmartLogix es una plataforma moderna de gestión logística basada en microservicios, diseñada para automatizar la sincronización de inventarios, procesamiento de pedidos y coordinación de envíos.

## 🏗️ Componentes de la Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Frontend (React)                          │
│                   (Puerto 3000, Node.js + Vite)                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   API Gateway (Spring Cloud)                         │
│                        (Puerto 8000)                                │
│  - Enrutamiento de solicitudes                                      │
│  - Autenticación/Autorización                                       │
│  - Rate Limiting                                                    │
│  - Circuit Breaker                                                  │
└─────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
    ▼                     ▼                     ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   BFF        │  │  Inventario  │  │   Pedidos    │
│ (Puerto 8090)│  │ (Puerto 8081)│  │ (Puerto 8082)│
└──────────────┘  └──────────────┘  └──────────────┘
                       │                    │
                   ▼               ▼
         ┌─────────────────┐  ┌─────────────────┐
         │   MySQL DB      │  │   MySQL DB      │
         │  inventario_db  │  │   pedidos_db    │
         └─────────────────┘  └─────────────────┘
```

## 🔹 Microservicios

### 1. **API Gateway (Puerto 8000)**
- Punto de entrada único para todas las solicitudes
- Enrutamiento dinámico según path
- Implementa Circuit Breaker para manejar fallos
- Rate limiting para proteger servicios
- Autenticación centralizada

### 2. **BFF - Backend For Frontend (Puerto 8090)**
- Agregador de datos de múltiples microservicios
- Optimiza respuestas para el frontend
- Maneja sesiones de usuario
- Valida datos antes de enviar a servicios

### 3. **Inventario Service (Puerto 8081)**
- Gestión de productos y stock
- Sincronización en tiempo real
- Soporte para múltiples bodegas
- Base de datos: MySQL (inventario_db)

### 4. **Pedidos Service (Puerto 8082)**
- Creación y gestión de pedidos
- Validación de disponibilidad
- Integración con inventario
- Base de datos: MySQL (pedidos_db)

### 5. **Envíos Service (Puerto 8083)** [Nuevo]
- Gestión de envíos
- Asignación a transportistas
- Seguimiento de entregas
- Base de datos: MySQL (envios_db)

## 📊 Patrones de Diseño Implementados

| Patrón | Ubicación | Propósito |
|--------|-----------|----------|
| **Repository Pattern** | Todos los servicios | Abstracción de persistencia |
| **Factory Method** | Pedidos/Envíos | Creación de instancias dinámicas |
| **Circuit Breaker** | API Gateway + Clients | Manejo de fallos en comunicación |
| **BFF** | BFF Service | Agregación de datos del frontend |
| **API Gateway** | Spring Cloud Gateway | Enrutamiento centralizado |
| **Dependency Injection** | Spring IoC | Inyección de dependencias |

## 🗄️ Base de Datos

### Conexión MySQL
- **Host**: localhost
- **Puerto**: 3306
- **Tres bases de datos independientes**:
  - `inventario_db`
  - `pedidos_db`
  - `envios_db`

### Estrategia
- **JPA/Hibernate** para ORM
- **@Entity** para mapeo de tablas
- **Repositorios** para acceso a datos
- Soporte para procedimientos almacenados

## 🔌 Comunicación entre Servicios

- **RestTemplate** para sincronización entre servicios
- **Circuit Breaker** para manejo de fallos
- **Fallback methods** cuando servicios no responden
- **Retry logic** para reintentos automáticos

## 🚀 Frontend React

- **Vite** como bundler
- **Axios** para consumir APIs
- **Redux** para state management
- **React Router** para navegación
- **Componentes modulares y reutilizables**

## 📦 Estructura de Carpetas

```
smartlogix/
├── api-gateway/
│   ├── pom.xml
│   └── src/
├── bff-service/
│   ├── pom.xml
│   └── src/
├── inventario-service/
│   ├── pom.xml
│   └── src/
├── pedidos-service/
│   ├── pom.xml
│   └── src/
├── envios-service/
│   ├── pom.xml
│   └── src/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   └── Dockerfile
└── docker-compose.yml
```

## 🔐 Seguridad

- Validación en BFF antes de enviar a microservicios
- CORS configurado en API Gateway
- Headers de seguridad
- Rate limiting por IP

## 📈 Escalabilidad

- Servicios **stateless** para facilitar replicación
- Base de datos separadas por servicio
- API Gateway como load balancer
- Posibilidad de containerizar con Docker

## 🔄 Flujo de una Solicitud

1. Frontend (React) envía solicitud a API Gateway
2. API Gateway valida y enruta a servicio correspondiente
3. Si es complejo, BFF agrega datos de múltiples servicios
4. Servicio consulta MySQL y retorna datos
5. Gateway retorna al frontend con transformaciones

## 📝 Justificación de Patrones

- **Repository**: Aislamiento de lógica de persistencia
- **Factory**: Creación flexible de envíos según tipo
- **Circuit Breaker**: Resiliencia ante fallos de servicios
- **BFF**: Mejor rendimiento y UX
- **API Gateway**: Punto de control centralizado
