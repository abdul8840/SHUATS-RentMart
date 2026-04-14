import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = ({ onSearch, placeholder = 'Search...', value = '' }) => {
  const [query, setQuery] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FiSearch />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" onClick={handleClear}><FiX /></button>
        )}
        <button type="submit">Search</button>
      </div>
    </form>
  );
};

export default SearchInput;