import { FaTelegram, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4 font-bold text-lg">
              <FaTelegram /> Broadcaster
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional multi-account Telegram broadcaster with session management and advanced scheduling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-saffron transition">Home</a></li>
              <li><a href="/broadcast" className="hover:text-saffron transition">Broadcast</a></li>
              <li><a href="/logs" className="hover:text-saffron transition">Logs</a></li>
              <li><a href="/settings" className="hover:text-saffron transition">Settings</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/about" className="hover:text-saffron transition">About</a></li>
              <li><a href="#" className="hover:text-saffron transition">Documentation</a></li>
              <li><a href="#" className="hover:text-saffron transition">Contact</a></li>
              <li><a href="#" className="hover:text-saffron transition">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>
            Made with <FaHeart className="inline text-red-500" /> by the Broadcaster Team
          </p>
          <p className="mt-2">© 2024 Telegram Broadcaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
