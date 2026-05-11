# 📋 INSTRUCCIONES DE INSTALACIÓN Y DESPLIEGUE
## SmartLogix - Evaluación Parcial N°2

---

## 🎯 Guía Rápida

### Opción 1: Docker Compose (Recomendado - 5 minutos)

```bash
# 1. Clonar
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix

# 2. Compilar servicios
cd api-gateway && mvnw clean package && cd ..
cd bff-service && mvnw clean package && cd ..
cd inventario-service && mvnw clean package && cd ..
cd pedidos-service && mvnw clean package && cd ..
cd envios-service && mvnw clean package && cd ..

# 3. Levantar stack
docker-compose up --build

# 4. Acceder
Frontend: http://localhost:3000
API: http://localhost:8000
```

### Opción 2: Local sin Docker (10 minutos)

```bash
# Crear bases de datos
mysql -u root -p
CREATE DATABASE bff_db;
CREATE DATABASE inventario_db;
CREATE DATABASE pedidos_db;
CREATE DATABASE envios_db;

# Terminal 1: API Gateway
cd api-gateway && mvn spring-boot:run

# Terminal 2: BFF
cd bff-service && mvn spring-boot:run

# Terminal 3: Inventario
cd inventario-service && mvn spring-boot:run

# Terminal 4: Pedidos
cd pedidos-service && mvn spring-boot:run

# Terminal 5: Envíos
cd envios-service && mvn spring-boot:run

# Terminal 6: Frontend
cd frontend && npm install && npm run dev
```

---

## 🐳 DESPLIEGUE CON DOCKER COMPOSE (Detallado)

### Paso 1: Clonar Repositorio

```bash
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix
```

### Paso 2: Verificar Docker

```bash
# Docker
docker --version
# Debe retornar: Docker version 20.10.0 o superior

# Docker Compose
docker-compose --version
# Debe retornar: Docker Compose version 2.0.0 o superior
```

Si no tiene Docker, descargarlo desde: https://www.docker.com/products/docker-desktop

### Paso 3: Compilar Servicios Java

**En Windows (PowerShell o CMD):**
```batch
cd api-gateway
mvnw.cmd clean package -DskipTests
cd ..

cd bff-service
mvnw.cmd clean package -DskipTests
cd ..

cd inventario-service
mvnw.cmd clean package -DskipTests
cd ..

cd pedidos-service
mvnw.cmd clean package -DskipTests
cd ..

cd envios-service
mvnw.cmd clean package -DskipTests
cd ..
```

**En Linux/macOS:**
```bash
cd api-gateway && ./mvnw clean package -DskipTests && cd ..
cd bff-service && ./mvnw clean package -DskipTests && cd ..
cd inventario-service && ./mvnw clean package -DskipTests && cd ..
cd pedidos-service && ./mvnw clean package -DskipTests && cd ..
cd envios-service && ./mvnw clean package -DskipTests && cd ..
```

**Salida esperada:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: ~25 seconds per service
```

### Paso 4: Levantar Stack

```bash
docker-compose up --build
```

**Primera ejecución:** ~2-3 minutos (descarga de imágenes)
**Ejecuciones posteriores:** ~30 segundos

**Verificar que esté funcionando:**
```
... [INFO] Tomcat started on port(s): 3000
... [INFO] Tomcat started on port(s): 8000
... [INFO] Tomcat started on port(s): 8090
```

### Paso 5: Acceder a la Aplicación

| Componente | URL | Descripción |
|-----------|-----|-------------|
| Frontend | http://localhost:3000 | Interfaz de usuario |
| API Gateway | http://localhost:8000 | Punto de entrada API |
| BFF | http://localhost:8090/api/dashboard/stats | Backend For Frontend |
| Inventario | http://localhost:8081/api/inventario/productos | Microservicio |
| Pedidos | http://localhost:8082/api/pedidos | Microservicio |
| Envíos | http://localhost:8083/api/envios | Microservicio |

### Paso 6: Probar Endpoints (con curl)

```bash
# Dashboard stats
curl http://localhost:8000/api/dashboard/stats

# Listar productos
curl http://localhost:8000/api/inventario/productos

# Listar pedidos
curl http://localhost:8000/api/pedidos
```

### Paso 7: Detener Servicios

```bash
docker-compose down
```

---

## 💻 INSTALACIÓN LOCAL SIN DOCKER

### Requisitos Previos

```bash
# Verificar Java 17
java -version
# Debe retornar: openjdk version "17.x.x"

