import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

const TelegramClient = require('telegram');
const StringSession = require('telegram').StringSession;
const { Api } = require('telegram');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      accountId,
      message,
      delaySeconds,
      repeatCount,
      autoRepeat,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Get account from database
    const account = db.prepare('SELECT * FROM accounts WHERE id = ?').get(accountId);

    if (!account) {
      return res.status(400).json({ error: 'Account not found' });
    }

    // Get selected groups
    const selectedGroups = db
      .prepare('SELECT * FROM groups WHERE account_id = ? AND is_selected = 1')
      .all(accountId);

    if (selectedGroups.length === 0) {
      return res.status(400).json({ error: 'No groups selected' });
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

    const broadcasts = [];
    const logs = [];
    let sentCount = 0;
    let failedCount = 0;

    // Create broadcast record
    const broadcastResult = db.prepare(`
      INSERT INTO broadcasts (account_id, message, delay_seconds, repeat_count, auto_repeat, status, started_at)
      VALUES (?, ?, ?, ?, ?, 'in_progress', CURRENT_TIMESTAMP)
    `).run(accountId, message, delaySeconds, repeatCount, autoRepeat ? 1 : 0);

    const broadcastId = broadcastResult.lastInsertRowid;

    // Send message to each selected group
    for (let i = 0; i < repeatCount; i++) {
      for (const group of selectedGroups) {
        try {
          // Send message
          await client.sendMessage(group.group_id, {
            message: message,
          });

          // Log success
          db.prepare(`
            INSERT INTO logs (broadcast_id, account_id, group_id, group_name, message, status)
            VALUES (?, ?, ?, ?, ?, 'success')
          `).run(
            broadcastId,
            accountId,
            group.group_id,
            group.group_name,
            message.substring(0, 100)
          );

          broadcasts.push({
            groupId: group.group_id,
            groupName: group.group_name,
            status: 'success',
          });

          sentCount++;

          // Delay between messages
          if (delaySeconds > 0) {
            await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
          }
        } catch (error: any) {
          // Log failure
          db.prepare(`
            INSERT INTO logs (broadcast_id, account_id, group_id, group_name, message, status, error_message)
            VALUES (?, ?, ?, ?, ?, 'error', ?)
          `).run(
            broadcastId,
            accountId,
            group.group_id,
            group.group_name,
            message.substring(0, 100),
            error.message
          );

          broadcasts.push({
            groupId: group.group_id,
            groupName: group.group_name,
            status: 'error',
            error: error.message,
          });

          failedCount++;
        }
      }
    }

    // Update broadcast status
    db.prepare(`
      UPDATE broadcasts SET status = 'completed', sent_count = ?, failed_count = ?, completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(sentCount, failedCount, broadcastId);

    await client.disconnect();

    res.status(200).json({
      success: true,
      message: `✅ Broadcast completed! Sent: ${sentCount}, Failed: ${failedCount}`,
      broadcasts,
      stats: {
        sentCount,
        failedCount,
        totalGroups: selectedGroups.length,
        repeatCount,
      },
    });
  } catch (error: any) {
    console.error('Broadcast error:', error);
    res.status(500).json({ error: error.message || 'Broadcast failed' });
  }
}
