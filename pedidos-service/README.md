# Microservicio de Pedidos - SmartLogix

## 📦 Descripción

Microservicio centralizado para la creación, procesamiento y seguimiento de órdenes de compra. Gestiona el ciclo de vida completo de pedidos, coordinando con los servicios de Inventario y Envíos para garantizar una experiencia de cliente seamless.

**Versión:** 1.0.0  
**Framework:** Spring Boot 3.2.0  
**Java Version:** 17  
**Puerto:** 8082  
**Base de Datos:** MySQL 8.0  
**Build Tool:** Maven 3.8.0+

---

## 🎯 Responsabilidades

✅ **Creación de Pedidos**
- Recibir solicitudes de nuevos pedidos
- Validar datos de entrada
- Generar número de pedido único

✅ **Validación con Inventario**
- Consultar disponibilidad de productos
- Decrementar stock confirmado
- Manejo de stock insuficiente

✅ **Gestión de Estados**
- Transiciones de estado: Pendiente → Confirmado → Entregado
- Manejo de cancelaciones
- Auditoría de cambios

✅ **Coordinación de Envíos**
- Crear órdenes de envío
- Seleccionar tipo de envío (Normal/Express)
- Seguimiento de entregas

✅ **Reportes y Estadísticas**
- Monto total de ventas
- Cantidad de pedidos por estado
- Segmentación por tipo de envío

---

## 📊 Modelo de Datos

### Entidad: Pedido

```java
@Entity
@Table(name = "pedidos")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String numeroPedido;  // PED-000001
    
    @Column(nullable = false, length = 100)
    private String cliente;
    
    @Column(length = 100)
    private String email;
    
    @Column(length = 500)
    private String direccion;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;  // PENDIENTE, CONFIRMADO, ENTREGADO, CANCELADO
    
    @Column(nullable = false)
    private BigDecimal monto;  // Monto total en CLP
    
    @Column(nullable = false)
    private Integer cantidad;  // Cantidad de items
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEnvio tipoEnvio;  // NORMAL, EXPRESS
    
    @Column
    private Long idEnvio;  // Referencia a envio-service
    
    @Column
    private LocalDateTime fechaCreacion;
    
    @Column
    private LocalDateTime fechaConfirmacion;
    
    @Column
    private LocalDateTime fechaEntrega;
    
    @Column
    private Boolean pagado = false;
    
    @Column(length = 500)
    private String notas;
}

// Enumerados
public enum EstadoPedido {
    PENDIENTE,      // Recién creado
    CONFIRMADO,     // Pagado y validado
    ENTREGADO,      // Completado
    CANCELADO       // Cancelado por cliente
}

public enum TipoEnvio {
    NORMAL,         // 5-7 días hábiles
    EXPRESS         // 1-2 días hábiles
}
```

**Campos principales:**
- `numeroPedido`: Código único (PED-001, PED-002, etc.)
- `cliente`: Nombre del cliente
- `email`: Correo del cliente
- `estado`: Estado actual del pedido
- `monto`: Monto total a pagar
- `cantidad`: Número de items en el pedido
- `tipoEnvio`: Velocidad de entrega
- `fechas`: Timestamps importantes

---

## 🔌 API REST

### 1. Listar Todos los Pedidos

