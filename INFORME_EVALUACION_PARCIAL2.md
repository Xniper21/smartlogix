# INFORME DE EVALUACIÓN PARCIAL N°2
## SmartLogix - Plataforma de Gestión Logística Moderna

**Fecha:** Mayo 2026  
**Asignatura:** Análisis de Patrones, Arquetipos y Patrones Arquitectónicos  
**Entregable:** Componentes Frontend NPM + Backend For Frontend (BFF) + 2 Microservicios + Arquetipos Maven  
**Repositorio Principal:** https://github.com/Xniper21/smartlogix.git

---

## 1. ANÁLISIS DE PATRONES Y ARQUETIPOS SELECCIONADOS

### 1.1 Patrón Arquitectónico: Microservicios

**Definición:**
La arquitectura de microservicios es un enfoque arquitectónico que estructura una aplicación como un conjunto de servicios pequeños, independientes y acoplados débilmente que se comunican a través de interfaces bien definidas (típicamente HTTP/REST).

**Justificación de su Selección para SmartLogix:**

**a) Escalabilidad Independiente**
- Cada servicio (Inventario, Pedidos, Envíos) puede escalar de manera independiente según su demanda
- Durante picos de pedidos, solo el servicio de Pedidos requiere más instancias
- Evita desperdicio de recursos escalando toda la aplicación uniformemente

**b) Deployment Independiente**
- Cambios en el servicio de Inventario no requieren redeploy de Pedidos o Envíos
- Ciclos de entrega más rápidos para cada equipo
- Reducción de riesgo: un fallo en deployment solo afecta un servicio

**c) Resiliencia y Tolerancia a Fallos**
- Si el servicio de Envíos falla, el usuario aún puede crear pedidos
- Implementación de Circuit Breaker en API Gateway para manejar servicios inactivos
- Recuperación granular de errores por servicio

**d) Independencia Tecnológica**
- Cada servicio puede usar su propia versión de Spring Boot, Java, u otra tecnología
- Equipo de Inventario puede optimizar con tecnologías específicas sin afectar otros equipos
- Facilita la adopción de nuevas tecnologías de manera gradual

**e) Desacoplamiento y Flexibilidad**
- Cambios en el contrato de API de un servicio no requieren cambios inmediatos en otros
- Nuevas integraciones (marketplaces, transportistas) se agregan como nuevos servicios
- Facilita testing independiente de cada componente

**Aplicación en SmartLogix:**
```
┌─────────────────────────────────────────┐
│         Frontend (React - Vite)         │
│       Interfaz de Usuario Responsiva    │
└────────────────┬────────────────────────┘
                 │
         HTTP/REST - Puerto 3000
                 │
┌────────────────▼────────────────────────┐
│      API Gateway (Spring Cloud)         │
│  • Enrutamiento centralizado            │
│  • Circuit Breaker                      │
│  • CORS Management                      │
│  • Rate Limiting                        │
│          Puerto 8000                    │
└────────────────┬────────────────────────┘
         │               │
         │ REST API      │ REST API
         ▼               ▼
    ┌────────────┐  ┌────────────┐
    │ BFF        │  │ Inventario │
    │ (8090)     │  │ (8081)     │
    │            │  │            │
    │ Agregador  │  │ Gestiona   │
    │ de datos   │  │ Stock      │
    └────────────┘  └────────────┘
         │
         │
    ┌────▼────────┐
    │ Pedidos     │
    │ (8082)      │
    │             │
    │ Procesa     │
    │ Órdenes     │
    └─────────────┘
```

---

### 1.2 Patrón de Integración: Backend For Frontend (BFF)

**Definición:**
El patrón BFF es un servidor backend específicamente diseñado para servir a una aplicación frontend particular. Actúa como intermediario entre el frontend y los microservicios, optimizando datos y flujos según las necesidades específicas del cliente web.

**Justificación:**

**a) Optimización de Respuestas**
- Problema: El frontend requiere datos de múltiples servicios (inventario + pedidos + envíos) en formatos diferentes
- Solución: BFF retorna una respuesta única, precargada y formateada para el dashboard
- Beneficio: Reduce latencia y complejidad en el cliente web

**b) Agregación de Datos**
- Evita el problema N+1 queries: Frontend no hace 10 llamadas, BFF coordina 1 respuesta
- Ejemplo: Dashboard obtiene estadísticas completas en 1 llamada en lugar de 5

**c) Transformación de Datos**
- El BFF normaliza formatos entre servicios (diferentes versionados de API)
- Aplica reglas de negocio específicas del frontend
- Realiza cálculos que el frontend no debería hacer

**d) Seguridad Centralizada**
- Validación de permisos de usuario en un punto
- Filtrado de datos sensibles antes de enviar al cliente
- Manejo centralizado de tokens y autenticación

**Implementación en SmartLogix:**

El BFF (Puerto 8090) coordina:
- Llamadas al servicio de Inventario para obtener productos disponibles
- Llamadas al servicio de Pedidos para obtener estadísticas de órdenes
- Llamadas al servicio de Envíos para obtener métricas de entregas
- Consolidación en un objeto de respuesta única para el Dashboard

```java
// Ejemplo de agregación en BFF
{
  "totalProductos": 145,
  "totalPedidos": 328,
  "gananciaEstimacion": 45000000,
  "totalEntregados": 310,
  "totalPendientes": 18,
  "productosAgotados": 12,
  "enviosPendientes": 8,
  "enviosEntregados": 302,
  "enviosTotales": 310
}
```

---

### 1.3 Patrón API: REST (Representational State Transfer)

**Definición:**
REST es un estilo arquitectónico que utiliza el protocolo HTTP de manera estándar para definir operaciones CRUD sobre recursos. Cada recurso se identifica por una URL única (URI) y se opera mediante métodos HTTP estándar (GET, POST, PUT, DELETE).

**Justificación:**

**a) Universalidad y Estandardización**
- REST es el estándar de facto en la industria
- Cualquier cliente (web, móvil, IoT) puede consumir APIs REST
- Fácil integración futura con nuevos sistemas

**b) Statelessness (Sin Estado)**
- Cada solicitud contiene toda la información necesaria
- Facilita escalado horizontal: cualquier servidor puede procesar cualquier solicitud
- Simplifica el load balancing

