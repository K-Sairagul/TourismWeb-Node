import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name, email, password, passwordConfirmation) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signup', // Use relative URL
      data: { name, email, password, passwordConfirmation },
      timeout: 10000, // 10 second timeout
      withCredentials: true
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
      return true; // Explicit return
    }
  } catch (err) {
    console.error('Signup error:', err);
    let errorMsg = err.response?.data?.message || 
                  err.message || 
                  'Signup failed. Please try again.';
    
    // Handle timeout specifically
    if (err.code === 'ECONNABORTED') {
      errorMsg = 'Request timeout. Please check your connection.';
    }
    
    throw new Error(errorMsg); // Re-throw for form handler
  }
};
export default signup;