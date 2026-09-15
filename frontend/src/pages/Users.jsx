import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Loading from "../components/Loading";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.get("/users");

      setUsers(data.users || data || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "TEAM_MEMBER",
      });

      setShowForm(false);

      await loadUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage team members and access roles
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add User
        </button>

      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >

          <h2 className="mb-5 font-semibold">
            Create User
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              required
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="TEAM_MEMBER">
                Team Member
              </option>

              <option value="MANAGER">
                Manager
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </select>

          </div>

          <div className="mt-5 flex gap-3">

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create User
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border px-5 py-2 text-sm font-semibold"
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">

              <tr>
                <th className="px-6 py-4">
                  User
                </th>

                <th className="px-6 py-4">
                  Email
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Status
                </th>
              </tr>

            </thead>

            <tbody className="divide-y">

              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50"
                >

                  <td className="px-6 py-4 font-semibold">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {user.role?.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}