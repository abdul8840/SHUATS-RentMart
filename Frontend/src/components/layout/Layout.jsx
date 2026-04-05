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
        animate-fade-in
      ">
        {/* Content wrapper */}
        <div>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;