**c) Cacheabilidad**
- Las respuestas HTTP pueden ser cacheadas por proxies y CDNs
- Reduce latencia para consultas frecuentes
- Reduce carga en servicios

**d) Legibilidad y Mantenibilidad**
- URLs autoexplicativas: `/api/pedidos`, `/api/inventario`
- Métodos HTTP claros: GET (leer), POST (crear), PUT (actualizar), DELETE (eliminar)
- Fácil de debuggear con herramientas estándar (curl, Postman, navegador)

**Implementación en SmartLogix:**

Endpoints REST bien definidos:
```
GET    /api/dashboard/stats              → Obtiene estadísticas para el dashboard
GET    /api/inventario/productos         → Lista todos los productos
GET    /api/inventario/productos/{id}    → Obtiene detalles de un producto
POST   /api/pedidos                       → Crea un nuevo pedido
GET    /api/pedidos/{id}                  → Obtiene detalles del pedido
PUT    /api/pedidos/{id}                  → Actualiza estado del pedido
GET    /api/envios/{id}                   → Obtiene información de envío
```

---

### 1.4 Patrón de Presentación: Componentes React Funcionales

**Definición:**
Los componentes funcionales en React son funciones JavaScript que retornan JSX (elementos React). Son la forma moderna y recomendada de crear componentes en React, especialmente con hooks.

**Justificación:**

**a) Simplicidad y Legibilidad**
- Código más conciso comparado con componentes de clase
- Lógica clara y fácil de seguir
- Menos boilerplate (código repetitivo)

**b) Hooks - Reutilización de Lógica**
- `useState`: Manejo de estado local de componentes
- `useEffect`: Manejo de efectos secundarios y ciclo de vida
- Posibilidad de crear hooks personalizados para lógica reutilizable

**c) Performance Optimizado**
- React Fiber automáticamente optimiza renders
- Fácil aplicar lazy loading y code splitting
- Mejor manejo de memoria

**d) Compatibilidad con Librerías Modernas**
- Recharts (gráficos) funciona perfectamente con componentes funcionales
- React Router v6 optimizado para componentes funcionales
- Tailwind CSS se integra sin problemas

**Implementación en SmartLogix:**

Componente Dashboard con hooks:
```javascript
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ventasData, setVentasData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchVentasData();
    const interval = setInterval(fetchStats, 15000); // Actualiza cada 15s
    return () => clearInterval(interval);
  }, []);

  // Renderiza skeleton durante carga
  if (loading && !stats) return <LoadingSkeleton />;

  // Renderiza dashboard con datos
  return <Dashboard data={stats} />;
}
```

---

### 1.5 Patrón de Datos: Entidades JPA Mapeadas a Base de Datos

**Definición:**
JPA (Java Persistence API) es una especificación que permite mapear objetos Java a tablas de base de datos relacionales de manera declarativa usando anotaciones.

**Justificación:**

**a) ORM (Object-Relational Mapping)**
- Reduce código SQL manual
- Aumento de seguridad: previene SQL injection mediante prepared statements
- Portabilidad: cambiar de base de datos sin cambiar el código de aplicación

**b) Transaccionalidad**
- Manejo automático de transacciones
- Rollback automático en casos de error
- Consistencia de datos garantizada

**c) Asociaciones Automáticas**
- Relaciones OneToMany, ManyToOne, ManyToMany se definen en código
- Lazy loading / Eager loading optimizable

**Implementación en SmartLogix:**

Entidad de Pedido mapeada a MySQL:
```java
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_pedido")
    private String numeroPedido;
    
    @Column(name = "cliente")
    private String cliente;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPedido estado;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @ManyToOne
    @JoinColumn(name = "inventario_id")
    private Inventario inventario;
}
```

---

## 2. PLAN DE BRANCHING Y ESTRATEGIA GIT FLOW

### 2.1 Introducción al Git Flow

El modelo Git Flow es una metodología de ramificación que proporciona un marco robusto para liberar versiones de proyectos y gestionar hotfixes. Define un conjunto de ramas con propósitos específicos y reglas sobre cómo y cuándo se deben fusionar.

### 2.2 Estructura de Ramas en SmartLogix

#### **Ramas Principales (Long-lived)**

**1. Rama `main` (Producción)**
- **Propósito:** Contiene código listo para producción
- **Política:** Solo recibe merges desde ramas `release` y `hotfix`
- **Protección:** Requiere Code Review mínimo antes de merge
- **Versioning:** Cada merge crea un tag de versión (v1.0.0, v1.0.1, etc.)
- **Quién mergeea:** Tech Lead o Project Manager

**2. Rama `develop` (Integración)**
- **Propósito:** Rama de desarrollo principal donde se integran features
- **Política:** Recibe merges desde `feature/*` branches
- **Ambiente:** Deployable a ambiente de desarrollo/staging
- **Versioning:** Versionado con sufijo -SNAPSHOT (1.0.0-SNAPSHOT)
- **Protección:** Requiere CI/CD pasado (tests, build)

#### **Ramas de Soporte (Feature/Hotfix)**

**3. Rama `feature/*` (Nuevas Características)**
- **Formato:** `feature/descripcion-corta` o `feature/TICKET-123-descripcion`
- **Origen:** Derivada de `develop`
- **Destino:** Merge a `develop` cuando esté completa
- **Duración:** Típicamente 1-5 días de trabajo
- **Ejemplo:** 
  ```
  feature/agregar-grafico-ventas
  feature/SMART-45-validacion-pedidos
  feature/integracion-bff-inventario
  ```

**4. Rama `release/*` (Preparación de Release)**
- **Formato:** `release/v1.0.0` o `release/1.0.0`
- **Origen:** Derivada de `develop` cuando se decide hacer release
- **Destino:** Merge a `main` Y de vuelta a `develop`
- **Propósito:** Solo permite:
  - Fixes de bugs encontrados en QA
  - Actualización de versionado
  - Documentación de release
- **No permite:** Nuevas features
- **Duración:** 3-5 días (tiempo de testing)

**5. Rama `hotfix/*` (Correcciones Críticas)**
- **Formato:** `hotfix/descripcion` o `hotfix/TICKET-456`
- **Origen:** Derivada de `main`
- **Destino:** Merge a `main` Y a `develop`
- **Propósito:** Correcciones críticas en producción que no pueden esperar
- **Ejemplo:**
  ```
  hotfix/corregir-errores-bd
  hotfix/seguridad-validacion-entrada
  ```

