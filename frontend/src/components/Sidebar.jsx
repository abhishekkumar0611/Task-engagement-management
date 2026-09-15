import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  {
    name: "Dashboard",
    path: "/",
    roles: ["ADMIN", "MANAGER", "TEAM_MEMBER"],
  },
  {
    name: "Tasks",
    path: "/tasks",
    roles: ["ADMIN", "MANAGER", "TEAM_MEMBER"],
  },
  {
    name: "Engagements",
    path: "/engagements",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Clients",
    path: "/clients",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Services",
    path: "/services",
    roles: ["ADMIN"],
  },
  {
    name: "Users",
    path: "/users",
    roles: ["ADMIN"],
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  const visibleLinks = links.filter((link) =>
    link.roles.includes(user?.role)
  );

  return (
    <aside className="fixed bottom-0 left-0 top-16 hidden w-64 border-r bg-slate-900 lg:block">

      <div className="p-4">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </p>

        <nav className="space-y-1">

          {visibleLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

        </nav>

      </div>
    </aside>
  );
}