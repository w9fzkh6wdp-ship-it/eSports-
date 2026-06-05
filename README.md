# 📱 Telegram Multi-Account Broadcaster

A professional, feature-rich application for managing multiple Telegram accounts and broadcasting messages to groups with advanced scheduling and analytics.

## ✨ Features

### 🔐 Account Management
- Multi-account login with session persistence
- Secure session storage in SQLite
- Auto-save API hash configuration
- Quick access to saved accounts

### 📢 Broadcasting
- Send messages to multiple groups across accounts
- Custom delay between messages (5-300 seconds)
- Message repeat functionality
- Auto-repeat broadcasts
- Bulk group selection

### 📊 Group Management
- Load groups per account
- Select/deselect groups individually
- Select all/deselect all functionality
- Group member count display
- Real-time group loading

### 📈 Analytics & Logging
- Real-time broadcast logs
- Success/error tracking
- Detailed message history
- Filter logs by status
- Auto-refresh every 5 seconds

### ⚙️ Settings
- API configuration (first-time setup only)
- Default delay settings
- Notification preferences
- Auto-save functionality
- Persistent storage

### 🎨 User Interface
- Beautiful Indian-themed design (Saffron, Green, White)
- Smooth animations with Framer Motion
- Responsive mobile-first design
- Dark mode logs interface
- Real-time updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Telegram API credentials (get from https://telegram.org/apps)

### Installation

```bash
# Clone repository
git clone https://github.com/w9fzkh6wdp-ship-it/eSports-.git
cd eSports-

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### First-Time Setup

1. **Open the app** - http://localhost:3000
2. **Go to Login page** - Click 'Add Account'
3. **Enter phone number** - Your Telegram phone number
4. **Enter verification code** - Check your Telegram app
5. **Enter API Hash** - Get from https://telegram.org/apps (only first time!)
6. **Select groups** - Choose groups for broadcasting
7. **Compose message** - Write your broadcast message
8. **Set delays** - Choose delay between messages (5-300 seconds)
9. **Start broadcast** - Click 'Start Broadcast'
10. **Monitor logs** - View real-time broadcast logs

## 📁 Project Structure

```
eSports-/
├── pages/
│   ├── api/              # API routes
│   ├── _app.tsx         # App wrapper
│   ├── index.tsx        # Home page
│   ├── login.tsx        # Login page
│   ├── broadcast.tsx    # Broadcast page
│   ├── logs.tsx         # Logs page
│   ├── settings.tsx     # Settings page
│   └── about.tsx        # About page
├── components/           # React components
│   ├── Layout.tsx       # Main layout
│   ├── Navigation.tsx   # Navigation bar
│   └── Footer.tsx       # Footer
├── lib/
│   ├── db.ts           # Database setup
│   └── store.ts        # Zustand store
├── styles/
│   └── globals.css     # Global styles
├── public/             # Static files
├── data/               # SQLite database (generated)
└── package.json        # Dependencies
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Server framework
- **SQLite3** - Database
- **Telethon** - Telegram API client
- **Better SQLite3** - Sync database

## 📊 Database Schema

### Tables
- `accounts` - Telegram accounts with sessions
- `groups` - Groups per account
- `broadcasts` - Broadcast tasks
- `logs` - Activity logs
- `settings` - App configuration

## 🔒 Security

- ✅ Session data encrypted in database
- ✅ API hash stored locally (never sent to servers)
- ✅ No cloud storage required
- ✅ SQLite local database
- ✅ Secure session management

## 📱 Building APK

### For Android Distribution

```bash
# Build optimized production version
npm run build

# Generate APK using React Native
react-native run-android

# Or use Expo for simpler distribution
# expo build:android
```

## 🐛 Troubleshooting

### API Hash Issues
- Get from https://telegram.org/apps
- You need Telegram API app ID and hash
- Visit https://my.telegram.org for credentials

### Login Problems
- Check phone number format (+country code)
- Ensure code entered correctly
- Check Telegram app for verification code

### Database Errors
- Delete `data/broadcaster.db` to reset
- Ensure `data/` directory exists
- Check file permissions

## 📄 License

MIT License - Free for personal and commercial use

## 💬 Support

For issues and feature requests, please open a GitHub issue.

## 🙏 Credits

Made with ❤️ for Telegram enthusiasts worldwide.

---

**Ready to broadcast?** Start by adding your first account! 🚀
