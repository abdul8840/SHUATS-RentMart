const StatusBadge = ({ status }) => {
  const getConfig = (s) => {
    const statusLower = s?.toLowerCase();
    switch (statusLower) {
      case 'approved':
      case 'active':
      case 'completed':
      case 'resolved':
        return { 
          className: 'bg-green-100 text-green-800 ring-1 ring-green-600/20', 
          label: s 
        };
      case 'pending':
        return { 
          className: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20', 
          label: s 
        };
      case 'rejected':
      case 'removed':
      case 'cancelled':
      case 'dismissed':
        return { 
          className: 'bg-red-100 text-red-800 ring-1 ring-red-600/20', 
          label: s 
        };
      case 'accepted':
      case 'rented':
        return { 
          className: 'bg-blue-100 text-blue-800 ring-1 ring-blue-600/20', 
          label: s 
        };
      case 'sold':
        return { 
          className: 'bg-purple-100 text-purple-800 ring-1 ring-purple-600/20', 
          label: s 
        };
      case 'reviewed':
        return { 
          className: 'bg-orange-100 text-orange-800 ring-1 ring-orange-600/20', 
          label: s 
        };
      default:
        return { 
          className: 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20', 
          label: s || 'Unknown' 
        };
    }
  };

  const config = getConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;