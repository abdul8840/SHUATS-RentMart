import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-light)]">
      {/* Fixed Navbar */}
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      <main className="
        flex-1 w-full
        px-4 sm:px-6 lg:px-8 py-6
        animate-fade-in
      ">
        {/* Content wrapper */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;