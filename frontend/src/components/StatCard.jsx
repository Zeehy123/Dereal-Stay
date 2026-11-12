const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-gray-500">{title}</p>

      <h2 className="text-3xl font-semibold mt-2">{value}</h2>
    </div>
  );
};

export default StatCard;
