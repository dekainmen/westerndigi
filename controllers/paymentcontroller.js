const paymentService =
  require("../services/payment.service");

const orderRepository =
  require("../repositories/order.repository");

exports.createPayment =
  async (req, res) => {

  /**
   * Create order ID first
   * So it exists even if gateway fails
   */
  const orderId =
    "ORD_" + Date.now();
    global.lastOrderId = orderId;

  try {

    const {
  products,
  customer,
  payment_method = 'ONLINE'
} = req.body;

/**
 * Calculate amount
 */
const amount =
  products?.reduce(
    (sum, p) =>
      sum + (p.price * p.qty),
    0
  ) || 0;

const name =
  customer?.name || "Guest";

const email =
  customer?.email || "";

const phone =
  customer?.phone || "";

    /**
     * Store order in Supabase
     */
    await orderRepository.createOrder({
      order_id: orderId,
      user_id: null, // Guest checkout - no user_id yet
      amount,
      name,
      email,
      phone,
      payment_method,
      status: "PENDING",
      created_at: new Date().toISOString()
    });

    console.log(
      "ORDER SAVED:",
      orderId
    );

    console.log(
      "PAYMENT METHOD:",
      payment_method
    );

    /**
     * COD: Skip payment gateway, return success immediately
     */
    if (payment_method === 'COD') {
      return res.json({
        success: true,
        order_id: orderId,
        message: "COD order placed successfully"
      });
    }

    /**
     * ONLINE: Call payment gateway
     */
    console.log(
      "RETURN_URL VALUE:",
      process.env.RETURN_URL
    );
    
    const response =
      await paymentService.createOrder({
        order_id: orderId,
        amount,
        phone,
        redirect_url:
          process.env.RETURN_URL,
        remark1: name,
        remark2: email
      });

    // /**
    //  * Success response
    //  */
    // res.json({
    //   ...response,
    //   order_id: orderId,
    //   amt : amount,
    //   phn: phone,
    // });

    console.log(
      "GATEWAY RESPONSE:",
      response
    );

if (response?.status === "SUCCESS" && response?.paymentUrl) {
  return res.json({
    success: true,
    paymentUrl: response.paymentUrl
  });
}

/**
 * If gateway failed → Send error
 */
return res.status(400).json({
  success: false,
  message: "Payment creation failed",
  order_id: orderId
});

  } catch (err) {

    console.error(
      "CREATE PAYMENT ERROR:",
      err.response?.data ||
      err.message ||
      err
    );

    /**
     * Failure response
     * Still return order_id
     */
    res.status(500).json({
      error: "Payment failed",
      reason:
        err.response?.data ||
        err.message,
      order_id: orderId
    });
  }
};
