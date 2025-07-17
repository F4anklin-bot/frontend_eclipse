import { Building2, ChartPie, TriangleAlert } from "lucide-react";

export default function Dashboard({opened}) {
    return (
      <div className="flex flex-col transition-all duration-300 p-4">
        {/* Titre */}
        <h1 className="font-bold text-3xl text-gray-800 mb-1">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mb-6">Vue d'ensemble des infrastructures marchandes</p>
  
        {/* Cartes */}
        <section className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-center gap-8 ${
            opened ? "ml-0" : "mx-15"} `}>
          {/* Exemple de carte */}
          <div className="p-2 ml-2 hover:-inset-y-1/12 rounded-xl bg-white h-[110px] group w-[230px] relative flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300">
            <span className="absolute text-sm top-4 left-4">Total Infrastructures</span>
            <span className="absolute text-blue-500 mb-4 text-3xl left-4 top-6 mt-2 font-bold">24</span>
            <span className="absolute left-4 bottom-4 text-[12px]"><span className="text-green-500 font-bold">+12%</span> ce mois</span>
            <span className="absolute top-7 right-4 text-blue-600 bg-blue-100 group-hover:bg-blue-200 transition-colors duration-500 p-2 rounded-xl"><Building2 /> </span>
          </div>
          <div className="p-2 ml-2 rounded-xl hover:-inset-y-1/12 group bg-white h-[110px] w-[230px] relative flex items-center justify-center shadow-xl  hover:shadow-2xl transition-all duration-300">
            <span className="absolute text-sm top-4 left-4">Taux d'occupation</span>
            <span className="absolute text-green-600 mb-4 text-3xl left-4 top-6 mt-2 font-bold">87%</span>
            <span className="absolute left-4 bottom-4 text-[12px]"><span className="text-green-500 font-bold ">+6%</span> ce mois</span>
            <span className="absolute top-7 right-4 text-green-600 transition-colors duration-500 group-hover:bg-green-200 bg-green-100 p-2 rounded-xl"><ChartPie /> </span>
          </div>
          <div className="p-2 ml-2 rounded-xl bg-white h-[110px] w-[230px] group relative flex items-center justify-center shadow-xl hover:-inset-y-1/12 hover:shadow-2xl transition-all duration-300">
            <span className="absolute text-sm top-4 left-4">Recettes mensuelles</span>
            <span className="absolute text-blue-500 mb-4 text-xl left-4 top-6 mt-2 font-bold">24 791 000</span>
            <span className="absolute left-4 bottom-4 text-[12px]"><span className="text-green-500 font-bold">+2%</span> ce mois</span>
            <span className="absolute top-7 right-4 group-hover:bg-blue-200 transition-colors duration-500 font-bold text-blue-600 bg-blue-100 p-2 rounded-xl">FCFA </span>
          </div>
          <div className="p-2 ml-2 rounded-xl bg-white h-[110px] w-[230px] group relative flex items-center justify-center shadow-xl hover:-inset-y-1/20 hover:shadow-2xl transition-all duration-300">
            <span className="absolute text-sm top-4 left-4">Interventions</span>
            <span className="absolute text-red-600 mb-4 text-3xl left-4 top-6 mt-2 font-bold">5</span>
            <span className="absolute left-4 bottom-4 text-[12px]"><span className="text-red-600 font-semibold">Urgent</span> à traiter</span>
            <span className="absolute top-7 right-4 text-red-600 group-hover:bg-red-200 transition-colors duration-300 bg-red-100 p-2 rounded-xl"><TriangleAlert /> </span>
          </div>
          
        </section>
      </div>
    );
  }
  