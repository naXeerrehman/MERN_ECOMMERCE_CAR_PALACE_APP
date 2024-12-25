// controllers/paypalController.js
import paypal from "@paypal/checkout-server-sdk";
import Order from "../models/Order.js";

const clientId = process.env.PAYPAL_CLIENT_ID;
const secretKey = process.env.PAYPAL_SECRET_KEY;

// Set up PayPal environment and client
const environment = new paypal.core.SandboxEnvironment(clientId, secretKey);
const client = new paypal.core.PayPalHttpClient(environment);

const createOrder = async (req, res) => {
  const { cartItems, discount } = req.body;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // Calculate total cost before discount
    let totalCost = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Apply discount if valid
    if (discount && !isNaN(discount) && discount > 0) {
      const discountAmount = (totalCost * discount) / 100;
      totalCost -= discountAmount;
    }

    totalCost = totalCost.toFixed(2);

    // Create PayPal order request
    const purchaseUnits = [
      {
        amount: {
          currency_code: "USD",
          value: totalCost,
        },
      },
    ];

    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: purchaseUnits,
      application_context: {
        return_url: `http://localhost:5000/api/paypal/capture-order`,
        cancel_url: `http://localhost:3000/cancel`,
      },
    });

    const orderResponse = await client.execute(orderRequest);
    const approvalUrl = orderResponse.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    // Save the order
    const order = new Order({
      cartItems,
      discount: discount || 0,
      totalCost: totalCost,
      amount: totalCost,
      productsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      status: "Placed",
      paymentMethod: "PayPal",
      date: new Date(),
      paypalOrderId: orderResponse.result.id,
    });

    await order.save();

    res.status(200).json({
      approvalUrl,
      paypalOrderId: orderResponse.result.id,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    const captureResponse = await client.execute(captureRequest);

    const { id, purchase_units } = captureResponse.result;
    const purchaseUnit = purchase_units[0];
    const cartItems = purchaseUnit.items || [];

    // Calculate total cost based on captured items
    const totalCost = cartItems.reduce(
      (total, item) => total + item.unit_amount.value * item.quantity,
      0
    );

    // Update order status
    await Order.findOneAndUpdate(
      { paypalOrderId: id },
      { status: "Placed", totalCost: totalCost.toFixed(2) },
      { new: true }
    );

    res.redirect(`http://localhost:3000/PaypalPaymentSuccess?orderId=${id}`);
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    res.redirect("http://localhost:3000/failure");
  }
};

export { createOrder, captureOrder };
