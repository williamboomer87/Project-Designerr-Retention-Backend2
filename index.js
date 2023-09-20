const serverless = require("serverless-http");
const express = require('express');
const cors = require('cors');

const app = express();
const port = 8080;

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = 'whsec_AuoLwve0JRzsbCWkWlQuzF3JckvH2FH9';

// Middleware
app.use(express.json());

app.post('/payment/get-payment-data', express.raw({ type: 'application/json' }), (request, response) => {
  let event = request.body;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
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

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});




app.use(cors());

// Routes
app.use('/auth', authRoutes);

app.use('/chat', chatRoutes);

app.use('/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

module.exports.handler = serverless(app);
