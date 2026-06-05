import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, action, code, apiId, apiHash } = req.body;

    if (!phone || !action) {
      return res.status(400).json({ error: 'Phone and action required' });
    }

    if (action === 'send_code') {
      // Step 1: Send verification code to user's Telegram
      if (!apiId || !apiHash) {
        return res.status(400).json({ error: 'API ID and API Hash required' });
      }

      try {
        // Call Telegram auth API
        const response = await axios.post('http://localhost:5001/auth/send_code', {
          phone,
          apiId,
          apiHash,
        });

        res.status(200).json({
          success: true,
          message: '✅ Verification code sent to your Telegram app',
          phoneCodeHash: response.data.phoneCodeHash,
        });
      } catch (error: any) {
        res.status(400).json({ error: error.response?.data?.error || 'Failed to send code' });
      }
    } else if (action === 'verify_code') {
      // Step 2: Verify code and login
      if (!code || !apiId || !apiHash) {
        return res.status(400).json({ error: 'Code, API ID, and API Hash required' });
      }

      try {
        const response = await axios.post('http://localhost:5001/auth/verify_code', {
          phone,
          code,
          apiId,
          apiHash,
        });

        if (response.data.success) {
          // Save account to database
          const result = db.prepare(`
            INSERT OR REPLACE INTO accounts (phone, session_data, user_id, first_name, last_name, api_hash, api_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(
            phone,
            response.data.sessionString,
            response.data.userId,
            response.data.firstName,
            response.data.lastName || '',
            apiHash,
            apiId
          );

          res.status(200).json({
            success: true,
            message: '✅ Logged in successfully!',
            account: {
              id: result.lastInsertRowid,
              phone,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              userId: response.data.userId,
            },
          });
        } else {
          res.status(400).json({ error: response.data.error || 'Login failed' });
        }
      } catch (error: any) {
        res.status(400).json({ error: error.response?.data?.error || error.message });
      }
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    res.status(500).json({ error: error.message });
  }
}
