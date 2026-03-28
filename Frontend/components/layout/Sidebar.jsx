import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { FiHome, FiGrid, FiShoppingBag, FiList, FiInbox, FiSend, FiMessageSquare, FiBookOpen, FiMapPin, FiUser, FiEdit } from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/', icon: <FiHome />, label: 'Home' },
    { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/items', icon: <FiShoppingBag />, label: 'Browse Items' },
    { to: '/my-listings', icon: <FiList />, label: 'My Listings' },
    { to: '/requests/received', icon: <FiInbox />, label: 'Received Requests' },
    { to: '/requests/sent', icon: <FiSend />, label: 'Sent Requests' },
    { to: '/chat', icon: <FiMessageSquare />, label: 'Messages' },
    { to: '/forum', icon: <FiBookOpen />, label: 'Campus Forum' },
    { to: '/meetup-locations', icon: <FiMapPin />, label: 'Meetup Points' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
    { to: '/profile/edit', icon: <FiEdit />, label: 'Edit Profile' }
  ];

  return (
    <aside>
      <div>
        {user?.profileImage?.url ? (
          <img src={user.profileImage.url} alt={user.name} />
        ) : (
          <div><FiUser /></div>
        )}
        <h3>{user?.name}</h3>
        <p>{user?.department} - Sem {user?.semester}</p>
        <p>Trust Score: {user?.trustScore}/100</p>
      </div>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'}>
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;