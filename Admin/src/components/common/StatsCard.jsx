const StatsCard = ({ icon, title, value, subtitle, color = 'blue' }) => {
  return (
    <div data-color={color}>
      <div>
        <div>{icon}</div>
        <div>
          <p>{title}</p>
          <h3>{value}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;