import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import CLGImage1 from '../../assets/clg1.jpg';
import CLGImage2 from '../../assets/clg2.webp';
import CLGImage3 from '../../assets/clg3.webp';
import CLGImage4 from '../../assets/clg4.avif';

const HeroSlider = ({ user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState('next');

  const slides = [
    {
      title: 'Your Campus Marketplace',
      subtitle: 'Rent, sell, and discover academic resources within SHUATS campus',
      description: 'Join thousands of students trading smarter.',
      image: CLGImage1,
      gradient: 'from-black to-black',
      accentColor: 'text-mint',
      buttonColor: 'bg-white text-forest-dark hover:scale-[1.02]',
      stat1: { label: 'Active Listings', value: '500+' },
      stat2: { label: 'Students', value: '1.2K+' },
      stat3: { label: 'Transactions', value: '2K+' },
    },
    {
      title: 'Find Quality Books & Materials',
      subtitle: 'Browse thousands of textbooks, notes, and study materials',
      description: 'From engineering to management - everything is here.',
      image: CLGImage2,
      gradient: 'from-black to-black',
      accentColor: 'text-mint',
      buttonColor: 'bg-white text-forest-dark hover:scale-[1.02]',
      stat1: { label: 'Books Listed', value: '2.5K+' },
      stat2: { label: 'Categories', value: '50+' },
      stat3: { label: 'Avg Discount', value: '45%' },
    },
    {
      title: 'Buy & Sell Devices',
      subtitle: 'Upgrade your gadgets with verified sellers and secure transactions',
      description: 'Laptops, phones, tablets - all in one place.',
      image: CLGImage3,
      gradient: 'from-black to-black',
      accentColor: 'text-mint',
      buttonColor: 'bg-white text-forest-dark hover:scale-[1.02]',
      stat1: { label: 'Verified Sellers', value: '800+' },
      stat2: { label: 'Device Types', value: '30+' },
      stat3: { label: 'Avg Rating', value: '4.8⭐' },
    },
    {
      title: 'Connect & Trade Safely',
      subtitle: 'Trust scores, verified profiles, and campus meetup points',
      description: 'Trade with confidence within your campus community.',
      image: CLGImage4,
      gradient: 'from-black to-black',
      accentColor: 'text-mint',
      buttonColor: 'bg-white text-forest-dark hover:scale-[1.02]',
      stat1: { label: 'Trust Score', value: '100%' },
      stat2: { label: 'Safe Spots', value: '15+' },
      stat3: { label: 'Zero Scams', value: '✓' },
    },
  ];

  const slide = slides[currentSlide];

  const nextSlide = () => {
    setDirection('next');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Slides Container */}
      <div className="relative h-[700px] lg:h-[800px] overflow-hidden">
        {slides.map((s, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${s.image})`,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient} opacity-75`} />
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-20 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
                style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
              />
              <div
                className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"
                style={{ animation: 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s' }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 animate-fade-in ${
                      index === currentSlide ? 'animate-fade-in' : ''
                    }`}
                  >
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-bounce-soft" />
                    Slide {index + 1} of {slides.length}
                  </div>

                  {/* Title */}
                  <h1
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 sm:mb-6 transition-all duration-700 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {s.title.split('\n').map((line, i) => (
                      <div key={i}>
                        {i === s.title.split('\n').length - 1 ? (
                          <span className={s.accentColor}>{line}</span>
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </h1>

                  {/* Subtitle */}
                  <p
                    className={`text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl mb-4 leading-relaxed transition-all duration-700 delay-100 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {s.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    className={`text-base sm:text-lg text-white/70 max-w-xl mb-8 transition-all duration-700 delay-200 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {s.description}
                  </p>

                  {/* CTA Buttons */}
                  <div
                    className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    <Link
                      to="/items/create"
                      className={`group inline-flex items-center justify-center gap-3 px-8 py-4 ${s.buttonColor} rounded-2xl
                        font-bold text-base sm:text-lg shadow-2xl shadow-black/30
                        hover:shadow-2xl transition-all duration-300 backdrop-blur-sm`}
                    >
                      <FiPlus className="w-6 h-6" />
                      List an Item
                      <FiArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                    <Link
                      to="/items"
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl
                        font-bold text-base sm:text-lg border-2 border-white/30
                        hover:bg-white/30 hover:border-white/40 transition-all duration-300"
                    >
                      <FiShoppingBag className="w-6 h-6" />
                      Browse Items
                    </Link>
                  </div>

                  {/* Stats */}
                  <div
                    className={`grid grid-cols-3 gap-6 mt-12 sm:mt-16 transition-all duration-700 delay-500 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                  >
                    {[s.stat1, s.stat2, s.stat3].map((stat, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <p className="text-white/60 text-xs sm:text-sm font-medium mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md
          text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
      >
        <FiChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-md
          text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
      >
        <FiChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 'next' : 'prev');
              setCurrentSlide(index);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-8 h-2'
                : 'bg-white/40 w-2 h-2 hover:bg-white/60'
            }`}
          />
        ))}
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
  );
};

export default HeroSlider;