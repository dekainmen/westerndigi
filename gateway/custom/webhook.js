const orderRepository =
  require("../../repositories/order.repository");

/**
 * Payment Gateway Webhook
 */
module.exports =
  async (req, res) => {

  try {

    console.log(
      "==============================="
    );
    console.log(
      "WEBHOOK RECEIVED"
    );
    console.log(
      "HEADERS:",
      req.headers
    );
    console.log(
      "BODY:",
      req.body
    );
    console.log(
      "==============================="
    );

    const {
      status,
      order_id
    } = req.body;

    /**
     * Validate order_id
     */
    if (!order_id) {

      console.log(
        "Missing order_id in webhook"
      );

      return res
        .status(400)
        .send("Missing order_id");
    }

    /**
     * Fetch existing order
     */
    const existing =
      await orderRepository.getOrder(order_id);

    if (!existing) {

      console.log(
        "Order not found:",
        order_id
      );

      return res
        .status(404)
        .send("Order not found");
    }

    const order = existing;

    /**
     * Normalize gateway status
     */
    const normalized =
      String(status || "")
        .toUpperCase();

    let paymentStatus =
      "PENDING";

    if (
      normalized === "SUCCESS" ||
      normalized === "COMPLETED" ||
      normalized === "PAID"
    ) {
      paymentStatus = "SUCCESS";
    }

    if (
      normalized === "FAILED" ||
      normalized === "FAILURE" ||
      normalized === "CANCELLED"
    ) {
      paymentStatus = "FAILED";
    }

    /**
     * Update order record
     */
    order.status =
      paymentStatus;

    order.gateway_response =
      req.body;

    order.updated_at =
      new Date().toISOString();

    /**
     * Persist update
     */
    await orderRepository.updateOrder(order_id, order);

    console.log(
      "ORDER UPDATED:",
      order_id,
      paymentStatus
    );

    /**
     * Acknowledge gateway
     */
    res.send(
      "Webhook processed"
    );

  } catch (err) {

    console.error(
      "WEBHOOK ERROR:",
      err
    );

    res
      .status(500)
      .send("Webhook failed");
  }
};
