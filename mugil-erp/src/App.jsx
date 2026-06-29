import { Navigate, Route, Routes } from "react-router-dom";
import CustomCursor from "./components/CustomCursor.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import AccountsLoginPage from "./pages/accounts/LoginPage.jsx";
import AdminLoginPage from "./pages/admin/LoginPage.jsx";
import HrLoginPage from "./pages/hr/LoginPage.jsx";
import MaterialPlanningLoginPage from "./pages/material-planning/LoginPage.jsx";
import ProductionLoginPage from "./pages/production/LoginPage.jsx";
import SupervisorLoginPage from "./pages/supervisor/LoginPage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import Inventory from "./pages/material-planning/Inventory.jsx";
import Material from "./pages/material-planning/Material.jsx";
import Consumable from "./pages/material-planning/Consumable.jsx";
export default function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/production/login" replace />}
        />
        <Route path="/production/login" element={<ProductionLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/hr/login" element={<HrLoginPage />} />
        <Route
          path="/material-planning/login"
          element={<MaterialPlanningLoginPage />}
        />
        <Route path="/supervisor/login" element={<SupervisorLoginPage />} />
        <Route path="/accounts/login" element={<AccountsLoginPage />} />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          }
        />
                          <Route
                    path="/inventory"
                    element={
                      <ProtectedRoute>
                        <Inventory />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/inventory/material"
                    element={
                      <ProtectedRoute>
                        <Material />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/inventory/consumable"
                    element={
                      <ProtectedRoute>
                        <Consumable />
                      </ProtectedRoute>
                    }
                  />
        <Route
          path="*"
          element={<Navigate to="/production/login" replace />}
        />
      </Routes>
    </AuthProvider>
  );
}
