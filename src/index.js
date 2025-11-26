// ============================================
// MAIN ENTRY POINT
// Starts the Wisdom of Crowds bot
// ============================================

require("dotenv").config();
const createWisdomAgent = require("./agent");

// ============================================
// Configuration
// ============================================

const GAME_API_KEY = process.env.GAME_API_KEY;

// Validate required environment variables
if (!GAME_API_KEY) {
  console.error("❌ ERROR: GAME_API_KEY not found!");
  console.error("📝 Please create a .env file with your API key");
  console.error("💡 Copy .env.example to .env and add your key");
  console.error("\nGet your API key from: https://console.game.virtuals.io/");
  process.exit(1);
}

// ============================================
// Bot Information
// ============================================

function printBanner() {
  console.log("\n" + "=".repeat(60));
  console.log("🧠 POLYMARKET WISDOM OF CROWDS TRACKER");
  console.log("=".repeat(60));
  console.log("📊 Mission: Track what the crowd thinks");
  console.log("🎯 Platform: Twitter/X");
  console.log("⏰ Updates: Every 2-3 hours");
  console.log("🔍 Focus: Trending markets & crowd predictions");
  console.log("=".repeat(60) + "\n");
}

// ============================================
// Start the bot
// ============================================

async function main() {
  printBanner();
  
  try {
    console.log("⚙️  Initializing Wisdom Tracker agent...");
    
    // Create the agent
    const agent = createWisdomAgent(GAME_API_KEY);
    
    // Initialize
    await agent.init();
    console.log("✅ Agent initialized successfully!\n");
    
    console.log("🚀 Bot is now running!");
    console.log("📱 Tracking Polymarket predictions...");
    console.log("💬 Will tweet interesting crowd predictions");
    console.log("⏸️  Press Ctrl+C to stop\n");
    
    console.log("📋 What the bot does:");
    console.log("   • Finds trending markets");
    console.log("   • Identifies high-confidence predictions");
    console.log("   • Spots uncertain/split markets");
    console.log("   • Tweets crowd intelligence insights\n");
    
    // Run the agent
    await agent.run();
    
  } catch (error) {
    console.error("\n💥 Bot crashed with error:");
    console.error("❌", error.message);
    console.error("\n📋 Full error details:");
    console.error(error);
    console.error("\n💡 Common fixes:");
    console.error("   1. Check your GAME_API_KEY is correct");
    console.error("   2. Ensure you have internet connection");
    console.error("   3. Verify Polymarket API is accessible");
    console.error("   4. Try running: npm install\n");
    process.exit(1);
  }
}

// ============================================
// Graceful shutdown handlers
// ============================================

process.on("SIGINT", () => {
  console.log("\n\n🛑 Received shutdown signal...");
  console.log("💾 Saving state...");
  console.log("👋 Wisdom Tracker shutting down gracefully");
  console.log("✨ Thanks for tracking the crowd with us!\n");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n🛑 Received SIGTERM signal");
  console.log("👋 Shutting down...\n");
  process.exit(0);
});

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("\n💥 Uncaught Exception:");
  console.error(error);
  console.error("\n🔄 Bot will attempt to restart...\n");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n⚠️  Unhandled Promise Rejection:");
  console.error(reason);
  console.error("\n🔄 Bot will attempt to restart...\n");
  process.exit(1);
});

// ============================================
// Run the bot!
// ============================================

main();