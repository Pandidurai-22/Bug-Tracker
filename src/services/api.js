const API_BASE_URL ='https://bug-tracker-backend-83mn.onrender.com/api';

// Fetch all bugs
export const getBugs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bugs`);
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.message || `HTTP error! status: ${response.status}`;
      console.error('Server error:', {
        status: response.status,
        statusText: response.statusText,
        error: data
      });
      throw new Error(`Failed to fetch bugs: ${errorMessage}`);
    }
    return data;
  } catch (error) {
    console.error('Error in getBugs:', error);
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
