import { Building2, ChartPie, TriangleAlert, Tool } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export default function Dashboard({ opened }) {
  const { token, role } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalInfrastructures: 0,
    totalEquipements: 0,
    equipementsOccupes: 0,
    equipementsLibres: 0,
    recettesMensuelles: 0,
  });

  useEffect(() => {
    async function fetchAll() {
      if (!token) return;
      try {
        const [infraRes, eqRes] = await Promise.all([
          fetch('http://localhost:8080/api/infrastructures', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:8080/api/equipements', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const infra = infraRes.ok ? await infraRes.json() : [];
        const eq = eqRes.ok ? await eqRes.json() : [];
        const equipementsOccupes = eq.filter(e => e.statut === 'Occupé').length;
        const equipementsLibres = eq.filter(e => e.statut === 'Libre').length;
        const recettesMensuelles = eq.filter(e => e.statut === 'Occupé').reduce((s, e) => s + (e.redevance || 0), 0);
        setStats({
          totalInfrastructures: infra.length,
          totalEquipements: eq.length,
          equipementsOccupes,
          equipementsLibres,
          recettesMensuelles,
        });
      } catch {}
    }
    fetchAll();
  }, [token]);

  const doughnutData = useMemo(() => ({
    labels: ['Occupés', 'Libres'],
    datasets: [{
      data: [stats.equipementsOccupes, stats.equipementsLibres],
      backgroundColor: ['#22c55e', '#3b82f6'],
    }]
  }), [stats]);

  const barData = useMemo(() => ({
    labels: ['Infrastructures', 'Équipements'],
    datasets: [{
      label: 'Volumes',
      data: [stats.totalInfrastructures, stats.totalEquipements],
      backgroundColor: ['#6366f1', '#06b6d4']
    }]
  }), [stats]);

  const lineData = useMemo(() => ({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Recettes estimées (F)',
      data: [
        Math.round(stats.recettesMensuelles * 0.8),
        Math.round(stats.recettesMensuelles * 0.9),
        Math.round(stats.recettesMensuelles * 1.1),
        Math.round(stats.recettesMensuelles * 1.05),
        Math.round(stats.recettesMensuelles * 0.95),
        Math.round(stats.recettesMensuelles)
      ],
      borderColor: '#2563eb',
      backgroundColor: '#93c5fd55'
    }]
  }), [stats]);

  return (
    <div className="flex flex-col transition-all duration-300 p-4">
      <h1 className="font-bold text-3xl text-gray-800 mb-1">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mb-6">Vue d'ensemble des infrastructures et équipements</p>

      <section className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-center gap-4 ${opened ? 'ml-0' : 'mx-15'}`}>
        <div className="px-4 py-3 rounded-xl bg-white h-[110px] relative flex items-center justify-center shadow">
          <span className="absolute text-sm top-3 left-4">Total Infrastructures</span>
          <span className="absolute text-blue-500 text-3xl left-4 top-6 mt-2 font-bold">{stats.totalInfrastructures}</span>
          <span className="absolute top-3 right-4 text-blue-600 bg-blue-100 p-2 rounded-xl"><Building2 /></span>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white h-[110px] relative flex items-center justify-center shadow">
          <span className="absolute text-sm top-3 left-4">Équipements</span>
          <span className="absolute text-sky-600 text-3xl left-4 top-6 mt-2 font-bold">{stats.totalEquipements}</span>
          <span className="absolute top-3 right-4 text-sky-600 bg-sky-100 p-2 rounded-xl"><Tool /></span>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white h-[110px] relative flex items-center justify-center shadow">
          <span className="absolute text-sm top-3 left-4">Occupés</span>
          <span className="absolute text-green-600 text-3xl left-4 top-6 mt-2 font-bold">{stats.equipementsOccupes}</span>
          <span className="absolute top-3 right-4 text-green-600 bg-green-100 p-2 rounded-xl"><ChartPie /></span>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white h-[110px] relative flex items-center justify-center shadow">
          <span className="absolute text-sm top-3 left-4">Recettes (mois)</span>
          <span className="absolute text-indigo-600 text-xl left-4 top-6 mt-2 font-bold">{stats.recettesMensuelles.toLocaleString()} F</span>
          <span className="absolute top-3 right-4 text-indigo-600 bg-indigo-100 p-2 rounded-xl">FCFA</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 shadow col-span-1">
          <h3 className="font-semibold mb-2">Répartition des équipements</h3>
          <Doughnut data={doughnutData} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow col-span-1">
          <h3 className="font-semibold mb-2">Volumes</h3>
          <Bar data={barData} />
        </div>
        <div className="bg-white rounded-xl p-4 shadow col-span-1">
          <h3 className="font-semibold mb-2">Recettes (tendance)</h3>
          <Line data={lineData} />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {role === 'ADMIN' ? (
          <>
            <a href="/infrastructure" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Gérer Infrastructures</a>
            <a href="/equipement" className="px-4 py-2 bg-sky-600 text-white rounded-lg">Gérer Équipements</a>
          </>
        ) : (
          <>
            <a href="/supervisor/infrastructure" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Infrastructures</a>
            <a href="/supervisor/equipement" className="px-4 py-2 bg-sky-600 text-white rounded-lg">Équipements</a>
          </>
        )}
      </div>
    </div>
  );
}
  