**Endpoint:** `GET /api/pedidos`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "numeroPedido": "PED-000001",
    "cliente": "Acme Corp",
    "email": "contacto@acme.com",
    "estado": "CONFIRMADO",
    "monto": 5000000,
    "cantidad": 10,
    "tipoEnvio": "EXPRESS",
    "pagado": true,
    "fechaCreacion": "2026-05-09T14:30:00",
    "fechaConfirmacion": "2026-05-09T14:45:00"
  },
  {
    "id": 2,
    "numeroPedido": "PED-000002",
    "cliente": "Tech Solutions",
    "email": "ventas@techsol.com",
    "estado": "PENDIENTE",
    "monto": 2500000,
    "cantidad": 5,
    "tipoEnvio": "NORMAL",
    "pagado": false,
    "fechaCreacion": "2026-05-10T10:15:00"
  }
]
```

### 2. Obtener Pedido Específico

**Endpoint:** `GET /api/pedidos/{id}`

**Response (200 OK):**
```json
{
  "id": 1,
  "numeroPedido": "PED-000001",
  "cliente": "Acme Corp",
  "email": "contacto@acme.com",
  "direccion": "Calle Principal 123, Santiago",
  "estado": "CONFIRMADO",
  "monto": 5000000,
  "cantidad": 10,
  "tipoEnvio": "EXPRESS",
  "idEnvio": 45,
  "pagado": true,
  "fechaCreacion": "2026-05-09T14:30:00",
  "fechaConfirmacion": "2026-05-09T14:45:00",
  "notas": "Entregar entre 9:00 y 17:00"
}
```

### 3. Crear Pedido

**Endpoint:** `POST /api/pedidos`

**Request Body:**
```json
{
  "cliente": "Nueva Empresa LTDA",
  "email": "compras@nuevaempresa.com",
  "direccion": "Avenida Central 456, Santiago",
  "items": [
    {
      "productoId": 1,
      "cantidad": 5,
      "precioUnitario": 1000000
    },
    {
      "productoId": 3,
      "cantidad": 2,
      "precioUnitario": 500000
    }
  ],
  "tipoEnvio": "EXPRESS",
  "notas": "Entregar firmado"
}
```

**Proceso interno:**
```
1. Validar entrada (cliente, items, dirección)
2. Calcular monto total = Σ(cantidad × precioUnitario)
3. Validar con Inventario: ¿hay stock de cada producto?
4. Si hay stock: decrementar stock
5. Crear pedido con estado PENDIENTE
6. Si validación OK → estado CONFIRMADO
7. Crear orden de envío en envios-service
8. Retornar pedido creado
```

**Response (201 Created):**
```json
{
  "id": 3,
  "numeroPedido": "PED-000003",
  "cliente": "Nueva Empresa LTDA",
  "email": "compras@nuevaempresa.com",
  "estado": "CONFIRMADO",
  "monto": 7000000,
  "cantidad": 7,
  "tipoEnvio": "EXPRESS",
  "idEnvio": 46,
  "pagado": false,
  "fechaCreacion": "2026-05-10T12:00:00",
  "fechaConfirmacion": "2026-05-10T12:00:05"
}
```

**Response (400 Bad Request) - Stock insuficiente:**
```json
{
  "error": "Stock insuficiente",
  "producto": "Laptop Dell XPS 13",
  "stock_disponible": 3,
  "cantidad_solicitada": 5,
  "mensaje": "No se puede crear el pedido por falta de inventario"
}
```

### 4. Actualizar Pedido

**Endpoint:** `PUT /api/pedidos/{id}`

**Request:**
```json
{
  "cliente": "Acme Corp (Actualizado)",
  "email": "nuevo@acme.com",
  "notas": "Entregar antes de las 12:00"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "numeroPedido": "PED-000001",
  "cliente": "Acme Corp (Actualizado)",
  "email": "nuevo@acme.com",
  "...": "resto de campos"
}
```

### 5. Cambiar Estado de Pedido

**Endpoint:** `PUT /api/pedidos/{id}/estado`

**Request:**
```json
{
  "nuevoEstado": "ENTREGADO",
  "razon": "Entrega confirmada por cliente"
}
```

**Transiciones válidas:**
```
PENDIENTE → CONFIRMADO  (después de pago)
CONFIRMADO → ENTREGADO  (después de llegada)
CUALQUIERA → CANCELADO  (en cualquier momento)
```

**Response (200 OK):**
```json
{
  "id": 1,
  "numeroPedido": "PED-000001",
  "estadoAnterior": "CONFIRMADO",
  "estadoNuevo": "ENTREGADO",
  "fechaActualizacion": "2026-05-10T16:30:00",
  "mensaje": "Estado actualizado exitosamente"
}
```

### 6. Cancelar Pedido

**Endpoint:** `DELETE /api/pedidos/{id}`

**Request:**
```json
{
  "razon": "Cliente solicita cancelación"
}
```

**Proceso:**
1. Cambiar estado a CANCELADO
2. Incrementar stock de productos en Inventario
3. Cancelar orden de envío
4. Registrar auditoría

**Response (200 OK):**
```json
{
  "id": 1,
  "numeroPedido": "PED-000001",
  "estado": "CANCELADO",
  "mensaje": "Pedido cancelado exitosamente",
  "stockRestituido": true,
  "enviosCancelados": 1
}
```

### 7. Listar por Estado

**Endpoint:** `GET /api/pedidos/estado/{estado}`

**Ejemplo:** `GET /api/pedidos/estado/CONFIRMADO`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "numeroPedido": "PED-000001",
    "cliente": "Acme Corp",
    "estado": "CONFIRMADO",
    "monto": 5000000,
    "fechaCreacion": "2026-05-09T14:30:00"
  },
  {
    "id": 3,
    "numeroPedido": "PED-000003",
    "cliente": "Nueva Empresa",
    "estado": "CONFIRMADO",
    "monto": 7000000,
    "fechaCreacion": "2026-05-10T12:00:00"
  }
]
```

