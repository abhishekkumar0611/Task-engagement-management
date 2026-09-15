const styles = {
  NOT_STARTED:
    "bg-gray-100 text-gray-700",

  IN_PROGRESS:
    "bg-blue-100 text-blue-700",

  WAITING_FOR_CLIENT:
    "bg-yellow-100 text-yellow-700",

  READY_FOR_REVIEW:
    "bg-purple-100 text-purple-700",

  CHANGES_REQUESTED:
    "bg-orange-100 text-orange-700",

  COMPLETED:
    "bg-green-100 text-green-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status?.replaceAll("_", " ")}
    </span>
  );
}