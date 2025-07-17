import { Building2, Menu, ChartLine, Users, ToolCase, Moon } from "lucide-react";

export default function Sidebar({opened, handleOpened, isLight, toggleDarkMode}) {
  

  return (
    <div 
      className={`flex flex-col relative h-screen shadow-xl p-3 border-r transition-all duration-300 ${
        opened ? "w-[200px]" : "w-[60px]"
      } ${
        isLight 
          ? "bg-white border-gray-300 text-gray-800" 
          : "bg-black border-gray-700 text-gray-200"
      }`}
    >
      {/* Bouton Menu */}
      <button
        onClick={handleOpened}
        className={`flex cursor-pointer items-center gap-3 mb-6 p-2 rounded-lg transition-all duration-300 ${
          isLight 
            ? "hover:bg-blue-50 hover:text-blue-600" 
            : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        <Menu className="w-6 h-6" />
        {opened && <span className="text-sm font-medium">Menu</span>}
      </button>

      {/* Exemple d'autres éléments de menu */}
      <div className="flex flex-col gap-2">
        <button className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
          isLight 
            ? "hover:bg-blue-50 hover:text-blue-600" 
            : "hover:bg-gray-700 hover:text-white"
        }`}>
          <ChartLine />
          {opened && <span className="text-sm font-medium">Dashboard</span>}
        </button>

        <button className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
          isLight 
            ? "hover:bg-blue-50 hover:text-blue-600" 
            : "hover:bg-gray-700 hover:text-white"
        }`}>
          <Building2 />
          {opened && <span className="text-sm font-medium">Infrastructures</span>}
        </button>

        <button className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
          isLight 
            ? "hover:bg-blue-50 hover:text-blue-600" 
            : "hover:bg-gray-700 hover:text-white"
        }`}>
          <ToolCase />
          {opened && <span className="text-sm font-medium">Equipements</span>}
        </button>

        <button className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
          isLight 
            ? "hover:bg-blue-50 hover:text-blue-600" 
            : "hover:bg-gray-700 hover:text-white"
        }`}>
          <Users />
          {opened && <span className="text-sm font-medium">Populations</span>}
        </button>
      </div>

      {/* bouton pour le mode nuit */}
      <div className="absolute bottom-2 left-3 right-3">
        <button 
          onClick={toggleDarkMode}
          className={`flex cursor-pointer items-center w-full rounded-lg gap-3 p-2 transition-all duration-300 ${
            isLight 
              ? "hover:bg-blue-50 hover:text-blue-600" 
              : "hover:bg-gray-700 hover:text-white"
          }`}
        >
          <Moon />
          {opened && <span className="text-sm font-medium">
            {isLight ? "Mode nuit" : "Mode jour"}
          </span>}
        </button>
      </div>
    </div>
  );
}