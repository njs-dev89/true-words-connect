import * as React from "react";
import { CardElement } from "@stripe/react-stripe-js";
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
function CardSection() {
  return (
    <label>
      <h3 className="font-medium mb-4">Card details</h3>
      <CardElement
        options={CARD_ELEMENT_OPTIONS}
        className="border py-4 px-2 "
      />
    </label>
  );
}
export default CardSection;
