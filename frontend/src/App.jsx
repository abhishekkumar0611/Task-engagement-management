import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Register from "./pages/Register";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Clients from "./pages/Clients";
import Users from "./pages/Users";
import Services from "./pages/Services";
import Engagements from "./pages/Engagements";

export default function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Public */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute
                roles={[
                  "ADMIN",
                  "MANAGER",
                ]}
              >
                <Layout>
                  <Clients />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              >
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/services"
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              >
                <Layout>
                  <Services />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/engagements"
            element={
              <ProtectedRoute
                roles={[
                  "ADMIN",
                  "MANAGER",
                ]}
              >
                <Layout>
                  <Engagements />
                </Layout>
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}