**6. Rama `fix/*` (Correcciones Menores)**
- **Formato:** `fix/descripcion` o `fix/TICKET-789-descripcion`
- **Origen:** Derivada de `develop`
- **Destino:** Merge a `develop`
- **Propósito:** Correcciones de bugs que no son críticos
- **Duración:** 1-2 días

### 2.3 Flujo de Trabajo Detallado

#### **Workflow para Una Nueva Feature:**

```
1. CREAR FEATURE
   git checkout develop
   git pull origin develop
   git checkout -b feature/nueva-funcionalidad
   
2. DESARROLLAR
   # Hacer cambios en el código
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   
3. CREAR PULL REQUEST
   - Descripción clara de cambios
   - Enlace a ticket si existe
   - Screenshots si es UI
   
4. CODE REVIEW
   - Mínimo 1 reviewer aprueba
   - Pasan los tests automáticos
   
5. MERGE A DEVELOP
   git checkout develop
   git pull origin develop
   git merge --no-ff feature/nueva-funcionalidad
   git push origin develop
   
6. ELIMINAR RAMA
   git branch -d feature/nueva-funcionalidad
   git push origin --delete feature/nueva-funcionalidad
```

#### **Workflow para Release:**

```
1. CREAR RAMA RELEASE
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   
2. ACTUALIZAR VERSIONES
   # Actualizar pom.xml: 1.0.0-SNAPSHOT → 1.0.0
   # Actualizar package.json: "version": "1.0.0"
   
3. TESTING Y FIXES
   # Solo fixes de bugs encontrados
   git commit -m "fix: corregir bug encontrado en testing"
   
4. MERGE A MAIN
   git checkout main
   git pull origin main
   git merge --no-ff release/v1.0.0
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin main --tags
   
5. MERGE DE VUELTA A DEVELOP
   git checkout develop
   git pull origin develop
   git merge --no-ff release/v1.0.0
   # Actualizar version: 1.0.0 → 1.0.1-SNAPSHOT
   
6. ELIMINAR RAMA RELEASE
   git branch -d release/v1.0.0
```

### 2.4 Convenciones de Commits

**Formato:** `<type>: <descripción>` ó `<type>(scope): <descripción>`

**Tipos permitidos:**
```
feat:       Nueva funcionalidad
fix:        Corrección de bug
docs:       Cambios de documentación
style:      Cambios de formato (sin cambios funcionales)
refactor:   Refactoring de código
perf:       Mejoras de performance
test:       Agregar o actualizar tests
chore:      Cambios en configuración, dependencias
ci:         Cambios en CI/CD
```

**Ejemplos válidos:**
```
feat(dashboard): agregar gráfico de ventas últimos 7 días
fix(pedidos): corregir validación de cantidad de items
docs: actualizar README con instrucciones de setup
refactor(bff): mejorar agregación de datos
test(inventario): agregar tests para validar stock
```

### 2.5 Protecciones de Rama Implementadas

En el repositorio GitHub se configuran:

**Branch Protection Rules para `main`:**
- ✅ Requiere pull request review (mínimo 1)
- ✅ Requiere que los commits estén actualizados con la rama base
- ✅ Requiere que pasen los checks de CI/CD
- ✅ Requiere que los cambios sean revisados antes de merge
- ✅ Despedir ramas obsoletas después del merge

**Branch Protection Rules para `develop`:**
- ✅ Requiere pull request review
- ✅ Requiere que pasen tests automáticos
- ✅ Protege contra accidental push

### 2.6 Integración Continua (CI/CD)

Cada commit que se pushea a una rama con PR dispara:

```
1. BUILD
   - Compilación de código Java con Maven
   - Build de frontend con Vite
   
2. TESTING
   - Tests unitarios
   - Tests de integración
   
3. ANÁLISIS DE CÓDIGO
   - SonarQube: Cobertura de código
   - Detección de vulnerabilidades
   
4. DOCKER BUILD
   - Build de imágenes Docker para cada servicio
   - Push a registro si todo pasa
```

---

## 3. COMPONENTES FRONTEND

### 3.1 Descripción General

**Tipo:** Aplicación SPA (Single Page Application)  
**Framework:** React 18.2.0  
**Build Tool:** Vite 5.0.0  
**Package Manager:** npm  
**Ubicación:** `/frontend`  
**Versión:** 1.0.0  
**Puerto:** 3000

### 3.2 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 18.2.0 | Framework de UI |
| React Router DOM | 6.18.0 | Enrutamiento de página |
| Axios | 1.6.0 | Cliente HTTP para llamadas API |
| Recharts | 3.8.1 | Visualización de gráficos |
| Tailwind CSS | 3.4.4 | Framework de estilos utility-first |
| Vite | 5.0.0 | Bundler moderno y rápido |
| PostCSS | 8.4.35 | Procesamiento de CSS |
| Autoprefixer | 10.4.20 | Compatibilidad con navegadores antiguos |

### 3.3 Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx              # Dashboard principal con gráficos
│   │   ├── CrearPedido.jsx           # Formulario para crear pedidos
│   │   ├── PedidoDetalle.jsx         # Vista detalle de un pedido
│   │   ├── Login.jsx                 # Componente de autenticación
│   │   └── [otros componentes...]
│   │
│   ├── services/
│   │   └── api.js                    # Configuración de Axios y endpoints
│   │
│   ├── App.jsx                        # Componente raíz
│   ├── App.css                        # Estilos globales
│   ├── main.jsx                       # Punto de entrada
│   └── index.css                      # Estilos base
│
├── public/
│   └── [assets estáticos]
│
├── package.json                       # Dependencias y scripts
├── vite.config.js                     # Configuración de Vite
├── tailwind.config.js                 # Configuración de Tailwind
├── postcss.config.js                  # Configuración de PostCSS
├── index.html                         # HTML base
└── Dockerfile                         # Containerización

```

### 3.4 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",                    // Inicia servidor de desarrollo
    "build": "vite build",            // Build para producción
    "preview": "vite preview"         // Preview del build
  }
}
```

### 3.5 Componentes Principales

