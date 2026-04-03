// NotFound.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiArrowLeft,
  FiSearch,
  FiShoppingBag,
  FiMessageSquare,
  FiMapPin,
  FiCompass,
} from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState(15);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const quickLinks = [
    {
      icon: <FiHome className="w-5 h-5" />,
      label: 'Home',
      description: 'Go to homepage',
      to: '/',
      color: 'bg-forest/10 text-forest hover:bg-forest hover:text-white',
    },
    {
      icon: <FiShoppingBag className="w-5 h-5" />,
      label: 'Browse Items',
      description: 'Find items to buy or rent',
      to: '/items',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
    },
    {
      icon: <FiMessageSquare className="w-5 h-5" />,
      label: 'Forum',
      description: 'Join discussions',
      to: '/forum',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white',
    },
    {
      icon: <FiMapPin className="w-5 h-5" />,
      label: 'Meetup Points',
      description: 'Campus locations',
      to: '/meetup-locations',
      color: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-light flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles with parallax */}
        <div
          className="absolute top-[10%] left-[10%] w-72 h-72 bg-forest/5 rounded-full blur-3xl"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        />
        <div
          className="absolute bottom-[15%] right-[10%] w-96 h-96 bg-sage/5 rounded-full blur-3xl"
          style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
        />
        <div
          className="absolute top-[40%] right-[30%] w-48 h-48 bg-mint/10 rounded-full blur-2xl"
          style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }}
        />

        {/* Floating shapes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce-soft opacity-10"
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + i * 16}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          >
            <div
              className={`${i % 2 === 0 ? 'w-6 h-6 border-2 border-forest rounded-lg' : 'w-4 h-4 border-2 border-sage rounded-full'}
                ${i % 3 === 0 ? 'rotate-45' : 'rotate-12'}`}
            />
          </div>
        ))}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--color-forest) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* 404 Number */}
        <div className="relative mb-6 animate-fade-in">
          {/* Shadow text */}
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <span
              className="text-[12rem] sm:text-[16rem] lg:text-[20rem] font-black text-forest/[0.03] leading-none"
              style={{
                transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
              }}
            >
              404
            </span>
          </div>

          {/* Main 404 */}
          <div className="relative">
            <h1
              className="text-8xl sm:text-9xl lg:text-[10rem] font-black gradient-text leading-none select-none"
              style={{
                transform: `translate(${mousePos.x * -0.05}px, ${mousePos.y * -0.05}px)`,
              }}
            >
              404
            </h1>
          </div>
        </div>

        {/* Compass animation */}
        <div className="flex justify-center mb-6 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-forest/10 to-sage/10 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-forest/10">
                <FiCompass
                  className="w-8 h-8 text-forest"
                  style={{
                    transform: `rotate(${mousePos.x * 2}deg)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                />
              </div>
            </div>
            {/* Orbiting dot */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-sage rounded-full shadow-md" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-2">
            The page you're looking for seems to have wandered off campus.
            Let's get you back on track!
          </p>
          <p className="text-xs text-gray-400">
            Auto-redirecting to home in{' '}
            <span className="inline-flex items-center justify-center w-6 h-6 bg-forest/10 text-forest font-bold rounded-full text-[11px]">
              {countdown}
            </span>{' '}
            seconds
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 animate-slide-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-2xl
              font-semibold text-sm border-2 border-gray-200 shadow-sm
              hover:bg-cream hover:border-cream-dark hover:text-gray-900
              transition-all duration-300 cursor-pointer group w-full sm:w-auto"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-forest to-sage text-white rounded-2xl
              font-semibold text-sm shadow-lg shadow-forest/25
              hover:shadow-xl hover:shadow-forest/35 hover:scale-[1.02]
              transition-all duration-300 w-full sm:w-auto"
          >
            <FiHome className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Quick Links */}
        <div
          className="mt-10 animate-slide-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Or try one of these pages
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="group glass rounded-xl p-4 text-center card-hover shadow-sm"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5 transition-all duration-300 ${link.color}`}
                >
                  {link.icon}
                </div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-forest transition-colors mb-0.5">
                  {link.label}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Search suggestion */}
        <div
          className="mt-8 animate-slide-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <Link
            to="/items"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream rounded-xl text-sm text-gray-500 hover:text-forest hover:bg-cream-dark transition-all group"
          >
            <FiSearch className="w-4 h-4" />
            Search for items instead
            <span className="text-xs px-1.5 py-0.5 bg-white rounded text-gray-400 group-hover:text-forest group-hover:bg-forest/10 transition-colors">
              ⌘K
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
