import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const {
      cartItems,
      paymentMethod,
      date,
      status,
      paymentStatus,
      shippingAddress,
      billingAddress,
    } = req.body;

    // Ensure the 'date' is a valid date or use current date
    let orderDate;
    if (date) {
      orderDate = new Date(date);
      // Check if date is invalid
      if (isNaN(orderDate.getTime())) {
        return res.status(400).json({ message: "Invalid date provided" });
      }
    } else {
      orderDate = new Date(); // If no date is provided, use current date
    }

    // Calculate total cost and products count from cartItems
    let totalCost = 0;
    let productsCount = 0;

    // Make sure to calculate total cost and products count correctly
    cartItems.forEach((item) => {
      const quantity = item.quantity || 1; // Default to 1 if quantity is not provided
      totalCost += item.price * quantity;
      productsCount += quantity;
    });

    const newOrder = new Order({
      cartItems,
      totalCost,
      amount: totalCost,
      productsCount,
      paymentMethod,
      paymentStatus,
      date: orderDate, // Set the valid date
      status,
      shippingAddress, // Save shipping address
      billingAddress, // Save billing address
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }).lean();

    orders.forEach((order) => {
      const date = new Date(order.date);
      // Ensure the date is valid before converting to ISO string
      order.date = isNaN(date.getTime()) ? null : date.toISOString();
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch orders", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};

export const saveOrder = async (req, res) => {
  const {
    transactionDetails,
    cartItems,
    discount,
    paymentMethod,
    totalCost,
    shippingAddress,
    billingAddress,
    email,
  } = req.body;

  try {
    // Create a new order
    const newOrder = new Order({
      transactionDetails,
      cartItems,
      discount,
      paymentMethod,
      totalCost,
      email,
      shippingAddress,
      billingAddress,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
}

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Returns the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};