**1. Dashboard.jsx**
- **Propósito:** Panel principal con estadísticas y gráficos
- **Características:**
  - Gráfico de líneas con últimos 12 días de datos
  - Resumen de pedidos (entregados, pendientes, express, normal)
  - Inventario y métricas de envíos
  - Actualización automática cada 15 segundos
  - Skeleton loading mientras se cargan datos
  - Formato de moneda en CLP

**2. CrearPedido.jsx**
- **Propósito:** Formulario para crear nuevos pedidos
- **Características:**
  - Validación de campos
  - Selección de productos del inventario
  - Cálculo automático de totales
  - Opción de envío express vs normal

**3. PedidoDetalle.jsx**
- **Propósito:** Visualización detallada de un pedido
- **Características:**
  - Información completa del pedido
  - Tracking de envío
  - Historial de cambios de estado

**4. Login.jsx**
- **Propósito:** Autenticación de usuarios
- **Características:**
  - Formulario de login
  - Validación de credenciales
  - Almacenamiento de token JWT en localStorage

### 3.6 Servicios de API

**Archivo:** `src/services/api.js`

```javascript
const dashboardAPI = {
  stats: () => axios.get('/api/dashboard/stats')
};

const pedidosAPI = {
  listar: () => axios.get('/api/pedidos'),
  obtener: (id) => axios.get(`/api/pedidos/${id}`),
  crear: (datos) => axios.post('/api/pedidos', datos),
  actualizar: (id, datos) => axios.put(`/api/pedidos/${id}`, datos)
};

const inventarioAPI = {
  listar: () => axios.get('/api/inventario/productos'),
  obtener: (id) => axios.get(`/api/inventario/productos/${id}`)
};
```

### 3.7 Características de UI/UX

- **Diseño Responsivo:** Adapta a móvil, tablet y desktop
- **Dark Mode:** Tema oscuro con gradientes modernos (Tailwind)
- **Animaciones Suaves:** Transiciones y skeleton loading
- **Gráficos Interactivos:** Recharts con tooltips y leyendas
- **Formularios Validados:** Validación en cliente antes de enviar

### 3.8 Instrucciones de Ejecución

**Instalación de dependencias:**
```bash
cd frontend
npm install
```

**Desarrollo local:**
```bash
npm run dev
# Acceder a http://localhost:3000
```

**Build para producción:**
```bash
npm run build
# Genera carpeta dist/ lista para desplegar
```

**Preview del build:**
```bash
npm run preview
# Visualiza cómo se vería en producción
```

---

## 4. COMPONENTES BACKEND

### 4.1 Backend For Frontend (BFF)

**Nombre:** bff-service  
**Versión:** 1.0.0  
**Framework:** Spring Boot 3.2.0  
**Java Version:** 17  
**Build Tool:** Maven  
**Puerto:** 8090  
**Ubicación:** `/bff-service`

#### **Descripción del BFF**

El Backend For Frontend (BFF) es un servicio especializado que actúa como intermediario entre el frontend y los microservicios backend. Su rol principal es:

1. **Agregación de Datos:** Consolida información de múltiples microservicios en una única respuesta
2. **Optimización:** Retorna solo los datos necesarios para el frontend
3. **Transformación:** Convierte formatos de respuesta según necesidades del cliente
4. **Caché:** Implementa caché de respuestas frecuentes
5. **Seguridad:** Valida permisos y filtra datos sensibles

#### **Arquitectura del BFF**

```
Requests desde Frontend
         │
         ▼
  BFF - Rutas REST
         │
    ┌────┼────┐
    │    │    │
    ▼    ▼    ▼
  Int  Ped  Env      (Llamadas a Microservicios)
    │    │    │
    └────┼────┘
         │
    Agregación de Datos
         │
         ▼
    Respuesta Única
         │
         ▼
   Frontend React
```

#### **Dependencias Principales**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
```

#### **Endpoints Principales**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Obtiene estadísticas consolidadas para el dashboard |
| GET | `/api/usuario` | Obtiene datos del usuario autenticado |
| POST | `/api/logout` | Cierra sesión del usuario |

#### **Respuesta de Dashboard Stats**

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

#### **Estructura del Proyecto BFF**

```
bff-service/
├── src/
│   ├── main/
│   │   ├── java/com/smartlogix/bff/
│   │   │   ├── BffServiceApplication.java         # Clase principal
│   │   │   ├── controller/
│   │   │   │   ├── DashboardController.java       # Endpoints de dashboard
│   │   │   │   └── UsuarioController.java         # Endpoints de usuario
│   │   │   ├── service/
│   │   │   │   ├── DashboardService.java          # Lógica de agregación
│   │   │   │   ├── InventarioService.java         # Cliente del servicio
│   │   │   │   ├── PedidosService.java            # Cliente del servicio
│   │   │   │   └── EnviosService.java             # Cliente del servicio
│   │   │   ├── client/
│   │   │   │   ├── InventarioClient.java          # Llamadas HTTP
│   │   │   │   ├── PedidosClient.java             # Llamadas HTTP
│   │   │   │   └── EnviosClient.java              # Llamadas HTTP
│   │   │   ├── config/
│   │   │   │   ├── RestTemplateConfig.java        # Config de HTTP
│   │   │   │   └── SecurityConfig.java            # Config de seguridad
│   │   │   └── dto/
│   │   │       ├── DashboardStatsDTO.java         # DTO de respuesta
│   │   │       └── ErrorResponseDTO.java          # DTO de errores
│   │   │
│   │   └── resources/
│   │       ├── application.properties             # Configuración
│   │       └── application-prod.properties        # Config producción
│   │
│   └── test/
│       └── java/com/smartlogix/bff/
│           ├── DashboardServiceTests.java
│           └── DashboardControllerTests.java
│
├── pom.xml                                         # Dependencias Maven
├── Dockerfile                                      # Containerización
└── README.md                                       # Instrucciones

```

#### **Configuración (application.properties)**

```properties
spring.application.name=bff-service
server.port=8090

# Base de Datos
spring.datasource.url=jdbc:mysql://localhost:3306/bff_db
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

# Servicios Internos
inventario.service.url=http://inventario-service:8081
pedidos.service.url=http://pedidos-service:8082
envios.service.url=http://envios-service:8083

