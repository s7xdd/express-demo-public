import { Router } from "express";
import { stripeController } from "../controllers/stripe-controller";

const stripeRoutes = Router();

//Embedded Checkout Routes
stripeRoutes.post("/create-checkout-session", stripeController.createCheckoutSession);
stripeRoutes.get("/session-status", stripeController.getSessionStatus);


//Embedded card entering form Routes
stripeRoutes.post("/create-payment-intent", stripeController.createPaymentIntent);
stripeRoutes.post("/check-payment-intent-status", stripeController.checkPaymentIntentStatus);


stripeRoutes.post("/attach-payment-method", stripeController.attachPaymentMethod);
stripeRoutes.post("/find-subscription", stripeController.findSubscription);
stripeRoutes.post("/invoice-preview", stripeController.invoicePreview);
stripeRoutes.post("/cancel-subscription", stripeController.cancelSubscription);



//NEW ROUTES
stripeRoutes.post("/create-customer", stripeController.createStripeCustomer);
stripeRoutes.post("/create-subscription", stripeController.createSubscription);
stripeRoutes.get("/stripe-callback", stripeController.stripeCallback);







stripeRoutes.post("/success", stripeController.handleSuccess);

export default stripeRoutes;
