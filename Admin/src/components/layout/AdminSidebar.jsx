import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiUserCheck, FiShoppingBag, FiRepeat,
  FiBookOpen, FiFileText, FiAlertTriangle, FiMapPin, FiBarChart2,
  FiPlusCircle, FiCheckSquare, FiX
} from 'react-icons/fi';

const AdminSidebar = ({ isOpen, onClose }) => {
  const links = [
    { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/users/pending', icon: <FiUserCheck />, label: 'Pending Approvals' },
    { to: '/users', icon: <FiUsers />, label: 'All Users' },
    { to: '/items', icon: <FiShoppingBag />, label: 'Manage Items' },
    { to: '/requests', icon: <FiRepeat />, label: 'Manage Requests' },
    { to: '/forum/access-requests', icon: <FiCheckSquare />, label: 'Forum Access' },
    { to: '/forum/posts', icon: <FiBookOpen />, label: 'Forum Posts' },
    { to: '/forum/create', icon: <FiPlusCircle />, label: 'Create Post' },
    { to: '/reports', icon: <FiAlertTriangle />, label: 'Reports' },
    { to: '/meetup-locations', icon: <FiMapPin />, label: 'Meetup Locations' },
    { to: '/analytics', icon: <FiBarChart2 />, label: 'Analytics' }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-xl font-bold text-white">RentMart</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-800 lg:hidden focus:outline-none"
            aria-label="Close Sidebar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800">
          <div className="px-4 py-3 bg-gray-800 rounded-lg">
            <p className="text-xs font-semibold text-green-500">SHUATS RentMart v1.0</p>
            <p className="mt-1 text-xs text-gray-400">Admin Control Panel</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;