import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSync, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/logs/list?limit=100');
      setLogs(res.data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'bg-green-100 text-india-green';
    if (status === 'error') return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Broadcast Logs</h1>
          <p className="text-gray-600">Real-time monitoring of all broadcast activities</p>
        </motion.div>

        {/* Controls */}
        <div className="glass-effect rounded-lg p-6 card-shadow mb-6 flex justify-between items-center">
          <div className="flex gap-3">
            {['all', 'success', 'error'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === f
                    ? 'bg-saffron text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f === 'all' ? '📋 All' : f === 'success' ? '✅ Success' : '❌ Error'}
              </button>
            ))}
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-india-green text-white rounded-lg font-semibold button-hover disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Logs Table */}
        {loading && logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No logs found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {filteredLogs.map((log, idx) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="glass-effect rounded-lg p-4 card-shadow hover:card-shadow border-l-4 border-saffron"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(log.status)}`}>
                        {log.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{dayjs(log.created_at).fromNow()}</span>
                    </div>
                    <p className="text-gray-800 font-semibold mb-1">{log.group_name || 'System'}</p>
                    {log.message && <p className="text-gray-600 text-sm mb-1">{log.message.substring(0, 150)}...</p>}
                    {log.error_message && <p className="text-red-600 text-sm">{log.error_message}</p>}
                  </div>
                  <button
                    onClick={() => {
                      const newLogs = logs.filter((l) => l.id !== log.id);
                      setLogs(newLogs);
                    }}
                    className="text-gray-400 hover:text-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
