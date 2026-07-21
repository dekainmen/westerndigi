require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

/**
 * ===============================
 * Middleware
 * ===============================
 */

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/**
 * ===============================
 * Static Frontend
 * ===============================
 */

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

/**
 * ===============================
 * Routes
 * ===============================
 */

app.use(
  "/api/payment",
  require("./routes/payment.routes")
);

app.use(
  "/api/products",
  require("./routes/products.routes")
);

app.use(
  "/api/orders",
  require("./routes/orders.routes")
);

app.use(
  "/api/auth",
  require("./routes/auth.routes")
);

/**
 * ===============================
 * Gateway Return URL (FIXED)
 * ===============================
 */

// app.all("/payment-return", async (req, res) => {

//   console.log("=================================");
//   console.log("PAYMENT RETURN HIT");
//   console.log("METHOD:", req.method);
//   console.log("=================================");

//   try {

//     const orderId = global.lastOrderId;
//      console.log("STATUS TOKEN USED:", process.env.USER_TOKEN); 

//     if (!orderId) {
//       console.log("No order ID found");
//       return res.redirect("/failure.html");
//     }

//     console.log("Verifying order:", orderId);

//     // ✅ Use URLSearchParams (no FormData issues)
//     const response = await fetch(
//       "https://silver-hawk-998279.hostingersite.com/api/check-order-status",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: new URLSearchParams({
//           user_token: process.env.USER_TOKEN,
//           order_id: orderId
//         })
//       }
//     );

//     const data = await response.json();

//     console.log("VERIFY RESPONSE:", data);

//     if (data.status === "COMPLETED") {
//       return res.redirect(`/success.html?order_id=${orderId}`);
//     }

//     return res.redirect(`/failure.html?order_id=${orderId}`);

//   } catch (error) {

//     console.error("RETURN ROUTE ERROR:", error);
//     return res.redirect("/failure.html");
//   }
// });
app.all("/payment-return", (req, res) => {

  console.log("=================================");
  console.log("PAYMENT RETURN HIT");
  console.log("METHOD:", req.method);
  console.log("=================================");

  console.log("QUERY:", req.query);
  console.log("BODY:", req.body);

  // Just redirect to homepage (no verification)
  return res.redirect("/?payment=processing");
});                         

/**
 * ===============================
 * Health Check
 * ===============================
 */

app.get("/health", (req, res) => {
  res.send("Server running");
});

/**
 * ===============================
 * Start Server
 * ===============================
 */

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);