# Logging
logging.level.root=INFO
logging.level.com.smartlogix=DEBUG
```

#### **Instrucciones de Instalación y Ejecución**

**Prerequisitos:**
- Java 17 instalado
- Maven 3.8+
- MySQL 8.0+ corriendo
- Otros microservicios funcionando (Inventario, Pedidos)

**Compilación:**
```bash
cd bff-service
mvn clean package -DskipTests
# Genera: target/bff-service-1.0.0.jar
```

**Ejecución Local:**
```bash
java -jar target/bff-service-1.0.0.jar
# Servicio disponible en: http://localhost:8090
```

**Con Maven:**
```bash
mvn spring-boot:run
```

**Con Docker:**
```bash
docker build -t bff-service:1.0.0 .
docker run -p 8090:8090 \
  -e DATABASE_URL=jdbc:mysql://mysql:3306/bff_db \
  bff-service:1.0.0
```

---

### 4.2 Microservicio: Inventario

**Nombre:** inventario-service  
**Versión:** 1.0.0  
**Framework:** Spring Boot 3.2.0  
**Java Version:** 17  
**Puerto:** 8081  
**Ubicación:** `/inventario-service`

#### **Descripción**

El servicio de Inventario gestiona el catálogo de productos, niveles de stock, y notificaciones de baja disponibilidad. Es un microservicio crítico que otros servicios consultan antes de procesar pedidos.

#### **Responsabilidades**

1. **Gestión de Productos:** CRUD de productos (crear, leer, actualizar, eliminar)
2. **Control de Stock:** Incremento y decremento de inventario
3. **Alertas:** Notificación cuando el stock está bajo
4. **Validación:** Verifica disponibilidad antes de confirmar pedido

#### **Entidades Principales**

```java
@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column
    private String descripcion;
    
    @Column(nullable = false)
    private BigDecimal precio;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column
    private Integer stockMinimo = 10;
    
    @Column
    private LocalDateTime fechaCreacion;
    
    @Column
    private Boolean activo = true;
}
```

#### **Endpoints REST**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/inventario/productos` | Lista todos los productos |
| GET | `/api/inventario/productos/{id}` | Obtiene detalles de un producto |
| POST | `/api/inventario/productos` | Crea nuevo producto |
| PUT | `/api/inventario/productos/{id}` | Actualiza producto |
| DELETE | `/api/inventario/productos/{id}` | Elimina producto |
| POST | `/api/inventario/productos/{id}/decrementar` | Decrementa stock |
| POST | `/api/inventario/productos/{id}/incrementar` | Incrementa stock |
| GET | `/api/inventario/agotados` | Lista productos agotados |
| GET | `/api/inventario/bajo-stock` | Lista productos con stock bajo |

#### **Estructura del Proyecto**

```
inventario-service/
├── src/
│   ├── main/
│   │   ├── java/com/smartlogix/inventario/
│   │   │   ├── InventarioServiceApplication.java
│   │   │   ├── controller/
│   │   │   │   └── ProductoController.java
│   │   │   ├── service/
│   │   │   │   ├── ProductoService.java
│   │   │   │   └── ProductoServiceImpl.java
│   │   │   ├── repository/
│   │   │   │   └── ProductoRepository.java
│   │   │   ├── entity/
│   │   │   │   └── Producto.java
│   │   │   ├── dto/
│   │   │   │   ├── ProductoDTO.java
│   │   │   │   └── StockDTO.java
│   │   │   └── exception/
│   │   │       ├── ProductoNotFoundException.java
│   │   │       └── StockInsuficienteException.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│       └── java/com/smartlogix/inventario/
│
├── pom.xml
├── Dockerfile
└── README.md

```

#### **Configuración (application.properties)**

```properties
spring.application.name=inventario-service
server.port=8081

spring.datasource.url=jdbc:mysql://localhost:3306/inventario_db
spring.datasource.username=root
spring.datasource.password=password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

logging.level.com.smartlogix=DEBUG
```

#### **Instrucciones de Instalación y Ejecución**

**Compilación:**
```bash
cd inventario-service
mvn clean package -DskipTests
```

**Ejecución:**
```bash
java -jar target/inventario-service-1.0.0.jar
# Disponible en: http://localhost:8081
```

**Con Docker:**
```bash
docker build -t inventario-service:1.0.0 .
docker run -p 8081:8081 \
  -e DATABASE_URL=jdbc:mysql://mysql:3306/inventario_db \
  inventario-service:1.0.0
```

**Testing:**
```bash
mvn test
# Ejecuta todos los tests unitarios e integración
```

---

### 4.3 Microservicio: Pedidos

**Nombre:** pedidos-service  
**Versión:** 1.0.0  
**Framework:** Spring Boot 3.2.0  
**Java Version:** 17  
**Puerto:** 8082  
**Ubicación:** `/pedidos-service`

#### **Descripción**

El servicio de Pedidos gestiona la creación, procesamiento y seguimiento de órdenes de compra. Interactúa constantemente con el servicio de Inventario para validar disponibilidad y con el de Envíos para coordinar entregas.

#### **Responsabilidades**

1. **Creación de Pedidos:** Recibe y procesa nuevas órdenes
2. **Validación:** Verifica stock con el servicio de Inventario
3. **Gestión de Estados:** Transición de estados (Pendiente → Confirmado → Entregado)
4. **Coordinación:** Comunica con Envíos para logística

#### **Entidades Principales**

```java
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String numeroPedido;
    
    @Column(nullable = false)
    private String cliente;
    
    @Column
    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado; // PENDIENTE, CONFIRMADO, ENTREGADO, CANCELADO
    
    @Column(nullable = false)
    private BigDecimal monto;
    
    @Column
    private Integer cantidad;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEnvio tipoEnvio; // NORMAL, EXPRESS
    
    @Column
    private LocalDateTime fechaCreacion;
    
    @Column
    private LocalDateTime fechaEntrega;
}

public enum EstadoPedido {
    PENDIENTE, CONFIRMADO, ENTREGADO, CANCELADO
}

public enum TipoEnvio {
    NORMAL, EXPRESS
}
```

