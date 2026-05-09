import React, { useState, useEffect } from 'react';
import { productosAPI } from '../services/api';

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', stock: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await productosAPI.listar();
      setProductos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || '' : value
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.nombre || formData.stock === '') {
      setError('Por favor completa todos los campos');
      return;
    }

    setCreating(true);
    try {
      await productosAPI.crear({
        nombre: formData.nombre,
        stock: formData.stock
      });
      setFormData({ nombre: '', stock: '' });
      setShowModal(false);
      setError(null);
      await fetchProductos();
    } catch (err) {
      setError('Error al crear producto: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card mx-auto max-w-7xl p-8">
        <p className="text-slate-300">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="glass-card overflow-hidden shadow-glow">
        <div className="rounded-3xl bg-gradient-to-br from-sky-600 via-indigo-700 to-violet-600 p-8 text-slate-50 shadow-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200/80">
                Inventario inteligente
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Productos disponibles para tus pedidos
              </h1>
              <p className="mt-4 max-w-2xl text-slate-200/90">
                Revisa el stock en tiempo real, gestiona productos y monitorea disponibilidad del sistema SmartLogix.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 px-6 py-5 text-slate-100 ring-1 ring-white/10 shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Total de productos</p>
              <p className="mt-3 text-4xl font-semibold text-white">{productos.length}</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="glass-card rounded-3xl bg-rose-950/90 p-6 shadow-glow">
          <p className="text-rose-300">{error}</p>
        </section>
      )}

      <section className="glass-card overflow-hidden shadow-glow">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Lista de Productos</h2>
            <p className="mt-1 text-sm text-slate-400">Actualizado automáticamente desde el servicio de inventario.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-sky-600 px-6 py-2 font-semibold text-white transition hover:bg-sky-700"
          >
            + Agregar Producto
          </button>
        </div>

        <div className="overflow-x-auto px-6 pb-6 pt-4">
          <table className="min-w-full divide-y divide-slate-700 text-sm text-slate-200">
            <thead>
              <tr className="bg-slate-950/90 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Disponibilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {productos.map(producto => (
                <tr key={producto.id} className="transition hover:bg-slate-900/70">
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-100">{producto.id}</td>
                  <td className="px-4 py-4 text-slate-200">{producto.nombre}</td>
                  <td className="px-4 py-4 text-slate-100">{producto.stock}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${producto.stock > 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                      {producto.stock > 0 ? 'En stock' : 'Agotado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-3xl bg-slate-950/95 p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-100">Agregar Producto</h2>
            <p className="mt-2 text-sm text-slate-400">Completa los datos para crear un nuevo producto en el inventario.</p>
            
            <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">Nombre del Producto</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Laptop Dell XPS"
                  className="mt-2 w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Stock Inicial</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Ej: 50"
                  min="0"
                  className="mt-2 w-full rounded-2xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder-slate-500 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ nombre: '', stock: '' });
                  }}
                  className="flex-1 rounded-2xl border border-slate-700 px-4 py-2 font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-2xl bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {creating ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
