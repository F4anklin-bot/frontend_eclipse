import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Menu, ChartLine, Users, ToolCase, LogIn, UserCircle2, LogOut, RefreshCw, KeyRound, ChevronUp, ChevronDown } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Sidebar({opened, handleOpened}) {
  const navigate = useNavigate();
  const { role, username, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function onClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

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
          title={!opened ? "Dashboard" : undefined}
          className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${pathname === "/dashboard" ? "bg-blue-200 text-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}>
          <ChartLine />
          {opened && <span className="text-sm font-medium">Dashboard</span>}
        </button>
        {role === 'ADMIN' && (
          <>
            <button 
              onClick={() => navigate("/infrastructure")}
              title={!opened ? "Infrastructures" : undefined}
              className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${pathname.startsWith("/infrastructure") && !pathname.startsWith("/supervisor/") ? "bg-blue-200 text-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}>
              <Building2 />
              {opened && <span className="text-sm font-medium">Infrastructures</span>}
            </button>
            <button 
              onClick={() => navigate("/equipement")}
              title={!opened ? "Equipements" : undefined}
              className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${pathname.startsWith("/equipement") && !pathname.startsWith("/supervisor/") ? "bg-blue-200 text-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}>
              <ToolCase />
              {opened && <span className="text-sm font-medium">Equipements</span>}
            </button>
            <button 
            onClick={() => navigate("/users")}
            title={!opened ? "Utilisateurs" : undefined}
            className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${pathname.startsWith("/users") ? "bg-blue-200 text-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}>
              <Users />
              {opened && <span className="text-sm font-medium">Utilisateurs</span>}
            </button>
          </>
        )}
        {role === 'SUPERVISOR' && (
          <>
            <button 
              onClick={() => navigate("/supervisor/infrastructure")}
              title={!opened ? "Infrastructures" : undefined}
              className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${pathname.startsWith("/supervisor/infrastructure") ? "bg-blue-200 text-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}>
              <Building2 />
              {opened && <span className="text-sm font-medium">Infrastructures</span>}
            </button>
            <button 
              onClick={() => navigate("/supervisor/equipement")}
              title={!opened ? "Equipements" : undefined}
              className={`flex cursor-pointer items-center gap-3 p-2 rounded-lg transition-all duration-300 ${pathname.startsWith("/supervisor/equipement") ? "bg-blue-200 text-blue-700" : "hover:bg-blue-50 hover:text-blue-600"}`}>
              <ToolCase />
              {opened && <span className="text-sm font-medium">Equipements</span>}
            </button>
          </>
        )}
        
      </div>
      <div className="absolute bottom-1 left-3 right-3">
        {role ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(p => !p)}
              className={`flex w-full items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:text-blue-600 ${profileOpen ? 'bg-blue-50 text-blue-700' : ''}`}
              title={!opened ? 'Profil' : undefined}
            >
              <UserCircle2 />
              {opened && (
                <span className="flex-1 text-sm font-medium truncate">
                  {username || (role === 'ADMIN' ? 'Administrateur' : 'Superviseur')}
                </span>
              )}
              {opened && (profileOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />)}
            </button>
            {profileOpen && (
              <div className={`absolute z-50 bottom-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${opened ? '' : 'w-[220px]'}`}>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/login'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                >
                  <RefreshCw size={16} />
                  <span className="text-sm">Changer d'utilisateur</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/reset-password'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                >
                  <KeyRound size={16} />
                  <span className="text-sm">Modifier le mot de passe</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-red-50 text-red-600"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
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
