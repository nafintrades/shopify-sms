import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

app.post("/order", async (req, res) => {
  const order = req.body;
  const phone = order.shipping_address?.phone;
  const name = order.shipping_address?.name;
  const orderId = order.id;

  if (!phone) {
    return res.status(400).send("No phone number found");
  }

  const message = Hi ${name}, your order #${orderId} has been received. Thank you for shopping with us!;

  const smsResponse = await fetch("https://bulksmsbd.net/api/smsapi", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      api_key: "YOUR_BULKSMSBD_API_KEY",
      senderid: "YOUR_SENDER_ID",
      number: phone,
      message: message
    })
  });

  const result = await smsResponse.text();
  console.log(result);

  res.status(200).send("SMS Sent");
});

app.get("/", (req, res) => {
  res.send("Shopify SMS API is running!");
});

app.listen(10000, () => console.log("Server running on port 10000"));