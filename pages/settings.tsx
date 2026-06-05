import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaKey, FaDatabase, FaBell } from 'react-icons/fa';
import axios from 'axios';
import { useStore } from '@/lib/store';

export default function Settings() {
  const { apiHash, setApiHash } = useStore();
  const [settings, setSettings] = useState<any>({
    api_hash: '',
    delay_default: '5',
    notification_enabled: 'true',
    auto_save: 'true',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/settings/get');
      setSettings({
        api_hash: res.data.settings?.api_hash || '',
        delay_default: res.data.settings?.delay_default || '5',
        notification_enabled: res.data.settings?.notification_enabled || 'true',
        auto_save: res.data.settings?.auto_save || 'true',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await Promise.all([
        axios.post('/api/settings/set', { key: 'api_hash', value: settings.api_hash }),
        axios.post('/api/settings/set', { key: 'delay_default', value: settings.delay_default }),
        axios.post('/api/settings/set', { key: 'notification_enabled', value: settings.notification_enabled }),
        axios.post('/api/settings/set', { key: 'auto_save', value: settings.auto_save }),
      ]);

      setApiHash(settings.api_hash);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚙️ Settings</h1>
          <p className="text-gray-600">Configure your Telegram Broadcaster preferences</p>
        </motion.div>

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* API Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-lg p-6 card-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaKey className="text-2xl text-saffron" />
              <h2 className="text-xl font-bold text-gray-800">API Configuration</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">API Hash</label>
              <input
                type="password"
                value={settings.api_hash}
                onChange={(e) => setSettings({ ...settings, api_hash: e.target.value })}
                placeholder="Your Telegram API Hash"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-saffron focus:outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">Get from https://telegram.org/apps</p>
            </div>
          </motion.div>

          {/* Broadcast Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-lg p-6 card-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaDatabase className="text-2xl text-india-green" />
              <h2 className="text-xl font-bold text-gray-800">Broadcast Settings</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Delay (seconds)</label>
              <input
                type="number"
                min="5"
                max="300"
                value={settings.delay_default}
                onChange={(e) => setSettings({ ...settings, delay_default: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-saffron focus:outline-none transition"
              />
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-lg p-6 card-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <FaBell className="text-2xl text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notification_enabled === 'true'}
                onChange={(e) => setSettings({ ...settings, notification_enabled: e.target.checked ? 'true' : 'false' })}
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-semibold">Enable notifications for broadcast events</span>
            </label>
          </motion.div>

          {/* Auto Save */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-lg p-6 card-shadow"
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_save === 'true'}
                onChange={(e) => setSettings({ ...settings, auto_save: e.target.checked ? 'true' : 'false' })}
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-semibold">Auto-save broadcast drafts</span>
            </label>
          </motion.div>

          {/* Success Message */}
          {saved && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-100 border-2 border-india-green rounded-lg p-4 text-india-green font-bold text-center"
            >
              ✅ Settings saved successfully!
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-saffron to-orange-600 text-white py-4 rounded-lg font-bold button-hover disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
