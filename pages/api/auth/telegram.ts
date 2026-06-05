import type { NextApiRequest, NextApiResponse } from 'next';

const TelegramClient = require('telegram');
const StringSession = require('telegram').StringSession;

const API_ID = process.env.TELEGRAM_APP_ID || '12345'; // User will enter this
const API_HASH = process.env.TELEGRAM_APP_HASH || 'abc123'; // User will enter this

interface TelegramSession {
  client?: any;
  sessionString?: string;
}

const sessions: { [key: string]: TelegramSession } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, phone, code, apiId, apiHash, sessionString } = req.body;

    if (action === 'send_code') {
      // Step 1: Send verification code
      if (!phone || !apiId || !apiHash) {
        return res.status(400).json({ error: 'Phone, API ID, and API Hash required' });
      }

      try {
        const client = new TelegramClient(
          new StringSession(''),
          parseInt(apiId),
          apiHash,
          {
            connectionRetries: 5,
          }
        );

        await client.connect();
        const result = await client.sendCodeRequest(phone);

        sessions[phone] = {
          client,
          sessionString: '',
        };

        res.status(200).json({
          success: true,
          message: 'Code sent to your Telegram app',
          phoneCodeHash: result.phoneCodeHash,
        });
      } catch (error: any) {
        res.status(400).json({ error: error.message || 'Failed to send code' });
      }
    } else if (action === 'verify_code') {
      // Step 2: Verify code and get session
      if (!phone || !code || !apiId || !apiHash) {
        return res.status(400).json({ error: 'Phone, code, API ID, and API Hash required' });
      }

      try {
        const client = new TelegramClient(
          new StringSession(''),
          parseInt(apiId),
          apiHash,
          {
            connectionRetries: 5,
          }
        );

        await client.connect();
        const result = await client.signIn({
          phone: phone,
          code: code,
        });

        const sessionString = client.session.save();
        const me = await client.getMe();

        sessions[phone] = {
          client,
          sessionString,
        };

        res.status(200).json({
          success: true,
          message: 'Logged in successfully',
          sessionString,
          userId: me.id,
          firstName: me.firstName,
          lastName: me.lastName || '',
          phone: me.phone,
        });
      } catch (error: any) {
        res.status(400).json({ error: error.message || 'Invalid code' });
      }
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    res.status(500).json({ error: error.message });
  }
}
