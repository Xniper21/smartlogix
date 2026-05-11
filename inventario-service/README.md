# Microservicio de Inventario - SmartLogix

## 📦 Descripción

Microservicio encargado de gestionar el catálogo completo de productos y el control de niveles de stock. Es un componente crítico que valida disponibilidad de productos antes de que se procesen pedidos.

**Versión:** 1.0.0  
**Framework:** Spring Boot 3.2.0  
**Java Version:** 17  
**Puerto:** 8081  
**Base de Datos:** MySQL 8.0  
**Build Tool:** Maven 3.8.0+

---

## 🎯 Responsabilidades

✅ **CRUD de Productos**
- Crear, leer, actualizar y eliminar productos
- Gestionar información: nombre, descripción, precio, stock

✅ **Control de Stock**
- Incrementar/decrementar inventario
- Validar disponibilidad
- Alertas de stock bajo

✅ **Consultas Optimizadas**
- Listar productos disponibles
- Filtrar por estado
- Búsqueda rápida

✅ **Integridad de Datos**
- Transaccionalidad garantizada
- Validación de entrada
- Prevención de overselling

---

## 📊 Modelo de Datos

### Entidad: Producto

```java
@Entity
@Table(name = "productos")
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String nombre;
    
    @Column(length = 500)
    private String descripcion;
    
    @Column(nullable = false)
    private BigDecimal precio;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(nullable = false)
    private Integer stockMinimo = 10;
    
    @Column
    private String sku;
    
    @Column
    private String categoria;
    
    @Column(nullable = false)
    private Boolean activo = true;
    
    @Column
    private LocalDateTime fechaCreacion;
    
    @Column
    private LocalDateTime fechaActualizacion;
}
```

**Campos principales:**
- `id`: Identificador único (PK)
- `nombre`: Nombre del producto
- `precio`: Precio unitario en CLP
- `stock`: Cantidad disponible
- `stockMinimo`: Umbral para alertas (default: 10)
- `sku`: Código de producto (opcional)
- `activo`: Disponible para venta (soft delete)

---

## 🔌 API REST

### 1. Listar Todos los Productos

**Endpoint:** `GET /api/inventario/productos`

**Request:**
```http
GET /api/inventario/productos HTTP/1.1
Host: localhost:8081
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Laptop Dell XPS 13",
    "descripcion": "Ultrabook potente y ligera",
    "precio": 1500000,
    "stock": 15,
    "stockMinimo": 5,
    "sku": "DELL-XPS-13",
    "categoria": "Electrónica",
    "activo": true,
    "fechaCreacion": "2026-01-15T10:30:00"
  },
  {
    "id": 2,
    "nombre": "Mouse Logitech MX Master",
    "descripcion": "Mouse ergonómico premium",
    "precio": 89000,
    "stock": 2,
    "stockMinimo": 10,
    "sku": "LOG-MX-MASTER",
    "categoria": "Periféricos",
    "activo": true,
    "fechaCreacion": "2026-01-20T14:45:00"
  }
]
```

### 2. Obtener Producto Específico

**Endpoint:** `GET /api/inventario/productos/{id}`

**Request:**
```http
GET /api/inventario/productos/1 HTTP/1.1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Laptop Dell XPS 13",
  "descripcion": "Ultrabook potente y ligera",
  "precio": 1500000,
  "stock": 15,
  "stockMinimo": 5,
  "sku": "DELL-XPS-13",
  "categoria": "Electrónica",
  "activo": true
}
```

**Response (404 Not Found):**
```json
{
  "error": "Producto no encontrado",
  "id": 999
}
```

### 3. Crear Producto

**Endpoint:** `POST /api/inventario/productos`

