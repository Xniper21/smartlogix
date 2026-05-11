# SmartLogix Frontend - Componente NPM

## 📦 Descripción

Aplicación React moderna y responsiva para gestión logística. Componente frontend empaquetado como módulo NPM independiente, desarrollado con las tecnologías más actuales de la industria.

**Versión:** 1.0.0  
**Framework:** React 18.2.0  
**Build Tool:** Vite 5.0.0  
**Estilos:** Tailwind CSS 3.4.4  
**Puerto:** 3000

---

## 🎯 Características Principales

✅ **Dashboard Interactivo**
- Gráficos en tiempo real con Recharts
- Estadísticas consolidadas de operaciones
- Actualización automática cada 15 segundos

✅ **Gestión de Pedidos**
- Creación de nuevos pedidos
- Visualización detallada
- Seguimiento de estado

✅ **Gestión de Inventario**
- Visualización de productos
- Control de stock
- Alertas de productos agotados

✅ **Autenticación**
- Sistema de login seguro
- Gestión de sesiones con JWT
- LocalStorage para persistencia

✅ **Diseño Responsivo**
- Adaptable a móvil, tablet y desktop
- Tema oscuro moderno
- Animaciones suaves

---

## 🛠️ Tecnologías Utilizadas

| Paquete | Versión | Propósito |
|---------|---------|----------|
| React | 18.2.0 | Framework UI |
| React Router DOM | 6.18.0 | Enrutamiento SPA |
| Axios | 1.6.0 | Cliente HTTP |
| Recharts | 3.8.1 | Visualización de gráficos |
| Tailwind CSS | 3.4.4 | Estilos utility-first |
| Vite | 5.0.0 | Bundler ultrarrápido |
| PostCSS | 8.4.35 | Procesamiento de CSS |
| Autoprefixer | 10.4.20 | Compatibilidad navegadores |

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/               # Componentes React reutilizables
│   │   ├── Dashboard.jsx         # Panel principal
│   │   ├── CrearPedido.jsx      # Formulario de nuevos pedidos
│   │   ├── PedidoDetalle.jsx    # Vista detalle de pedido
│   │   ├── Login.jsx            # Autenticación
│   │   └── [otros componentes]
│   │
│   ├── services/
│   │   └── api.js               # Configuración de Axios y endpoints
│   │
│   ├── App.jsx                   # Componente raíz
│   ├── main.jsx                  # Punto de entrada
│   ├── App.css                   # Estilos globales
│   └── index.css                 # Estilos base
│
├── public/                        # Assets estáticos
├── dist/                          # Build generado
├── package.json                   # Dependencias y scripts
├── package-lock.json             # Lock de versiones exactas
├── vite.config.js                # Configuración Vite
├── tailwind.config.js            # Configuración Tailwind
├── postcss.config.js             # Configuración PostCSS
├── index.html                    # HTML base
└── Dockerfile                    # Containerización Docker

```

---

## 🚀 Instalación y Setup

### Prerequisitos

- **Node.js:** 18.0.0 o superior
- **npm:** 9.0.0 o superior (incluido con Node.js)

### Pasos de Instalación

**1. Clonar el repositorio:**
```bash
git clone https://github.com/Xniper21/smartlogix.git
cd smartlogix/frontend
```

**2. Instalar dependencias:**
```bash
npm install
```

**3. Verificar instalación:**
```bash
npm list react react-dom vite
```

---

## 📜 Scripts Disponibles

### Desarrollo

**Iniciar servidor de desarrollo:**
```bash
npm run dev
```

Abre la aplicación en `http://localhost:3000` con hot-reload automático.

**Características:**
- Recarga automática al cambiar código
- Errores mostrados en la pantalla
- WebSocket para comunicación en tiempo real

### Producción

**Generar build optimizado:**
```bash
npm run build
```

Genera carpeta `dist/` con:
- Código minificado
- Chunks optimizados
- CSS optimizado
- Assets comprimidos

**Tamaño típico:** ~150KB (gzipped)

**Previsualizar build localmente:**
```bash
npm run preview
```

Visualiza cómo se vería la aplicación en producción antes de desplegar.

---

## 🔗 Configuración de API

### Archivo: `src/services/api.js`

```javascript
import axios from 'axios';

// Instancia base de Axios
const apiClient = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// APIs específicos
export const dashboardAPI = {
  stats: () => apiClient.get('/dashboard/stats')
};

export const pedidosAPI = {
  listar: () => apiClient.get('/pedidos'),
  obtener: (id) => apiClient.get(`/pedidos/${id}`),
  crear: (datos) => apiClient.post('/pedidos', datos),
  actualizar: (id, datos) => apiClient.put(`/pedidos/${id}`, datos)
};

export const inventarioAPI = {
  listar: () => apiClient.get('/inventario/productos'),
  obtener: (id) => apiClient.get(`/inventario/productos/${id}`)
};
```

### Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=SmartLogix
VITE_ENV=development
```

---

## 🎨 Componentes Principales

### Dashboard.jsx

**Propósito:** Panel principal con estadísticas y gráficos.

**Características:**
```jsx
- Gráfico de líneas (últimos 12 días)
- Métricas: ganancias, pedidos, envíos
- Resumen de estado de pedidos
- Inventario y envíos
- Loading skeleton durante carga
- Actualización automática cada 15s
```

**Props:** Ninguno (obtiene datos desde API)

**Ejemplo de uso:**
```jsx
import Dashboard from './components/Dashboard';

function App() {
  return <Dashboard />;
}
```

### CrearPedido.jsx

**Propósito:** Formulario para crear nuevos pedidos.

**Características:**
```jsx
- Selección de productos del inventario
- Cantidad y validación
- Tipo de envío (Normal/Express)
- Cálculo automático de totales
- Validación en cliente
```

### PedidoDetalle.jsx

**Propósito:** Visualización detallada de un pedido específico.

**Características:**
```jsx
- Información completa del pedido
- Historial de cambios de estado
- Tracking de envío
- Datos del cliente
```

### Login.jsx

**Propósito:** Autenticación de usuarios.

**Características:**
```jsx
- Formulario de login
- Validación de credenciales
- Almacenamiento de JWT en localStorage
- Redirección automática post-login
```

---

## 🌐 Endpoints de API Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Estadísticas del dashboard |
| GET | `/pedidos` | Lista de todos los pedidos |
| POST | `/pedidos` | Crear nuevo pedido |
| GET | `/pedidos/{id}` | Detalles de un pedido |
| GET | `/inventario/productos` | Lista de productos |
| GET | `/inventario/productos/{id}` | Detalles de un producto |

---

## 🐳 Docker

### Build de Imagen Docker

```bash
docker build -t smartlogix-frontend:1.0.0 .
```

### Ejecutar Contenedor

```bash
docker run -p 3000:3000 \
  -e VITE_API_URL=http://api-gateway:8000/api \
  smartlogix-frontend:1.0.0
```

### Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up frontend
```

---

## 🔍 Debugging

### Chrome DevTools

1. Abrir Chrome DevTools (F12)
2. Pestaña **React Developer Tools** (extensión recomendada)
3. Inspeccionar componentes y estado

### Logging en Consola

```javascript
console.log('Mi valor:', valor);
console.error('Error:', error);
```

### Network Tab

1. F12 → Pestaña Network
2. Hacer acción en app
3. Ver solicitudes HTTP y respuestas

---

## 🧪 Testing

### Requisitos para testing

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Ejemplo de Test

```javascript
// Dashboard.test.jsx
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  test('muestra cargando inicialmente', () => {
    render(<Dashboard />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});
```

### Ejecutar Tests

```bash
npm run test
```

---

## 📊 Performance

### Recomendaciones

✅ **Code Splitting**
```javascript
const Dashboard = React.lazy(() => import('./components/Dashboard'));
```

✅ **Memoización**
```javascript
const MemoComponent = React.memo(MyComponent);
```

✅ **useCallback para funciones**
```javascript
const handleClick = useCallback(() => {
  // lógica
}, []);
```

### Herramientas de Análisis

**Lighthouse (Chrome):**
- F12 → Lighthouse
- Analizar performance

**Vite Build Analysis:**
```bash
npm run build -- --analyze
```

---

## 🚀 Despliegue

### A Vercel (Recomendado para Frontend)

```bash
npm install -g vercel
vercel
```

### A Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### A Servidor Propio

```bash
npm run build
# Copiar carpeta dist/ a servidor web (Nginx, Apache)
# Servir en puerto 3000 o detrás de proxy
```

### Environment de Producción

Crear `.env.production`:
```env
VITE_API_URL=https://api.smartlogix.com/api
VITE_ENV=production
```

---

## 🐛 Troubleshooting

### Puerto 3000 ya en uso
```bash
# Encontrar proceso
lsof -i :3000
# Matar proceso (Linux/Mac)
kill -9 <PID>
# Windows: usar Task Manager
```

### Módulos no encontrados
```bash
# Limpiar caché
rm -rf node_modules package-lock.json
npm install
```

### Errores de CORS
- Verificar que API Gateway esté corriendo en puerto 8000
- Configurar `VITE_API_URL` correctamente

### Cambios no se reflejan
- Limpiar caché del navegador (Ctrl+Shift+Delete)
- Restart del servidor de desarrollo

---

## 📚 Recursos Adicionales

- [React Documentación](https://react.dev)
- [Vite Guía](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Axios](https://axios-http.com)

---

## 🤝 Contribuir

1. Crear branch: `git checkout -b feature/mi-feature`
2. Commit cambios: `git commit -m "feat: descripción"`
3. Push: `git push origin feature/mi-feature`
4. Crear Pull Request en GitHub

---

## 📝 Notas Importantes

- ⚠️ **VITE_API_URL** debe ser accesible desde el navegador
- ⚠️ Los tokens JWT se almacenan en localStorage (usar https en producción)
- ⚠️ Las credenciales nunca se deben hardcodear en el código
- ⚠️ Usar variables de entorno para configuración sensible

---

## 📄 Licencia

Proyecto desarrollado para evaluación académica - SmartLogix 2026

---

**Última actualización:** Mayo 2026  
**Mantenedor:** Equipo SmartLogix