# Verificar Maven
mvn -version
# Debe retornar: Apache Maven 3.8.0 o superior

# Verificar Node.js
node --version
npm --version
# Debe retornar: v18.0.0 o superior

# Verificar MySQL
mysql --version
# Debe retornar: mysql  Ver 8.0.33 o superior
```

### Paso 1: MySQL - Crear Bases de Datos

```bash
mysql -u root -p
```

```sql
-- Crear bases de datos
CREATE DATABASE bff_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE inventario_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE pedidos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE envios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar
SHOW DATABASES;
-- Debe mostrar las 4 bases de datos creadas

EXIT;
```

### Paso 2: Compilar Servicios Backend

**Navegar a cada servicio y compilar:**

```bash
# 1. API Gateway
cd api-gateway
mvn clean package -DskipTests
cd ..

# 2. BFF Service
cd bff-service
mvn clean package -DskipTests
cd ..

# 3. Inventario Service
cd inventario-service
mvn clean package -DskipTests
cd ..

# 4. Pedidos Service
cd pedidos-service
mvn clean package -DskipTests
cd ..

# 5. Envíos Service
cd envios-service
mvn clean package -DskipTests
cd ..
```

**Resultado esperado en cada carpeta:**
```
target/
├── api-gateway-1.0.0.jar
├── bff-service-1.0.0.jar
├── inventario-service-1.0.0.jar
├── pedidos-service-1.0.0.jar
└── envios-service-1.0.0.jar
```

### Paso 3: Iniciar Servicios Backend

**Abrir 5 terminales separadas:**

**Terminal 1 - API Gateway:**
```bash
cd api-gateway
java -jar target/api-gateway-1.0.0.jar

# Esperar mensaje:
# ... Tomcat started on port(s): 8000
```

**Terminal 2 - BFF Service:**
```bash
cd bff-service
java -jar target/bff-service-1.0.0.jar

# Esperar mensaje:
# ... Tomcat started on port(s): 8090
```

**Terminal 3 - Inventario Service:**
```bash
cd inventario-service
java -jar target/inventario-service-1.0.0.jar

# Esperar mensaje:
# ... Tomcat started on port(s): 8081
```

**Terminal 4 - Pedidos Service:**
```bash
cd pedidos-service
java -jar target/pedidos-service-1.0.0.jar

# Esperar mensaje:
# ... Tomcat started on port(s): 8082
```

**Terminal 5 - Envíos Service:**
```bash
cd envios-service
java -jar target/envios-service-1.0.0.jar

# Esperar mensaje:
# ... Tomcat started on port(s): 8083
```

### Paso 4: Instalar y Ejecutar Frontend

**En una nueva terminal:**
```bash
cd frontend
npm install

# Esperar instalación (~2 minutos en primera vez)

npm run dev

# Esperar mensaje:
# ➜  Local:   http://localhost:3000/
```

### Paso 5: Acceder a Aplicación

Abrir navegador en: **http://localhost:3000**

---

## 🔍 VERIFICACIÓN DE SERVICIOS

### Verificar que todos estén corriendo

```bash
# Script para verificar (Linux/Mac)
for port in 3000 8000 8090 8081 8082 8083; do
  echo "Puerto $port:"
  curl -s http://localhost:$port/actuator/health 2>/dev/null | grep -q "UP" && echo "✓ Funcionando" || echo "✗ No disponible"
done
```

### Verificar endpoints principales

```bash
# Dashboard stats (más importante)
curl http://localhost:8000/api/dashboard/stats
# Debe retornar JSON con estadísticas

# Listar productos
curl http://localhost:8000/api/inventario/productos
# Debe retornar array de productos

# Listar pedidos
curl http://localhost:8000/api/pedidos
# Debe retornar array de pedidos (vacío al inicio)
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Puerto ya en uso

**Problema:** `Address already in use`

**Solución:**

Windows:
```powershell
netstat -ano | findstr :8090
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -i :8090
kill -9 <PID>
```

### MySQL no se conecta

**Problema:** `Connection refused`

**Verificar:**
```bash
# ¿MySQL está corriendo?
mysql -u root -p -e "SELECT 1"
# Debe retornar: 1

# ¿Base de datos existe?
mysql -u root -p -e "SHOW DATABASES"
# Debe mostrar las 4 bases
```

### Compilación falla

**Problema:** `BUILD FAILURE`

**Soluciones:**
```bash
# 1. Limpiar Maven cache
mvn clean install

# 2. Verificar Java version
java -version  # Debe ser 17

# 3. Verificar Maven version
mvn -version  # Debe ser 3.8.0+

# 4. Reinstalar dependencias
rm -rf ~/.m2/repository/
mvn clean install
```

### Frontend no carga

**Problema:** `http://localhost:3000` no responde

**Verificar:**
```bash
# ¿Node está instalado?
node --version

# ¿Puerto 3000 está libre?
lsof -i :3000

# ¿npm install funcionó?
npm list react react-dom

# Reiniciar servidor
npm run dev
```

### Conexión entre servicios falla

**Problema:** Error en logs del BFF: `Cannot connect to inventario-service`

**Causa:** Los servicios no se pueden alcanzar entre sí.

**Solución:**
```bash
# Si usas Docker Compose:
# - Asegúrate de que todos están en la misma red
docker network ls
docker inspect smartlogix_default  # Ver contenedores conectados

# Si es local sin Docker:
# - Cambiar URLs en application.properties:
#   De: http://inventario-service:8081
#   A: http://localhost:8081
```

---

## 📊 MONITOREO EN TIEMPO REAL

### Ver logs de un servicio

Con Docker:
```bash
docker logs -f smartlogix-bff-service-1
docker logs -f smartlogix-inventario-service-1
```

Local (desde la carpeta):
```bash
tail -f logs/application.log
```

### Ver estado de contenedores

```bash
docker ps
# Muestra todos los servicios corriendo

docker ps -a
# Muestra servicios corriendo y detenidos

docker stats
# Muestra CPU, memoria y red en tiempo real
```

---

## 🧪 TESTING DE ENDPOINTS

### Usar Postman o curl

**Crear un pedido:**
```bash
curl -X POST http://localhost:8000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "Test Cliente",
    "email": "test@example.com",
    "items": [
      {"productoId": 1, "cantidad": 5}
    ],
    "tipoEnvio": "EXPRESS"
  }'
```

**Obtener estadísticas:**
```bash
curl http://localhost:8000/api/dashboard/stats | python -m json.tool
```

**Crear producto:**
```bash
curl -X POST http://localhost:8000/api/inventario/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Test",
    "precio": 50000,
    "stock": 100,
    "stockMinimo": 10
  }'
```

---

## 🚀 DEPLOYMENT A PRODUCCIÓN

### Preparar para producción

**1. Cambiar a ambiente production:**
```bash
# En cada servicio, cambiar application.properties
spring.profiles.active=prod
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USER}
logging.level.root=WARN
```

**2. Compilar con optimizaciones:**
```bash
mvn clean package -P production
```

**3. Usar Docker:** (ver docker-compose.yml)

**4. Configurar variables de entorno:**
```bash
export DATABASE_URL=jdbc:mysql://prod-db:3306/bff_db
export DATABASE_USER=prod_user
export DATABASE_PASSWORD=secure_password
export INVENTARIO_SERVICE_URL=http://inventario-prod:8081
```

### Desplegable en Kubernetes (Opcional)

Ver archivos: `k8s/deployment.yaml`, `k8s/service.yaml`

---

## ✅ CHECKLIST DE VERIFICACIÓN

```
Antes de considerar el despliegue completado:

[ ] Las 5 terminales de servicios backend muestran "Tomcat started"
[ ] El frontend carga en http://localhost:3000
[ ] Dashboard muestra estadísticas (no está vacío)
[ ] Puedo crear un nuevo pedido
[ ] Puedo listar productos del inventario
[ ] No hay errores en la consola
[ ] MySQL tiene los datos
[ ] Docker Compose levanta todo en 1 comando (si lo usas)
```

---

## 📞 SOPORTE

**Si algo no funciona:**

1. Verificar logs: `docker logs <servicio>` o terminal
2. Revisar puertos: asegúrate que no estén ocupados
3. Revisar URLs en application.properties
4. Reiniciar servicios
5. Limpiar caché: `mvn clean`

**Recursos:**
- README.md en cada carpeta
- ARQUITECTURA.md
- DECISIONES_ARQUITECTONICAS.md
- GIT_FLOW.md

---

**¡Listo! La aplicación está lista para usar. Accede a http://localhost:3000**

Última actualización: Mayo 2026
