import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Loading from "../components/Loading";

export default function Engagements() {
  const [engagements, setEngagements] =
    useState([]);

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [teamMembers, setTeamMembers] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    client: "",
    serviceType: "",
    manager: "",
    periodKey: "",
    startDate: "",
    endDate: "",
    assignee: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        engagementData,
        clientData,
        serviceData,
        userData,
      ] = await Promise.all([
        api.get("/engagements"),
        api.get("/clients"),
        api.get("/services"),
        api.get("/users/team-members"),
      ]);

      setEngagements(
        engagementData.engagements ||
          engagementData ||
          []
      );

      setClients(
        clientData.clients ||
          clientData ||
          []
      );

      setServices(
        serviceData.services ||
          serviceData ||
          []
      );

      setTeamMembers(
        userData.users ||
          userData ||
          []
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/engagements", form);

      setForm({
        client: "",
        serviceType: "",
        manager: "",
        periodKey: "",
        startDate: "",
        endDate: "",
        assignee: "",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const generateNext = async (engagement) => {
    try {
      await api.post(
        `/engagements/${engagement._id}/next-period`
      );

      await loadData();
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
            Engagements
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage client engagements and recurring services
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + New Engagement
        </button>

      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >

          <h2 className="mb-5 font-semibold">
            Create Engagement
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Client
              </label>

              <select
                required
                value={form.client}
                onChange={(e) =>
                  setForm({
                    ...form,
                    client: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">
                  Select client
                </option>

                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client._id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Service
              </label>

              <select
                required
                value={form.serviceType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    serviceType:
                      e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">
                  Select service
                </option>

                {services.map((service) => (
                  <option
                    key={service._id}
                    value={service._id}
                  >
                    {service.name} -{" "}
                    {service.frequency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Manager
              </label>

              <select
                required
                value={form.manager}
                onChange={(e) =>
                  setForm({
                    ...form,
                    manager: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">
                  Select manager
                </option>

                {teamMembers
                  .filter(
                    (member) =>
                      member.role === "MANAGER"
                  )
                  .map((member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Task Assignee
              </label>

              <select
                value={form.assignee}
                onChange={(e) =>
                  setForm({
                    ...form,
                    assignee: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">
                  Select team member
                </option>

                {teamMembers
                  .filter(
                    (member) =>
                      member.role ===
                      "TEAM_MEMBER"
                  )
                  .map((member) => (
                    <option
                      key={member._id}
                      value={member._id}
                    >
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Period
              </label>

              <input
                required
                placeholder="2026-09"
                value={form.periodKey}
                onChange={(e) =>
                  setForm({
                    ...form,
                    periodKey: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date
              </label>

              <input
                required
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                End Date
              </label>

              <input
                required
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

          </div>

          <div className="mt-6 flex gap-3">

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Engagement
            </button>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="rounded-lg border px-5 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      {/* Engagement Cards */}

      <div className="grid gap-5">

        {engagements.map((engagement) => (
          <div
            key={engagement._id}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >

            <div className="flex flex-col justify-between gap-4 md:flex-row">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="font-semibold text-gray-900">
                    {engagement.client?.name ||
                      "Client"}
                  </h2>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {engagement.serviceType
                      ?.name || "Service"}
                  </span>

                  {engagement.recurring && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      Recurring
                    </span>
                  )}

                </div>

                <div className="mt-3 grid gap-2 text-sm text-gray-500 sm:grid-cols-3">

                  <p>
                    Period:{" "}
                    <span className="font-medium text-gray-700">
                      {engagement.periodKey}
                    </span>
                  </p>

                  <p>
                    Manager:{" "}
                    <span className="font-medium text-gray-700">
                      {engagement.manager
                        ?.name || "-"}
                    </span>
                  </p>

                  <p>
                    Tasks:{" "}
                    <span className="font-medium text-gray-700">
                      {engagement.taskCount ??
                        "-"}
                    </span>
                  </p>

                </div>

              </div>

              {engagement.recurring && (
                <button
                  onClick={() =>
                    generateNext(
                      engagement
                    )
                  }
                  className="h-fit rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Generate Next Period
                </button>
              )}

            </div>

          </div>
        ))}

        {engagements.length === 0 && (
          <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
            No engagements found.
          </div>
        )}

      </div>

    </div>
  );
}