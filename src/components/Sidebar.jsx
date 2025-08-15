import { useNavigate } from "react-router-dom";
import { Building2, Menu, ChartLine, Users, ToolCase, LogIn, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Sidebar({opened, handleOpened}) {
  const navigate = useNavigate();
  const { role, logout } = useContext(AuthContext);

  return (
    <div 
      className={`flex flex-col relative min-h-screen shadow-xl p-3 border-r transition-all duration-300 ${
        opened ? "w-[200px]" : "w-[60px]"
      } bg-white border-gray-300 text-gray-800`}
    >
      {/* Bouton Menu */}
      <button
        onClick={handleOpened}
        className="flex cursor-pointer items-center gap-3 mb-6 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
      >
        <Menu className="w-6 h-6" />
        {opened && <span className="text-sm font-medium">Menu</span>}
      </button>
      {/* Exemple d'autres éléments de menu */}
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600">
          <ChartLine />
          {opened && <span className="text-sm font-medium">Dashboard</span>}
        </button>
        {role === 'ADMIN' && (
          <>
            <button 
              onClick={() => navigate("/infrastructure")}
              className="flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600">
              <Building2 />
              {opened && <span className="text-sm font-medium">Infrastructures</span>}
            </button>
            <button 
              onClick={() => navigate("/equipement")}
              className="flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600">
              <ToolCase />
              {opened && <span className="text-sm font-medium">Equipements</span>}
            </button>
            <button 
            onClick={() => navigate("/populations")}
            className="flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600">
              <Users />
              {opened && <span className="text-sm font-medium">Populations</span>}
            </button>
          </>
        )}
        {role === 'SUPERVISOR' && (
          <>
            <button 
              onClick={() => navigate("/supervisor/infrastructure")}
              className="flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600">
              <Building2 />
              {opened && <span className="text-sm font-medium">Infrastructures</span>}
            </button>
            <button 
              onClick={() => navigate("/supervisor/equipement")}
              className="flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600">
              <ToolCase />
              {opened && <span className="text-sm font-medium">Equipements</span>}
            </button>
          </>
        )}
        
      </div>
      <div className="absolute bottom-1 left-3 right-3">
        {role ? (
          <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="flex w-full justify-center cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600">
              <LogOut />
              {opened && <span className="text-sm font-medium">Se déconnecter</span>}
          </button>
        ) : (
          <button 
              onClick={() => navigate("/login")}
              className="flex w-full justify-center cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600">
              <LogIn />
              {opened && <span className="text-sm font-medium">Se connecter</span>}
          </button>
        )}
      </div>
    </div>
  );
}
