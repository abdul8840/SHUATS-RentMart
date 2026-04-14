const SimpleChart = ({ data, title, type = 'bar' }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.count));

  return (
    <div>
      <h3>{title}</h3>
      {type === 'bar' ? (
        <div>
          {data.map((item, index) => (
            <div key={index}>
              <div>
                <span>{item._id || item.label}</span>
                <span>{item.count}</span>
              </div>
              <div>
                <div style={{ width: `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%` }}>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {data.map((item, index) => (
            <div key={index}>
              <span>{item._id || item.label}</span>
              <span>{item.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleChart;