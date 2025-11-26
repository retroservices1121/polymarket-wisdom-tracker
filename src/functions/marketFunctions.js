// ============================================
// MARKET DATA FUNCTIONS
// Functions to fetch Polymarket data
// ============================================

const { 
  GameFunction, 
  ExecutableGameFunctionResponse, 
  ExecutableGameFunctionStatus 
} = require("@virtuals-protocol/game");
const axios = require("axios");
const {
  formatPercentage,
  formatVolume,
  getConfidenceLevel,
  shortenQuestion
} = require("../utils/formatters");

// ============================================
// FUNCTION: Get Trending Markets
// Fetches markets with highest recent activity
// ============================================

const getTrendingMarkets = new GameFunction({
  name: "get_trending_markets",
  description: "Get the most active prediction markets by 24hr volume",
  args: [],
  executable: async () => {
    try {
      console.log("📊 Fetching trending markets...");
      
      const response = await axios.get("https://gamma-api.polymarket.com/markets", {
        params: {
          active: true,
          closed: false,
          limit: 50,
          order: "volume24hr",
          ascending: false
        },
        timeout: 10000
      });
      
      const markets = response.data;
      console.log(`Found ${markets.length} active markets`);
      
      // Filter and format trending markets
      const trending = markets
        .filter(m => m.volume24hr && m.volume24hr > 5000) // At least $5k volume
        .slice(0, 10)
        .map(m => {
          const yesPrice = m.outcomePrices?.[0] || 0.5;
          const yesPercentage = Math.round(yesPrice * 100);
          
          return {
            question: shortenQuestion(m.question),
            probability: yesPercentage,
            volume24hr: Math.round(m.volume24hr),
            confidence: getConfidenceLevel(yesPrice),
            category: m.category || "Other",
            endDate: m.endDate
          };
        });
      
      console.log(`📈 Found ${trending.length} trending markets`);
      
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify({
          count: trending.length,
          markets: trending
        })
      );
      
    } catch (error) {
      console.error("❌ Error fetching trending markets:", error.message);
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Error: ${error.message}`
      );
    }
  }
});

// ============================================
// FUNCTION: Get Markets by Category
// Fetches markets from specific categories
// ============================================

const getMarketsByCategory = new GameFunction({
  name: "get_markets_by_category",
  description: "Get active markets from a specific category (politics, crypto, sports, etc)",
  args: [
    {
      name: "category",
      type: "string",
      description: "Category to filter by (e.g., 'politics', 'crypto', 'sports')"
    }
  ],
  executable: async (args) => {
    try {
      console.log(`🏷️  Fetching ${args.category} markets...`);
      
      const response = await axios.get("https://gamma-api.polymarket.com/markets", {
        params: {
          active: true,
          closed: false,
          limit: 30
        },
        timeout: 10000
      });
      
      const markets = response.data;
      
      // Filter by category (case insensitive)
      const categoryMarkets = markets
        .filter(m => {
          const marketCategory = (m.category || "").toLowerCase();
          const searchCategory = args.category.toLowerCase();
          return marketCategory.includes(searchCategory);
        })
        .slice(0, 10)
        .map(m => {
          const yesPrice = m.outcomePrices?.[0] || 0.5;
          return {
            question: shortenQuestion(m.question),
            probability: Math.round(yesPrice * 100),
            volume24hr: Math.round(m.volume24hr || 0),
            confidence: getConfidenceLevel(yesPrice)
          };
        });
      
      console.log(`Found ${categoryMarkets.length} markets in ${args.category}`);
      
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify({
          category: args.category,
          count: categoryMarkets.length,
          markets: categoryMarkets
        })
      );
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Error: ${error.message}`
      );
    }
  }
});

// ============================================
// FUNCTION: Get High Confidence Markets
// Finds markets where crowd is very sure
// ============================================

const getHighConfidenceMarkets = new GameFunction({
  name: "get_high_confidence_markets",
  description: "Get markets where the crowd has high confidence (>80% or <20%)",
  args: [],
  executable: async () => {
    try {
      console.log("💪 Fetching high confidence markets...");
      
      const response = await axios.get("https://gamma-api.polymarket.com/markets", {
        params: {
          active: true,
          closed: false,
          limit: 100
        },
        timeout: 10000
      });
      
      const markets = response.data;
      
      // Filter for high confidence (>80% or <20%)
      const highConfidence = markets
        .filter(m => {
          const yesPrice = m.outcomePrices?.[0] || 0.5;
          return yesPrice > 0.80 || yesPrice < 0.20;
        })
        .sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0)) // Sort by volume
        .slice(0, 8)
        .map(m => {
          const yesPrice = m.outcomePrices?.[0] || 0.5;
          const yesPercentage = Math.round(yesPrice * 100);
          
          return {
            question: shortenQuestion(m.question),
            probability: yesPercentage,
            outcome: yesPercentage > 50 ? "YES" : "NO",
            volume24hr: Math.round(m.volume24hr || 0),
            confidence: "VERY HIGH"
          };
        });
      
      console.log(`💪 Found ${highConfidence.length} high confidence markets`);
      
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify({
          count: highConfidence.length,
          markets: highConfidence
        })
      );
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Error: ${error.message}`
      );
    }
  }
});

// ============================================
// FUNCTION: Get Uncertain Markets
// Finds markets where crowd is split
// ============================================

const getUncertainMarkets = new GameFunction({
  name: "get_uncertain_markets",
  description: "Get markets where the crowd is uncertain (close to 50/50)",
  args: [],
  executable: async () => {
    try {
      console.log("🤷 Fetching uncertain markets...");
      
      const response = await axios.get("https://gamma-api.polymarket.com/markets", {
        params: {
          active: true,
          closed: false,
          limit: 100
        },
        timeout: 10000
      });
      
      const markets = response.data;
      
      // Filter for uncertain markets (45-55%)
      const uncertain = markets
        .filter(m => {
          const yesPrice = m.outcomePrices?.[0] || 0.5;
          return yesPrice >= 0.45 && yesPrice <= 0.55;
        })
        .filter(m => (m.volume24hr || 0) > 3000) // Must have decent volume
        .sort((a, b) => (b.volume24hr || 0) - (a.volume24hr || 0))
        .slice(0, 8)
        .map(m => {
          const yesPrice = m.outcomePrices?.[0] || 0.5;
          return {
            question: shortenQuestion(m.question),
            probability: Math.round(yesPrice * 100),
            volume24hr: Math.round(m.volume24hr || 0),
            confidence: "LOW"
          };
        });
      
      console.log(`🤷 Found ${uncertain.length} uncertain markets`);
      
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Done,
        JSON.stringify({
          count: uncertain.length,
          markets: uncertain
        })
      );
      
    } catch (error) {
      console.error("❌ Error:", error.message);
      return new ExecutableGameFunctionResponse(
        ExecutableGameFunctionStatus.Failed,
        `Error: ${error.message}`
      );
    }
  }
});

module.exports = {
  getTrendingMarkets,
  getMarketsByCategory,
  getHighConfidenceMarkets,
  getUncertainMarkets
};