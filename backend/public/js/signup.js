/* eslint-disable */
import axios from "axios";
import { showAlert } from './alert';


export const signup = async (name, email, password, passwordConfirmation) => {
    console.log(name, password, email, passwordConfirmation);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirmation
            }
        });

        // Handle the success case if the response contains 'success' in the status
        if (res.data.status === 'success') {
            showAlert('success', 'User created successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        // Improved error handling
        let message = 'An error occurred'; // Default error message

        // Check if err.response exists
        if (err.response) {
            // If there's a response, try to get the message from it
            message = err.response.data.message || message; // Fallback to default message
        } else if (err.request) {
            // If there's no response, the request was made but no response was received
            message = 'No response from server';
        } else {
            // Other errors (like setting up the request)
            message = err.message || message;
        }

        showAlert('error', message);
    }
};

export default signup;

