import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import {
  FiHome, FiGrid, FiShoppingBag, FiList, FiInbox,
  FiSend, FiMessageSquare, FiBookOpen, FiMapPin,
  FiUser, FiEdit, FiStar
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { to: '/', icon: <FiHome size={17} />, label: 'Home', end: true },
    { to: '/dashboard', icon: <FiGrid size={17} />, label: 'Dashboard' },
    { to: '/items', icon: <FiShoppingBag size={17} />, label: 'Browse Items' },
    { to: '/my-listings', icon: <FiList size={17} />, label: 'My Listings' },
    { to: '/requests/received', icon: <FiInbox size={17} />, label: 'Received Requests' },
    { to: '/requests/sent', icon: <FiSend size={17} />, label: 'Sent Requests' },
    { to: '/chat', icon: <FiMessageSquare size={17} />, label: 'Messages' },
    { to: '/forum', icon: <FiBookOpen size={17} />, label: 'Campus Forum' },
    { to: '/meetup-locations', icon: <FiMapPin size={17} />, label: 'Meetup Points' },
    { to: '/profile', icon: <FiUser size={17} />, label: 'Profile' },
    { to: '/profile/edit', icon: <FiEdit size={17} />, label: 'Edit Profile' },
  ];

  const trustScore = user?.trustScore ?? 0;

  const getTrustLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-600' };
    if (score >= 60) return { label: 'Good', color: 'text-[var(--color-forest)]' };
    if (score >= 40) return { label: 'Fair', color: 'text-amber-500' };
    return { label: 'New', color: 'text-gray-500' };
  };

  const trust = getTrustLabel(trustScore);

  return (
    <aside className="
      w-64 xl:w-72 flex-shrink-0
      bg-[var(--color-cream-light)] border-r border-[var(--color-rose-beige)]/50
      flex flex-col h-full overflow-y-auto
      animate-slide-right
    ">

      {/* ── USER PROFILE CARD ── */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[var(--color-mint-light)] to-[var(--color-cream)] border border-[var(--color-mint)]/40 shadow-sm">

        {/* Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="
              w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center
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
                <FiUser size={28} />
              )}
            </div>
            {/* Online indicator */}
            <div className="
              absolute -bottom-1 -right-1 w-4 h-4 rounded-full
              bg-emerald-400 border-2 border-[var(--color-cream-light)]
              animate-pulse-soft
            " />
          </div>

          <h3 className="font-bold text-gray-800 text-sm leading-tight truncate w-full">
            {user?.name || 'Student'}
          </h3>
          <p className="text-xs text-[var(--color-forest)] mt-0.5 truncate w-full">
            {user?.department
              ? `${user.department} • Sem ${user?.semester}`
              : 'SHUATS University'
            }
          </p>
        </div>

        {/* Trust Score */}
        <div className="mt-3 pt-3 border-t border-[var(--color-mint)]/40">
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

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[var(--color-rose-beige)]/60 rounded-full overflow-hidden">
            <div
              className="h-full trust-bar rounded-full transition-all duration-700"
              style={{ width: `${trustScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-[var(--color-forest)] uppercase tracking-widest px-3 py-2 mt-1">
          Menu
        </p>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `
              sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium cursor-pointer select-none
              ${isActive
                ? 'nav-active animate-scale-in'
                : 'text-gray-600 hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]'
              }
              ${isActive ? '' : 'hover:translate-x-1'}
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`
                  flex-shrink-0 transition-all duration-200
                  ${isActive ? 'text-white' : 'text-[var(--color-sage)]'}
                `}>
                  {link.icon}
                </span>
                <span className="truncate">{link.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse-soft" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── BOTTOM BRAND ── */}
      <div className="px-4 py-3 border-t border-[var(--color-rose-beige)]/40">
        <p className="text-[10px] text-center text-gray-400">
          📚 SHUATS RentMart • MCA Project
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;