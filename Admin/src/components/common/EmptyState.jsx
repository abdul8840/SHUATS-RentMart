const EmptyState = ({ icon, title, message }) => {
  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="text-3xl">{icon}</span>
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title || 'No data'}
        </h3>
        {message && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;