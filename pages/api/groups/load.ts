import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

const TelegramClient = require('telegram');
const StringSession = require('telegram').StringSession;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accountId } = req.body;

    if (!accountId) {
      return res.status(400).json({ error: 'Account ID required' });
    }

    // Get account from database
    const account = db.prepare('SELECT * FROM accounts WHERE id = ?').get(accountId);

    if (!account) {
      return res.status(400).json({ error: 'Account not found' });
    }

    // Connect to Telegram
    const client = new TelegramClient(
      new StringSession(account.session_data),
      parseInt(account.api_id || process.env.TELEGRAM_APP_ID || '12345'),
      account.api_hash,
      {
        connectionRetries: 5,
      }
    );

    await client.connect();

    // Get dialogs (groups, chats, channels)
    const dialogs = await client.getDialogs();
    const groups = [];

    for (const dialog of dialogs) {
      if (dialog.isGroup || dialog.isChannel) {
        try {
          const entity = dialog.entity;
          const groupInfo = await client.getEntity(entity);

          // Get member count
          let memberCount = 0;
          try {
            const participants = await client.getParticipants(entity);
            memberCount = participants.total || 0;
          } catch (e) {
            memberCount = 0;
          }

          groups.push({
            id: entity.id,
            name: entity.title || entity.name || 'Unknown',
            username: entity.username || '',
            memberCount: memberCount,
          });

          // Save to database
          try {
            db.prepare(`
              INSERT OR REPLACE INTO groups (account_id, group_id, group_name, group_username, member_count, is_selected)
              VALUES (?, ?, ?, ?, ?, 0)
            `).run(
              accountId,
              entity.id,
              entity.title || entity.name || 'Unknown',
              entity.username || '',
              memberCount
            );
          } catch (e) {
            // Group might already exist
          }
        } catch (error) {
          console.error('Error getting group info:', error);
        }
      }
    }

    await client.disconnect();

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error: any) {
    console.error('Load groups error:', error);
    res.status(500).json({ error: error.message || 'Failed to load groups' });
  }
}
