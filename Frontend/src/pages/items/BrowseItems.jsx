import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getItemsAPI } from '../../api/axios.js';
import ItemGrid from '../../components/items/ItemGrid.jsx';
import ItemFilters from '../../components/items/ItemFilters.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Pagination from '../../components/common/Pagination.jsx';

const BrowseItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    department: searchParams.get('department') || '',
    semester: searchParams.get('semester') || '',
    condition: searchParams.get('condition') || '',
    listingType: searchParams.get('listingType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const { data } = await getItemsAPI(params);
      if (data.success) {
        setItems(data.items);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Fetch items error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleReset = () => {
    setFilters({ search: '', category: '', department: '', semester: '', condition: '', listingType: '', minPrice: '', maxPrice: '', page: 1 });
  };

  return (
    <div>
      <h1>Browse Items</h1>

      <SearchBar onSearch={handleSearch} placeholder="Search items..." />
      <ItemFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
      <ItemGrid items={items} loading={loading} />
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

export default BrowseItems;