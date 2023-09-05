import axios from 'axios';

const serverURL = 'http://localhost:4000';

const API = async (endpoint, method, data) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-type': 'application/json',
  };
  // 토큰이 존재한다면,
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    url: serverURL + endpoint,
    method: method,
    headers: headers,
    data: data,
  };

  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    if (error.response) {
      console.log('Error status:', error.response.status);
    }
    throw error;
  }
};

export default API;
