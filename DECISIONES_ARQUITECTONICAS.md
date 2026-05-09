# SmartLogix - Decisiones Arquitectónicas

## 📋 Documento de Justificación de Patrones y Decisiones Técnicas

### 1. Arquitectura de Microservicios

**Decisión:** Implementar arquitectura de microservicios en lugar de monolito.

**Justificación:**
- ✅ **Escalabilidad independiente**: Cada servicio puede escalar según su demanda
- ✅ **Deployment independiente**: Cambios en un servicio no requieren redeploy global
- ✅ **Resilencia**: Fallo de un servicio no afecta los demás
- ✅ **Flexibilidad tecnológica**: Cada equipo puede usar tecnologías diferentes
- ✅ **Desacoplamiento**: Cambios en un servicio no requieren cambios en otros

**Evidencia del caso de uso:**
- SmartLogix necesita sincronización en tiempo real → requiere independencia
- Futuras integraciones con marketplace/transportistas → cada integración es un servicio
- Escalado diferenciado: Inventario puede requerir más replicas que Pedidos

---

### 2. API Gateway

**Decisión:** Usar Spring Cloud Gateway como punto de entrada único.

**Justificación:**
- ✅ **Punto de control centralizado**: Seguridad, autorización en un lugar
- ✅ **Enrutamiento dinámico**: Redirige solicitudes a servicios correctos
- ✅ **Manejo centralizado de CORS**: No repetir en cada servicio
- ✅ **Rate limiting**: Protege servicios de sobrecarga
- ✅ **Monitoreo centralizado**: Trazas y logs en un punto

**Alternativas consideradas:**
- Nginx: Menos integración con Spring, requiere configuración adicional
- Kong: Más complejo, overkill para esta fase inicial

**Impacto:**
- Frontend hace solicitudes a un puerto único (8000)
- Fácil agregar nuevos servicios sin cambiar frontend

---

### 3. BFF (Backend For Frontend)

**Decisión:** Crear servicio BFF específicamente para necesidades del frontend.

**Justificación:**
- ✅ **Optimización de respuestas**: Retorna solo datos necesarios
- ✅ **Agregación de datos**: Reduce llamadas N+1 del frontend
- ✅ **Lógica de presentación**: Transformaciones sin afectar servicios core
- ✅ **Caché de datos frecuentes**: Mejora performance

**Flujo de ventaja:**

Sin BFF (Frontend → Múltiples servicios):
```
Frontend → Inventario Service → MySQL
Frontend → Pedidos Service → MySQL
Frontend → Envíos Service → MySQL
(Múltiples viajes de red, agregación en frontend)
```

Con BFF (Frontend → BFF → Servicios):
```
Frontend → BFF → Inventario Service → MySQL
         → Pedidos Service → MySQL
         → Envíos Service → MySQL
(BFF agrega datos, retorna completo al frontend)
```

---

### 4. Repository Pattern

**Decisión:** Usar JpaRepository en lugar de acceso directo a BD.

**Justificación:**
- ✅ **Abstracción de datos**: Cambiar BD sin tocar lógica de negocio
- ✅ **Testing**: Fácil mockear con Spring Data
- ✅ **CRUD estándar**: Operaciones básicas gratis
- ✅ **Queries personalizadas**: Soporte para consultas complejas

**Ejemplo:**
```java
// Con Repository Pattern (BUENO)
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByStockGreaterThan(int stock);
}

// Sin patrón (MALO)
public class ProductoDAO {
    private DataSource dataSource;
    // SQL manual, más mantenimiento
}
```

**Ventaja:** Si mañana cambias de MySQL a PostgreSQL, solo cambias el driver.

---

### 5. Factory Method Pattern

**Decisión:** Usar Factory para crear tipos de envío.

**Justificación:**
- ✅ **Creación flexible**: Nuevos tipos sin modificar código existente
- ✅ **Principio Open/Closed**: Abierto para extensión, cerrado para modificación
- ✅ **Lógica centralizada**: Un lugar para decisiones de creación

