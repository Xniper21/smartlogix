import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProductosList from './components/ProductosList';
import CrearPedido from './components/CrearPedido';
import PedidosList from './components/PedidosList';
import PedidoDetalle from './components/PedidoDetalle';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const empresa = localStorage.getItem('empresa');
    if (token) {
      setUser({ token, email, empresa });
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('empresa', userData.empresa);
    setUser(userData);
  };

  const handleRegister = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('empresa', userData.empresa);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('empresa');
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen overflow-hidden">
        <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center gap-3 text-2xl font-semibold text-sky-400">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 shadow-glow text-white">
                S
              </span>
              SmartLogix
            </Link>

            <nav>
              <ul className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-300 sm:gap-5">
                <li>
                  <Link to="/dashboard" className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/productos" className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link to="/crear-pedido" className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                    Crear Pedido
                  </Link>
                </li>
                <li>
                  <Link to="/pedidos" className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                    Mis Pedidos
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="rounded-full px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/productos" element={<ProductosList />} />
            <Route path="/crear-pedido" element={<CrearPedido />} />
            <Route path="/pedidos" element={<PedidosList />} />
            <Route path="/pedidos/:id" element={<PedidoDetalle />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;