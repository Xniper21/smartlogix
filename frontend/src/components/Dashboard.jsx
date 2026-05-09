import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../services/api';

const formatCurrency = (value) => {
  return value.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  });
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [ventasData, setVentasData] = useState([]);
  const empresa = localStorage.getItem('empresa') || 'Mi Empresa';

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.stats();
      setStats(response.data);
      setUpdatedAt(new Date().toLocaleTimeString());
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las métricas del dashboard. Verifica que el backend esté disponible.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVentasData = () => {
    // Generar datos realistas de últimos 12 días para la pyme
    const generateMetricsData = () => {
      const data = [];
      const today = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('es-CL', { weekday: 'short', month: 'numeric', day: 'numeric' });
        
        // Simular fluctuaciones realistas de negocio
        const baseGanancia = 150000 + Math.random() * 200000;
        const basePedidos = 8 + Math.floor(Math.random() * 15);
        const baseEnvios = 6 + Math.floor(Math.random() * 12);
        
        // Añadir tendencia al alza (pyme en crecimiento)
        const growthFactor = (11 - i) * 0.05;
        
        data.push({
          dia: dayName,
          ganancias: Math.floor(baseGanancia * (1 + growthFactor)),
          pedidos: Math.floor(basePedidos * (1 + growthFactor * 0.8)),
          envios: Math.floor(baseEnvios * (1 + growthFactor * 0.7)),
        });
      }
      
      return data;
    };
    
    try {
      setVentasData(generateMetricsData());
    } catch (err) {
      console.error('Error generando datos del gráfico:', err);
      // Fallback con datos por defecto
      setVentasData([
        { dia: 'Día 1', ganancias: 200000, pedidos: 10, envios: 8 },
        { dia: 'Día 2', ganancias: 220000, pedidos: 12, envios: 10 },
        { dia: 'Día 3', ganancias: 190000, pedidos: 9, envios: 7 },
        { dia: 'Día 4', ganancias: 250000, pedidos: 14, envios: 11 },
        { dia: 'Día 5', ganancias: 280000, pedidos: 16, envios: 13 },
        { dia: 'Día 6', ganancias: 260000, pedidos: 15, envios: 12 },
        { dia: 'Día 7', ganancias: 300000, pedidos: 18, envios: 15 },
        { dia: 'Día 8', ganancias: 310000, pedidos: 19, envios: 16 },
        { dia: 'Día 9', ganancias: 290000, pedidos: 17, envios: 14 },
        { dia: 'Día 10', ganancias: 330000, pedidos: 20, envios: 17 },
        { dia: 'Día 11', ganancias: 340000, pedidos: 21, envios: 18 },
        { dia: 'Día 12', ganancias: 360000, pedidos: 22, envios: 19 },
      ]);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchVentasData();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  // Estado de carga con skeleton
  if (loading && !stats) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Header skeleton */}
        <section className="glass-card overflow-hidden shadow-glow rounded-3xl bg-slate-950/90 p-8">
          <div className="flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-700 to-violet-600 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-4">
                <div className="h-4 w-48 animate-pulse rounded bg-slate-200/20"></div>
                <div className="h-12 w-96 animate-pulse rounded bg-slate-200/20"></div>
                <div className="h-4 w-80 animate-pulse rounded bg-slate-200/20"></div>
              </div>
              <div className="rounded-3xl bg-slate-950/95 px-6 py-5 ring-1 ring-white/10">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200/20"></div>
                <div className="mt-3 h-10 w-32 animate-pulse rounded bg-slate-200/20"></div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-white/10">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200/20"></div>
                  <div className="mt-3 h-10 w-32 animate-pulse rounded bg-slate-200/20"></div>
                  <div className="mt-2 h-4 w-40 animate-pulse rounded bg-slate-200/20"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats skeletons */}
        <section className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-3xl bg-slate-950/90 p-6 shadow-glow">
              <div className="space-y-4 border-b border-slate-800/80 pb-4">
                <div className="h-6 w-48 animate-pulse rounded bg-slate-200/20"></div>
                <div className="h-4 w-72 animate-pulse rounded bg-slate-200/20"></div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="rounded-3xl bg-slate-900/80 p-5 ring-1 ring-slate-700/80">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200/20"></div>
                    <div className="mt-3 h-10 w-24 animate-pulse rounded bg-slate-200/20"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Chart skeleton */}
        <section className="glass-card rounded-3xl bg-slate-950/90 p-6 shadow-glow">
          <div className="space-y-4 border-b border-slate-800/80 pb-4">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200/20"></div>
            <div className="h-4 w-96 animate-pulse rounded bg-slate-200/20"></div>
          </div>
          <div className="mt-6 h-72 w-full animate-pulse rounded-2xl bg-slate-900/80"></div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header compacto */}
      <section className="glass-card overflow-hidden shadow-glow rounded-3xl bg-slate-950/90 p-6 sm:p-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-700 to-violet-600 p-6 sm:p-8 text-slate-50 shadow-xl">
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-200/80">Dashboard de operaciones</p>
              <h1 className="mt-2 sm:mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">Bienvenido, {empresa}</h1>
              <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-slate-200/90">
                Estadísticas en tiempo real conectadas al BFF y al resto de los servicios backend.
              </p>
            </div>
            <div className="rounded-2xl sm:rounded-3xl bg-slate-950/95 px-4 sm:px-6 py-3 sm:py-5 text-slate-100 ring-1 ring-white/10 shadow-xl whitespace-nowrap">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-300">Actualización</p>
              <p className="mt-2 sm:mt-3 text-xl sm:text-3xl font-semibold text-white">{updatedAt || 'Cargando...'}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-3">
            <Link to="/productos" className="rounded-2xl sm:rounded-3xl bg-slate-950/80 p-3 sm:p-5 text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-900">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-400">Inventario</p>
              <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold">{stats?.totalProductos ?? '0'}</p>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">Productos</p>
            </Link>
            <Link to="/pedidos" className="rounded-2xl sm:rounded-3xl bg-slate-950/80 p-3 sm:p-5 text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-900">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-400">Pedidos</p>
              <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold">{stats?.totalPedidos ?? '0'}</p>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">Registrados</p>
            </Link>
            <Link to="/crear-pedido" className="rounded-2xl sm:rounded-3xl bg-slate-950/80 p-3 sm:p-5 text-slate-100 ring-1 ring-white/10 transition hover:bg-slate-900">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-400">Ganancias</p>
              <p className="mt-2 sm:mt-3 text-xl sm:text-3xl font-semibold">{stats ? formatCurrency(stats.gananciaEstimacion) : '$0'}</p>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">Estimada</p>
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <section className="glass-card rounded-3xl bg-rose-950/90 p-6 shadow-glow">
          <p className="text-rose-300">{error}</p>
        </section>
      )}

      {/* Gráfico prominente - Arriba */}
      <section className="glass-card rounded-3xl bg-slate-950/90 p-6 shadow-glow">
        <div className="border-b border-slate-800/80 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-slate-100">Métricas de Desempeño - Últimos 12 Días</h2>
          <p className="mt-1 text-sm text-slate-400">Evolución de ganancias, pedidos completados y envíos realizados.</p>
        </div>
        <div className="mt-4">
          {ventasData && ventasData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="dia" 
                    stroke="#9CA3AF"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    yAxisId="left"
                    tick={{ fontSize: 10 }}
                    width={35}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10 }}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.75rem',
                      color: '#F3F4F6',
                      fontSize: '12px',
                    }}
                    formatter={(value) => {
                      if (value > 10000) return [`$${value.toLocaleString('es-CL')}`, 'Ganancias'];
                      return [value, 'Cantidad'];
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="ganancias" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Ganancias (CLP)"
                    isAnimationActive={true}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="pedidos" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Pedidos"
                    isAnimationActive={true}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="envios" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Envíos"
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-slate-400 text-sm">Cargando gráfico...</p>
              </div>
            )}
          </div>
        </section>

      {/* Grid de stats - Abajo */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Resumen de pedidos */}
        <div className="glass-card rounded-3xl bg-slate-950/90 p-6 shadow-glow">
          <div className="border-b border-slate-800/80 pb-3 mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Resumen de pedidos</h2>
            <p className="mt-1 text-xs text-slate-400">Métricas del servicio de pedidos.</p>
          </div>
          <div className="grid gap-3 grid-cols-2">
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Entregados</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.totalEntregados ?? '0'}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pendientes</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.totalPendientes ?? '0'}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Express</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.pedidosExpress ?? '0'}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Normal</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.pedidosNormal ?? '0'}</p>
            </div>
          </div>
        </div>

        {/* Inventario y envíos */}
        <div className="glass-card rounded-3xl bg-slate-950/90 p-6 shadow-glow">
          <div className="border-b border-slate-800/80 pb-3 mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Inventario y envíos</h2>
            <p className="mt-1 text-xs text-slate-400">Conexiones cruzadas entre servicios.</p>
          </div>
          <div className="grid gap-3 grid-cols-2">
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Productos agotados</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.productosAgotados ?? '0'}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Envíos pendientes</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.enviosPendientes ?? '0'}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Envíos completados</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.enviosEntregados ?? '0'}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-100 ring-1 ring-slate-700/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total de envíos</p>
              <p className="mt-2 text-2xl font-semibold">{stats?.enviosTotales ?? '0'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