**Implementación:**
```java
public class EnvioFactory {
    public static Envio crearEnvio(String tipo) {
        if ("express".equalsIgnoreCase(tipo)) {
            return new EnvioExpress();
        } else if ("internacional".equalsIgnoreCase(tipo)) {
            return new EnvioInternacional(); // Fácil agregar
        }
        return new EnvioNormal();
    }
}
```

**Extensibilidad futura:**
```java
// Sin tocar factory, simplemente agregar:
return new EnvioDomestico();
return new EnvioRefrigerado();
```

---

### 6. Circuit Breaker Pattern

**Decisión:** Implementar Circuit Breaker para comunicación entre servicios.

**Justificación:**
- ✅ **Resiliencia**: Evita cascada de fallos
- ✅ **Degradación elegante**: Retorna valor por defecto en lugar de error
- ✅ **Recuperación automática**: Reintentos después de timeout

**Escenario de fallo:**

Sin Circuit Breaker:
```
1. Pedido Service llama Inventario Service
2. Inventario Service falla
3. Pedido Service espera timeout (30s)
4. Cliente espera 30s
5. Timeout propaga → otros clientes esperan
6. Cascada de fallos
```

Con Circuit Breaker:
```
1. Pedido Service llama Inventario Service
2. Inventario Service falla
3. Circuit Breaker intercede después de 2-3 intentos
4. Retorna false (no hay stock disponible)
5. Cliente obtiene respuesta inmediata
6. Sin cascada de fallos
```

**Implementación:**
```java
public boolean verificarStock(Long id, int cantidad) {
    try {
        return restTemplate.getForObject(url, Boolean.class);
    } catch (Exception e) {
        // Circuit breaker: retorna false en lugar de lanzar excepción
        return false;
    }
}
```

---

### 7. JPA con MySQL

**Decisión:** Usar JPA/Hibernate como ORM con MySQL.

**Justificación:**
- ✅ **Mapeo objeto-relacional**: Código más limpio, menos SQL
- ✅ **Portabilidad**: Cambiar BD con cambio mínimo de configuración
- ✅ **Performance**: Hibernate optimiza queries, lazy loading
- ✅ **Integración Spring**: Automático con Spring Data

**Configuración:**
```properties
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
```

**Alternativas rechazadas:**
- JDBC puro: Más control pero más código SQL
- NoSQL: No encaja bien con relaciones de datos (Producto-Pedido)

---

### 8. Bases de Datos Separadas por Servicio

**Decisión:** Cada microservicio tiene su propia base de datos.

**Justificación:**
- ✅ **Escalabilidad independiente**: Inventario puede tener BD más grande
- ✅ **Seguridad**: Un servicio no accede datos de otro
- ✅ **Consistency local**: Cada servicio controla su propia consistencia
- ✅ **Migración independiente**: Cambios de schema sin afectar otros servicios

**Patrón Database per Service:**

```
Inventario Service ────→ inventario_db (usuarios: inventario_user)
Pedidos Service ────────→ pedidos_db (usuarios: pedidos_user)
Envíos Service ─────────→ envios_db (usuarios: envios_user)
```

**Vs. Base de datos compartida (MALO):**
```
Todos los servicios → monolith_db
(Acoplamiento, escalado conjunto, single point of failure)
```

---

### 9. React + Vite para Frontend

**Decisión:** Usar React con Vite en lugar de Angular o Vue.

**Justificación:**
- ✅ **Popularidad y comunidad**: Más recursos, librerías
- ✅ **Vite**: Build rápido, desarrollo ágil (vs. Create React App)
- ✅ **Componentes reutilizables**: Librería de componentes NPM
- ✅ **React Router**: Navegación declarativa
- ✅ **Axios**: HTTP client simple y poderoso

**Performance:**
- Vite: Build inicial en <1s (vs. Create React App 10-30s)
- HMR (Hot Module Replacement) instant
- Tree shaking automático

---

### 10. Docker y Docker Compose

**Decisión:** Containerizar servicios y usar Docker Compose para orquestación local.

**Justificación:**
- ✅ **Consistencia**: "Funciona en mi máquina" → funciona en producción
- ✅ **Facilidad de setup**: `docker-compose up` vs. instalar 6 servicios
- ✅ **Aislamiento**: Cada servicio en contenedor independiente
- ✅ **Escalabilidad**: Fácil pasar a Kubernetes

