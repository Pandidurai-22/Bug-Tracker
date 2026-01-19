const API_BASE_URL = 'http://localhost:8080/api';

// Fetch all bugs
export const getBugs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs`);
    if (!response.ok) {
      throw new Error('Failed to fetch bugs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bugs:', error);
    throw error;
  }
};

// Create a new bug
export const createBug = async (bugData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bugData),
    });

    if (!response.ok) {
      throw new Error('Failed to create bug');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating bug:', error);
    throw error;
  }
};

// Update bug status
export const updateBugStatus = async (bugId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs/${bugId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update bug status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating bug status:', error);
    throw error;
  }
};
