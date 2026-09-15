import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Loading from "../components/Loading";

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] =
    useState(null);

  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] =
    useState(false);
  const [showTemplateForm, setShowTemplateForm] =
    useState(false);

  const [serviceForm, setServiceForm] =
    useState({
      name: "",
      frequency: "ONE_TIME",
    });

  const [templateForm, setTemplateForm] =
    useState({
      title: "",
      description: "",
      defaultDays: 7,
      position: 1,
    });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.get("/services");

      setServices(data.services || data || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectService = async (service) => {
    try {
      setSelectedService(service);

      const data = await api.get(
        `/services/${service._id}`
      );

      setTemplates(
        data.templates ||
          data.service?.templates ||
          []
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const createService = async (e) => {
    e.preventDefault();

    try {
      await api.post("/services", serviceForm);

      setServiceForm({
        name: "",
        frequency: "ONE_TIME",
      });

      setShowServiceForm(false);

      await loadServices();
    } catch (error) {
      alert(error.message);
    }
  };

  const createTemplate = async (e) => {
    e.preventDefault();

    if (!selectedService) return;

    try {
      await api.post(
        `/services/${selectedService._id}/templates`,
        templateForm
      );

      setTemplateForm({
        title: "",
        description: "",
        defaultDays: 7,
        position: templates.length + 1,
      });

      setShowTemplateForm(false);

      await selectService(selectedService);
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
            Services
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage services and task templates
          </p>
        </div>

        <button
          onClick={() =>
            setShowServiceForm(
              !showServiceForm
            )
          }
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Service
        </button>

      </div>

      {showServiceForm && (
        <form
          onSubmit={createService}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >

          <h2 className="mb-5 font-semibold">
            Create Service
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <input
              required
              placeholder="Service name"
              value={serviceForm.name}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  name: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={serviceForm.frequency}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  frequency: e.target.value,
                })
              }
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="ONE_TIME">
                One Time
              </option>

              <option value="MONTHLY">
                Monthly
              </option>
            </select>

          </div>

          <div className="mt-5 flex gap-3">

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
            >
              Create
            </button>

            <button
              type="button"
              onClick={() =>
                setShowServiceForm(false)
              }
              className="rounded-lg border px-5 py-2 text-sm font-semibold"
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Services */}
        <div className="space-y-4">

          <h2 className="font-semibold">
            Service Types
          </h2>

          {services.map((service) => (
            <button
              key={service._id}
              onClick={() =>
                selectService(service)
              }
              className={`w-full rounded-xl border p-5 text-left transition ${
                selectedService?._id ===
                service._id
                  ? "border-blue-500 bg-blue-50"
                  : "bg-white hover:shadow-sm"
              }`}
            >

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold">
                    {service.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {service.frequency ===
                    "MONTHLY"
                      ? "Recurring monthly"
                      : "One time"}
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {service.frequency}
                </span>

              </div>

            </button>
          ))}

        </div>

        {/* Templates */}
        <div className="lg:col-span-2">

          {!selectedService ? (
            <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed bg-white text-gray-500">
              Select a service to view task templates
            </div>
          ) : (
            <div className="rounded-xl border bg-white shadow-sm">

              <div className="flex items-center justify-between border-b px-6 py-4">

                <div>
                  <h2 className="font-semibold">
                    {selectedService.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Task Templates
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowTemplateForm(
                      !showTemplateForm
                    )
                  }
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  + Template
                </button>

              </div>

              {showTemplateForm && (
                <form
                  onSubmit={createTemplate}
                  className="border-b bg-gray-50 p-5"
                >

                  <div className="grid gap-4 md:grid-cols-2">

                    <input
                      required
                      placeholder="Task title"
                      value={templateForm.title}
                      onChange={(e) =>
                        setTemplateForm({
                          ...templateForm,
                          title: e.target.value,
                        })
                      }
                      className="rounded-lg border px-4 py-3"
                    />

                    <input
                      type="number"
                      min="0"
                      placeholder="Default days"
                      value={
                        templateForm.defaultDays
                      }
                      onChange={(e) =>
                        setTemplateForm({
                          ...templateForm,
                          defaultDays:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                      className="rounded-lg border px-4 py-3"
                    />

                  </div>

                  <textarea
                    placeholder="Description"
                    value={
                      templateForm.description
                    }
                    onChange={(e) =>
                      setTemplateForm({
                        ...templateForm,
                        description:
                          e.target.value,
                      })
                    }
                    rows="3"
                    className="mt-4 w-full rounded-lg border px-4 py-3"
                  />

                  <button
                    type="submit"
                    className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
                  >
                    Create Template
                  </button>

                </form>
              )}

              <div className="divide-y">

                {templates.map(
                  (template, index) => (
                    <div
                      key={template._id}
                      className="flex gap-4 p-5"
                    >

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {template.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {template.description ||
                            "No description"}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                          Due after{" "}
                          {template.defaultDays}{" "}
                          days
                        </p>
                      </div>

                    </div>
                  )
                )}

                {templates.length === 0 && (
                  <div className="p-10 text-center text-sm text-gray-500">
                    No templates created for this
                    service.
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}