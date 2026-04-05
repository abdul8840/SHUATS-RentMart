import { Link } from 'react-router-dom';
import { FiMessageSquare, FiUsers, FiStar, FiArrowRight, FiHeart } from 'react-icons/fi';

const CampusForumBanner = () => {
  const stats = [
    { icon: <FiMessageSquare className="w-5 h-5" />, label: 'Active Discussions', value: '500+' },
    { icon: <FiUsers className="w-5 h-5" />, label: 'Community Members', value: '1K+' },
    { icon: <FiStar className="w-5 h-5" />, label: 'Topics', value: '200+' },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="">
        <div className="relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/90 to-sage/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-mint/20 rounded-full blur-2xl animate-bounce-soft" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6 animate-fade-in">
                <FiHeart className="w-4 h-4" />
                Join Our Community
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight animate-slide-up">
                Explore the Campus Forum
              </h2>

              {/* Description */}
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-8 leading-relaxed animate-slide-up animation-delay-100">
                Connect with fellow students, ask questions, share experiences, and get advice from the SHUATS community. From academics to campus life, discuss it all!
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10 animate-slide-up animation-delay-200">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white/15 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/20">
                    <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm mb-2">
                      {stat.icon}
                      {stat.label}
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-300">
                <Link
                  to="/forum"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-forest rounded-2xl
                    font-bold text-base sm:text-lg shadow-2xl shadow-black/30
                    hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <FiMessageSquare className="w-6 h-6" />
                  Visit Forum
                  <FiArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>

                <Link
                  to="/items/create"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl
                    font-bold text-base sm:text-lg border-2 border-white/30
                    hover:bg-white/30 transition-all duration-300"
                >
                  <FiUsers className="w-6 h-6" />
                  Explore
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="hidden lg:block absolute right-0 top-0 w-1/3 h-full">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop"
              alt="Forum"
              className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusForumBanner;