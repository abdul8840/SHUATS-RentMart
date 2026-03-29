const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div className="
      flex flex-col items-center justify-center
      py-16 px-6 text-center
      animate-fade-in
    ">
      {/* Icon container */}
      {icon && (
        <div className="
          relative mb-6
          w-24 h-24 rounded-3xl gradient-bg
          flex items-center justify-center text-white
          shadow-xl shadow-[var(--color-forest)]/25
          animate-bounce-soft
        ">
          {/* Glow ring */}
          <div className="
            absolute inset-0 rounded-3xl gradient-bg
            opacity-30 blur-xl scale-110
          " />
          <span className="relative z-10">{icon}</span>
        </div>
      )}

      {/* Decorative dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 200}ms` }}
            className="
              w-1.5 h-1.5 rounded-full bg-[var(--color-mint)]
              animate-bounce-soft
            "
          />
        ))}
      </div>

      <h3 className="
        text-xl font-extrabold text-gray-800 mb-2
        animate-slide-up
      ">
        {title}
      </h3>

      <p className="
        text-sm text-gray-500 max-w-xs leading-relaxed mb-6
        animate-slide-up
      "
        style={{ animationDelay: '80ms' }}
      >
        {message}
      </p>

      {action && (
        <div
          className="animate-slide-up"
          style={{ animationDelay: '160ms' }}
        >
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;