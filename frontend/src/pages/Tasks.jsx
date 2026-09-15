import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

const statuses = [
  "ALL",
  "NOT_STARTED",
  "IN_PROGRESS",
  "WAITING_FOR_CLIENT",
  "READY_FOR_REVIEW",
  "CHANGES_REQUESTED",
  "COMPLETED",
];

export default function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState(null);

  const [newStatus, setNewStatus] = useState("");
  const [waitingReason, setWaitingReason] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.get("/tasks");

      setTasks(data.tasks || data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    if (!selectedTask) return;

    try {
      await api.patch(`/tasks/${selectedTask._id}/status`, {
        status: newStatus,
        waitingReason,
        note,
      });

      setSelectedTask(null);
      setWaitingReason("");
      setNote("");

      await loadTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  const submitForReview = async (task) => {
    try {
      await api.patch(
        `/tasks/${task._id}/status`,
        {
          status: "READY_FOR_REVIEW",
        }
      );

      await loadTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  const approveTask = async (task) => {
    try {
      await api.patch(
        `/tasks/${task._id}/approve`
      );

      await loadTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  const requestChanges = async (task) => {
    const note = window.prompt(
      "Enter changes requested:"
    );

    if (!note) return;

    try {
      await api.patch(
        `/tasks/${task._id}/changes-requested`,
        { note }
      );

      await loadTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter(
          (task) => task.status === filter
        );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tasks
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage task status and workflow
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto rounded-xl border bg-white p-3">

        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.replaceAll("_", " ")}
          </button>
        ))}

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Engagement</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredTasks.map((task) => {

                const canEdit =
                  user?.role === "ADMIN" ||
                  user?.role === "MANAGER" ||
                  task.assignee?._id === user?._id ||
                  task.assignee === user?._id;

                return (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                          {task.description}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {task.engagement?.periodKey || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {task.assignee?.name || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={task.status}
                      />
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex flex-wrap gap-2">

                        {canEdit &&
                          task.status !==
                            "COMPLETED" && (
                            <button
                              onClick={() => {
                                setSelectedTask(task);
                                setNewStatus(
                                  task.status
                                );
                              }}
                              className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                            >
                              Update
                            </button>
                          )}

                        {task.status ===
                          "IN_PROGRESS" &&
                          canEdit && (
                            <button
                              onClick={() =>
                                submitForReview(task)
                              }
                              className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
                            >
                              Submit
                            </button>
                          )}

                        {task.status ===
                          "READY_FOR_REVIEW" &&
                          (user?.role === "MANAGER" ||
                            user?.role === "ADMIN") && (
                            <>
                              <button
                                onClick={() =>
                                  approveTask(task)
                                }
                                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  requestChanges(task)
                                }
                                className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
                              >
                                Changes
                              </button>
                            </>
                          )}

                      </div>

                    </td>

                  </tr>
                );
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No tasks found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold">
                Update Task
              </h2>

              <button
                onClick={() =>
                  setSelectedTask(null)
                }
                className="text-gray-500 hover:text-gray-900"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="NOT_STARTED">
                    Not Started
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="WAITING_FOR_CLIENT">
                    Waiting for Client
                  </option>

                  <option value="READY_FOR_REVIEW">
                    Ready for Review
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>

              {newStatus ===
                "WAITING_FOR_CLIENT" && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Waiting Reason
                  </label>

                  <textarea
                    value={waitingReason}
                    onChange={(e) =>
                      setWaitingReason(
                        e.target.value
                      )
                    }
                    rows="3"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="What are you waiting for?"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Note
                </label>

                <textarea
                  value={note}
                  onChange={(e) =>
                    setNote(e.target.value)
                  }
                  rows="3"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Optional note"
                />
              </div>

              <div className="flex justify-end gap-3">

                <button
                  onClick={() =>
                    setSelectedTask(null)
                  }
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={updateTask}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}