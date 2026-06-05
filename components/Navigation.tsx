import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaTelegram } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Broadcast', href: '/broadcast' },
    { label: 'Logs', href: '/logs' },
    { label: 'Settings', href: '/settings' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav className="bg-gradient-to-r from-saffron via-white to-india-green shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-gray-800 hover:text-saffron transition">
            <FaTelegram className="text-blue-500" />
            <span>Broadcaster</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-semibold transition ${
                  isActive(link.href)
                    ? 'text-saffron border-b-2 border-saffron'
                    : 'text-gray-700 hover:text-saffron'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-800"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 space-y-3 border-t-2 border-gray-200 pt-4"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block font-semibold transition ${
                  isActive(link.href)
                    ? 'text-saffron pl-4 border-l-4 border-saffron'
                    : 'text-gray-700 hover:text-saffron'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
