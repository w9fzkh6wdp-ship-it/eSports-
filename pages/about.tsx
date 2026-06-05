import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaTelegram } from 'react-icons/fa';
import Link from 'next/link';

export default function About() {
  const team = [
    { name: 'Development Team', role: 'Core Development', icon: '👨‍💻' },
    { name: 'UI/UX Design', role: 'Interface Design', icon: '🎨' },
    { name: 'Testing Team', role: 'Quality Assurance', icon: '🧪' },
  ];

  const features = [
    { title: 'Multi-Account Support', description: 'Manage unlimited Telegram accounts simultaneously' },
    { title: 'Session Persistence', description: 'Sessions are automatically saved and restored' },
    { title: 'Advanced Scheduling', description: 'Schedule broadcasts with custom delays and repeats' },
    { title: 'Real-time Logs', description: 'Monitor all activities with detailed logging' },
    { title: 'Group Management', description: 'Efficiently manage and select groups for broadcasting' },
    { title: 'Indian Theme', description: 'Beautiful interface with Indian color theme' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-saffron via-blue-500 to-india-green bg-clip-text text-transparent mb-4">
            Telegram Broadcaster
          </h1>
          <p className="text-gray-600 text-lg">Professional multi-account broadcasting platform</p>
          <p className="text-gray-500 text-sm mt-2">Version 1.0.0</p>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-lg p-8 card-shadow mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About This App</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Telegram Broadcaster is a powerful and intuitive application designed for managing multiple Telegram
            accounts and broadcasting messages to groups efficiently. With a beautiful Indian-themed interface and
            advanced features, it's the perfect tool for content creators, marketers, and community managers.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The app provides seamless session management, allowing you to maintain multiple active accounts without
            constantly re-logging in. Schedule broadcasts with custom delays, set repeat intervals, and monitor all
            activities through detailed logs.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-effect rounded-lg p-6 card-shadow hover:card-shadow border-l-4 border-saffron"
              >
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-effect rounded-lg p-6 card-shadow text-center"
              >
                <div className="text-5xl mb-3">{member.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-lg p-8 card-shadow mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-bold mb-2">Frontend</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>⚛️ React 18</li>
                <li>🎨 Tailwind CSS</li>
                <li>✨ Framer Motion</li>
                <li>📱 Next.js 14</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Backend</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>🔗 Node.js</li>
                <li>💾 SQLite</li>
                <li>📱 Telethon API</li>
                <li>🚀 Express Server</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect With Us</h2>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-3xl text-gray-600 hover:text-saffron transition">
              <FaGithub />
            </a>
            <a href="#" className="text-3xl text-gray-600 hover:text-blue-600 transition">
              <FaLinkedin />
            </a>
            <a href="#" className="text-3xl text-gray-600 hover:text-blue-400 transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-3xl text-gray-600 hover:text-blue-500 transition">
              <FaTelegram />
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/broadcast">
            <button className="bg-gradient-to-r from-saffron to-orange-600 text-white px-8 py-4 rounded-lg font-bold button-hover">
              Get Started Now →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
