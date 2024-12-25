import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import moment from 'moment'; // Import moment for time formatting

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
export const StripePayment = async (req, res) => {
  const { cartItems, discount } = req.body;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    const discountValue = discount && discount > 0 ? discount : 0;

    const line_items = cartItems.map((item) => {
      const discountedPrice =
        discountValue > 0 ? item.price * (1 - discountValue / 100) : item.price;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.model,
            description: item.brand,
          },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    const totalCost = cartItems.reduce(
      (total, item) =>
        total +
        (discountValue > 0
          ? item.price * (1 - discountValue / 100)
          : item.price) *
          item.quantity,
      0
    );

    const productsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const uniqueOrderId = `stripe-${Date.now()}`; // Unique order ID

    const metadata = {
      uniqueOrderId,
      discount: discountValue.toString(),
    };

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/StripePaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
      metadata, // Store metadata in session
    });

    // Save order with session metadata once the payment is successful
    await Order.create({
      paypalOrderId: uniqueOrderId,
      cartItems,
      totalCost: totalCost.toFixed(2),
      amount: totalCost.toFixed(2),
      productsCount,
      status: 'Pending',
      date: moment().format('YYYY-MM-DD hh:mm A'), // Save formatted date
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Save Order After Payment Success
export const SaveOrder = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Invalid or unpaid session.' });
    }

    const orderReference = session.metadata.uniqueOrderId;

    // Retrieve the order from the database using the reference
    const existingOrder = await Order.findOne({ paypalOrderId: orderReference, status: 'Pending' });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found or already processed.' });
    }

    // Format the current date to 12-hour format
    const formattedDate = moment().format('YYYY-MM-DD hh:mm A'); // 12-hour format with AM/PM

    // Update the order status to "Placed"
    existingOrder.status = 'Placed';
    existingOrder.paymentMethod = 'stripe';
    existingOrder.date = formattedDate; // Save formatted date

    await existingOrder.save();

    // Return the updated order with formatted date and "Placed" status
    res.status(201).json({ 
      message: 'Order status updated to Placed.',
      order: {
        paypalOrderId: existingOrder.paypalOrderId,
        cartItems: existingOrder.cartItems,
        totalCost: existingOrder.totalCost,
        amount: existingOrder.amount,
        productsCount: existingOrder.productsCount,
        status: existingOrder.status,
        date: existingOrder.date, // Return formatted date
        paymentMethod: existingOrder.paymentMethod,
      },
    });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: error.message });
  }
};
