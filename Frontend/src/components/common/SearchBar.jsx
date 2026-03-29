import { useState, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery]     = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef              = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fade-in">
      <div className={`
        relative flex items-center gap-2
        bg-[var(--color-cream-light)] rounded-2xl
        border-2 transition-all duration-300
        shadow-sm
        ${focused
          ? 'border-[var(--color-forest)] shadow-lg shadow-[var(--color-forest)]/10'
          : 'border-[var(--color-rose-beige)]/60 hover:border-[var(--color-mint)]'
        }
      `}>

        {/* Search icon */}
        <div className={`
          pl-4 flex-shrink-0 transition-colors duration-200
          ${focused ? 'text-[var(--color-forest)]' : 'text-gray-400'}
        `}>
          <FiSearch size={18} />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="
            flex-1 py-3.5 bg-transparent text-sm text-gray-700
            placeholder:text-gray-400 focus:outline-none
          "
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              flex-shrink-0 w-6 h-6 rounded-lg
              flex items-center justify-center
              text-gray-400 hover:text-gray-600
              hover:bg-[var(--color-rose-beige)]/40
              cursor-pointer transition-all duration-150
              animate-scale-in
            "
          >
            <FiX size={14} />
          </button>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-[var(--color-rose-beige)] flex-shrink-0" />

        {/* Search button */}
        <button
          type="submit"
          className="
            flex items-center gap-2 mr-1.5 px-4 py-2.5 rounded-xl
            gradient-bg text-white text-sm font-semibold
            hover:shadow-md hover:shadow-[var(--color-forest)]/30
            hover:scale-105 active:scale-95
            cursor-pointer transition-all duration-200
            flex-shrink-0 btn-ripple
          "
        >
          <FiSearch size={14} />
          <span className="hidden sm:block">Search</span>
        </button>
      </div>

      {/* Animated underline hint */}
      {focused && query && (
        <p className="text-xs text-gray-400 mt-1.5 ml-4 animate-slide-down">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-cream)] border border-[var(--color-rose-beige)] text-[10px] font-mono">Enter</kbd> to search
        </p>
      )}
    </form>
  );
};

export default SearchBar;