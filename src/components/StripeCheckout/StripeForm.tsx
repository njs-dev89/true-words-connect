import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";
import { functions } from "../../config/firebaseConfig";
import { httpsCallable } from "@firebase/functions";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_live_51JxQuyE3fIKpY5oeFKRBasxSUDA2ei9wcU7fvmO5g0R90JK2aWahjQp6pmWBz4ZUGg2BxMkndQNRpsP6ISsNPJJB00mZinO79Q"
);
const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");

function StripeForm({ offerId }) {
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  useEffect(() => {
    createPaymentIntent({ offerId }).then((data: any) => {
      setClientSecret(data.data);
      setLoading(false);
    });
  }, []);
  return loading ? (
    <p>Loading...</p>
  ) : (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}

export default StripeForm;
