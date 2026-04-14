const StatusBadge = ({ status }) => {
  const getConfig = (s) => {
    switch (s?.toLowerCase()) {
      case 'approved': case 'active': case 'completed': case 'resolved':
        return { color: 'green', label: s };
      case 'pending':
        return { color: 'yellow', label: s };
      case 'rejected': case 'removed': case 'cancelled': case 'dismissed':
        return { color: 'red', label: s };
      case 'accepted': case 'rented':
        return { color: 'blue', label: s };
      case 'sold':
        return { color: 'purple', label: s };
      case 'reviewed':
        return { color: 'orange', label: s };
      default:
        return { color: 'gray', label: s || 'Unknown' };
    }
  };

  const config = getConfig(status);

  return (
    <span data-color={config.color}>
      {config.label}
    </span>
  );
};

export default StatusBadge;