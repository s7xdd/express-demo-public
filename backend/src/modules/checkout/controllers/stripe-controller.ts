import { ResponseHandler } from '../../../shared/components/response-handler/response-handler';
import { createPayload } from '../../../shared/utils/helper/common-functions';
import { calculateOrderAmount } from '../functions/checkout-functions';
import { stripeServices } from '../services/stripe-service';
import { StripePaymentIntentResponseProps, StripeSetupIntentProps } from '../types/stripe-types';

const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeCustomerId = 'cus_SJatPcnkWqqrY3';

export const stripeController = {
  //Embedded Checkout Form
  async createCheckoutSession(req: any, res: any, next: any) {
    try {
      const data = {
        line_items: [
          {
            price_data: {
              unit_amount: 400000,
              currency: 'usd',
              product_data: {
                name: 'Test Product',
              },
            },
            quantity: 1,
          },
        ],
        customer_email: 'test@gmail.com',
      };

      const session = await stripeServices.createSession(data);

      res.send({ clientSecret: session.client_secret });
    } catch (error) {
      next(error);
    }
  },

  async getSessionStatus(req: any, res: any) {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    res.send({
      status: session.status,
      customer_email: session.customer_details!.email,
    });
  },

  async fulfillCheckout(sessionId: any) {
    console.log('Fulfilling Checkout Session ' + sessionId);
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (checkoutSession.payment_status !== 'unpaid') {
    }
  },

  //Embedded card entering form
  async createPaymentIntent(req: any, res: any, next: any) {
    try {
      const { customerId } = req.body;

      const selectedPlan = {
        planId: '123',
        planAmount: '20000',
        currency: 'USD',
        planPriceId: 'price_1RODPwRifjQEyrRHqSg4Dda8'
      }

      const paymentIntent = await stripeServices.createPaymentIntent({
        amount: selectedPlan.planAmount,
        currency: selectedPlan.currency,
        stripeCustomerId: customerId,
        newMetadata: {
          ...selectedPlan
        }
      });

      ResponseHandler.success({
        res,
        message: 'Payment Intent created successfully',
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          paymentIntent: paymentIntent,
        },
      });
    } catch (error) {
      next(error);
    }
  },


  async stripeCallback(req: any, res: any, next: any) {
    try {
      const { payment_intent, payment_intent_client_secret, redirect_status } = req.query;
      if (!payment_intent || !payment_intent_client_secret || !redirect_status) {
        res.redirect(process.env.FRONTEND_URL + '/order-response?success=false');
      }

      const response: StripePaymentIntentResponseProps = await stripeServices.checkPaymentIntentStatus(payment_intent);

      if (response.status === 'succeeded') {
        const createSubscription = await stripeServices.createSubscription({ customerId: response.customer!, paymentMethodId: response.payment_method, paymentIntentId: response.id, priceId: response.metadata.planPriceId, metaData: response.metadata });

        console.log("createSubscription", createSubscription);

        res.redirect(`${process.env.FRONTEND_URL}/order-response?success=true`);
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/order-response?success=false`);
      }
    } catch (error) {
      next(error);
    }
  },

  async createSubscription(req: any, res: any, next: any) {
    try {
      const { customerId, priceId, paymentMethodId, paymentIntentId, metaData } = req.body;
      console.log("req.body",req.body);
      
      if (!customerId || !priceId || !paymentMethodId || !metaData) {
        throw new Error('Missing details');
      }
      
      const subscription = await stripeServices.createSubscription({ customerId, priceId, paymentMethodId, paymentIntentId, metaData });

      ResponseHandler.success({
        res,
        message: 'createSubscription created',
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  },


  async checkPaymentIntentStatus(req: any, res: any, next: any) {
    try {
      const { payment_intent } = req.body;
      if (!payment_intent) {
        throw new Error('Missing payment_intent ID');
      }
      const response: StripePaymentIntentResponseProps = await stripeServices.checkPaymentIntentStatus(payment_intent);

      ResponseHandler.success({
        res,
        message: 'Payment Intent status retrieved',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async createStripeCustomer(req: any, res: any, next: any) {
    try {
      const { email } = req.body;
      if (!email) {
        throw new Error('Missing email');
      }
      const response = await stripeServices.createCustomer(email);

      ResponseHandler.success({
        res,
        message: 'Customer created',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async handleSuccess(req: any, res: any, next: any) {


  },

  async invoicePreview(req: any, res: any, next: any) {
    try {
      const { customerId, priceId, subscriptionId } = req.body;
      if (!customerId) {
        throw new Error('Missing customerId');
      }
      const response = await stripeServices.invoiceLookup({ customerId, priceId, subscriptionId });

      ResponseHandler.success({
        res,
        message: 'Customer created',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async cancelSubscription(req: any, res: any, next: any) {
    try {
      const { subscriptionId } = req.body;
      if (!subscriptionId) {
        throw new Error('Missing subscriptionId');
      }
      const response = await stripeServices.deleteSubscription({ subscriptionId });

      ResponseHandler.success({
        res,
        message: 'Subscription cancelled',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async attachPaymentMethod(req: any, res: any, next: any) {
    try {
      const { subscriptionId, customerId, paymentMethodId, paymentIntentId } = req.body;
      if (!subscriptionId) {
        throw new Error('Missing subscriptionId');
      }
      const response = await stripeServices.updateSubscriptionPaymentMethod({ subscriptionId, customerId, paymentMethodId, paymentIntentId });

      ResponseHandler.success({
        res,
        message: 'updateSubscriptionPaymentMethod',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },

  async findSubscription(req: any, res: any, next: any) {
    try {
      const { subscriptionId } = req.body;
      if (!subscriptionId) {
        throw new Error('Missing subscriptionId');
      }
      const response = await stripeServices.findSubscription({ subscriptionId });

      ResponseHandler.success({
        res,
        message: 'findSubscription',
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },





};
