// ============================================
// MAIN ENTRY POINT - FIXED VERSION
// With active task generation loop
// ============================================

require("dotenv").config();
const createWisdomAgent = require("./agent");

// ============================================
// Configuration
// ============================================

const GAME_API_KEY = process.env.GAME_API_KEY;
const CHECK_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

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
  console.log("⏰ Updates: Every 2 hours");
  console.log("🔍 Focus: Trending markets & crowd predictions");
  console.log("=".repeat(60) + "\n");
}

// ============================================
// Active Agent Loop (FIXED)
// ============================================

async function runAgentCycle(agent) {
  try {
    console.log("\n" + "=".repeat(60));
    console.log(`⏰ [${new Date().toLocaleString()}] Running agent cycle...`);
    console.log("=".repeat(60));
    
    // Use step() method which executes one decision cycle
    await agent.step({
      verbose: true  // Enable verbose logging
    });
    
    console.log("✅ Cycle completed successfully\n");
    
  } catch (error) {
    console.error("❌ Error in agent cycle:", error.message);
    console.error("Full error:", error);
  }
}

// ============================================
// Main function with active loop
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
    console.log(`⏰ Checking every ${CHECK_INTERVAL_MS / 1000 / 60 / 60} hours\n`);
    
    console.log("📋 What the bot does:");
    console.log("   • Finds trending markets");
    console.log("   • Identifies high-confidence predictions");
    console.log("   • Spots uncertain/split markets");
    console.log("   • Tweets crowd intelligence insights\n");
    
    // Run first cycle immediately
    console.log("🎬 Running first cycle now...");
    await runAgentCycle(agent);
    
    // Set up recurring cycles
    console.log(`⏰ Next check in ${CHECK_INTERVAL_MS / 1000 / 60 / 60} hours`);
    
    setInterval(async () => {
      await runAgentCycle(agent);
    }, CHECK_INTERVAL_MS);
    
    // Keep process alive
    console.log("\n💡 Bot is running continuously...");
    console.log("⏸️  Press Ctrl+C to stop\n");
    
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