**Request:**
```json
{
  "nombre": "Teclado Mecánico RGB",
  "descripcion": "Teclado gaming con switches Cherry MX",
  "precio": 250000,
  "stock": 20,
  "stockMinimo": 5,
  "sku": "KEY-MECH-RGB",
  "categoria": "Periféricos"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "nombre": "Teclado Mecánico RGB",
  "descripcion": "Teclado gaming con switches Cherry MX",
  "precio": 250000,
  "stock": 20,
  "stockMinimo": 5,
  "sku": "KEY-MECH-RGB",
  "categoria": "Periféricos",
  "activo": true,
  "fechaCreacion": "2026-05-10T12:00:00"
}
```

### 4. Actualizar Producto

**Endpoint:** `PUT /api/inventario/productos/{id}`

**Request:**
```json
{
  "nombre": "Laptop Dell XPS 13 (Actualizado)",
  "precio": 1600000,
  "stock": 12
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Laptop Dell XPS 13 (Actualizado)",
  "precio": 1600000,
  "stock": 12,
  "...": "otros campos"
}
```

### 5. Eliminar Producto

**Endpoint:** `DELETE /api/inventario/productos/{id}`

**Request:**
```http
DELETE /api/inventario/productos/3 HTTP/1.1
```

**Response (204 No Content):**
```
(sin cuerpo)
```

### 6. Decrementar Stock

**Endpoint:** `POST /api/inventario/productos/{id}/decrementar`

**Propósito:** Disminuir stock cuando se confirma un pedido.

**Request:**
```json
{
  "cantidad": 5
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Laptop Dell XPS 13",
  "stockAnterior": 15,
  "stockNuevo": 10,
  "cantidadDecrementada": 5,
  "mensaje": "Stock decrementado exitosamente"
}
```

**Response (400 Bad Request) - Stock insuficiente:**
```json
{
  "error": "Stock insuficiente",
  "stockActual": 3,
  "cantidadSolicitada": 5,
  "falta": 2
}
```

### 7. Incrementar Stock

**Endpoint:** `POST /api/inventario/productos/{id}/incrementar`

**Propósito:** Aumentar stock en caso de devoluciones o reposición.

**Request:**
```json
{
  "cantidad": 10
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Laptop Dell XPS 13",
  "stockAnterior": 10,
  "stockNuevo": 20,
  "cantidadIncrementada": 10,
  "mensaje": "Stock incrementado exitosamente"
}
```

### 8. Listar Productos Agotados

**Endpoint:** `GET /api/inventario/agotados`

**Propósito:** Identificar productos sin stock.

**Request:**
```http
GET /api/inventario/agotados HTTP/1.1
```

**Response (200 OK):**
```json
[
  {
    "id": 5,
    "nombre": "Monitor Samsung 4K",
    "stock": 0,
    "stockMinimo": 5
  }
]
```

### 9. Listar Productos con Bajo Stock

**Endpoint:** `GET /api/inventario/bajo-stock`

**Propósito:** Alertas de productos que necesitan reposición.

