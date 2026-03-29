import { Link } from 'react-router-dom';
import {
  FiShoppingBag, FiBookOpen, FiMapPin,
  FiMail, FiHeart, FiGithub, FiExternalLink
} from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: '/items', icon: <FiShoppingBag size={13} />, label: 'Browse Items' },
    { to: '/forum', icon: <FiBookOpen size={13} />, label: 'Campus Forum' },
    { to: '/meetup-locations', icon: <FiMapPin size={13} />, label: 'Meetup Locations' },
  ];

  return (
    <footer className="footer-gradient text-white mt-auto">

      {/* ── DECORATIVE TOP BORDER ── */}
      <div className="h-1 gradient-bg opacity-80" />

      {/* ── MAIN FOOTER CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* ── BRAND COLUMN ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="
                w-10 h-10 rounded-xl gradient-bg flex items-center justify-center
                text-xl shadow-lg animate-bounce-soft
              ">
                📚
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">
                  SHUATS RentMart
                </h3>
                <p className="text-[var(--color-mint)] text-xs">Campus Marketplace</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              A Student Rental, Resale & Campus Forum Platform built exclusively
              for SHUATS University students.
            </p>

            {/* Stats badges */}
            <div className="flex gap-3 mt-5 flex-wrap">
              {[
                { value: '500+', label: 'Students' },
                { value: '1K+', label: 'Listings' },
                { value: '4.8★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="
                  px-3 py-1.5 rounded-lg
                  bg-white/10 backdrop-blur-sm border border-white/10
                  text-center
                ">
                  <p className="text-xs font-bold text-[var(--color-mint)]">{stat.value}</p>
                  <p className="text-[10px] text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── QUICK LINKS COLUMN ── */}
          <div>
            <h4 className="
              font-semibold text-sm uppercase tracking-widest
              text-[var(--color-mint)] mb-4
            ">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="
                      flex items-center gap-2.5 text-sm text-gray-300
                      hover:text-[var(--color-mint)] cursor-pointer
                      transition-all duration-200 group
                      hover:translate-x-1
                    "
                  >
                    <span className="
                      text-[var(--color-sage)] group-hover:text-[var(--color-mint)]
                      transition-colors duration-200
                    ">
                      {link.icon}
                    </span>
                    {link.label}
                    <FiExternalLink
                      size={11}
                      className="opacity-0 group-hover:opacity-60 transition-opacity ml-auto"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── SUPPORT COLUMN ── */}
          <div>
            <h4 className="
              font-semibold text-sm uppercase tracking-widest
              text-[var(--color-mint)] mb-4
            ">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@shuats.com"
                  className="
                    flex items-center gap-2.5 text-sm text-gray-300
                    hover:text-[var(--color-mint)] cursor-pointer
                    transition-all duration-200 group
                  "
                >
                  <FiMail
                    size={13}
                    className="text-[var(--color-sage)] group-hover:text-[var(--color-mint)]
                    transition-colors flex-shrink-0"
                  />
                  support@shuats.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-300">
                <FiHeart
                  size={13}
                  className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse-soft"
                />
                <span>Made with love for MCA Final Year Project</span>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-2.5 text-sm text-gray-300
                    hover:text-[var(--color-mint)] cursor-pointer
                    transition-all duration-200 group
                  "
                >
                  <FiGithub
                    size={13}
                    className="text-[var(--color-sage)] group-hover:text-[var(--color-mint)]
                    transition-colors"
                  />
                  View on GitHub
                </a>
              </li>
            </ul>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-1.5 mt-5">
              {['React', 'Node.js', 'MongoDB', 'Tailwind'].map((tech) => (
                <span key={tech} className="
                  px-2 py-0.5 rounded-md text-[10px] font-medium
                  bg-white/10 text-gray-300 border border-white/10
                  hover:bg-[var(--color-forest)]/50 hover:text-white
                  cursor-default transition-all duration-200
                ">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/10">
        <div className="
          max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          py-4 flex flex-col sm:flex-row items-center
          justify-between gap-2 text-xs text-gray-500
        ">
          <p>
            © {year}{' '}
            <span className="text-[var(--color-mint)] font-medium">SHUATS RentMart</span>
            {' '}· All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-gray-500">
            <span>Built with</span>
            <FiHeart size={11} className="text-red-400 animate-pulse-soft" />
            <span>for SHUATS students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;