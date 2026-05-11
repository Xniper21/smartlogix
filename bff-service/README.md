# Backend For Frontend (BFF) - SmartLogix

## 📦 Descripción

Microservicio especializado que actúa como intermediario entre el frontend React y los múltiples microservicios backend. El BFF agrega datos de diferentes servicios, los optimiza y los transforma para satisfacer las necesidades específicas del cliente web.

**Versión:** 1.0.0  
**Framework:** Spring Boot 3.2.0  
**Java Version:** 17  
**Puerto:** 8090  
**Base de Datos:** MySQL 8.0  
**Build Tool:** Maven 3.8.0+

---

## 🎯 Propósito y Responsabilidades

### ¿Por qué un BFF?

El patrón Backend For Frontend (BFF) resuelve el problema de que diferentes clientes (web, móvil, IoT) tienen diferentes necesidades de datos. En lugar de que el frontend haga múltiples llamadas a varios servicios, el BFF:

✅ **Agrega datos** desde múltiples microservicios  
✅ **Optimiza respuestas** retornando solo datos necesarios  
✅ **Transforma formatos** según necesidades del cliente  
✅ **Centraliza seguridad** validando permisos en un punto  
✅ **Implementa caché** para operaciones frecuentes  
✅ **Reduce latencia** al cliente web  

### Responsabilidades Específicas

```
Frontend React                    
         ↓
    HTTP GET /api/dashboard/stats
         ↓
    ┌────────────────┐
    │   BFF Service  │
    │   (puerto 8090)│
    └────────────────┘
         ↓
    ┌────┬────┬────┐
    ↓    ↓    ↓    
  Inv  Ped  Env   (Múltiples llamadas paralelas)
    ↑    ↑    ↑
    └────┼────┘
         ↓
    Agregar + Transformar
         ↓
    Respuesta Única Optimizada
         ↓
    Frontend React recibe JSON consolidado
```

---

## 🏗️ Arquitectura Interna

### Capas

```
┌─────────────────────────────────┐
│   Controller Layer              │  ← Endpoints REST
│   (DashboardController.java)    │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Service Layer                 │  ← Lógica de negocio
│   (DashboardService.java)       │  ← Orquestación
└────────────┬────────────────────┘
             │
┌────────────▼──────────────────────┐
│   Client Layer                    │  ← Llamadas HTTP
│   (InventarioClient,              │  ← RestTemplate/WebClient
│    PedidosClient,                 │
│    EnviosClient)                  │
└────────────┬──────────────────────┘
             │
┌────────────▼──────────────────────┐
│   External Microservices          │
│   (Inventario, Pedidos, Envíos)   │
└───────────────────────────────────┘
```

---

## 📋 Endpoints Disponibles

### 1. Estadísticas del Dashboard

**Endpoint:** `GET /api/dashboard/stats`

**Descripción:** Retorna estadísticas consolidadas para el dashboard del frontend.

**Request:**
```http
GET /api/dashboard/stats HTTP/1.1
Host: localhost:8090
Authorization: Bearer token_jwt
```

**Response (200 OK):**
```json
{
  "totalProductos": 145,
  "totalPedidos": 328,
  "gananciaEstimacion": 45000000,
  "totalEntregados": 310,
  "totalPendientes": 18,
  "pedidosExpress": 52,
  "pedidosNormal": 276,
  "productosAgotados": 12,
  "enviosPendientes": 8,
  "enviosEntregados": 302,
  "enviosTotales": 310
}
```

**Cálculos internos:**
```
totalProductos      = GET /inventario/productos + count()
totalPedidos        = GET /pedidos + count()
gananciaEstimacion  = SUM(pedidos.monto) donde estado = ENTREGADO
totalEntregados     = COUNT(pedidos.estado = ENTREGADO)
totalPendientes     = COUNT(pedidos.estado != ENTREGADO)
productosAgotados   = COUNT(productos.stock = 0)
```

### 2. Datos del Usuario

**Endpoint:** `GET /api/usuario`

**Descripción:** Retorna datos del usuario autenticado.

**Request:**
```http
GET /api/usuario HTTP/1.1
Authorization: Bearer token_jwt
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@smartlogix.com",
  "rol": "ADMIN",
  "empresa": "Mi Empresa"
}
```

### 3. Logout

**Endpoint:** `POST /api/logout`

**Descripción:** Cierra la sesión del usuario.

**Request:**
```http
POST /api/logout HTTP/1.1
Authorization: Bearer token_jwt
```

**Response (200 OK):**
```json
{
  "mensaje": "Sesión cerrada exitosamente"
}
```

---

## 📁 Estructura del Proyecto

