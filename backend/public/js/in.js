import {login,logout} from './login'
import signup from './signup';
// import '@babel/polyfill'
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Map } from './mapBox';
import { updateSettings } from './updateSettings';
import {bookTour} from './stripe'




//Login purpose
const loginForm = document.querySelector('.form--login');
const signupForm=document.querySelector('.form--signup');
const mapBox=document.getElementById('map');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn=document.getElementById('book-tour')


   
  if(mapBox){
      const locations=JSON.parse(mapBox.dataset.locations);
      Map(locations);
  }



 // Assuming signupForm and loginForm are already defined
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value; // Updated ID
    const email = document.getElementById('signupEmail').value; // Updated ID
    const password = document.getElementById('signupPassword').value; // Updated ID
    const passwordConfirmation = document.getElementById('signupPasswordConfirmation').value; // Updated ID
    signup(name, email, password, passwordConfirmation);
  });
} else {
  console.log('Failed to send signup data');
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value; // Updated ID
    const password = document.getElementById('loginPassword').value; // Updated ID
    login(email, password);
  });
} else {
  console.error('Form element not found!');
}


// This thing is used for logut purpose...
    document.addEventListener('DOMContentLoaded', () => {
    const logOutBtn = document.querySelector('.nav__el--logout');
  
    if (logOutBtn) {
      logOutBtn.addEventListener('click', logout);
    } else {
      console.error('Logout button not found!');
    }
  });



  if(userDataForm)
    userDataForm.addEventListener('submit', e=>{

     e.preventDefault();
     const form= new FormData();
     form.append('name',document.getElementById('name').value)
     form.append('email',document.getElementById('email').value)
     form.append('photo',document.getElementById('photo').files[0])
     console.log(form)

     updateSettings(form,'data')

  })




  if(userPasswordForm)
    userPasswordForm.addEventListener('submit', async(e)=>{
    document.querySelector('.btn--save--password').textContent='Updating...'

     e.preventDefault();
     const passwordCurrent = document.getElementById('password-current').value;
     const  password= document.getElementById('password').value;
     const  passwordConfirmation= document.getElementById('password-confirm').value;

     await updateSettings({passwordCurrent,password,passwordConfirmation},'password')
     
    document.querySelector('.btn--save--password').textContent='Save Password'
     
     document.getElementById('password-current').value='';
     document.getElementById('password').value='';
     document.getElementById('password-confirm').value='';

  })

  

  if(bookBtn)
    bookBtn.addEventListener('click',e=>{
    e.target.textContent='Processing..'
     const {tourId}=e.target.dataset;
     bookTour(tourId)
  })
  
  