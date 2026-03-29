import { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiSliders } from 'react-icons/fi';

const categories = [
  'Books', 'Previous Year Papers', 'Calculators', 'Electronic Devices',
  'Lab Equipment', 'Stationery', 'Sports Equipment', 'Musical Instruments',
  'Clothing', 'Furniture', 'Other',
];
const conditions  = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const departments = [
  'MCA', 'BCA', 'B.Tech CSE', 'B.Tech ME', 'B.Tech CE',
  'B.Tech EE', 'B.Tech ECE', 'MBA', 'MSc', 'BSc', 'BA', 'Other',
];

/* ── reusable styled select ── */
const FilterSelect = ({ label, value, onChange, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="
          w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm
          bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/70
          text-gray-700 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
          focus:border-[var(--color-sage)]
          hover:border-[var(--color-mint)] hover:bg-[var(--color-mint-light)]/30
          transition-all duration-200
        "
      >
        {children}
      </select>
      <FiChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  </div>
);

/* ── reusable price input ── */
const PriceInput = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-forest)] text-sm font-bold">
        ₹
      </span>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full pl-7 pr-3 py-2.5 rounded-xl text-sm
          bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/70
          text-gray-700
          focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
          focus:border-[var(--color-sage)]
          hover:border-[var(--color-mint)] hover:bg-[var(--color-mint-light)]/30
          transition-all duration-200
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
        "
      />
    </div>
  </div>
);

const ItemFilters = ({ filters, onFilterChange, onReset }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key, value) =>
    onFilterChange({ ...filters, [key]: value });

  /* count active filters */
  const activeCount = Object.values(filters).filter(
    (v) => v !== '' && v !== null && v !== undefined
  ).length;

  return (
    <div className="w-full animate-fade-in">

      {/* ── FILTER TOGGLE BUTTON ── */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="
          flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
          bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/70
          text-[var(--color-forest)] cursor-pointer
          hover:bg-[var(--color-mint-light)] hover:border-[var(--color-sage)]
          hover:shadow-md active:scale-95
          transition-all duration-200 group
        "
      >
        <FiSliders
          size={16}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
        <span>Filters</span>

        {/* Active filter badge */}
        {activeCount > 0 && (
          <span className="
            w-5 h-5 rounded-full gradient-bg text-white text-xs
            font-bold flex items-center justify-center
            animate-scale-in
          ">
            {activeCount}
          </span>
        )}

        <FiChevronDown
          size={14}
          className={`
            ml-auto text-gray-400 transition-transform duration-300
            ${showFilters ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <div className="
          mt-3 p-5 rounded-2xl animate-slide-down
          bg-[var(--color-cream-light)] border border-[var(--color-rose-beige)]/60
          shadow-xl shadow-black/5
        ">
          {/* Panel header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <FiFilter size={13} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Filter Items</h3>
              {activeCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-mint-light)] text-[var(--color-forest)] text-xs font-semibold">
                  {activeCount} active
                </span>
              )}
            </div>

            {/* Clear button */}
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  text-red-500 bg-red-50 hover:bg-red-100
                  cursor-pointer transition-all duration-200
                  hover:scale-105 active:scale-95
                "
              >
                <FiX size={12} />
                Clear All
              </button>
            )}
          </div>

          {/* Filter grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

            {/* Listing Type */}
            <FilterSelect
              label="Listing Type"
              value={filters.listingType || ''}
              onChange={(e) => handleChange('listingType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="rent">🔄 For Rent</option>
              <option value="sell">🏷️ For Sale</option>
            </FilterSelect>

            {/* Category */}
            <FilterSelect
              label="Category"
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </FilterSelect>

            {/* Department */}
            <FilterSelect
              label="Department"
              value={filters.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </FilterSelect>

            {/* Semester */}
            <FilterSelect
              label="Semester"
              value={filters.semester || ''}
              onChange={(e) => handleChange('semester', e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </FilterSelect>

            {/* Condition */}
            <FilterSelect
              label="Condition"
              value={filters.condition || ''}
              onChange={(e) => handleChange('condition', e.target.value)}
            >
              <option value="">Any Condition</option>
              {conditions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </FilterSelect>

            {/* Min Price */}
            <PriceInput
              label="Min Price"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />

            {/* Max Price */}
            <PriceInput
              label="Max Price"
              placeholder="Any"
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--color-rose-beige)]/40">
              <p className="text-xs text-gray-500 mb-2 font-medium">Active filters:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, val]) => {
                  if (!val) return null;
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (s) => s.toUpperCase());
                  return (
                    <span
                      key={key}
                      className="
                        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                        bg-[var(--color-mint-light)] text-[var(--color-forest)]
                        text-xs font-medium border border-[var(--color-mint)]/40
                        animate-scale-in
                      "
                    >
                      {label}: <strong>{val}</strong>
                      <button
                        onClick={() => handleChange(key, '')}
                        className="
                          ml-0.5 hover:text-red-500 cursor-pointer
                          transition-colors duration-150
                        "
                      >
                        <FiX size={11} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemFilters;