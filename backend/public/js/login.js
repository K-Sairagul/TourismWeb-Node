/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        // Handle the success case if the response contains 'success' in the status
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        } else {
            // Handle other non-success statuses in the response
            const message = res.data.message || 'Login failed, please try again.';
            showAlert('error', message);
        }
    } catch (err) {
        // Handle cases where the error object might not have response or message fields
        const message = 'An error occurred, please try again.';
        showAlert('error', message);
    }
};
