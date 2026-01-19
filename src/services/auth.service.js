import axios from 'axios';

const API_URL = 'https://bug-tracker-backend-83mn.onrender.com/api/auth/';
// const API_URL = 'http://localhost:8080/api/auth/';

const register = async (username, email, password) => {
  try {
    const response = await axios.post(API_URL + 'signup', {
      username,
      email,
      password,
      role: ['user']
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return {
      success: true,
      message: "Registration successfull, Please log in",
      data:response.data
    }
  } catch (error) {
    console.error('registration not happening')
    throw error;
  }
};

// const register = async (username, email, password) => {
//   try {
//     const response = await axios.post(API_URL + 'signup', {
//       username,
//       email,
//       password,
//       role: ['user']
//   }, {
//     withCredentials: true,
//     headers : {
//       'Content-Type':'application/json'
//     }
//   });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL + 'signin', { username, password },{
      withCredentials:true,
      headers: {
        'Content-Type' : 'application/json'
      }
    }
  );
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser
};

export default authService;