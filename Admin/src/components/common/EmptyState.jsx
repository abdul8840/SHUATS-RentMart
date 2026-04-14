const EmptyState = ({ icon, title, message }) => {
  return (
    <div>
      {icon && <div>{icon}</div>}
      <h3>{title || 'No data'}</h3>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmptyState;