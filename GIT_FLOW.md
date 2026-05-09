# SmartLogix - Git Flow Setup

## 🚀 Repositorio en GitHub
```
https://github.com/Xniper21/smartlogix.git
```

## 📋 Estructura de Ramas (Git Flow)

### Ramas Principales
- **main**: Rama de producción (releases estables)
- **develop**: Rama de desarrollo (integración de features)

### Ramas de Soporte
- **release**: Preparación de releases
- **hotfix**: Correcciones críticas en producción
- **fix**: Correcciones de bugs

## 📥 Clonar el Repositorio

```bash
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix
```

## 🏗️ Levantar la Aplicación

### Con Docker Compose (Recomendado)

```bash
# Compilar todos los servicios
cd api-gateway && ..\mvnw.cmd clean package && cd ..
cd bff-service && ..\mvnw.cmd clean package && cd ..
cd inventario-service && ..\mvnw.cmd clean package && cd ..
cd pedidos-service && ..\mvnw.cmd clean package && cd ..
cd envios-service && ..\mvnw.cmd clean package && cd ..

# Levantar todos los servicios
docker-compose up --build
```

El frontend estará disponible en: **http://localhost:3000**

### Sin Docker (Ejecución local)

Ver [INSTRUCCIONES.md](INSTRUCCIONES.md) para detalles completos.

## 🔄 Workflow de Git Flow

### Crear Feature (en develop)
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-feature
# ... hacer cambios ...
git add .
git commit -m "feat: descripción del feature"
git push -u origin feature/nombre-feature
# Crear Pull Request a develop en GitHub
```

### Fix (Bug fixes en develop)
```bash
git checkout develop
git checkout -b fix/nombre-fix
# ... hacer cambios ...
git commit -m "fix: descripción del fix"
git push -u origin fix/nombre-fix
# Crear Pull Request a develop en GitHub
```

### Release (Preparar release)
```bash
git checkout -b release/v1.0.0 develop
# Hacer cambios de versión si es necesario
git commit -m "release: v1.0.0"
git push -u origin release/v1.0.0
# Crear Pull Request a main y develop en GitHub
# Después de merge, crear tag: git tag -a v1.0.0 -m "Version 1.0.0"
```

### Hotfix (Corrección urgente en producción)
```bash
git checkout -b hotfix/v1.0.1 main
# ... hacer corrección ...
git commit -m "hotfix: descripción del hotfix"
git push -u origin hotfix/v1.0.1
# Crear Pull Request a main y develop en GitHub
```

## 📚 Archivos Principales

```
smartlogix/
├── docker-compose.yml          # Configuración Docker
├── pom.xml                     # Maven parent POM
├── init-db.sql                 # Inicialización BD
├── README.md                   # Documentación principal
├── INSTRUCCIONES.md            # Instrucciones de ejecución
├── ARQUITECTURA.md             # Arquitectura del sistema
├── api-gateway/                # API Gateway (Puerto 8000)
├── bff-service/                # BFF Service (Puerto 8090)
├── inventario-service/         # Inventario Service (Puerto 8081)
├── pedidos-service/            # Pedidos Service (Puerto 8082)
├── envios-service/             # Envíos Service (Puerto 8083)
└── frontend/                   # Frontend React (Puerto 3000)
```

## 🔐 Credenciales Base de Datos

```
Usuario: root
Contraseña: smartlogix123
Host: localhost:3306
```

## ✅ Estado del Repositorio

- Rama principal: **main**
- Rama de desarrollo: **develop**
- Total de ramas: 5 (main, develop, release, hotfix, fix)
- Primer commit: Contiene estructura completa lista para deployar

## 📝 Notas

- Solo se han subido archivos necesarios (excluidos node_modules, target, .mvn, etc)
- El repositorio está limpio y listo para clonar y ejecutar
- Todos los microservicios están dockerizados
- El frontend usa Vite para desarrollo rápido

---

**Configuración realizada:** 08/05/2026
**Usuario:** Xniper21
**Correo:** ignacionico322@gmail.com
