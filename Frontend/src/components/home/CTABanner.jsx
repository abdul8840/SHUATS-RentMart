import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight, FiBookOpen } from 'react-icons/fi';

const CTABanner = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="">
        <div className="relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest to-sage" />

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl animate-bounce-soft" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse-soft" />
              Get Started Today
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 max-w-3xl mx-auto leading-tight animate-slide-up">
              Ready to Trade Smart?
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up animation-delay-100">
              Create your first listing now and start trading with thousands of SHUATS students. It takes less than 2 minutes to get started!
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10 max-w-xl mx-auto animate-slide-up animation-delay-200">
              {[
                { label: 'Easy Setup', value: '2 mins' },
                { label: 'Zero Fees', value: '100%' },
                { label: 'Safe Trading', value: '✓' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <p className="text-white/70 text-xs sm:text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-300">
              <Link
                to="/items/create"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-forest-dark rounded-2xl
                  font-bold text-base sm:text-lg shadow-2xl shadow-black/30
                  hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <FiPlus className="w-6 h-6" />
                Create Listing
                <FiArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>

              <Link
                to="/forum"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl
                  font-bold text-base sm:text-lg border-2 border-white/30
                  hover:bg-white/30 transition-all duration-300"
              >
                <FiBookOpen className="w-6 h-6" />
                Visit Forum
              </Link>
            </div>

            {/* Footer Text */}
            <p className="text-white/60 text-sm mt-8 animate-fade-in animation-delay-500">
              Join 1,200+ students already trading on CampusMart 🚀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;