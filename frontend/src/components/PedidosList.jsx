import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosAPI, productosAPI } from '../services/api';

export default function PedidosList() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pedidosResponse, productosResponse] = await Promise.all([
        pedidosAPI.listar(),
        productosAPI.listar()
      ]);
      setPedidos(pedidosResponse.data);
      setProductos(productosResponse.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pedido) => {
    navigate(`/pedidos/${pedido.id}`);
  };

  const getProductoNombre = (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.nombre : `Producto ${productoId}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      try {
        await pedidosAPI.eliminar(id);
        fetchData(); // Refresh the list
      } catch (err) {
        setError('Error al eliminar pedido');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="glass-card mx-auto max-w-7xl p-8">
        <p className="text-slate-300">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card mx-auto max-w-7xl p-8">
        <p className="text-rose-300">{error}</p>
      </div>
    );
  }

  const totalPedidos = pedidos.length;
  const entregas = pedidos.filter((pedido) => pedido.estado === 'ENTREGADO').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="glass-card overflow-hidden shadow-glow">
        <div className="rounded-3xl bg-slate-900/90 p-8 shadow-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-100">Mis pedidos</h2>
              <p className="mt-2 text-slate-400">Visualiza el historial de pedidos y el estado de cada envío.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/90 px-5 py-4 text-slate-100 ring-1 ring-slate-700/80">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Total pedidos</p>
                <p className="mt-3 text-3xl font-semibold">{totalPedidos}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/90 px-5 py-4 text-slate-100 ring-1 ring-slate-700/80">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Entregados</p>
                <p className="mt-3 text-3xl font-semibold">{entregas}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card overflow-hidden shadow-glow">
        <div className="overflow-x-auto px-6 pb-6 pt-5">
          {pedidos.length === 0 ? (
            <div className="rounded-3xl bg-slate-950/90 p-8 text-slate-300 ring-1 ring-slate-700/80">
              No hay pedidos registrados aún.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-700 text-sm text-slate-200">
              <thead className="bg-slate-950/90 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Envío</th>
                  <th className="px-4 py-3">Dirección</th>
                  <th className="px-4 py-3">Región</th>
                  <th className="px-4 py-3">Comuna</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="transition hover:bg-slate-900/70">
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-100">{pedido.id}</td>
                    <td className="px-4 py-4 text-slate-200">{getProductoNombre(pedido.productoId)}</td>
                    <td className="px-4 py-4 text-slate-100">{pedido.cantidad}</td>
                    <td className="px-4 py-4 text-slate-200">{pedido.tipoEnvio}</td>
                    <td className="px-4 py-4 text-slate-200">{pedido.direccion != null ? pedido.direccion : 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-200">{pedido.region != null ? pedido.region : 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-200">{pedido.comuna != null ? pedido.comuna : 'N/A'}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${pedido.estado === 'ENTREGADO' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-sky-500/15 text-sky-300'}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{new Date(pedido.fechaCreacion).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(pedido)}
                          className="rounded bg-sky-500 px-3 py-1 text-xs text-white hover:bg-sky-400"
                        >
                          Ver Detalle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(pedido.id)}
                          className="rounded bg-rose-500 px-3 py-1 text-xs text-white hover:bg-rose-400"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
