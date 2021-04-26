import axios from "axios";
import catchAsync from "../../utils/catchAsync";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51IkKn5EM32bMERIhp60RpWAQU0ViAduFvfeqHvyNOhc71o109biHleVdoR1sBersvPJWJjLXryg7Aj1PlKE7oJVL00lxci70nN"
);
export const bookTour = async (tourId) => {
  try {
    //1 get session from server
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    // console.log(session);
    //2 create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};