```
bff-service/
├── src/
│   ├── main/
│   │   ├── java/com/smartlogix/bff/
│   │   │   ├── BffServiceApplication.java              # Clase main
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── DashboardController.java            # Endpoints dashboard
│   │   │   │   ├── UsuarioController.java              # Endpoints usuario
│   │   │   │   └── ErrorController.java                # Manejo de errores
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── DashboardService.java               # Interfaz
│   │   │   │   ├── DashboardServiceImpl.java            # Implementación
│   │   │   │   ├── InventarioService.java              # Llamadas a Inventario
│   │   │   │   ├── PedidosService.java                 # Llamadas a Pedidos
│   │   │   │   └── EnviosService.java                  # Llamadas a Envíos
│   │   │   │
│   │   │   ├── client/
│   │   │   │   ├── InventarioClient.java               # HTTP cliente
│   │   │   │   ├── PedidosClient.java                  # HTTP cliente
│   │   │   │   └── EnviosClient.java                   # HTTP cliente
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── DashboardStatsDTO.java              # Response DTO
│   │   │   │   ├── ProductoDTO.java                    # Data Transfer
│   │   │   │   ├── PedidoDTO.java                      # Data Transfer
│   │   │   │   ├── UsuarioDTO.java                     # Data Transfer
│   │   │   │   └── ErrorResponseDTO.java               # Error Response
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── Usuario.java                        # Entidad JPA
│   │   │   │   └── AuditoriaAcceso.java                # Auditoría
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── UsuarioRepository.java              # JPA Repository
│   │   │   │   └── AuditoriaRepository.java            # JPA Repository
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── RestTemplateConfig.java             # Config HTTP
│   │   │   │   ├── SecurityConfig.java                 # Config seguridad
│   │   │   │   ├── WebConfig.java                      # Config web
│   │   │   │   └── CacheConfig.java                    # Config caché
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── ServicioNoDisponibleException.java  # Excepción custom
│   │   │   │   ├── DatosInvalidosException.java        # Excepción custom
│   │   │   │   └── GlobalExceptionHandler.java         # Manejador central
│   │   │   │
│   │   │   └── util/
│   │   │       ├── LoggerUtil.java                     # Utilidades logging
│   │   │       └── DateUtil.java                       # Utilidades fecha
│   │   │
│   │   └── resources/
│   │       ├── application.properties                  # Config default
│   │       ├── application-dev.properties              # Config desarrollo
│   │       ├── application-prod.properties             # Config producción
│   │       └── logback-spring.xml                      # Config logging
│   │
│   └── test/
│       └── java/com/smartlogix/bff/
│           ├── DashboardServiceTests.java              # Tests unitarios
│           ├── DashboardControllerTests.java           # Tests integración
│           └── ClientsTests.java                       # Tests clientes
│
├── pom.xml                                             # Dependencias Maven
├── Dockerfile                                          # Containerización
├── docker-compose.yml                                  # Orquestación (opcional)
└── README.md                                           # Este archivo
```

---

## 🔧 Configuración (application.properties)

### Archivo: `src/main/resources/application.properties`

```properties
# Aplicación
spring.application.name=bff-service
spring.profiles.active=dev
server.port=8090
server.servlet.context-path=/

# Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/bff_db
spring.datasource.username=root
spring.datasource.password=password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.smartlogix=DEBUG
logging.level.org.springframework.web=DEBUG
logging.pattern.console=%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n

# URLs de Servicios
inventario.service.url=http://inventario-service:8081
pedidos.service.url=http://pedidos-service:8082
envios.service.url=http://envios-service:8083

# Timeouts
http.connectTimeout=5000
http.readTimeout=10000

# Caché
spring.cache.type=simple

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:4200
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.max-age=3600
```

### Archivo: `src/main/resources/application-prod.properties`

```properties
spring.profiles.active=prod
server.port=8090

spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USER}
spring.datasource.password=${DATABASE_PASSWORD}

spring.jpa.hibernate.ddl-auto=validate

logging.level.root=WARN
logging.level.com.smartlogix=INFO

inventario.service.url=${INVENTARIO_SERVICE_URL}
pedidos.service.url=${PEDIDOS_SERVICE_URL}
envios.service.url=${ENVIOS_SERVICE_URL}
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

```
✓ Java 17 JDK
✓ Maven 3.8.0+
✓ MySQL 8.0+ corriendo
✓ Servicios de Inventario, Pedidos y Envíos accesibles
```

### Pasos de Instalación

**1. Clonar repositorio:**
```bash
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix/bff-service
```

**2. Crear base de datos:**
```sql
CREATE DATABASE bff_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**3. Compilar proyecto:**
```bash
mvn clean package -DskipTests
```