#### **Endpoints REST**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Lista todos los pedidos |
| GET | `/api/pedidos/{id}` | Obtiene detalles de un pedido |
| POST | `/api/pedidos` | Crea nuevo pedido |
| PUT | `/api/pedidos/{id}` | Actualiza pedido |
| PUT | `/api/pedidos/{id}/estado` | Cambia estado del pedido |
| DELETE | `/api/pedidos/{id}` | Cancela pedido |
| GET | `/api/pedidos/estado/{estado}` | Lista por estado |
| GET | `/api/pedidos/cliente/{cliente}` | Lista por cliente |
| GET | `/api/pedidos/estadisticas` | Estadísticas consolidadas |

#### **Flujo de Creación de Pedido**

```
1. Cliente envía POST /api/pedidos
   {
     "cliente": "Acme Corp",
     "email": "contacto@acme.com",
     "items": [
       {"productoId": 1, "cantidad": 5, "precio": 10000}
     ],
     "tipoEnvio": "EXPRESS"
   }

2. Servicio valida con Inventario
   GET /api/inventario/productos/1
   ✓ Stock disponible
   
3. Crea pedido en BD
   estado = PENDIENTE
   
4. Decrementa stock en Inventario
   POST /api/inventario/productos/1/decrementar
   cantidad = 5
   
5. Crea orden de envío
   POST /api/envios con detalles del pedido
   
6. Retorna pedido creado al cliente
   {
     "id": 123,
     "numeroPedido": "PED-001",
     "estado": "CONFIRMADO",
     "monto": 50000
   }
```

#### **Estructura del Proyecto**

```
pedidos-service/
├── src/
│   ├── main/
│   │   ├── java/com/smartlogix/pedidos/
│   │   │   ├── PedidosServiceApplication.java
│   │   │   ├── controller/
│   │   │   │   └── PedidoController.java
│   │   │   ├── service/
│   │   │   │   ├── PedidoService.java
│   │   │   │   ├── PedidoServiceImpl.java
│   │   │   │   ├── InventarioClient.java
│   │   │   │   └── EnviosClient.java
│   │   │   ├── repository/
│   │   │   │   └── PedidoRepository.java
│   │   │   ├── entity/
│   │   │   │   ├── Pedido.java
│   │   │   │   ├── EstadoPedido.java
│   │   │   │   └── TipoEnvio.java
│   │   │   ├── dto/
│   │   │   │   ├── PedidoDTO.java
│   │   │   │   ├── CrearPedidoDTO.java
│   │   │   │   └── EstadisticasDTO.java
│   │   │   └── exception/
│   │   │       ├── PedidoNotFoundException.java
│   │   │       └── StockInsuficienteException.java
│   │   │
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── pom.xml
├── Dockerfile
└── README.md

```

#### **Configuración (application.properties)**

```properties
spring.application.name=pedidos-service
server.port=8082

spring.datasource.url=jdbc:mysql://localhost:3306/pedidos_db
spring.datasource.username=root
spring.datasource.password=password

spring.jpa.hibernate.ddl-auto=update

# Clientes de otros servicios
inventario.service.url=http://inventario-service:8081
envios.service.url=http://envios-service:8083

logging.level.com.smartlogix=DEBUG
```

#### **Instrucciones de Instalación y Ejecución**

**Compilación:**
```bash
cd pedidos-service
mvn clean package -DskipTests
```

**Ejecución:**
```bash
java -jar target/pedidos-service-1.0.0.jar
# Disponible en: http://localhost:8082
```

**Con Docker:**
```bash
docker build -t pedidos-service:1.0.0 .
docker run -p 8082:8082 \
  -e DATABASE_URL=jdbc:mysql://mysql:3306/pedidos_db \
  pedidos-service:1.0.0
```

---

## 5. ARQUETIPOS MAVEN

### 5.1 Concepto de Arquetipo Maven

Un **arquetipo Maven** es una plantilla de proyecto que proporciona una estructura base, configuración y dependencias comunes. Actúa como "generador de proyectos" que acelera la creación de nuevos módulos manteniendo consistencia.

### 5.2 Arquetipos Utilizados en SmartLogix

#### **1. Spring Boot Starter Parent (Arquetipo Base)**

**ID:** `org.springframework.boot:spring-boot-starter-parent`  
**Versión:** `3.2.0`

**Propósito:**
- Proporciona configuración predefinida de Spring Boot
- Gestiona versiones de dependencias compatibles
- Define plugins de compilación (maven-compiler-plugin, spring-boot-maven-plugin)
- Proporciona propiedades como `java.version`

**Uso en SmartLogix:**
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
    <relativePath/>
