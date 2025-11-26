// ============================================
// MAIN ENTRY POINT - RATE LIMIT FIX
// Handles 429 errors with exponential backoff
// ============================================

require("dotenv").config();
const createWisdomAgent = require("./agent");

// ============================================
// Configuration
// ============================================

const GAME_API_KEY = process.env.GAME_API_KEY;
const CHECK_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
let RETRY_COUNT = 0;
const MAX_RETRIES = 5;

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
// Sleep function for delays
// ============================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// Active Agent Loop
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
    RETRY_COUNT = 0; // Reset retry count on success
    
  } catch (error) {
    console.error("❌ Error in agent cycle:", error.message);
    
    // Check if it's a rate limit error
    if (error.response?.status === 429 || error.message.includes('429')) {
      console.error("⏳ Rate limit hit - this is normal, agent will retry");
    }
  }
}

// ============================================
// Main function with rate limit handling
// ============================================

async function main() {
  printBanner();
  
  while (RETRY_COUNT < MAX_RETRIES) {
    try {
      // Calculate backoff delay
      const backoffDelay = Math.min(1000 * Math.pow(2, RETRY_COUNT), 60000); // Max 60 seconds
      
      if (RETRY_COUNT > 0) {
        console.log(`⏳ Waiting ${backoffDelay / 1000} seconds before retry ${RETRY_COUNT}/${MAX_RETRIES}...`);
        await sleep(backoffDelay);
      }
      
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
      
      // Break out of retry loop on success
      break;
      
    } catch (error) {
      console.error("\n💥 Initialization error:");
      console.error("❌", error.message);
      
      // Check if it's a rate limit error
      if (error.response?.status === 429 || error.message.includes('429') || error.message.includes('Too Many Requests')) {
        RETRY_COUNT++;
        console.error(`⚠️  Rate limit hit (429). Retry ${RETRY_COUNT}/${MAX_RETRIES}`);
        
        if (RETRY_COUNT >= MAX_RETRIES) {
          console.error("\n❌ Max retries reached. Waiting 5 minutes before full restart...");
          await sleep(5 * 60 * 1000); // Wait 5 minutes
          RETRY_COUNT = 0; // Reset for next attempt
        }
        
        continue; // Retry
        
      } else {
        // Different error - exit
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
  
  // If rate limit, wait and let Railway restart
  if (error.message.includes('429')) {
    console.error("\n⏳ Rate limit - waiting 60 seconds before restart...\n");
    setTimeout(() => process.exit(1), 60000);
  } else {
    console.error("\n🔄 Bot will restart...\n");
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("\n⚠️  Unhandled Promise Rejection:");
  console.error(reason);
  
  // If rate limit, wait before restart
  if (reason?.response?.status === 429 || reason?.message?.includes('429')) {
    console.error("\n⏳ Rate limit - waiting 60 seconds before restart...\n");
    setTimeout(() => process.exit(1), 60000);
  } else {
    console.error("\n🔄 Bot will restart...\n");
    process.exit(1);
  }
});

// ============================================
// Run the bot!
// ============================================

main();