**Salida esperada:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: 23.456 s
[INFO] bff-service-1.0.0.jar
```

---

## 📜 Ejecutar el Servicio

### Opción 1: Con Maven (Desarrollo)

```bash
mvn spring-boot:run
```

**Output:**
```
... : Starting BffServiceApplication
... : Started BffServiceApplication in 3.245 seconds
... : Tomcat started on port(s): 8090 (http)
```

**Acceder a:** `http://localhost:8090/api/dashboard/stats`

### Opción 2: Con Java JAR

```bash
java -jar target/bff-service-1.0.0.jar
```

### Opción 3: Con Variables de Entorno

```bash
java -jar target/bff-service-1.0.0.jar \
  --spring.datasource.url=jdbc:mysql://db-host:3306/bff_db \
  --spring.datasource.username=root \
  --spring.datasource.password=password123 \
  --inventario.service.url=http://inventario:8081 \
  --pedidos.service.url=http://pedidos:8082 \
  --envios.service.url=http://envios:8083
```

---

## 🐳 Docker

### Build de Imagen

```bash
docker build -t bff-service:1.0.0 .
```

### Ejecutar Contenedor

```bash
docker run -d \
  --name bff-service \
  -p 8090:8090 \
  -e DATABASE_URL=jdbc:mysql://mysql:3306/bff_db \
  -e DATABASE_USER=root \
  -e DATABASE_PASSWORD=password \
  -e INVENTARIO_SERVICE_URL=http://inventario-service:8081 \
  -e PEDIDOS_SERVICE_URL=http://pedidos-service:8082 \
  -e ENVIOS_SERVICE_URL=http://envios-service:8083 \
  bff-service:1.0.0
```

### Docker Compose

Desde la raíz del proyecto:
```bash
docker-compose up bff-service
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
mvn test
```

### Ejemplo de Test

```java
@SpringBootTest
public class DashboardServiceTests {
    
    @MockBean
    private InventarioClient inventarioClient;
    
    @Autowired
    private DashboardService dashboardService;
    
    @Test
    public void testGetStats() {
        // Arrange
        when(inventarioClient.getTotalProductos())
            .thenReturn(145);
        
        // Act
        DashboardStatsDTO stats = dashboardService.getStats();
        
        // Assert
        assertEquals(145, stats.getTotalProductos());
    }
}
```

---

## 🔍 Debugging

### Logs en Tiempo Real

```bash
# Con Maven
mvn spring-boot:run | grep "ERROR\|WARN"

# Con Docker
docker logs -f bff-service

# Archivo de logs
tail -f logs/application.log
```

### Endpoints de Health Check

```bash
# Verificar que esté corriendo
curl http://localhost:8090/actuator/health

# Respuesta esperada:
# {"status":"UP"}
```

---

## 📊 Monitoreo

### Actuator Endpoints

```properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

**URLs:**
- Health: `http://localhost:8090/actuator/health`
- Info: `http://localhost:8090/actuator/info`
- Métricas: `http://localhost:8090/actuator/metrics`

---

## 🚨 Troubleshooting

### Puerto 8090 ya en uso

```bash
# Linux/Mac
lsof -i :8090
kill -9 <PID>

# Windows
netstat -ano | findstr :8090
taskkill /PID <PID> /F
```

### Conexión a Inventario rechazada

```bash
# Verificar que Inventario esté corriendo
curl http://localhost:8081/api/inventario/productos

# Verificar URL configurada
grep inventario.service.url application.properties
```

### MySQL Connection Error

```bash
# Verificar que MySQL esté corriendo
mysql -u root -p

# Verificar credentials en application.properties
# Asegurarse que base de datos existe
```

---

## 🔐 Seguridad

### Autenticación

Implementar JWT token validation:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/login").permitAll()
            .anyRequest().authenticated();
        return http.build();
    }
}
```

### CORS Configuration

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}
```

---

## 📚 Dependencias Maven

```xml
<!-- Spring Boot -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>

<!-- Testing -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

---

## 🤝 Contribuir

1. Crear feature branch:
```bash
git checkout -b feature/mi-feature
```

2. Hacer cambios y commitear:
```bash
git commit -m "feat(bff): agregar nueva funcionalidad"
```

3. Push y crear Pull Request:
```bash
git push origin feature/mi-feature
```

---

## 📝 Notas Importantes

⚠️ **El BFF debe estar corriendo antes de que el frontend intente conectarse**  
⚠️ **Los servicios de Inventario, Pedidos y Envíos deben estar accesibles**  
⚠️ **Usar HTTPS en producción, especialmente para tokens JWT**  
⚠️ **Implementar rate limiting para proteger contra DDoS**  
⚠️ **Cachear respuestas que no cambian frecuentemente**

---

## 📄 Licencia

Proyecto desarrollado para evaluación académica - SmartLogix 2026

---

**Última actualización:** Mayo 2026  
**Mantenedor:** Equipo SmartLogix  
**Contacto:** support@smartlogix.com