</parent>
```

**Beneficios:**
- No es necesario especificar versiones de Spring Boot starters
- Compilación automática con Java 17
- Configuración de plugins optimizada
- Actualizaciones coherentes en el ecosistema Spring

#### **2. Arquetipo Custom: Microservicio Base**

SmartLogix define un patrón interno para nuevos microservicios:

**Estructura base:**
```
microservicio-nuevo/
├── pom.xml                          # Heredar de spring-boot-starter-parent
├── src/main/java/com/smartlogix/{servicio}/
│   ├── {Servicio}Application.java   # Clase @SpringBootApplication
│   ├── controller/                  # Capas REST
│   ├── service/                     # Lógica de negocio
│   ├── repository/                  # Acceso a datos
│   ├── entity/                      # Entidades JPA
│   ├── dto/                         # DTOs (Data Transfer Objects)
│   ├── exception/                   # Excepciones personalizadas
│   └── config/                      # Configuraciones Spring
├── src/main/resources/
│   ├── application.properties
│   └── application-prod.properties
└── Dockerfile                        # Containerización
```

**pom.xml template:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.smartlogix</groupId>
    <artifactId>mi-microservicio</artifactId>
    <version>1.0.0</version>
    <name>Mi Microservicio</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### 5.3 Cómo Crear un Nuevo Microservicio Basado en Arquetipo

**Paso 1: Clonar estructura base**
```bash
# Copiar uno de los microservicios existentes como plantilla
cp -r inventario-service nuevo-servicio
cd nuevo-servicio
```

**Paso 2: Actualizar pom.xml**
```xml
<artifactId>nuevo-servicio</artifactId>
<name>Nuevo Servicio</name>
<description>Descripción del nuevo servicio</description>
```

**Paso 3: Renombrar package**
```bash
# Cambiar de: src/main/java/com/smartlogix/inventario
# A: src/main/java/com/smartlogix/nuevoservicio
```

**Paso 4: Actualizar clase principal**
```java
@SpringBootApplication
public class NuevoServicioApplication {
    public static void main(String[] args) {
        SpringApplication.run(NuevoServicioApplication.class, args);
    }
}
```

**Paso 5: Configurar application.properties**
```properties
spring.application.name=nuevo-servicio
server.port=8084
spring.datasource.url=jdbc:mysql://localhost:3306/nuevo_db
```

**Paso 6: Compilar y probar**
```bash
mvn clean package
java -jar target/nuevo-servicio-1.0.0.jar
```

### 5.4 Dependencias Comunes en Arquetipos

| Dependencia | Propósito | Ámbito |
|-----------|----------|--------|
| spring-boot-starter-web | REST controllers, servidores | compile |
| spring-boot-starter-data-jpa | ORM, consultas a BD | compile |
| spring-boot-starter-security | Autenticación y autorización | compile |
| mysql-connector-java | Driver de MySQL | runtime |
| spring-boot-starter-test | JUnit, Mockito, testing | test |
| lombok | Reducción de boilerplate | compile |
| spring-boot-starter-validation | Validación de datos | compile |

---

## 6. ENLACES A REPOSITORIOS GITHUB

### 6.1 Repositorio Principal

**Nombre:** SmartLogix  
**Enlace:** https://github.com/Xniper21/smartlogix.git  
**Descripción:** Repositorio monorepo que contiene todos los componentes (frontend, BFF, microservicios)

**Rama principal:** `main`  
**Rama de desarrollo:** `develop`

**Contenido:**
- Estructura completa del proyecto
- Todos los microservicios Spring Boot
- Aplicación React frontend
- Configuración Docker Compose
- Documentación del proyecto

---

### 6.2 Repositorio del Frontend

**Nombre:** smartlogix-frontend  
**Enlace:** https://github.com/Xniper21/smartlogix-frontend  
**Descripción:** Componente frontend empaquetado como módulo NPM independiente

**Contenido:**
- Código fuente de React con componentes funcionales
- Package.json con dependencias y scripts
- Configuración de Vite para build
- Tailwind CSS para estilos
- README.md con instrucciones de instalación

**Instalación:**
```bash
npm install
npm run dev      # Desarrollo
npm run build    # Producción
```

---

### 6.3 Repositorio Backend For Frontend (BFF)

**Nombre:** smartlogix-bff-service  
**Enlace:** https://github.com/Xniper21/smartlogix-bff-service  
**Descripción:** Microservicio BFF que agrega datos de otros servicios para el frontend

**Contenido:**
- Código fuente en Spring Boot 3.2.0
- Controllers REST para agregación de datos
- Servicios de llamadas a microservicios
- Entidades JPA y DTOs
- Configuración de MySQL
- Dockerfile para containerización

**Compilación:**
```bash
mvn clean package
java -jar target/bff-service-1.0.0.jar
```

---

### 6.4 Repositorio Microservicio de Inventario

**Nombre:** smartlogix-inventario-service  
**Enlace:** https://github.com/Xniper21/smartlogix-inventario-service  
**Descripción:** Microservicio encargado de gestionar el inventario de productos

**Contenido:**
- CRUD completo de productos
- Control de niveles de stock
- Alertas de productos agotados
- Endpoints REST para consultas de disponibilidad
- Tests unitarios e integración
- Dockerfile para despliegue

**API Endpoints:**
```
GET    /api/inventario/productos
POST   /api/inventario/productos
GET    /api/inventario/productos/{id}
PUT    /api/inventario/productos/{id}
DELETE /api/inventario/productos/{id}
POST   /api/inventario/productos/{id}/decrementar
POST   /api/inventario/productos/{id}/incrementar
GET    /api/inventario/agotados
```

---

### 6.5 Repositorio Microservicio de Pedidos

**Nombre:** smartlogix-pedidos-service  
**Enlace:** https://github.com/Xniper21/smartlogix-pedidos-service  
**Descripción:** Microservicio para crear, procesar y rastrear órdenes de compra

**Contenido:**
- Creación y gestión de pedidos
- Validación con servicio de Inventario
- Coordinación con servicio de Envíos
- Gestión de estados (Pendiente, Confirmado, Entregado)
- Endpoints REST para operaciones CRUD
- Estadísticas y reportes de pedidos

**API Endpoints:**
```
GET    /api/pedidos
POST   /api/pedidos
GET    /api/pedidos/{id}
PUT    /api/pedidos/{id}
PUT    /api/pedidos/{id}/estado
DELETE /api/pedidos/{id}
GET    /api/pedidos/estado/{estado}
GET    /api/pedidos/estadisticas
```

---

### 6.6 Repositorio Microservicio de Envíos (Adicional)

**Nombre:** smartlogix-envios-service  
**Enlace:** https://github.com/Xniper21/smartlogix-envios-service  
**Descripción:** Microservicio para gestión de envíos y logistics

**Contenido:**
- Creación de órdenes de envío
- Seguimiento de entregas
- Diferentes tipos de envío (Normal, Express)
- Integración con proveedores de logística
- Notificaciones a clientes

---

## 7. ESTRUCTURA COMPLETA DEL ENTREGABLE

```
SmartLogix-Evaluacion-Parcial2/
│
├── DOCUMENTACION/
│   ├── 01_ANALISIS_PATRONES_ARQUETIPOS.pdf
│   │   └── Contiene análisis detallado de patrones seleccionados
│   │
│   ├── 02_PLAN_BRANCHING_GIT_FLOW.pdf
│   │   └── Estrategia de branching y flujos de trabajo
│   │
│   ├── 03_INSTRUCCIONES_INSTALACION.pdf
│   │   └── Guía paso a paso para instalar y ejecutar todo
│   │
│   └── 04_ARQUITECTURA_GENERAL.pdf
│       └── Diagramas y explicación de la arquitectura
│
├── COMPONENTES_FRONTEND/
│   ├── frontend/
│   │   ├── package.json              ✓ NPM package
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── ...
│   │   ├── README.md                 ✓ Instrucciones
│   │   └── Dockerfile                ✓ Containerización
│   │
│   └── frontend-README.md
│       └── Guía de instalación y uso
│
├── COMPONENTES_BACKEND/
│   ├── bff-service/
│   │   ├── pom.xml                   ✓ Arquetipo Maven
│   │   ├── src/
│   │   ├── README.md                 ✓ Instrucciones
│   │   └── Dockerfile                ✓ Containerización
│   │
│   ├── inventario-service/
│   │   ├── pom.xml                   ✓ Arquetipo Maven
│   │   ├── src/
│   │   ├── README.md                 ✓ Instrucciones
│   │   └── Dockerfile                ✓ Containerización
│   │
│   ├── pedidos-service/
│   │   ├── pom.xml                   ✓ Arquetipo Maven
│   │   ├── src/
│   │   ├── README.md                 ✓ Instrucciones
│   │   └── Dockerfile                ✓ Containerización
│   │
│   └── envios-service/
│       ├── pom.xml                   ✓ Arquetipo Maven
│       ├── src/
│       ├── README.md                 ✓ Instrucciones
│       └── Dockerfile                ✓ Containerización
│
├── ARQUETIPOS_MAVEN/
│   ├── GUIA_ARQUETIPOS.md            ✓ Guía de uso
│   ├── pom-template.xml              ✓ Template base
│   └── estructura-base.txt            ✓ Estructura recomendada
│
├── repositorios.txt                   ✓ Enlaces a GitHub
│
└── docker-compose.yml                 ✓ Stack completo
    └── Para levantar todos los servicios

