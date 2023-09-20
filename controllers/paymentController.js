
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = 'we_1NsVeeJYVRzxBOJIbpbIxvCG';

const getPaymentData = async (req, res) => {
  console.log('-----------------')
  console.log('Raw Request Body:', req.rawBody);

  let event = req.body;
  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];
    let body = JSON.stringify(req.body, null, 2);

    console.log(req.body)
    console.log('++++++++++++++')
    console.log(body)


    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  console.log('-----------------')

  // Return a 200 response to acknowledge receipt of the event
  response.send();
}


const calculateOrderAmount = (items) => {
  return 1400;
};

const createPayment = async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}



module.exports = {
  createPayment,
  getPaymentData
};
