import { login, logout } from './login';
import signup from './signup';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Map } from './mapBox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { likeTour } from './likeButton';

// DOM Elements
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const mapBox = document.getElementById('map');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const likeBtns = document.querySelectorAll('.btn--like');


// Map rendering
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  Map(locations);
}

// Signup form submission
// Signup form submission
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.btn--green');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const passwordConfirmation = document.getElementById('signupPasswordConfirmation').value;

      // Client-side validation
      if (password !== passwordConfirmation) {
        throw new Error('Passwords do not match');
      }

      await signup(name, email, password, passwordConfirmation);
      
    } catch (error) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      showAlert('error', error.message);
    }
  });
}

// Login form submission
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
  });
}

// Logout event listener
document.addEventListener('DOMContentLoaded', () => {
  const logOutBtn = document.querySelector('.nav__el--logout');
  if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
  }
});

// Update user data
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

// Update user password
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save--password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password-confirm').value;

    await updateSettings({ passwordCurrent, password, passwordConfirmation }, 'password');

    document.querySelector('.btn--save--password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// Book tour
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}


//likeUpdation


if (likeBtns) {
  likeBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const button = e.currentTarget; // Get the button itself
      const tourId = button.dataset.tourId; // Get tour ID from dataset

      try {
        const liked = await likeTour(tourId); // Call API and get liked status

        // Update button UI based on like status
        button.innerHTML = liked 
          ? '<svg class="card__icon"><use xlink:href="/img/icons.svg#icon-heart-filled"></use></svg>' 
          : '<svg class="card__icon"><use xlink:href="/img/icons.svg#icon-heart"></use></svg>'; 

        // Toggle class for styling
        button.classList.toggle('liked', liked);
      } catch (err) {
        console.error(err);
      }
    });
  });
}
