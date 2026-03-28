import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { NotificationContext } from '../../context/NotificationContext.jsx';
import NotificationDropdown from '../notifications/NotificationDropdown.jsx';
import { FiMenu, FiX, FiPlus, FiBell, FiMessageSquare, FiUser, FiLogOut, FiHome, FiGrid, FiShoppingBag, FiBookOpen, FiMapPin } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div>
        <div>
          <Link to="/">
            <span>📚 SHUATS RentMart</span>
          </Link>

          <div>
            <Link to="/">
              <FiHome /> Home
            </Link>
            <Link to="/items">
              <FiShoppingBag /> Browse
            </Link>
            <Link to="/forum">
              <FiBookOpen /> Forum
            </Link>
            <Link to="/meetup-locations">
              <FiMapPin /> Meetup
            </Link>
          </div>

          <div>
            <Link to="/items/create">
              <FiPlus /> List Item
            </Link>

            <Link to="/chat">
              <FiMessageSquare />
            </Link>

            <div>
              <button onClick={() => setNotifOpen(!notifOpen)}>
                <FiBell />
                {unreadCount > 0 && <span>{unreadCount}</span>}
              </button>
              {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
            </div>

            <div>
              <button onClick={() => setProfileOpen(!profileOpen)}>
                {user?.profileImage?.url ? (
                  <img src={user.profileImage.url} alt={user.name} />
                ) : (
                  <FiUser />
                )}
              </button>
              {profileOpen && (
                <div>
                  <div>
                    <p>{user?.name}</p>
                    <p>{user?.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setProfileOpen(false)}>
                    <FiGrid /> Dashboard
                  </Link>
                  <Link to="/profile" onClick={() => setProfileOpen(false)}>
                    <FiUser /> Profile
                  </Link>
                  <Link to="/my-listings" onClick={() => setProfileOpen(false)}>
                    <FiShoppingBag /> My Listings
                  </Link>
                  <button onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/items" onClick={() => setMenuOpen(false)}>Browse Items</Link>
            <Link to="/items/create" onClick={() => setMenuOpen(false)}>List Item</Link>
            <Link to="/forum" onClick={() => setMenuOpen(false)}>Forum</Link>
            <Link to="/chat" onClick={() => setMenuOpen(false)}>Chat</Link>
            <Link to="/meetup-locations" onClick={() => setMenuOpen(false)}>Meetup Locations</Link>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;