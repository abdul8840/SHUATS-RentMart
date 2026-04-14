import { useAdminAuth } from '../../hooks/useAdminAuth.js';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';

const AdminHeader = ({ onToggleSidebar }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Toggle Sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-gray-800 lg:text-2xl">
            Admin Panel
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin Info */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[150px] truncate">
              {admin?.name || 'Admin'}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:scale-95"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;