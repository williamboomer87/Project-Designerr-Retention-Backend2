
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = 'whsec_AuoLwve0JRzsbCWkWlQuzF3JckvH2FH9';
const Payment = require('../models/payment');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const getPaymentData = async (req, res) => {

  let event = req.body;
  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      console.log(paymentIntent)
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
  res.send();
}

const handlePaymentIntentSucceeded = (paymentIntent) => {

}

const calculateOrderAmount = (items) => {
  return 1400;
};

const createPayment = async (req, res) => {
  const { items, token } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      token: token,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}

const savePayment = async (req, res) => {
  const { paymentIntent, token } = req.body;

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    let amount = paymentIntent.amount / 100;

    const payment = await Payment.create({
      user_id: userId,
      amount: amount,
      status: paymentIntent.status
    });

    res.status(200).json({ success: true });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle JWT error
      return res.status(400).json({
        success: false, errors: {
          error: 'Invalid JWT token: ' + error.message
        }
      });
    } else {
      return res.status(500).json({
        success: false, errors: {
          "Error": error.message
        }
      });
    }
  }

  res.send();
}

const getUserPayment = async (req, res) => {
  const { token } = req.body;

  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    const payments = await Payment.findAll({
      where: {
        user_id: userId,
      },
    });

    res.status(201).json({ success: true, data: { payments: payments } });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Handle JWT error
      return res.status(400).json({
        success: false, errors: {
          error: 'Invalid JWT token: ' + error.message
        }
      });
    } else {
      return res.status(500).json({
        success: false, errors: {
          "Error": error.message
        }
      });
    }
  }

  res.send();
}


module.exports = {
  createPayment,
  getPaymentData,
  savePayment,
  getUserPayment
};
