import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data,type) => {
  try {
    const url= type==='password'?'http://127.0.0.1:3000/api/v1/users/UpdateMyPassword'
    :'http://127.0.0.1:3000/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (error) {
    // Safely check if error.response and error.response.data exist
    const errorMessage = error.response && error.response.data && error.response.data.message 
      ? error.response.data.message 
      : 'Something went wrong!';
    
    showAlert('error', errorMessage);
    console.error(error); // Log the complete error object for debugging
  }
};
