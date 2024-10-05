/*eslint-disable*/
import axios from 'axios'
import {showAlert} from './alert';

export const  bookTour=async tourId=>{
    //1) Get checkout session from API
    const stripe=Stripe('pk_test_51Q65C7RrtLEve9UIPawRh7SpfDPVeuT92xVz1mF901R8rl9Hj8S5z2ab5aV6gLUkbhCGrgdNg0A9boGxPMntVy1y00Y0er5jfQ');

    try{

        const session=await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`

    );
    console.log(session)

    //2)Create checkout 
     await stripe.redirectToCheckout({
        sessionId:session.data.session.id
     })


} catch(err){
    console.log(err);
    showAlert('error',err);
}


    

};
