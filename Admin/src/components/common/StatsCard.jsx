const StatsCard = ({ icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    teal: 'bg-teal-100 text-teal-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  const ringClasses = {
    blue: 'ring-blue-500/20',
    green: 'ring-green-500/20',
    yellow: 'ring-yellow-500/20',
    red: 'ring-red-500/20',
    purple: 'ring-purple-500/20',
    indigo: 'ring-indigo-500/20',
    teal: 'ring-teal-500/20',
    orange: 'ring-orange-500/20',
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all ring-2 ${ringClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
        {subtitle && (
          <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;