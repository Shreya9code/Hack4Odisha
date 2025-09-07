import { useState } from 'react';
import Dashboard from './Dashboard';
import Inventory from './Inventory';
import Compliance from './Compliance';
import QRGenerator from './QRGenerator';
import Analytics from './Analytics';
import Campaigns from './Campaigns';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Home = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'compliance':
        return <Compliance />;
      case 'qr-generator':
        return <QRGenerator />;
      case 'analytics':
        return <Analytics />;
      case 'campaigns':
        return <Campaigns />;
      default:
        return <Dashboard />;
    }
  };

  const HeroSection = () => (
    <section className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-white/70 p-8 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/50 md:p-10">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full !bg-emerald-300/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-28 h-96 w-96 rounded-full !bg-teal-300/20 blur-3xl" />

      <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 !bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            <span>♻</span>
            <span>Smart E-waste lifecycle</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            <span className="!bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Sustainable E‑Waste Management</span>
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-gray-600 md:text-lg">
            Track inventory, generate QR codes, and stay compliant — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActivePage('qr-generator')}
              className="inline-flex items-center justify-center rounded-lg !bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:!bg-emerald-700 hover:shadow-md active:translate-y-0">
              Generate QR
            </button>
            <button
              onClick={() => setActivePage('inventory')}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:!bg-emerald-50 hover:shadow-md active:translate-y-0">
              View Inventory
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-4 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Devices Recycled</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">12,483</p>
          </div>
          <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-4 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">CO₂ Saved</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">28.7t</p>
          </div>
          <div className="rounded-xl border border-emerald-200/60 bg-white/80 p-4 text-center shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">Active Pickups</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">36</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-emerald-300/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-teal-300/20 blur-3xl" />
      
      {/* Main Content - No Sidebar */}
      <div className="main-content relative z-10 flex flex-1 flex-col">
        <Header />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {activePage === 'dashboard' && <HeroSection />}
            <div className="rounded-2xl border border-emerald-100/60 bg-white/70 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/50">
              <main className="p-6 md:p-8">
                {renderPage()}
              </main>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;