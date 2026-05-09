import React, { useState } from 'react';
import { pedidosAPI } from '../services/api';

export default function CrearPedido() {
  const [formData, setFormData] = useState({
    productoId: '',
    cantidad: '',
    tipoEnvio: 'normal',
    direccion: '',
    region: '',
    comuna: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const regiones = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana',
    'O\'Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén',
    'Magallanes'
  ];

  const comunasPorRegion = {
    'Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Vitacura', 'La Reina', 'Macul'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Quillota'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel'],
    'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla'],
    'Maule': ['Talca', 'Curicó', 'Linares'],
    // Agregar más comunas para otras regiones si es necesario
  };

  const comunas = comunasPorRegion[formData.region] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      setFormData(prev => ({
        ...prev,
        region: value,
        comuna: '' // Reset comuna when region changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await pedidosAPI.crear({
        productoId: parseInt(formData.productoId),
        cantidad: parseInt(formData.cantidad),
        tipoEnvio: formData.tipoEnvio,
        direccion: formData.direccion,
        region: formData.region,
        comuna: formData.comuna
      });
      setMensaje(response.data);
      setFormData({ productoId: '', cantidad: '', tipoEnvio: 'normal', direccion: '', region: '', comuna: '' });
    } catch (err) {
      setMensaje('Error al crear pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card mx-auto max-w-3xl overflow-hidden shadow-glow animate-fade-in">
      <div className="flex flex-col gap-6 bg-slate-950/90 px-6 py-8 sm:px-10 sm:py-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Pedido rápido</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-50">Crear un nuevo pedido</h2>
          <p className="mt-3 text-slate-400">
            Genera un pedido en el sistema con disponibilidad de inventario integrada y envíos express.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-200">
              ID Producto
              <input
                type="number"
                name="productoId"
                value={formData.productoId}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Cantidad
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-200">
            Tipo de Envío
            <select
              name="tipoEnvio"
              value={formData.tipoEnvio}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="normal">Normal (3 días)</option>
              <option value="express">Express (24 horas)</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Dirección de entrega
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
            />
          </label>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-200">
              Región
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Selecciona región</option>
                {regiones.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Comuna
              <select
                name="comuna"
                value={formData.comuna}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Selecciona comuna</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {loading ? 'Procesando...' : 'Crear Pedido'}
          </button>
        </form>

        {mensaje && (
          <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-100 ring-1 ring-slate-700/80">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}
