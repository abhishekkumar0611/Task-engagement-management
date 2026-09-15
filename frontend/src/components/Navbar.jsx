import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-6">

        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-600">
            TaskFlow
          </h1>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500">
              {user?.role?.replaceAll("_", " ")}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}