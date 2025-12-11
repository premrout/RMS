import React from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';
import { PageState } from '../types';

interface PublicNavbarProps {
  setPage: (page: PageState) => void;
  currentPage: PageState;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({ setPage, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavLink = ({ target, label }: { target: PageState, label: string }) => (
    <button 
      onClick={() => { setPage(target); setMobileMenuOpen(false); }}
      className={`text-sm font-medium transition-colors ${
        currentPage === target ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-indigo-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setPage('LANDING')}>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-slate-900 tracking-tight">RevOp<span className="text-indigo-600">RMS</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink target="LANDING" label="Product" />
            <button className="text-slate-600 hover:text-indigo-600 text-sm font-medium">Resources</button>
            <NavLink target="PRICING" label="Pricing" />
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setPage('LOGIN')}
              className="text-slate-600 hover:text-indigo-600 font-medium text-sm"
            >
              Login
            </button>
            <button 
              onClick={() => setPage('LOGIN')} // Usually goes to register, using login for demo
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg"
            >
              Start Free Trial
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-indigo-600">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col">
            <NavLink target="LANDING" label="Product" />
            <NavLink target="PRICING" label="Pricing" />
            <div className="border-t border-slate-100 my-2"></div>
            <button 
              onClick={() => { setPage('LOGIN'); setMobileMenuOpen(false); }}
              className="text-left text-slate-600 font-medium"
            >
              Login
            </button>
            <button 
              onClick={() => { setPage('LOGIN'); setMobileMenuOpen(false); }}
              className="bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium text-center"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;