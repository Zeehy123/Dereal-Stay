const compact = (n) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `₦${Math.round(n / 1000)}k` : `₦${n}`;

const DashboardMetrics = ({ data }) => {
  const metrics = [
    { title: "Available", value: data.rooms.available, bg: "bg-green-50", text: "text-green-700" },
    { title: "Occupied", value: data.rooms.occupied, bg: "bg-red-50", text: "text-red-700" },
    { title: "Maintenance", value: data.rooms.maintenance, bg: "bg-gray-50", text: "text-gray-700" },
    { title: "Revenue", value: compact(Number(data.revenue.total)), bg: "bg-orange-50", text: "text-orange-700" },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className={`${metric.bg} rounded-2xl p-8 text-center`}
        >
          <h2 className={`text-3xl font-semibold ${metric.text}`}>
            {metric.value}
          </h2>

          <p
            className={`uppercase tracking-widest text-sm mt-2 ${metric.text}`}
          >
            {metric.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;
