/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51LT4hxFm0hsc8QkUyljULeFX6dLn8r9433x1Olvff7jAvAOjgbpoP1m0MzJ1XtAt5EsQ6hUELhtqx4M6Qq43j1BK00yJ069rtf'
);

export const bookTour = async (tourId) => {
  try {
    // 1. get checkout session from API
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    // 2. create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
