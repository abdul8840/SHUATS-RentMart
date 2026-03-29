import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-cream-light)]">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page body */}
      <div className="flex flex-1 relative">

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {sidebarOpen && (
          <div
            className="menu-overlay xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── MOBILE SIDEBAR TOGGLE ── */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="
            xl:hidden fixed bottom-6 left-4 z-50
            w-12 h-12 rounded-2xl gradient-bg text-white
            shadow-lg shadow-[var(--color-forest)]/40
            flex items-center justify-center cursor-pointer
            hover:scale-110 active:scale-95
            transition-all duration-200 animate-bounce-soft
          "
        >
          {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* ── SIDEBAR ── */}
        {/* Desktop: always visible | Mobile: slide-in drawer */}
        <div className={`
          xl:relative xl:translate-x-0 xl:block
          fixed left-0 top-16 bottom-0 z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
        `}>
          <Sidebar />
        </div>

        {/* ── MAIN CONTENT ── */}
        <main className="
          flex-1 min-w-0 overflow-auto
          px-4 sm:px-6 lg:px-8 py-6
          animate-fade-in
        ">
          {/* Content card wrapper */}
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;