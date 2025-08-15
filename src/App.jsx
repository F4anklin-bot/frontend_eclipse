import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./components/adminpages/Dashboard";
import Infrastructure from "./components/adminpages/Infrastructure";
import Equipement from "./components/adminpages/Equipement";
import InfrastructureForm from "./components/adminpages/InfrastructureForm";
import EquipementForm from "./components/adminpages/EquipementForm";
import LoginPage from "./components/login/LoginPage";
import Users from "./components/adminpages/Users";
import CreateAccount from "./components/login/CreateAccount";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";

// Superviseur pages
import SupervisorDashboard from "./components/supervisorpages/Dashboard";
import SupervisorInfrastructure from "./components/supervisorpages/Infrastructure";
import SupervisorEquipement from "./components/supervisorpages/Equipement";
import SupervisorInfrastructureForm from "./components/supervisorpages/InfrastructureForm";
import SupervisorEquipementForm from "./components/supervisorpages/EquipementForm";

function App() {
  const [opened, setOpened] = useState(false);
  const location = useLocation();

  function handleOpened() {
    setOpened(prev => !prev);
  }

  const shouldShowSidebar = !["/login", "/create-account", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <div className="flex transition-colors duration-300 bg-blue-50">
      {shouldShowSidebar && (
        <Sidebar opened={opened} handleOpened={handleOpened} />
      )}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route element={<ProtectedRoute />}> 
          <Route 
            path="/dashboard"
            element={<Dashboard opened={opened} />}
          />
          <Route
            path="/infrastructure"
            element={<Infrastructure />}
          />
          <Route 
            path="/equipement"
            element={<Equipement />}
          />
          <Route 
            path="/equipement/new"
            element={<EquipementForm />}
          />
          <Route 
            path="/equipement/:id/edit"
            element={<EquipementForm />}
          />
          {/* Superviseur */}
          <Route 
            path="/supervisor/dashboard"
            element={<SupervisorDashboard opened={opened} />}
          />
          <Route
            path="/supervisor/infrastructure"
            element={<SupervisorInfrastructure />}
          />
          <Route 
            path="/supervisor/equipement"
            element={<SupervisorEquipement />}
          />
          <Route 
            path="/supervisor/equipement/new"
            element={<SupervisorEquipementForm />}
          />
          <Route 
            path="/supervisor/equipement/:id/edit"
            element={<SupervisorEquipementForm />}
          />
          <Route
            path="/supervisor/infrastructure/new"
            element={<SupervisorInfrastructureForm />}
          />
          <Route
            path="/supervisor/infrastructure/:id/edit"
            element={<SupervisorInfrastructureForm />}
          />
          <Route
          path="users"
          element={<Users />}
          />
          </Route>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/create-account"
            element={<CreateAccount />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          <Route
            path="/infrastructure/new"
            element={<InfrastructureForm />}
          />
          <Route
            path="/infrastructure/:id/edit"
            element={<InfrastructureForm />}
          />
          
        </Routes>
      </div>
    </div>
  )
}

export default App
