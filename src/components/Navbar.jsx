import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Experience', to: 'experience' },
  { name: 'Projects', to: 'projects' },
  { name: 'Contact', to: 'contact' },
];

const scrollProps = { smooth: true, duration: 500, offset: -80 };

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('');

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-dark-900/90 backdrop-blur-sm border-b border-white/5">
      <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link
          to="home"
          {...scrollProps}
          className="font-display font-semibold text-white cursor-pointer"
          onClick={() => setActive('')}
        >
          Eshan Gunasekara
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              {...scrollProps}
              spy={true}
              onSetActive={() => setActive(link.name)}
              className={`px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                active === link.name ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsOpen(v => !v)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-dark-900"
            aria-label="Main"
          >
            <ul className="container mx-auto px-6 py-4 flex flex-col">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    {...scrollProps}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-gray-300 hover:text-white cursor-pointer"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
