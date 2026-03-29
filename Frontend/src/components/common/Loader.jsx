const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="
      fixed inset-0 z-50 flex items-center justify-center
      bg-[var(--color-cream-light)]/80 backdrop-blur-sm
      animate-fade-in
    ">
      <div className="flex flex-col items-center gap-5">

        {/* Spinner ring stack */}
        <div className="relative w-20 h-20">
          {/* Outer ring */}
          <div className="
            absolute inset-0 rounded-full border-4
            border-[var(--color-mint-light)]
          " />
          {/* Spinning arc */}
          <div className="
            absolute inset-0 rounded-full border-4 border-transparent
            border-t-[var(--color-forest)] border-r-[var(--color-sage)]
            animate-spin
          " />
          {/* Inner ring */}
          <div className="
            absolute inset-3 rounded-full border-4
            border-[var(--color-cream)]
          " />
          {/* Inner spinning arc */}
          <div className="
            absolute inset-3 rounded-full border-4 border-transparent
            border-t-[var(--color-sage)] border-l-[var(--color-mint-dark)]
            animate-[spin_0.7s_linear_infinite_reverse]
          " />
          {/* Center dot */}
          <div className="
            absolute inset-[30%] rounded-full gradient-bg
            animate-pulse-soft shadow-md
          " />
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 150}ms` }}
                className="
                  w-2 h-2 rounded-full gradient-bg
                  animate-bounce-soft
                "
              />
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--color-forest)] animate-pulse-soft">
            {message}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;