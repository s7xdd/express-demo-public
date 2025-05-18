import Stripe from "stripe";
import { stripeServices } from "../services/stripe-service";

const stripe = require("stripe")(
  "sk_test_51RE8j4RifjQEyrRHRwpDUsoyVzOI7qYyyobTLQBVjRzkuUqr0ZcvAptC33ENXhs6Lk3rixsSb7WyrwhbPvn72OQf00QRuU2jwp"
);

export const checkoutController = {
  createCheckoutSession: async (req: any, res: any, next: any) => {
    try {
      const { product_id } = req.body;

      const data = {
        line_items: [
          {
            price_data: {
              unit_amount: 400000,
              currency: "usd",
              product_data: {
                name: "Test Product",
              },
            },
            quantity: 1,
          },
        ],
        customer_email: req.user.email,
      };

      const session = await stripeServices.createSession(data);

      res.send({ clientSecret: session.client_secret });
      
    } catch (error) {
      next(error);
    }
  },
};
