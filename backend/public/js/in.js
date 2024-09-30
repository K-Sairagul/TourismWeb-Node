import {login} from './login'
import '@babel/polyfill'
import { Map } from './mapBox';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form');
  
    console.log(loginForm); // Check if the form element is found
  
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
      });
    } else {
      console.error('Form element not found!');
    }
  });
  