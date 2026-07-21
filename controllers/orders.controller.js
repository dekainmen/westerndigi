const orderRepository =
  require("../repositories/order.repository");

/**
 * Get single order
 */
exports.getOrder =
  async (req, res) => {

  try {

    const { order_id } =
      req.params;

    console.log(
      "Fetching order:",
      order_id
    );

    const data =
      await orderRepository.getOrder(order_id);

    if (!data) {

      return res.status(404)
        .json({
          error:
            "Order not found"
        });
    }

    res.json(data);

  } catch (err) {

    console.error(
      "GET ORDER ERROR:",
      err
    );

    res.status(500)
      .json({
        error:
          "Failed to fetch order",
        reason:
          err.message
      });
  }
};
