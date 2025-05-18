export interface StripeCheckoutFormProps {
  customer_email: string;
  line_items: Array<{
    price_data: {
      unit_amount: number;
      currency: string;
      product_data: {
        name: string;
      };
    };
    quantity: number;
  }>;
}
export interface StripeSetupIntentProps {
  id: string;
  status: string;
  payment_method: string;
  customer: string;
}

export interface CreatePaymentMethodParams {
  paymentMethodId: string;
  email: string;
}

export interface CreateSetupIntentParams {
  customerId: string;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  stripeCustomerId: string;
}

export interface StripePaymentIntentResponseProps {
  id: string;
  object: 'payment_intent';
  amount: number;
  amount_capturable: number;
  amount_details: {
    tip: {};
  };
  amount_received: number;
  application: null;
  application_fee_amount: null;
  automatic_payment_methods: {
    allow_redirects: 'always';
    enabled: true;
  };
  canceled_at: null;
  cancellation_reason: null;
  capture_method: 'automatic_async';
  client_secret: string;
  confirmation_method: 'automatic';
  created: number;
  currency: string;
  customer: null;
  description: null;
  last_payment_error: null;
  latest_charge: string;
  livemode: boolean;
  metadata: {
    [key: string]: any;
  };
  next_action: null;
  on_behalf_of: null;
  payment_method: string;
  payment_method_configuration_details: {
    id: string;
    parent: null;
  };
  payment_method_options: {
    card: {
      installments: null;
      mandate_options: null;
      network: null;
      request_three_d_secure: 'automatic';
    };
    link: {
      persistent_token: null;
    };
  };
  payment_method_types: Array<'card' | 'link'>;
  processing: null;
  receipt_email: null;
  review: null;
  setup_future_usage: null;
  shipping: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
    carrier: null;
    name: string;
    phone: string;
    tracking_number: null;
  };
  source: null;
  statement_descriptor: null;
  statement_descriptor_suffix: null;
  status: 'succeeded';
  transfer_data: null;
  transfer_group: null;
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  paymentMethodId: string;
}
