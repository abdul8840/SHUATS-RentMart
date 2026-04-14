const SimpleChart = ({ data, title, type = 'bar' }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.count));

  const colors = [
    'bg-green-500',
    'bg-green-600',
    'bg-green-400',
    'bg-green-700',
    'bg-green-500',
    'bg-green-600',
  ];

  return (
    <div className="space-y-4">
      {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
      {type === 'bar' ? (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 truncate max-w-[200px]">
                  {item._id || item.label}
                </span>
                <span className="font-semibold text-gray-900 ml-2">
                  {item.count}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${colors[index % colors.length]}`}
                  style={{ width: `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {item._id || item.label}
              </span>
              <span className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-full">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleChart;