import checkoutRoutes from "./routes/checkout-routes";
import stripeRoutes from "./routes/stripe-routes";

export const checkoutModule = {
  routes: {
    v1: stripeRoutes,
    // v2: checkoutRoutes,
  },

  controllers: {},
};