**Dockerfile estrategia multi-stage (Frontend):**
```dockerfile
# Stage 1: Build
FROM node:18 AS builder
RUN npm run build

# Stage 2: Runtime
FROM node:18
COPY --from=builder /app/dist ./dist
CMD ["serve", "-s", "dist"]
```

Beneficio: Imagen final pequeña (sin node_modules del build)

---

### 11. Lombok para Reducción de Boilerplate

**Decisión:** Usar Lombok para generación automática de getters/setters.

**Justificación:**
- ✅ **Código limpio**: Menos líneas, más legibilidad
- ✅ **Mantenibilidad**: Cambios automáticos con `@Data`
- ✅ **Convención**: Patrón estándar en comunidad Spring

**Comparación:**

```java
// Con Lombok (5 líneas)
@Data
@Entity
public class Producto {
    private Long id;
    private String nombre;
}

// Sin Lombok (20+ líneas)
@Entity
public class Producto {
    private Long id;
    private String nombre;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    // ... toString, equals, hashCode
}
```

---

### 12. Versionamiento Semántico

**Decisión:** Usar versión 1.0.0 para lanzamiento inicial.

**Justificación:**
- ✅ **Comunicar estabilidad**: 1.0.0 indica MVP funcional
- ✅ **Compatibilidad**: Futuras versiones 1.1.0, 2.0.0 bien definidas

**Estrategia Git Flow (recomendada):**
```
main (v1.0.0 deployado)
    ↓
release/1.1.0 (preparación)
    ↓
develop (desarrollo activo)
    ↓
feature/login-oauth (nuevas características)
```

---

## 📊 Matriz de Decisiones

| Componente | Opción Elegida | Alternativas | Razón |
|------------|----------------|--------------|-------|
| Arquitectura | Microservicios | Monolito | Escalabilidad independiente |
| API Gateway | Spring Cloud | Nginx/Kong | Integración Spring |
| ORM | JPA/Hibernate | JDBC/QueryDSL | Estándar de facto |
| Frontend | React+Vite | Angular/Vue | Comunidad, performance |
| BD | MySQL | PostgreSQL/NoSQL | Requisitos del caso |
| Containerización | Docker | VirtualBox | Estándar industria |
| Patrón BD | Separada por servicio | Compartida | Desacoplamiento |

---

## 🎯 Criterios de Éxito

La arquitectura será exitosa si:

1. ✅ **Escalabilidad**: Cada servicio puede escalar independientemente
2. ✅ **Mantenibilidad**: Nuevos desarrolladores entienden estructura en <1 día
3. ✅ **Performance**: Latencia <500ms en 95% de solicitudes
4. ✅ **Resiliencia**: Fallo de un servicio no afecta los demás
5. ✅ **Extensibilidad**: Agregar nuevo servicio sin cambiar existentes
6. ✅ **Testabilidad**: Cobertura >80% de tests automáticos
7. ✅ **Deployment**: Release en <5 minutos con CI/CD

---

## 🔮 Evolución Futura

### Fase 2 (v1.5)
- [ ] Autenticación con OAuth2/JWT
- [ ] RabbitMQ para operaciones asincrónicas
- [ ] Redis para caché distribuido
- [ ] Logging centralizado (ELK Stack)

### Fase 3 (v2.0)
- [ ] Kubernetes para orquestación
- [ ] Event sourcing para auditoría
- [ ] GraphQL como alternativa a REST
- [ ] Machine Learning para predicción de demanda

### Fase 4 (v3.0)
- [ ] Integración con marketplaces (Amazon, Mercado Libre)
- [ ] APIs para transportistas
- [ ] Mobile app con React Native
- [ ] Analytics en tiempo real

---

## 📚 Documentos Relacionados

- [README.md](./README.md) - Descripción general del proyecto
- [ARQUITECTURA.md](./ARQUITECTURA.md) - Diagrama técnico
- [INSTRUCCIONES.md](./INSTRUCCIONES.md) - Guía de ejecución

---

**Documento creado:** Abril 2026
**Versión:** 1.0
**Estado:** Aprobado para implementación
