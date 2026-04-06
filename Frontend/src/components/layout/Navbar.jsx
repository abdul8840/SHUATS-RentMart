import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
  FiMenu, FiX, FiPlus, FiBell, FiMessageSquare,
  FiUser, FiLogOut, FiHome, FiGrid, FiShoppingBag,
  FiBookOpen, FiMapPin, FiChevronDown, FiList, FiInbox,
  FiSend, FiEdit, FiStar
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close profile dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── close mobile menu on route change ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/', icon: <FiHome size={16} />, label: 'Home' },
    { to: '/items', icon: <FiShoppingBag size={16} />, label: 'Browse' },
    { to: '/forum', icon: <FiBookOpen size={16} />, label: 'Forum' },
    { to: '/meetup-locations', icon: <FiMapPin size={16} />, label: 'Meetup' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const trustScore = user?.trustScore ?? 0;

  const getTrustLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600', bgColor: 'bg-emerald-100' };
    if (score >= 60) return { label: 'Good', color: 'text-[var(--color-forest)]', bgColor: 'bg-[var(--color-mint-light)]' };
    if (score >= 40) return { label: 'Fair', color: 'text-amber-500', bgColor: 'bg-amber-100' };
    return { label: 'New', color: 'text-gray-500', bgColor: 'bg-gray-100' };
  };

  const trust = getTrustLabel(trustScore);

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 navbar-glass
          transition-all duration-300
          ${scrolled ? 'shadow-lg shadow-[var(--color-forest)]/10' : ''}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── LOGO ── */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="
                w-9 h-9 rounded-xl gradient-bg flex items-center justify-center
                shadow-md group-hover:shadow-lg group-hover:scale-105
                transition-all duration-300 text-lg
              ">
                📚
              </div>
              <span className="
                text-lg font-bold gradient-text hidden sm:block
                tracking-tight
              ">
                SHUATS RentMart
              </span>
            </Link>

            {/* ── DESKTOP NAV LINKS ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                    cursor-pointer transition-all duration-200
                    ${isActive(link.to)
                      ? 'nav-active'
                      : 'text-[var(--color-forest-dark)] hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]'
                    }
                  `}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ── RIGHT ACTIONS ── */}
            <div className="flex items-center gap-2">

              {/* List Item Button */}
              <Link
                to="/items/create"
                className="
                  hidden sm:flex items-center gap-1.5
                  px-4 py-2 rounded-xl text-sm font-semibold
                  gradient-bg text-white cursor-pointer
                  hover:shadow-lg hover:shadow-[var(--color-forest)]/30
                  hover:scale-105 active:scale-95
                  transition-all duration-200 btn-ripple
                "
              >
                <FiPlus size={16} />
                <span className="hidden md:block">List Item</span>
              </Link>

              {/* Chat Icon */}
              <Link
                to="/chat"
                className="
                  relative w-10 h-10 rounded-xl flex items-center justify-center
                  text-[var(--color-forest)] bg-[var(--color-mint-light)]
                  hover:bg-[var(--color-mint)] hover:scale-105
                  cursor-pointer transition-all duration-200
                "
              >
                <FiMessageSquare size={18} />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="
                    flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl
                    hover:bg-[var(--color-mint-light)] cursor-pointer
                    transition-all duration-200 group
                  "
                >
                  {/* Avatar */}
                  <div className="
                    w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center
                    bg-gradient-to-br from-[var(--color-forest)] to-[var(--color-sage)]
                    text-white shadow-md group-hover:shadow-lg
                    transition-all duration-200 relative
                  ">
                    {user?.profileImage?.url ? (
                      <img
                        src={user.profileImage.url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser size={16} />
                    )}
                    {/* Online indicator */}
                    <div className="
                      absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full
                      bg-emerald-400 border border-white
                    " />
                  </div>
                  <FiChevronDown
                    size={14}
                    className={`
                      text-[var(--color-forest)] hidden sm:block
                      transition-transform duration-200
                      ${profileOpen ? 'rotate-180' : ''}
                    `}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div className="
                    absolute right-0 top-full mt-2 w-72
                    bg-[var(--color-cream-light)] rounded-2xl
                    shadow-2xl shadow-black/10 border border-[var(--color-rose-beige)]/50
                    overflow-hidden z-50 animate-slide-down
                  ">
                    {/* User info header */}
                    <div className="
                      px-4 py-4 bg-gradient-to-br
                      from-[var(--color-mint-light)] to-[var(--color-cream)]
                      border-b border-[var(--color-rose-beige)]/40
                    ">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="
                          w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center
                          bg-gradient-to-br from-[var(--color-forest)] to-[var(--color-sage)]
                          text-white shadow-lg flex-shrink-0 relative
                        ">
                          {user?.profileImage?.url ? (
                            <img src={user.profileImage.url} alt={user.name}
                              className="w-full h-full object-cover" />
                          ) : (
                            <FiUser size={20} />
                          )}
                          {/* Online indicator */}
                          <div className="
                            absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full
                            bg-emerald-400 border-2 border-[var(--color-cream-light)]
                            animate-pulse-soft
                          " />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-800 truncate">
                            {user?.name || 'Student'}
                          </p>
                          <p className="text-xs text-[var(--color-forest)] truncate">
                            {user?.department
                              ? `${user.department} • Sem ${user?.semester}`
                              : 'SHUATS University'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Trust Score */}
                      <div className="pt-3 border-t border-[var(--color-mint)]/40">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <FiStar size={12} className="text-amber-400" />
                            <span className="font-medium">Trust Score</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${trust.color}`}>
                              {trustScore}/100
                            </span>
                            <span className={`
                              text-[10px] font-semibold px-2 py-0.5 rounded-full
                              ${trust.color} ${trust.bgColor}
                            `}>
                              {trust.label}
                            </span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-2 bg-[var(--color-rose-beige)]/60 rounded-full overflow-hidden">
                          <div
                            className="h-full trust-bar rounded-full transition-all duration-700"
                            style={{ width: `${trustScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5 px-1.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {/* Main Menu Section */}
                      <div className="px-2 py-1">
                        <p className="text-[10px] font-semibold text-[var(--color-forest)] uppercase tracking-widest mb-1">
                          Menu
                        </p>
                      </div>

                      {[
                        { to: '/dashboard', icon: <FiGrid size={15} />, label: 'Dashboard' },
                        { to: '/profile', icon: <FiUser size={15} />, label: 'Profile' },
                        { to: '/profile/edit', icon: <FiEdit size={15} />, label: 'Edit Profile' },
                        { to: '/my-listings', icon: <FiList size={15} />, label: 'My Listings' },
                        { to: '/forum/my-posts', icon: <FiList size={16} />, label: 'My Forum Posts' },
                        { to: '/requests/received', icon: <FiInbox size={15} />, label: 'Received Requests' },
                        { to: '/requests/sent', icon: <FiSend size={15} />, label: 'Sent Requests' },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                            cursor-pointer transition-all duration-150 group
                            ${isActive(item.to)
                              ? 'bg-gradient-to-r from-[var(--color-forest)] to-[var(--color-sage)] text-white'
                              : 'text-gray-700 hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]'
                            }
                          `}
                        >
                          <span className={`
                            transition-colors duration-150
                            ${isActive(item.to)
                              ? 'text-white'
                              : 'text-[var(--color-sage)] group-hover:text-[var(--color-forest)]'
                            }
                          `}>
                            {item.icon}
                          </span>
                          <span className="flex-1">{item.label}</span>
                          {isActive(item.to) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse-soft" />
                          )}
                        </Link>
                      ))}

                      <div className="border-t border-[var(--color-rose-beige)]/40 my-1.5" />

                      <button
                        onClick={handleLogout}
                        className="
                          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                          text-red-500 hover:bg-red-50 w-full cursor-pointer
                          transition-all duration-150 group
                        "
                      >
                        <FiLogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        Logout
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-[var(--color-rose-beige)]/40 bg-[var(--color-cream)]">
                      <p className="text-[10px] text-center text-gray-400">
                        📚 SHUATS RentMart • MCA Project
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="
                  lg:hidden w-10 h-10 rounded-xl flex items-center justify-center
                  text-[var(--color-forest)] bg-[var(--color-mint-light)]
                  hover:bg-[var(--color-mint)] hover:scale-105
                  cursor-pointer transition-all duration-200
                "
              >
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <>
            {/* Overlay */}
            <div
              className="menu-overlay lg:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="
              lg:hidden absolute top-full left-0 right-0
              bg-[var(--color-cream-light)] border-t border-[var(--color-rose-beige)]/50
              shadow-2xl animate-slide-down z-50 max-h-[80vh] overflow-y-auto
            ">
              {/* User Profile Card - Mobile */}
              <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[var(--color-mint-light)] to-[var(--color-cream)] border border-[var(--color-mint)]/40 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="
                      w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center
                      bg-gradient-to-br from-[var(--color-forest)] to-[var(--color-sage)]
                      text-white shadow-lg
                    ">
                      {user?.profileImage?.url ? (
                        <img
                          src={user.profileImage.url}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser size={20} />
                      )}
                    </div>
                    <div className="
                      absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full
                      bg-emerald-400 border-2 border-[var(--color-cream-light)]
                      animate-pulse-soft
                    " />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-800 truncate">
                      {user?.name || 'Student'}
                    </h3>
                    <p className="text-xs text-[var(--color-forest)] truncate">
                      {user?.department
                        ? `${user.department} • Sem ${user?.semester}`
                        : 'SHUATS University'
                      }
                    </p>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="pt-3 border-t border-[var(--color-mint)]/40">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <FiStar size={11} className="text-amber-400" />
                      <span>Trust Score</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-bold ${trust.color}`}>
                        {trustScore}/100
                      </span>
                      <span className={`text-[10px] font-medium ${trust.color}`}>
                        · {trust.label}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-[var(--color-rose-beige)]/60 rounded-full overflow-hidden">
                    <div
                      className="h-full trust-bar rounded-full transition-all duration-700"
                      style={{ width: `${trustScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile nav links */}
              <div className="px-4 pt-2 pb-2 space-y-1">
                <p className="text-xs font-semibold text-[var(--color-forest)] uppercase tracking-wider px-3 mb-2">
                  Navigation
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      cursor-pointer transition-all duration-200
                      ${isActive(link.to)
                        ? 'nav-active'
                        : 'text-gray-700 hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]'
                      }
                    `}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-[var(--color-rose-beige)]/40 mx-4 my-2" />

              {/* Mobile account links */}
              <div className="px-4 pb-4 space-y-1">
                <p className="text-xs font-semibold text-[var(--color-forest)] uppercase tracking-wider px-3 mb-2">
                  Account
                </p>
                {[
                  { to: '/items/create', icon: <FiPlus size={16} />, label: 'List Item', highlight: true },
                  { to: '/chat', icon: <FiMessageSquare size={16} />, label: 'Messages' },
                  { to: '/dashboard', icon: <FiGrid size={16} />, label: 'Dashboard' },
                  { to: '/profile', icon: <FiUser size={16} />, label: 'Profile' },
                  { to: '/profile/edit', icon: <FiEdit size={16} />, label: 'Edit Profile' },
                  { to: '/my-listings', icon: <FiList size={16} />, label: 'My Listings' },
                  { to: '/forum/my-posts', icon: <FiList size={16} />, label: 'My Forum Posts' },
                  { to: '/requests/received', icon: <FiInbox size={16} />, label: 'Received Requests' },
                  { to: '/requests/sent', icon: <FiSend size={16} />, label: 'Sent Requests' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      cursor-pointer transition-all duration-200
                      ${item.highlight
                        ? 'gradient-bg text-white shadow-md'
                        : 'text-gray-700 hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]'
                      }
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    text-red-500 hover:bg-red-50 w-full cursor-pointer
                    transition-all duration-200
                  "
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Navbar spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;