import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { getFeaturedItemsAPI, getCategoriesAPI } from '../../api/axios.js';
import HeroSlider from '../../components/home/HeroSlider.jsx';
import FeaturesSection from '../../components/home/FeaturesSection.jsx';
import CategoriesSection from '../../components/home/CategoriesSection.jsx';
import RecentItemsSection from '../../components/home/RecentItemsSection.jsx';
import MostPopularSection from '../../components/home/MostPopularSection.jsx';
import CampusForumBanner from '../../components/home/CampusForumBanner.jsx';
import CTABanner from '../../components/home/CTABanner.jsx';

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

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Hero Slider */}
      <HeroSlider user={user} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Campus Forum Banner */}
      <CampusForumBanner />

      {/* Categories Section */}
      <CategoriesSection categories={categories} />

      {/* Recently Added Items */}
      <RecentItemsSection items={recentItems} />

      {/* Most Popular Items */}
      <MostPopularSection items={mostViewed} />

      {/* CTA Banner */}
      <CTABanner />

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