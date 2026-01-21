import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/ai';
//const API_BASE_URL = 'https://bug-tracker-backend-83mn.onrender.com/api/ai';

/**
 * Get predicted priority for a bug description
 * @param {string} description - Bug description
 * @returns {Promise<string>} Predicted priority
 */
export const getPredictedPriority = async (description) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze/priority`, null, {
      params: { description }
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting priority:', error);
    return 'MEDIUM'; // Default fallback
  }
};

/**
 * Get predicted severity for a bug description
 * @param {string} description - Bug description
 * @returns {Promise<string>} Predicted severity
 */
export const getPredictedSeverity = async (description) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze/severity`, null, {
      params: { description }
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting severity:', error);
    return 'NORMAL'; // Default fallback
  }
};

/**
 * Extract entities from bug description
 * @param {string} description - Bug description
 * @returns {Promise<Object>} Extracted entities
 */
export const extractEntities = async (description) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze/entities`, null, {
      params: { description }
    });
    return response.data;
  } catch (error) {
    console.error('Error extracting entities:', error);
    return {};
  }
};

/**
 * Find similar bugs
 * @param {string} description - Bug description
 * @param {number} limit - Maximum number of similar bugs to return
 * @returns {Promise<Array>} List of similar bugs
 */
export const findSimilarBugs = async (description, limit = 5) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze/similar`, null, {
      params: { description, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error finding similar bugs:', error);
    return [];
  }
};

/**
 * Get suggested solutions for a bug
 * @param {string} description - Bug description
 * @returns {Promise<Array>} List of suggested solutions
 */
export const getSuggestedSolutions = async (description) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/suggest/solutions`, null, {
      params: { description }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting suggested solutions:', error);
    return [];
  }
};

/**
 * Get comprehensive AI analysis (includes tags, severity, priority)
 * Uses backend endpoint that calls AI service
 * @param {string} description - Bug description
 * @param {string} title - Bug title (optional)
 * @returns {Promise<Object>} Comprehensive AI analysis with tags
 */
export const getComprehensiveAnalysis = async (description, title = '') => {
  try {
    const API_URL = API_BASE_URL.replace('/ai', '');
    const response = await axios.post(`${API_URL}/bugs/ai/analyze`, {
      title: title,
      description: description
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting comprehensive analysis:', error);
    return null;
  }
};

/**
 * Analyze bug description and return comprehensive AI insights
 * @param {string} description - Bug description
 * @param {string} title - Bug title (optional)
 * @returns {Promise<Object>} AI analysis results with tags
 */
export const analyzeBugDescription = async (description, title = '') => {
  try {
    // Use comprehensive analysis endpoint (includes tags)
    const comprehensive = await getComprehensiveAnalysis(description, title);
    if (comprehensive && comprehensive.tags) {
      return {
        priority: comprehensive.priority,
        severity: comprehensive.severity,
        tags: comprehensive.tags || [],
        similarBugs: comprehensive.similarBugs || [],
        confidence: comprehensive.confidence,
        modelVersion: comprehensive.modelVersion,
        needsReview: comprehensive.needsReview || false
      };
    }
  } catch (error) {
    console.error('Comprehensive analysis failed:', error);
  }

  // Fallback to individual calls if comprehensive fails
  try {
    const [priority, severity] = await Promise.all([
      getPredictedPriority(description).catch(() => 'MEDIUM'),
      getPredictedSeverity(description).catch(() => 'NORMAL')
    ]);

    return {
      priority,
      severity,
      tags: [], // No tags from fallback
      similarBugs: [],
      confidence: 0.5,
      needsReview: true
    };
  } catch (error) {
    console.error('Fallback analysis failed:', error);
    return {
      priority: 'MEDIUM',
      severity: 'NORMAL',
      tags: [],
      similarBugs: [],
      confidence: 0.0,
      needsReview: true
    };
  }
};
