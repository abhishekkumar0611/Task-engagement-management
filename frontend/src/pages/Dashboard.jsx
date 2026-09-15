import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

const loadTasks = async () => {
  try {
    const data = await api.get("/tasks");

    setTasks(
      data.tasks ||
      data.data?.tasks ||
      data ||
      []
    );
  } catch (error) {
    console.error("Tasks API error:", error);

    // Keep dashboard working even if task API is unavailable
    setTasks([]);
  } finally {
    setLoading(false);
  }
};
  const openTasks = tasks.filter(
    (task) => task.status !== "COMPLETED"
  ).length;

  const overdue = tasks.filter((task) => {
    if (!task.dueDate || task.status === "COMPLETED") {
      return false;
    }

    return new Date(task.dueDate) < new Date();
  }).length;

  const today = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const date = new Date(task.dueDate);
    const now = new Date();

    return (
      date.toDateString() === now.toDateString()
    );
  }).length;

  const review = tasks.filter(
    (task) => task.status === "READY_FOR_REVIEW"
  ).length;

  const stats = [
    {
      title: "Open Tasks",
      value: openTasks,
    },
    {
      title: "Overdue",
      value: overdue,
    },
    {
      title: "Due Today",
      value: today,
    },
    {
      title: "Waiting for Review",
      value: review,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of tasks and engagement activity
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {stat.title}
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}

      </div>

      <div className="rounded-xl border bg-white shadow-sm">

        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Tasks
            </h2>

            <p className="text-sm text-gray-500">
              Latest task activity
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Task</th>
                <th className="px-6 py-3">Assignee</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Due Date</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {tasks.slice(0, 10).map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {task.title}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {task.assignee?.name || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}

              {tasks.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
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

    </div>
  );
}