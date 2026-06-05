import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTelegram, FaPhoneAlt, FaArrowRight, FaCheckCircle, FaKey } from 'react-icons/fa';
import axios from 'axios';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function Login() {
  const [step, setStep] = useState('api_key'); // api_key, phone, code, success
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const { setApiHash: setStoreApiHash } = useStore();

  useEffect(() => {
    fetchSavedAccounts();
    checkStoredApiKeys();
  }, []);

  const fetchSavedAccounts = async () => {
    try {
      const res = await axios.get('/api/accounts/list');
      setSavedAccounts(res.data.accounts || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const checkStoredApiKeys = async () => {
    try {
      const res = await axios.get('/api/settings/get');
      if (res.data.settings?.api_id && res.data.settings?.api_hash) {
        setApiId(res.data.settings.api_id);
        setApiHash(res.data.settings.api_hash);
        setStep('phone');
      }
    } catch (error) {
      console.log('No saved API keys');
    }
  };

  const handleApiKeySubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!apiId || !apiHash) {
      setError('API ID and API Hash are required');
      return;
    }

    // Save API keys
    try {
      await axios.post('/api/settings/set', { key: 'api_id', value: apiId });
      await axios.post('/api/settings/set', { key: 'api_hash', value: apiHash });
      setStoreApiHash(apiHash);
      setMessage('✅ API Keys saved! Now enter your phone number.');
      setTimeout(() => {
        setStep('phone');
        setMessage('');
      }, 1500);
    } catch (error) {
      setError('Failed to save API keys');
    }
  };

  const handlePhoneSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!phone) {
      setError('Phone number required');
      return;
    }

    if (!phone.startsWith('+')) {
      setError('Phone must start with + (e.g., +1234567890)');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        phone,
        action: 'send_code',
        apiId,
        apiHash,
      });

      if (response.data.success) {
        setMessage('✅ Verification code sent to your Telegram app');
        setTimeout(() => {
          setStep('code');
          setMessage('');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!code) {
      setError('Verification code required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        phone,
        code,
        action: 'verify_code',
        apiId,
        apiHash,
      });

      if (response.data.success) {
        setMessage('✅ Logged in successfully!');
        setTimeout(() => {
          setStep('success');
          setMessage('');
        }, 1500);
        fetchSavedAccounts();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/20 via-white to-india-green/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect rounded-2xl p-8 card-shadow">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <FaTelegram className="text-5xl text-blue-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add Account</h1>
            <p className="text-gray-600 text-sm">Connect your real Telegram account</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            <div className={`text-center flex-1 ${step === 'api_key' ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step === 'api_key' ? 'bg-saffron text-white' : 'bg-gray-300 text-gray-600'}`}>
                🔑
              </div>
              <p className="text-xs font-bold">API Key</p>
            </div>
            <div className={`text-center flex-1 ${step === 'phone' ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step === 'phone' ? 'bg-saffron text-white' : 'bg-gray-300 text-gray-600'}`}>
                📱
              </div>
              <p className="text-xs font-bold">Phone</p>
            </div>
            <div className={`text-center flex-1 ${step === 'code' ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step === 'code' ? 'bg-saffron text-white' : 'bg-gray-300 text-gray-600'}`}>
                ✓
              </div>
              <p className="text-xs font-bold">Verify</p>
            </div>
          </div>

          {/* API Key Step */}
          {step === 'api_key' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleApiKeySubmit}
              className="space-y-4"
            >
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                <p className="text-sm text-blue-800 font-semibold mb-2">📝 Get Your API Keys:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Visit <a href="https://my.telegram.org" target="_blank" rel="noopener noreferrer" className="underline font-bold">my.telegram.org</a></li>
                  <li>Login with your phone number</li>
                  <li>Go to "API development tools"</li>
                  <li>Copy API ID and API Hash below</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">API ID</label>
                <input
                  type="text"
                  value={apiId}
                  onChange={(e) => setApiId(e.target.value)}
                  placeholder="e.g., 1234567"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-saffron focus:outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">API Hash</label>
                <input
                  type="password"
                  value={apiHash}
                  onChange={(e) => setApiHash(e.target.value)}
                  placeholder="e.g., abc123def..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-saffron focus:outline-none transition font-mono"
                />
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 border-2 border-india-green rounded-lg p-3 text-green-700 text-sm flex items-center gap-2"
                >
                  <FaCheckCircle /> {message}
                </motion.div>
              )}

              {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-saffron to-orange-600 text-white py-3 rounded-lg font-bold button-hover flex items-center justify-center gap-2"
              >
                <FaKey /> Continue
              </button>
            </motion.form>
          )}

          {/* Phone Step */}
          {step === 'phone' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handlePhoneSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaPhoneAlt className="inline mr-2" /> Your Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-saffron focus:outline-none transition font-bold text-lg"
                />
                <p className="text-xs text-gray-500 mt-2">Include country code (e.g., +1 for USA, +91 for India)</p>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 border-2 border-india-green rounded-lg p-3 text-green-700 text-sm flex items-center gap-2"
                >
                  <FaCheckCircle /> {message}
                </motion.div>
              )}

              {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-saffron to-orange-600 text-white py-3 rounded-lg font-bold button-hover disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Send Code'} <FaArrowRight />
              </button>

              <button
                type="button"
                onClick={() => setStep('api_key')}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
              >
                ← Back
              </button>
            </motion.form>
          )}

          {/* Code Step */}
          {step === 'code' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleCodeSubmit}
              className="space-y-4"
            >
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
                <p className="text-sm text-yellow-800 font-semibold">📲 Check your Telegram app!</p>
                <p className="text-xs text-yellow-700 mt-1">You should receive a verification code</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="00000"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-saffron focus:outline-none transition text-center text-3xl tracking-widest font-bold"
                />
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-100 border-2 border-india-green rounded-lg p-3 text-green-700 text-sm flex items-center gap-2"
                >
                  <FaCheckCircle /> {message}
                </motion.div>
              )}

              {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-saffron to-orange-600 text-white py-3 rounded-lg font-bold button-hover disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300"
              >
                ← Back
              </button>
            </motion.form>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-6xl"
              >
                ✅
              </motion.div>
              <div>
                <p className="text-gray-700 font-bold text-lg mb-2">Account connected!</p>
                <p className="text-gray-600 text-sm">Ready to broadcast to real Telegram groups</p>
              </div>
              <Link href="/broadcast">
                <button className="w-full bg-gradient-to-r from-india-green to-green-600 text-white py-3 rounded-lg font-bold button-hover">
                  📢 Go to Broadcast
                </button>
              </Link>
            </motion.div>
          )}

          {/* Saved Accounts */}
          {savedAccounts.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-4">✅ Your Connected Accounts ({savedAccounts.length})</p>
              <div className="space-y-2">
                {savedAccounts.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border-l-4 border-india-green">
                    <div>
                      <p className="text-sm text-gray-700 font-semibold">{acc.first_name} {acc.last_name}</p>
                      <p className="text-xs text-gray-500">{acc.phone}</p>
                    </div>
                    <span className="text-xs bg-india-green text-white px-2 py-1 rounded">Ready</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          <Link href="/" className="text-saffron font-bold hover:underline">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
