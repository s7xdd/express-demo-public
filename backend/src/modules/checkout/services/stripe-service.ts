const stripe = require('stripe')('sk_test_51RE8j4RifjQEyrRHRwpDUsoyVzOI7qYyyobTLQBVjRzkuUqr0ZcvAptC33ENXhs6Lk3rixsSb7WyrwhbPvn72OQf00QRuU2jwp');

import { calculateOrderAmount } from '../functions/checkout-functions';
import { CreatePaymentIntentParams, CreatePaymentMethodParams, CreateSetupIntentParams, CreateSubscriptionParams, StripeCheckoutFormProps } from '../types/stripe-types';

export const stripeServices = {
  //FOR EMBEDDED UI
  async createSession(data: StripeCheckoutFormProps) {
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        customer_email: data.customer_email,
        submit_type: 'auto',
        billing_address_collection: 'auto',
        phone_number_collection: { enabled: true },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'],
        },
        line_items: data.line_items,
        mode: 'payment',
        return_url: `${process.env.STRIPE_RETURN_URL}`,
      });
      return session;
    } catch (error) {
      throw error;
    }
  },

  //FOR EMBEDDED INPUT FORM
  async createPaymentIntent({ amount, currency, stripeCustomerId, newMetadata }: { amount: string, currency: string, stripeCustomerId: string, newMetadata: { [key: string]: string } }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        confirm: false,
        customer: stripeCustomerId,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        metadata: { ...newMetadata },
        setup_future_usage: 'off_session',
      });
      return paymentIntent;
    } catch (error: any) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  },

  async checkPaymentIntentStatus(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error: any) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  },

  async createCustomer(email: string) {
    try {
      const customer = await stripe.customers.create({ email });
      return customer;
    } catch (error: any) {
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  },

  async findSubscription({ subscriptionId }: { subscriptionId: string }) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error: any) {
      throw new Error(`Failed to find subscription: ${error.message}`);
    }
  },

  async getAllSubscriptions({ customerId }: { customerId: string }) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
      });
      return subscriptions;
    } catch (error: any) {
      throw new Error(`Failed to find subscriptions: ${error.message}`);
    }
  },

  async deleteSubscription({ subscriptionId }: { subscriptionId: string }) {
    try {
      const deletedSubscription = await stripe.subscriptions.del(
        subscriptionId
      );
      return deletedSubscription;
    } catch (error: any) {
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }
  },
  async invoiceLookup({ subscriptionId, customerId, priceId }: { subscriptionId: string; customerId: string, priceId: string }) {
    try {
      const subscription = await this.findSubscription({ subscriptionId });
      const invoice = await stripe.invoices.retrieve(subscription.latest_invoice.id);
      return invoice;
    } catch (error: any) {
      throw new Error(`Failed to find invoice: ${error.message}`);
    }
  },

  async attachPaymentMethod(customerId: string, paymentMethodId: string) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      return paymentMethod;
    } catch (error: any) {
      throw new Error(`Failed to attach payment method: ${error.message}`);
    }
  },

  async createSubscription({ customerId, priceId, paymentMethodId, paymentIntentId, metaData }: { customerId: string, priceId: string, paymentIntentId: string, paymentMethodId: string, metaData: { [key: string]: string } }) {
    try {
      let paymentMethod;
      try {
        paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      } catch (error: any) {
        throw new Error(`Invalid payment method: ${error.message}`);
      }

      if (!paymentMethod.customer) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
      } else if (paymentMethod.customer !== customerId) {
        throw new Error('Payment method is attached to a different customer.');
      }

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      const trialEnd = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
        payment_behavior: 'allow_incomplete',
        trial_end: trialEnd,
        metadata: { ...metaData, setupCostPaymentId: paymentIntentId },
      });

      if (!subscription) {
        throw new Error('Failed to create subscription');
      }

      return {
        subscription,
      };
    } catch (error: any) {
      throw new Error(`Failed to create subscription or payment intent: ${error.message}`);
    }
  },

  async updateSubscriptionPaymentMethod({ customerId, subscriptionId, paymentMethodId, paymentIntentId }: { customerId: string, subscriptionId: string, paymentMethodId: string, paymentIntentId: string }) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`PaymentIntent is not succeeded. Status: ${paymentIntent.status}`);
      }

      const invoiceId = paymentIntent.metadata.invoice_id;
      if (!invoiceId) {
        throw new Error('No invoice ID found in PaymentIntent metadata');
      }

      const invoice = await stripe.invoices.retrieve(invoiceId);

      if (invoice.status === 'open') {
        await stripe.invoices.finalizeInvoice(invoice.id, {
          auto_advance: true,
        });
      } else if (invoice.status !== 'paid') {
        throw new Error(`Invoice is not paid and cannot be finalized. Status: ${invoice.status}`);
      }

      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        default_payment_method: paymentMethodId,
        status: invoice.status === 'paid' ? 'active' : 'incomplete',
      });

      return { subscription: updatedSubscription, invoice };
    } catch (error: any) {
      throw new Error(`Failed to update subscription payment method: ${error.message}`);
    }
  }
};
