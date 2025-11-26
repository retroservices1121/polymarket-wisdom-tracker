// ============================================
// FORMATTING UTILITIES
// Helper functions to format data for tweets
// ============================================

/**
 * Format a price as a percentage
 */
function formatPercentage(price) {
  return Math.round(price * 100) + "%";
}

/**
 * Format volume as a readable number
 */
function formatVolume(volume) {
  if (volume >= 1000000) {
    return "$" + (volume / 1000000).toFixed(1) + "M";
  } else if (volume >= 1000) {
    return "$" + (volume / 1000).toFixed(0) + "K";
  } else {
    return "$" + Math.round(volume);
  }
}

/**
 * Calculate confidence level based on price
 */
function getConfidenceLevel(price) {
  const percentage = price * 100;
  
  if (percentage >= 85 || percentage <= 15) {
    return "VERY HIGH";
  } else if (percentage >= 70 || percentage <= 30) {
    return "HIGH";
  } else if (percentage >= 60 || percentage <= 40) {
    return "MODERATE";
  } else {
    return "LOW";
  }
}

/**
 * Get emoji based on confidence level
 */
function getConfidenceEmoji(price) {
  const percentage = price * 100;
  
  if (percentage >= 85 || percentage <= 15) {
    return "🔥"; // Very confident
  } else if (percentage >= 70 || percentage <= 30) {
    return "💪"; // Confident
  } else if (percentage >= 60 || percentage <= 40) {
    return "🤔"; // Moderate
  } else {
    return "🤷"; // Uncertain
  }
}

/**
 * Get trend emoji based on price change
 */
function getTrendEmoji(priceChange) {
  if (priceChange > 10) {
    return "🚀"; // Big increase
  } else if (priceChange > 5) {
    return "📈"; // Increase
  } else if (priceChange < -10) {
    return "📉"; // Big decrease
  } else if (priceChange < -5) {
    return "⬇️"; // Decrease
  } else {
    return "➡️"; // Stable
  }
}

/**
 * Shorten a market question if too long
 */
function shortenQuestion(question, maxLength = 80) {
  if (question.length <= maxLength) {
    return question;
  }
  return question.substring(0, maxLength - 3) + "...";
}

/**
 * Calculate price change percentage
 */
function calculatePriceChange(currentPrice, previousPrice) {
  if (!previousPrice || previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

/**
 * Format a date to a readable string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

module.exports = {
  formatPercentage,
  formatVolume,
  getConfidenceLevel,
  getConfidenceEmoji,
  getTrendEmoji,
  shortenQuestion,
  calculatePriceChange,
  formatDate
};