```

---

## 8. INSTRUCCIONES GENERALES DE INSTALACIÓN Y EJECUCIÓN

### 8.1 Requisitos Previos

- **Sistema Operativo:** Windows, macOS o Linux
- **Java:** JDK 17 o superior
- **Maven:** 3.8.0 o superior
- **Node.js:** 18.0.0 o superior (con npm)
- **MySQL:** 8.0 o superior
- **Docker & Docker Compose:** (Opcional pero recomendado)
- **Git:** Para clonar repositorios

### 8.2 Instalación Paso a Paso

#### **Opción 1: Con Docker Compose (Recomendado)**

**Paso 1: Clonar repositorio**
```bash
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix
```

**Paso 2: Compilar todos los servicios**
```bash
# En Windows (desde la raíz del proyecto)
cd api-gateway && ..\mvnw.cmd clean package && cd ..
cd bff-service && ..\mvnw.cmd clean package && cd ..
cd inventario-service && ..\mvnw.cmd clean package && cd ..
cd pedidos-service && ..\mvnw.cmd clean package && cd ..
cd envios-service && ..\mvnw.cmd clean package && cd ..

# En Linux/macOS
cd api-gateway && ../mvnw clean package && cd ..
cd bff-service && ../mvnw clean package && cd ..
cd inventario-service && ../mvnw clean package && cd ..
cd pedidos-service && ../mvnw clean package && cd ..
cd envios-service && ../mvnw clean package && cd ..
```

**Paso 3: Levantar stack completo**
```bash
docker-compose up --build
```

**Paso 4: Verificar servicios**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- BFF: http://localhost:8090
- Inventario: http://localhost:8081
- Pedidos: http://localhost:8082
- MySQL: localhost:3306

#### **Opción 2: Ejecución Local Sin Docker**

**Paso 1: Instalar dependencias de frontend**
```bash
cd frontend
npm install
```

**Paso 2: Crear bases de datos MySQL**
```sql
CREATE DATABASE bff_db CHARACTER SET utf8mb4;
CREATE DATABASE inventario_db CHARACTER SET utf8mb4;
CREATE DATABASE pedidos_db CHARACTER SET utf8mb4;
CREATE DATABASE envios_db CHARACTER SET utf8mb4;
```

**Paso 3: Iniciar servicios backend (en terminales separadas)**
```bash
# Terminal 1: API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 2: BFF
cd bff-service
mvn spring-boot:run

# Terminal 3: Inventario
cd inventario-service
mvn spring-boot:run

# Terminal 4: Pedidos
cd pedidos-service
mvn spring-boot:run

# Terminal 5: Envíos
cd envios-service
mvn spring-boot:run
```

**Paso 4: Iniciar frontend (Terminal 6)**
```bash
cd frontend
npm run dev
```

---

## 9. RESUMEN DE CUMPLIMIENTO

### ✅ Requisitos Cumplidos

| Requisito | Estado | Detalles |
|-----------|--------|---------|
| **Componentes Frontend NPM** | ✅ | Package.json con React, Vite, scripts |
| **Backend For Frontend (BFF)** | ✅ | Servicio Spring Boot en puerto 8090 |
| **2+ Microservicios** | ✅ | Inventario (8081), Pedidos (8082), Envíos (8083) |
| **Arquetipos Maven** | ✅ | Spring Boot Starter Parent + plantilla custom |
| **Documentación de Patrones** | ✅ | Análisis completo en este documento |
| **Plan de Branching** | ✅ | Git Flow detallado en Sección 2 |
| **README Frontend** | ✅ | Instrucciones de instalación incluidas |
| **README BFF** | ✅ | Instrucciones de instalación incluidas |
| **README Microservicios** | ✅ | Instrucciones para cada servicio |
| **Repositorios GitHub** | ✅ | Enlaces incluidos en Sección 6 |
| **Versionado en GitHub** | ✅ | Todos los componentes en repositorios |
| **Docker Compose** | ✅ | Stack completo para desplegar |
| **Documentación Técnica** | ✅ | Detallada en todas las secciones |

### 📦 Archivo Comprimido

Este informe debe acompañarse de un archivo ZIP que contenga:
- Este documento (INFORME_EVALUACION.pdf)
- Carpeta con código fuente del frontend
- Carpeta con código fuente de cada microservicio
- Archivo docker-compose.yml
- Archivo repositorios.txt con enlaces
- READMEs de cada componente
- Documentación de patrones y branching

### 🚀 Próximos Pasos

1. Convertir este documento a PDF
2. Crear archivo ZIP con todos los componentes
3. Verificar que todos los repositorios estén públicos en GitHub
4. Compartir enlace a repositorios en blackboard
5. Subir archivo ZIP a blackboard

---

**Documento Preparado Para Evaluación Parcial N°2**  
**Fecha:** Mayo 2026  
**Equipo:** SmartLogix Development Team
