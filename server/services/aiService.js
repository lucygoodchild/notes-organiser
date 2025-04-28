const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: "./.env.local" });
const HF_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

// API endpoints for various AI models on Hugging Face
const SENTIMENT_MODEL_API = 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english';
const SUMMARIZATION_MODEL_API = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const CLASSIFICATION_MODEL_API = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

// Categories for classification
const CATEGORIES = ['Work', 'Personal', 'Ideas', 'Other'];

/**
 * Analyze text using AI models from Hugging Face
 * @param {string} text - The note content to analyze
 * @returns {Object} Analysis results including sentiment, summary, and category
 */
async function analyzeText(text) {
  try {
    // Only analyze if text is longer than a certain threshold
    if (text.length < 10) {
      return {
        sentiment: 'Neutral',
        summary: '',
        suggestedCategory: 'Other'
      };
    }

    // Make parallel API calls for efficiency
    const [sentimentResult, summaryResult, categoryResult] = await Promise.allSettled([
      analyzeSentiment(text),
      summarizeText(text),
      classifyText(text, CATEGORIES)
    ]);

    return {
      sentiment: sentimentResult.status === 'fulfilled' ? sentimentResult.value : 'Neutral',
      summary: summaryResult.status === 'fulfilled' ? summaryResult.value : '',
      suggestedCategory: categoryResult.status === 'fulfilled' ? categoryResult.value : 'Other'
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    return {
      sentiment: 'Neutral',
      summary: '',
      suggestedCategory: 'Other'
    };
  }
}

/**
 * Analyze sentiment of text
 * @param {string} text 
 * @returns {string} Sentiment (Positive, Neutral, Negative)
 */
async function analyzeSentiment(text) {
  try {
    const response = await axios.post(
      SENTIMENT_MODEL_API,
      { inputs: text },
      { headers: { Authorization: `Bearer ${HF_API_TOKEN}` } }
    );

    const result = response.data;
    
    // Extract sentiment label and score
    if (Array.isArray(result) && result[0] && result[0][0]) {
      const { label, score } = result[0][0];
      
      if (label === 'POSITIVE' && score > 0.6) return 'Positive';
      if (label === 'NEGATIVE' && score > 0.6) return 'Negative';
      return 'Neutral';
    }
    
    return 'Neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 'Neutral';
  }
}

/**
 * Generate summary for longer texts
 * @param {string} text 
 * @returns {string} Summarized text
 */
async function summarizeText(text) {
  // Only summarize longer text (more than 100 chars)
  if (text.length < 100) return '';
  
  try {
    const response = await axios.post(
      SUMMARIZATION_MODEL_API,
      {
        inputs: text,
        parameters: {
          max_length: 100,
          min_length: 30,
          do_sample: false
        }
      },
      { headers: { Authorization: `Bearer ${HF_API_TOKEN}` } }
    );

    const result = response.data;
    return result[0]?.summary_text || '';
  } catch (error) {
    console.error('Summarization error:', error);
    return '';
  }
}

/**
 * Classify text into one of the predefined categories
 * @param {string} text 
 * @param {string[]} categories 
 * @returns {string} Best matching category
 */
async function classifyText(text, categories) {
  try {
    // Validate input
    if (!text || categories.length === 0) {
      throw new Error('Invalid input: text or categories are missing');
    }

    // Create hypotheses
    const hypotheses = categories.map(category => `This is a ${category.toLowerCase()} note.`);

    // Make API requests
    const promises = hypotheses.map(hypothesis => {
      return axios.post(
        CLASSIFICATION_MODEL_API,
        {
          inputs: {
            premise: text,
            hypothesis: hypothesis,
          },
        },
        { headers: { Authorization: `Bearer ${HF_API_TOKEN}` } }
      );
    });

    const results = await Promise.all(promises);

    // Find the category with the highest entailment score
    let bestScore = -1;
    let bestCategory = 'Other';
    results.forEach((response, index) => {
      const scores = response.data[0]?.scores || [];
      const entailmentScore = scores[0]; // Assuming entailment is the first score
      if (entailmentScore > bestScore) {
        bestScore = entailmentScore;
        bestCategory = categories[index];
      }
    });

    return bestCategory;
  } catch (error) {
    console.error('Classification error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Parse natural language query (NLQ) for advanced search
 * @param {string} query 
 * @returns {Object} Structured query parameters
 */
async function parseNaturalLanguageQuery(query) {
  // Simplified implementation - in a real app, you'd use a more sophisticated NLP model
  const queryLower = query.toLowerCase();
  
  // Extract time references
  const timeMatches = {
    'today': {
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
        $lt: new Date(new Date().setHours(24, 0, 0, 0))  // Start of tomorrow
      }
    },
    'yesterday': {
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0),
        $lt: new Date(new Date().setHours(0, 0, 0, 0))
      }
    },
    'this week': {
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0, 0, 0, 0)
      }
    },
    'last week': {
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 7)).setHours(0, 0, 0, 0),
        $lt: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).setHours(0, 0, 0, 0)
      }
    },
  };
  
  // Extract category references
  const categoryMatches = {
    'work': { category: 'Work' },
    'personal': { category: 'Personal' },
    'ideas': { category: 'Ideas' }
  };

  // Build query object
  let queryObj = {};

  // Check for time references
  for (const [key, value] of Object.entries(timeMatches)) {
    if (queryLower.includes(key)) {
      queryObj = { ...queryObj, ...value };
      break;
    }
  }

  // Check for category references
  for (const [key, value] of Object.entries(categoryMatches)) {
    if (queryLower.includes(key)) {
      queryObj = { ...queryObj, ...value };
      break;
    }
  }

  // Extract keywords (removing common words and query terms)
  const stopWords = ['find', 'my', 'notes', 'from', 'about', 'containing', 'the', 'a', 'an', 'in', 'on', 'at', 'with'];
  const words = queryLower.split(/\s+/);
  const keywords = words.filter(word =>
    !stopWords.includes(word) &&
    !Object.keys(timeMatches).some(key => key.includes(word)) &&
    !Object.keys(categoryMatches).some(key => key.includes(word))
  );

  // Add text search if keywords exist
  if (keywords.length > 0) {
    const searchRegex = keywords.join('|');
    queryObj.$or = [
      { title: { $regex: searchRegex, $options: 'i' } },
      { content: { $regex: searchRegex, $options: 'i' } }
    ];
  }

  return queryObj;
}

module.exports = {
  analyzeText,
  parseNaturalLanguageQuery
};