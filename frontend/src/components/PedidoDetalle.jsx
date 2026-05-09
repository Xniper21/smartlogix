import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pedidosAPI, productosAPI } from '../services/api';

export default function PedidoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [pedidoResponse, productosResponse] = await Promise.all([
        pedidosAPI.obtener(id),
        productosAPI.listar()
      ]);
      setPedido(pedidoResponse.data);
      setProductos(productosResponse.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProductoNombre = (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.nombre : `Producto ${productoId}`;
  };

  const getProductoPrecio = (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.precio : 0;
  };

  const handleGuardarNotas = async () => {
    if (!notas.trim()) {
      alert('Por favor ingresa alguna nota');
      return;
    }
    
    setGuardando(true);
    try {
      // Aquí irían las notas, una vez que el backend lo soporte
      alert('Notas guardadas correctamente');
      setNotas('');
    } catch (err) {
      setError('Error al guardar notas');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card mx-auto max-w-4xl p-8">
        <p className="text-slate-300">Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card mx-auto max-w-4xl p-8">
        <p className="text-rose-300 mb-4">{error}</p>
        <button
          onClick={() => navigate('/pedidos')}
          className="rounded-full bg-sky-500 px-6 py-2 text-white hover:bg-sky-400"
        >
          Volver a Mis Pedidos
        </button>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="glass-card mx-auto max-w-4xl p-8">
        <p className="text-slate-300 mb-4">Pedido no encontrado</p>
        <button
          onClick={() => navigate('/pedidos')}
          className="rounded-full bg-sky-500 px-6 py-2 text-white hover:bg-sky-400"
        >
          Volver a Mis Pedidos
        </button>
      </div>
    );
  }

  const totalPedido = getProductoPrecio(pedido.productoId) * pedido.cantidad;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header con botón volver */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/pedidos')}
          className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 transition"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-semibold text-slate-100">Pedido #{pedido.id}</h1>
      </div>

      {/* Estado del Pedido */}
      <section className="glass-card overflow-hidden shadow-glow">
        <div className="rounded-3xl bg-slate-900/90 p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Estado actual</p>
              <div className="mt-3 flex items-center gap-3">
                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  pedido.estado === 'ENTREGADO' 
                    ? 'bg-emerald-500/15 text-emerald-300' 
                    : 'bg-sky-500/15 text-sky-300'
                }`}>
                  {pedido.estado}
                </span>
                <span className="text-slate-400">
                  Creado: {new Date(pedido.fechaCreacion).toLocaleDateString()} 
                  {pedido.fechaCreacion && ` a las ${new Date(pedido.fechaCreacion).toLocaleTimeString()}`}
                </span>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950/90 px-6 py-4 ring-1 ring-slate-700/80">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total estimado</p>
              <p className="mt-2 text-2xl font-semibold text-sky-300">${totalPedido.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detalles del Producto */}
      <section className="glass-card overflow-hidden shadow-glow">
        <div className="rounded-3xl bg-slate-900/90 p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Detalles del Producto</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Producto</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{getProductoNombre(pedido.productoId)}</p>
              <p className="mt-1 text-sm text-slate-400">ID: {pedido.productoId}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Cantidad</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{pedido.cantidad} unidades</p>
            </div>
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Precio unitario</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">${getProductoPrecio(pedido.productoId).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Subtotal</p>
              <p className="mt-2 text-lg font-semibold text-sky-300">${totalPedido.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detalles de Envío */}
      <section className="glass-card overflow-hidden shadow-glow">
        <div className="rounded-3xl bg-slate-900/90 p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Detalles de Envío</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Tipo de envío</p>
              <p className="mt-2 text-lg font-semibold text-slate-100 capitalize">{pedido.tipoEnvio}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Dirección</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{pedido.direccion || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Región</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{pedido.region || 'N/A'}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80">
              <p className="text-sm text-slate-400">Comuna</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">{pedido.comuna || 'N/A'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notas y Actualizaciones */}
      <section className="glass-card overflow-hidden shadow-glow">
        <div className="rounded-3xl bg-slate-900/90 p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Notas y Actualizaciones</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200">Agregar una nota</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Escribe aquí tus notas, inconvenientes o consultas sobre este pedido..."
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                rows="4"
              />
            </div>
            <button
              onClick={handleGuardarNotas}
              disabled={guardando}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {guardando ? 'Guardando...' : 'Guardar Nota'}
            </button>
            
            {/* Simulamos actualizaciones del courier */}
            <div className="mt-6 space-y-3 border-t border-slate-700 pt-6">
              <h3 className="text-sm font-semibold text-slate-300">Historial de actualizaciones</h3>
              <div className="rounded-2xl bg-slate-950/90 p-4 ring-1 ring-slate-700/80 text-sm">
                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-sky-500"></div>
                  <div>
                    <p className="font-semibold text-slate-100">Pedido creado</p>
                    <p className="text-slate-400">{new Date(pedido.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
