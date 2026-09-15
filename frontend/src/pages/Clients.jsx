import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

export default function Clients() {
  const { user } = useAuth();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await api.get("/clients");

      setClients(data.clients || data || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/clients", form);

      setForm({
        name: "",
        email: "",
        phone: "",
      });

      setShowForm(false);

      await loadClients();
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
            Clients
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your professional service clients
          </p>
        </div>

        {user?.role === "ADMIN" && (
          <button
            onClick={() =>
              setShowForm(!showForm)
            }
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Add Client
          </button>
        )}

      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >

          <h2 className="mb-5 font-semibold">
            Create Client
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <input
              required
              placeholder="Client name"
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
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          <div className="mt-5 flex gap-3">

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create
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

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {clients.map((client) => (
          <div
            key={client._id}
            className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>
                <h2 className="font-semibold text-gray-900">
                  {client.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {client.email || "No email"}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  client.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {client.isActive
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

            <div className="mt-5 border-t pt-4">

              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 text-sm font-medium">
                {client.phone || "-"}
              </p>

            </div>

          </div>
        ))}

        {clients.length === 0 && (
          <div className="col-span-full rounded-xl border bg-white p-12 text-center text-gray-500">
            No clients found.
          </div>
        )}

      </div>

    </div>
  );
}