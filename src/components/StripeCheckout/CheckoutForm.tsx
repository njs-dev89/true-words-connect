import * as React from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useSiteNotificationContext } from "../../context/siteNotificationsContext";

// import CardSection from "./CardSection";

export default function CheckoutForm({ providerId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState(null);
  const { setSiteInfo, setSiteErrors } = useSiteNotificationContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: process.env.NEXT_PUBLIC_STRIPE_ORDER_RETURN_URL,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., payment
      // details incomplete)
      setError(error.message);
    } else {
      setSiteInfo("Order placed successfully");
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-96 p-4">
      {/* <CardSection /> */}
      {error && <div>{error}</div>}
      <PaymentElement />
      <button disabled={!stripe} className="btn btn-green mt-4">
        Confirm order
      </button>
    </form>
  );
}
