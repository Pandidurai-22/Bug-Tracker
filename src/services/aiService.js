import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api/ai';
const API_BASE_URL = 'https://bug-tracker-backend-83mn.onrender.com/api/ai';

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
 * Analyze bug description and return comprehensive AI insights
 * @param {string} description - Bug description
 * @returns {Promise<Object>} AI analysis results
 */
export const analyzeBugDescription = async (description) => {
  const [priority, severity, entities, similarBugs, solutions] = await Promise.all([
    getPredictedPriority(description),
    getPredictedSeverity(description),
    extractEntities(description),
    findSimilarBugs(description, 3),
    getSuggestedSolutions(description)
  ]);

  return {
    priority,
    severity,
    entities,
    similarBugs,
    solutions
  };
};