### 8. Estadísticas Consolidadas

**Endpoint:** `GET /api/pedidos/estadisticas`

**Response (200 OK):**
```json
{
  "totalPedidos": 328,
  "totalEntregados": 310,
  "totalPendientes": 18,
  "totalCancelados": 0,
  "pedidosExpress": 52,
  "pedidosNormal": 276,
  "montoTotalVentas": 123456789,
  "montoPromedioPorPedido": 376442,
  "tasaEntrega": 94.5,
  "pedidosUltimos7Dias": 45,
  "ventasUltimos7Dias": 15234567
}
```

---

## 📁 Estructura del Proyecto

```
pedidos-service/
├── src/
│   ├── main/
│   │   ├── java/com/smartlogix/pedidos/
│   │   │   ├── PedidosServiceApplication.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── PedidoController.java              # REST endpoints
│   │   │   │   └── EstadisticasController.java        # Reportes
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── PedidoService.java                 # Interfaz
│   │   │   │   ├── PedidoServiceImpl.java              # Implementación
│   │   │   │   ├── InventarioClient.java              # Llamadas a Inventario
│   │   │   │   ├── EnviosClient.java                  # Llamadas a Envíos
│   │   │   │   └── PedidoValidator.java               # Validaciones
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── PedidoRepository.java              # JPA
│   │   │   │   └── EstadisticasRepository.java        # Queries custom
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── Pedido.java                        # Entidad
│   │   │   │   ├── EstadoPedido.java                  # Enum
│   │   │   │   ├── TipoEnvio.java                     # Enum
│   │   │   │   └── Item.java                          # Items del pedido
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── PedidoDTO.java
│   │   │   │   ├── CrearPedidoDTO.java
│   │   │   │   ├── CambiarEstadoDTO.java
│   │   │   │   ├── ItemDTO.java
│   │   │   │   └── EstadisticasDTO.java
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── PedidoNotFoundException.java
│   │   │   │   ├── StockInsuficienteException.java
│   │   │   │   ├── TransicionInvalidaException.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── RestTemplateConfig.java
│   │   │   │   └── JpaConfig.java
│   │   │   │
│   │   │   └── util/
│   │   │       ├── PedidoNumberGenerator.java
│   │   │       ├── PedidoMapper.java
│   │   │       └── DateUtil.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-prod.properties
│   │       └── data.sql
│   │
│   └── test/
│       └── java/com/smartlogix/pedidos/
│           ├── PedidoServiceTests.java
│           ├── PedidoControllerTests.java
│           └── ValidatorTests.java
│
├── pom.xml
├── Dockerfile
└── README.md
```

---

## 🔧 Configuración

### application.properties

```properties
spring.application.name=pedidos-service
server.port=8082

# Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/pedidos_db
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Logging
logging.level.root=INFO
logging.level.com.smartlogix=DEBUG

# Clientes de otros servicios
inventario.service.url=http://inventario-service:8081
envios.service.url=http://envios-service:8083

# Timeouts
http.connectTimeout=5000
http.readTimeout=10000
```

---

## 🚀 Instalación y Ejecución

### Requisitos
```
✓ Java 17 JDK
✓ Maven 3.8.0+
✓ MySQL 8.0+ corriendo
✓ Inventario Service accesible
✓ Envíos Service accesible
```

### Pasos

**1. Clonar:**
```bash
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix/pedidos-service
```

**2. Base de datos:**
```sql
CREATE DATABASE pedidos_db CHARACTER SET utf8mb4;
```

**3. Compilar:**
```bash
mvn clean package -DskipTests
```

**4. Ejecutar:**
```bash
java -jar target/pedidos-service-1.0.0.jar
```

**Verificación:**
```bash
curl http://localhost:8082/api/pedidos
```

---

## 🐳 Docker

```bash
docker build -t pedidos-service:1.0.0 .
docker run -p 8082:8082 \
  -e DATABASE_URL=jdbc:mysql://mysql:3306/pedidos_db \
  -e INVENTARIO_SERVICE_URL=http://inventario-service:8081 \
  -e ENVIOS_SERVICE_URL=http://envios-service:8083 \
  pedidos-service:1.0.0
```

---

## 🧪 Testing

```bash
mvn test
```

---

## 📝 Notas Importantes

⚠️ Validar siempre disponibilidad en Inventario antes de confirmar  
⚠️ Implementar idempotencia para creación de pedidos  
⚠️ Usar transacciones para operaciones atómicas  
⚠️ Auditar todos los cambios de estado  
⚠️ Notificar cambios de estado a clientes por email

---

**Última actualización:** Mayo 2026  
**Mantenedor:** Equipo SmartLogix
