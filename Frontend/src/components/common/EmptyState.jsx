const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div>
      {icon && <div>{icon}</div>}
      <h3>{title}</h3>
      <p>{message}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;