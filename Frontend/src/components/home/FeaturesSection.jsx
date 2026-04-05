import { useState } from 'react';
import {
  FiShoppingBag,
  FiShield,
  FiMapPin,
  FiZap,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi';

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: <FiShoppingBag className="w-8 h-8" />,
      title: 'Buy & Sell Instantly',
      description: 'Trade books, devices, and materials with fellow students in seconds',
      longDescription: 'Our seamless marketplace connects buyers and sellers instantly with smart matching algorithms.',
      benefits: ['Instant listings', 'Real-time notifications', 'Secure payments', '24/7 support'],
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-600',
      lightBg: 'bg-green-50',
      accentBg: 'from-green-400/20 to-emerald-400/20',
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Verified Trust Scores',
      description: 'Community-driven ratings ensure you trade with verified, trustworthy members',
      longDescription: 'Every transaction builds trust. Our verified system keeps everyone accountable and safe.',
      benefits: ['Verified profiles', 'Review system', 'Dispute resolution', 'Fraud protection'],
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-600',
      lightBg: 'bg-emerald-50',
      accentBg: 'from-emerald-400/20 to-teal-400/20',
    },
    {
      icon: <FiMapPin className="w-8 h-8" />,
      title: 'Campus Meetup Points',
      description: 'Pre-approved safe locations on campus for secure, worry-free exchanges',
      longDescription: 'Trade at designated campus locations with CCTV monitoring and security presence.',
      benefits: ['Safe locations', 'CCTV monitored', 'Security present', 'Easy navigation'],
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-600',
      lightBg: 'bg-green-50',
      accentBg: 'from-green-400/20 to-emerald-400/20',
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'AI-Powered Listings',
      description: 'Smart recommendations and auto-generated descriptions for better visibility',
      longDescription: 'Leverage AI to optimize your listings and reach the right buyers faster.',
      benefits: ['Auto descriptions', 'Price optimization', 'Smart tags', 'SEO boosted'],
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-600',
      lightBg: 'bg-green-50',
      accentBg: 'from-green-400/20 to-emerald-400/20',
    },
  ];

  const feature = features[activeFeature];

  return (
    <section className="relative py-10 overflow-hidden bg-gradient-to-b from-cream-light via-white to-cream">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-mint/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div style={{
          backgroundImage: 'linear-gradient(90deg, #40916c 1px, transparent 1px), linear-gradient(#40916c 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-forest/15 to-sage/15 rounded-full text-forest text-sm font-bold mb-6 animate-fade-in border border-forest/20 backdrop-blur-sm">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-forest to-sage rounded-full animate-pulse-soft" />
            Powerful Features
            <FiArrowRight className="w-4 h-4 ml-2" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 animate-slide-up leading-tight">
            Why You'll Love <br />
            <span className="gradient-text">SHUATS RentMart</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed animate-slide-up animation-delay-100">
            Everything you need for a seamless, secure, and rewarding campus trading experience
          </p>
        </div>

        {/* Main Features Grid + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Features Grid (Left) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="space-y-3">
              {features.map((feat, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`w-full relative group overflow-hidden rounded-2xl transition-all duration-500 transform
                    animate-slide-up p-5 text-left border-2
                    ${activeFeature === index
                      ? `bg-gradient-to-br ${feat.bgGradient} ${feat.borderColor} border-2 shadow-lg shadow-black/10 -translate-y-1`
                      : `bg-white/50 border-gray-200/30 hover:border-gray-300/50`
                    }
                    ${hoveredIndex === index && activeFeature !== index ? 'border-gray-300/50 bg-white/80' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 opacity-0 ${activeFeature === index ? 'opacity-100' : ''} transition-opacity duration-500`}
                    style={{
                      backgroundImage: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 100%)',
                    }}
                  />

                  {/* Icon Badge */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white mb-3 relative z-10
                    ${activeFeature === index ? 'scale-110 shadow-lg shadow-black/20' : 'group-hover:scale-105'}
                    transition-transform duration-300`}
                  >
                    {feat.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`font-bold text-sm sm:text-base mb-1 relative z-10 transition-colors duration-300
                    ${activeFeature === index ? feat.textColor : 'text-gray-800'}
                  `}>
                    {feat.title}
                  </h3>

                  {/* Short Description */}
                  <p className={`text-xs sm:text-sm relative z-10 line-clamp-2 transition-colors duration-300
                    ${activeFeature === index ? 'text-gray-700' : 'text-gray-500'}
                  `}>
                    {feat.description}
                  </p>

                  {/* Active Indicator */}
                  {activeFeature === index && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feat.gradient} animate-pulse-soft`} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detail Panel (Right) */}
          <div className="lg:col-span-2">
            <div className={`group relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-12 transition-all duration-700
              bg-gradient-to-br ${feature.bgGradient} border-2 ${feature.borderColor}
              hover:shadow-2xl hover:shadow-black/10 animate-fade-in`}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)',
                }}
              />

              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform origin-left group-hover:scale-x-100 transition-transform duration-700`} />

              {/* Background decoration */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                      flex items-center justify-center text-white mb-6 shadow-lg shadow-black/20
                      group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500`}
                    >
                      {feature.icon}
                    </div>

                    <h3 className={`text-3xl sm:text-4xl font-black mb-3 ${feature.textColor}`}>
                      {feature.title}
                    </h3>
                  </div>

                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                    <FiArrowRight className="w-6 h-6" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {feature.longDescription}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  <p className="text-sm font-bold text-gray-800 uppercase tracking-wider">Key Benefits</p>
                  <div className="grid grid-cols-2 gap-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br ${feature.accentBg}
                          border border-white/50 backdrop-blur-sm group-hover:scale-105 transition-all duration-500
                          hover:shadow-md`}
                        style={{ transitionDelay: `${idx * 50}ms` }}
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                          <FiCheck className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${feature.gradient}
                  shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/30
                  hover:scale-105 active:scale-95 transition-all duration-300
                  flex items-center justify-center gap-2 group/btn`}
                >
                  <span>Learn More</span>
                  <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { number: '500+', label: 'Active Listings' },
                { number: '1.2K+', label: 'Happy Students' },
                { number: '2K+', label: 'Transactions' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border-2 ${feature.borderColor}
                    text-center group/stat hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                    animate-slide-up`}
                  style={{ animationDelay: `${0.3 + idx * 0.1}s`, animationFillMode: 'both' }}
                >
                  <p className={`text-2xl sm:text-3xl font-black ${feature.textColor} mb-1`}>
                    {stat.number}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;