**Request:**
```http
GET /api/inventario/bajo-stock HTTP/1.1
```

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "nombre": "Mouse Logitech MX Master",
    "stock": 2,
    "stockMinimo": 10,
    "faltante": 8
  },
  {
    "id": 7,
    "nombre": "Webcam Logitech C920",
    "stock": 7,
    "stockMinimo": 15,
    "faltante": 8
  }
]
```

---

## 📁 Estructura del Proyecto

```
inventario-service/
├── src/
│   ├── main/
│   │   ├── java/com/smartlogix/inventario/
│   │   │   ├── InventarioServiceApplication.java      # Clase main
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── ProductoController.java            # Endpoints
│   │   │   │   └── HealthController.java              # Health check
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── ProductoService.java               # Interfaz
│   │   │   │   ├── ProductoServiceImpl.java            # Implementación
│   │   │   │   └── StockService.java                  # Gestión stock
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── ProductoRepository.java            # JPA Repository
│   │   │   │   └── ProductoSpecifications.java        # Búsquedas
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   └── Producto.java                      # Entidad JPA
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── ProductoDTO.java                   # Request/Response
│   │   │   │   ├── CrearProductoDTO.java              # Create DTO
│   │   │   │   ├── ActualizarStockDTO.java            # Stock DTO
│   │   │   │   └── ProductoAgotadoDTO.java            # Alert DTO
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── ProductoNotFoundException.java      # 404
│   │   │   │   ├── StockInsuficienteException.java    # 400
│   │   │   │   ├── ProductoDuplicadoException.java    # 409
│   │   │   │   └── GlobalExceptionHandler.java        # Manejador
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── JpaConfig.java                     # Config JPA
│   │   │   │   ├── ValidationConfig.java              # Config validación
│   │   │   │   └── AuditConfig.java                   # Auditoría
│   │   │   │
│   │   │   └── util/
│   │   │       ├── ProductoMapper.java                # Mapeo entidades
│   │   │       └── ValidationUtil.java                # Validaciones
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-prod.properties
│   │       ├── data.sql                               # Datos iniciales
│   │       └── schema.sql                             # DDL
│   │
│   └── test/
│       └── java/com/smartlogix/inventario/
│           ├── ProductoServiceTests.java
│           ├── ProductoControllerTests.java
│           ├── StockServiceTests.java
│           └── IntegrationTests.java
│
├── pom.xml
├── Dockerfile
└── README.md
```

---

## 🔧 Configuración

### application.properties

```properties
spring.application.name=inventario-service
server.port=8081

# Base de Datos MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/inventario_db
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.smartlogix=DEBUG

# Validación
spring.jpa.properties.hibernate.validator.apply_to_ddl=false

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:8000
```

---

## 🚀 Instalación y Ejecución

### Requisitos

```
✓ Java 17 JDK
✓ Maven 3.8.0+
✓ MySQL 8.0+ corriendo
```

### Pasos

**1. Clonar y navegar:**
```bash
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix/inventario-service
```

**2. Crear base de datos:**
```sql
CREATE DATABASE inventario_db CHARACTER SET utf8mb4;
```

**3. Compilar:**
```bash
mvn clean package -DskipTests
```

**4. Ejecutar:**
```bash
java -jar target/inventario-service-1.0.0.jar
```

**O con Maven:**
```bash
mvn spring-boot:run
```

**Verificación:**
```bash
curl http://localhost:8081/api/inventario/productos
```

---

## 🐳 Docker

### Build
```bash
docker build -t inventario-service:1.0.0 .
```

### Run
```bash
docker run -p 8081:8081 \
  -e DATABASE_URL=jdbc:mysql://mysql:3306/inventario_db \
  -e DATABASE_USER=root \
  -e DATABASE_PASSWORD=password \
  inventario-service:1.0.0
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
mvn test
```

### Ejemplo Test
```java
@SpringBootTest
public class StockServiceTests {
    
    @Autowired
    private StockService stockService;
    
    @Test
    public void testDecrementarStock() {
        // Arrange
        Producto producto = new Producto();
        producto.setStock(10);
        
        // Act
        Producto resultado = stockService.decrementarStock(producto, 3);
        
        // Assert
        assertEquals(7, resultado.getStock());
    }
}
```

---

## 🚨 Troubleshooting

### Base de datos no encontrada
```sql
-- Verificar que existe
SHOW DATABASES;
-- Si no existe, crear:
CREATE DATABASE inventario_db CHARACTER SET utf8mb4;
```

### Producto no encontrado (404)
```json
{
  "timestamp": "2026-05-10T12:00:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Producto con id 999 no encontrado"
}
```

### Stock insuficiente (400)
```json
{
  "status": 400,
  "error": "Stock Insuficiente",
  "message": "No hay suficiente stock. Disponible: 3, Solicitado: 5"
}
```

---

## 📚 Notas

⚠️ Las transacciones son automáticas en operaciones de stock  
⚠️ El campo `activo` implementa soft delete  
⚠️ Stock mínimo se valida al crear alertas  
⚠️ Implementar idempotencia para decrementos

---

**Última actualización:** Mayo 2026  
**Mantenedor:** Equipo SmartLogix
