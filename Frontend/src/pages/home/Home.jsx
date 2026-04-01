// Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getFeaturedItemsAPI, getCategoriesAPI } from '../../api/axios.js';
import ItemCard from '../../components/items/ItemCard.jsx';
import CategoryCard from '../../components/items/CategoryCard.jsx';
import {
  FiPlus,
  FiShoppingBag,
  FiBookOpen,
  FiMapPin,
  FiShield,
  FiZap,
  FiChevronRight,
  FiTrendingUp,
  FiClock,
  FiArrowRight,
  FiStar,
  FiUsers,
  FiHeart,
} from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();
  const [recentItems, setRecentItems] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, catRes] = await Promise.all([
        getFeaturedItemsAPI(),
        getCategoriesAPI(),
      ]);
      if (featuredRes.data.success) {
        setRecentItems(featuredRes.data.recentItems);
        setMostViewed(featuredRes.data.mostViewed);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
      }
    } catch (error) {
      console.error('Home data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FiShoppingBag className="w-6 h-6" />,
      title: 'Buy & Sell',
      description: 'Trade books, devices, and study materials with fellow students',
      color: 'from-forest to-sage',
      iconBg: 'bg-forest/10 text-forest',
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: 'Trust Score',
      description: 'Verified students with community-driven trust ratings',
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: 'Safe Meetups',
      description: 'Pre-approved campus meetup points for secure exchanges',
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: 'AI Powered',
      description: 'Smart AI-assisted listings and intelligent forum posts',
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-cream-light">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-bg opacity-95" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
          {/* Floating shapes */}
          <div className="absolute top-16 left-[15%] w-8 h-8 border-2 border-white/10 rounded-lg rotate-12 animate-bounce-soft" />
          <div
            className="absolute top-32 right-[20%] w-6 h-6 border-2 border-white/10 rounded-full animate-bounce-soft"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute bottom-24 left-[30%] w-10 h-10 border-2 border-white/10 rounded-xl rotate-45 animate-bounce-soft"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-28 lg:pb-32">
          <div className="max-w-3xl animate-fade-in">
            {/* Greeting Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 animate-slide-down">
              <span className="w-2 h-2 bg-mint rounded-full animate-pulse-soft" />
              {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
              Your Campus
              <br />
              <span className="text-mint">Marketplace</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-xl mb-8 sm:mb-10 leading-relaxed">
              Rent, sell, and discover academic resources within SHUATS campus.
              Join thousands of students trading smarter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/items/create"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white text-forest-dark rounded-2xl
                  font-semibold text-sm sm:text-base shadow-xl shadow-black/10
                  hover:shadow-2xl hover:shadow-black/15 hover:scale-[1.02]
                  transition-all duration-300"
              >
                <FiPlus className="w-5 h-5" />
                List an Item
                <FiArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
              <Link
                to="/items"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white rounded-2xl
                  font-semibold text-sm sm:text-base border border-white/20
                  hover:bg-white/25 hover:border-white/30 hover:scale-[1.02]
                  transition-all duration-300"
              >
                <FiShoppingBag className="w-5 h-5" />
                Browse Items
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-10 mt-10 sm:mt-12">
              {[
                { label: 'Active Listings', value: '500+', icon: <FiShoppingBag className="w-4 h-4" /> },
                { label: 'Students', value: '1.2K+', icon: <FiUsers className="w-4 h-4" /> },
                { label: 'Transactions', value: '2K+', icon: <FiStar className="w-4 h-4" /> },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.3 + i * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                    {stat.icon}
                    {stat.label}
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 80L60 70C120 60 240 40 360 33.3C480 27 600 33 720 40C840 47 960 53 1080 50C1200 47 1320 33 1380 27L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              fill="var(--color-cream-light)"
            />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Why Choose <span className="gradient-text">CampusMart</span>?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need for a seamless campus trading experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass rounded-2xl p-5 sm:p-6 card-hover shadow-md animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
            >
              {/* Gradient accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div
                className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Browse by Category
              </h2>
              <p className="text-gray-500 text-sm mt-1">Find exactly what you need</p>
            </div>
            <Link
              to="/items"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-dark transition-colors group"
            >
              View All
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat, index) => (
              <Link
                key={cat._id}
                to={`/items?category=${cat._id}`}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
              >
                <CategoryCard category={cat._id} count={cat.count} />
              </Link>
            ))}
          </div>

          <Link
            to="/items"
            className="sm:hidden flex items-center justify-center gap-2 mt-5 py-3 bg-white rounded-xl text-sm font-semibold text-forest border border-cream-dark hover:bg-cream transition-colors"
          >
            View All Categories
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* ===== RECENTLY ADDED ===== */}
      {recentItems.length > 0 && (
        <section className="bg-white/60 border-y border-cream-dark/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-forest/10 rounded-xl">
                  <FiClock className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Recently Added
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">Fresh listings from campus</p>
                </div>
              </div>
              <Link
                to="/items?sort=newest"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest/10 text-forest rounded-xl text-sm font-semibold
                  hover:bg-forest hover:text-white transition-all duration-300 group"
              >
                View All
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {recentItems.map((item, index) => (
                <div
                  key={item._id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
                >
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== MOST POPULAR ===== */}
      {mostViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <FiTrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Most Popular
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">Trending among students</p>
              </div>
            </div>
            <Link
              to="/items?sort=popular"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold
                hover:bg-amber-500 hover:text-white transition-all duration-300 group"
            >
              View All
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {mostViewed.map((item, index) => (
              <div
                key={item._id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 gradient-bg" />
          <div className="absolute inset-0">
            <div className="absolute top-10 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6"
            >
              <FiHeart className="w-4 h-4" />
              Join the Community
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
              Have something to sell or rent?
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              List your items and reach fellow SHUATS students instantly. It takes less than 2 minutes to create a listing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/items/create"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white text-forest-dark rounded-2xl
                  font-semibold shadow-xl shadow-black/10
                  hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <FiPlus className="w-5 h-5" />
                Create Listing
                <FiArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
              <Link
                to="/forum"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white/15 backdrop-blur-sm text-white rounded-2xl
                  font-semibold border border-white/20
                  hover:bg-white/25 transition-all duration-300"
              >
                <FiBookOpen className="w-5 h-5" />
                Visit Forum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse-soft">
                <div className="h-48 bg-cream-dark" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-cream-dark rounded-lg w-3/4" />
                  <div className="h-3 bg-cream-dark rounded-lg w-1/2" />
                  <div className="h-6 bg-cream-dark rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;