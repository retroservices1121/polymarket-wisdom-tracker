// ============================================
// WISDOM WORKER
// Manages market data functions
// ============================================

const { GameWorker } = require("@virtuals-protocol/game");
const {
  getTrendingMarkets,
  getMarketsByCategory,
  getHighConfidenceMarkets,
  getUncertainMarkets
} = require("../functions/marketFunctions");

const wisdomWorker = new GameWorker({
  id: "wisdom_worker",
  name: "Market Wisdom Worker",
  description: `This worker specializes in fetching and analyzing Polymarket prediction 
  markets to understand what "the crowd thinks". It can:
  
  - Find trending markets with high trading activity
  - Get markets by category (politics, crypto, sports, etc)
  - Identify markets where the crowd has high confidence
  - Find markets where the crowd is uncertain/split
  
  The worker helps show real-time collective intelligence and crowd predictions.`,
  functions: [
    getTrendingMarkets,
    getMarketsByCategory,
    getHighConfidenceMarkets,
    getUncertainMarkets
  ]
});

module.exports = wisdomWorker;