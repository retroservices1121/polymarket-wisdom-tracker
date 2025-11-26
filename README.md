# 🧠 Polymarket Wisdom of Crowds Tracker

An AI-powered Twitter bot that tracks and shares what "the crowd thinks" on Polymarket prediction markets.

![Bot Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 What It Does

This bot monitors Polymarket prediction markets and tweets insights about collective intelligence:

- **Trending Markets**: What's hot right now with high trading volume
- **High Confidence**: Markets where the crowd is very sure (>85% or <15%)
- **Split Decisions**: Markets where the crowd is divided (close to 50/50)
- **Category Spotlights**: Politics, crypto, sports predictions

### Example Tweets

```
The crowd says: 78% chance Biden doesn't run in 2024 ☕️

💪 HIGH CONFIDENCE: 'Will AI pass the Turing test by 2025?' - 84% YES

🤷 SPLIT DECISION: 'Trump vs Biden rematch?' - 51% YES, 49% NO

📊 Politics this week:
• 2024 Election: 55% Trump
• Biden runs: 22% YES  
• DeSantis nominee: 38% YES
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com))
- GAME API key ([Get one here](https://console.game.virtuals.io/))

### Local Setup (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/polymarket-wisdom-tracker.git
cd polymarket-wisdom-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your GAME_API_KEY

# 4. Run the bot
npm start
```

You should see:
```
🧠 POLYMARKET WISDOM OF CROWDS TRACKER
✅ Agent initialized successfully!
🚀 Bot is now running!
```

## 📦 What's Included

```
polymarket-wisdom-tracker/
├── src/
│   ├── functions/           # Polymarket API integrations
│   │   └── marketFunctions.js
│   ├── workers/             # Worker configurations
│   │   └── wisdomWorker.js
│   ├── utils/              # Helper functions
│   │   └── formatters.js
│   ├── agent.js            # Bot personality
│   └── index.js            # Entry point
├── .env.example            # Environment template
├── package.json            # Dependencies
├── railway.json            # Railway deployment config
└── README.md              # This file
```

## 🚂 Deploy to Railway (Production)

### Option 1: Automatic Deploy (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/polymarket-wisdom-tracker.git
git push -u origin main
```

2. Deploy on Railway:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `polymarket-wisdom-tracker`
   - Add environment variable:
     - **Key**: `GAME_API_KEY`
     - **Value**: Your API key
   - Click "Deploy"

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variable
railway variables set GAME_API_KEY=your_key_here

# Deploy
railway up
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GAME_API_KEY` | ✅ Yes | - | Your GAME API key |
| `UPDATE_FREQUENCY_HOURS` | No | 2 | How often to check (hours) |
| `MIN_VOLUME_THRESHOLD` | No | 5000 | Minimum market volume ($) |
| `TWEET_STYLE` | No | informative | Tweet style (informative/casual) |

### Customization

#### Change Tweet Frequency
Edit `src/agent.js`, in the `goal` section:
```javascript
goal: `Check Polymarket every 1 hour...` // Changed from 2-3 hours
```

#### Change Volume Threshold
Edit `src/functions/marketFunctions.js`:
```javascript
.filter(m => m.volume24hr && m.volume24hr > 10000) // Changed from 5000
```

#### Modify Personality
Edit `src/agent.js`, in the `description` section - make it more casual, formal, funny, etc.

## 📊 Features

### Market Intelligence
- ✅ Real-time trending markets
- ✅ High confidence predictions
- ✅ Uncertain/split markets
- ✅ Category filtering
- ✅ Volume-based ranking

### Tweet Variety
- 📈 Simple predictions
- 💪 Confidence levels
- 🔥 Trending alerts
- 📊 Category roundups
- 🤷 Split decisions

### Technical
- ✅ Automatic retries
- ✅ Error handling
- ✅ Graceful shutdown
- ✅ Railway optimized
- ✅ Modular architecture

## 🔍 Monitoring

### View Logs (Railway)
1. Go to your Railway project
2. Click on your deployment
3. Click "View Logs"
4. Monitor bot activity in real-time

### Common Log Messages
```
📊 Fetching trending markets...
📈 Found 10 trending markets
💪 HIGH CONFIDENCE: [market found]
🤷 SPLIT DECISION: [uncertain market]
```

## 🐛 Troubleshooting

### Bot Not Tweeting?

**Check these:**
1. ✅ GAME_API_KEY is set correctly in Railway
2. ✅ Bot is running (check Railway logs)
3. ✅ Markets meet volume threshold (>$5k)
4. ✅ Bot found interesting markets (needs 2-3 hours)

### "GAME_API_KEY not found"
```bash
# Make sure .env exists and contains:
GAME_API_KEY=apt-your-key-here
```

### "Module not found"
```bash
npm install
```

### Bot Crashes Immediately
```bash
# Check logs for errors
npm start

# Common issues:
# - Invalid API key
# - No internet connection
# - Polymarket API down
```

## 📈 Usage Examples

### Test Specific Functions

Create `test.js`:
```javascript
require("dotenv").config();
const { getTrendingMarkets } = require("./src/functions/marketFunctions");

async function test() {
  const result = await getTrendingMarkets.executable();
  console.log(result);
}

test();
```

Run: `node test.js`

## 🤝 Contributing

Contributions welcome! Ideas:

- [ ] Add price change tracking
- [ ] Create weekly summaries
- [ ] Add market alerts
- [ ] Include charts/visualizations
- [ ] Multi-language support
- [ ] Discord integration

## 📄 License

MIT License - feel free to use and modify!

## 🔗 Links

- [Virtuals Protocol](https://virtuals.io)
- [Polymarket](https://polymarket.com)
- [GAME Documentation](https://docs.game.virtuals.io)
- [Railway](https://railway.app)

## 💡 Tips

- **Start small**: Let it run for 24 hours to see patterns
- **Monitor volume**: Higher volume = more interesting predictions
- **Vary content**: The bot mixes different tweet types automatically
- **Be patient**: Good markets take time to develop
- **Check logs**: Railway logs show what the bot is finding

## 🆘 Support

Having issues?

1. Check the [troubleshooting section](#-troubleshooting)
2. Review Railway logs
3. Verify API key is valid
4. Open an issue on GitHub

---

Built with ❤️ using [Virtuals Protocol G.A.M.E](https://virtuals.io)

**Ready to track the wisdom of crowds?** 🧠🚀