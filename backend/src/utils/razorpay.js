const crypto = require("crypto");
const { badRequest } = require("./http-error");

function requireRazorpayConfig() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw badRequest("Razorpay is not configured.");
  }
}

function getRazorpayAuthHeader() {
  requireRazorpayConfig();
  return `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")}`;
}

async function createRazorpayOrder({ amount, receipt, notes }) {
  requireRazorpayConfig();

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: getRazorpayAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw badRequest(payload?.error?.description || "Unable to create Razorpay order.");
  }

  return payload;
}

function verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  requireRazorpayConfig();

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (!razorpaySignature || expectedSignature !== razorpaySignature) {
    throw badRequest("Invalid Razorpay signature.");
  }
}

function summarizeOrderItems(items) {
  if (!Array.isArray(items) || !items.length) {
    throw badRequest("Your cart is empty.");
  }

  return items.reduce(
    (summary, item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw badRequest("Invalid item quantity.");
      }

      if (!Number.isFinite(price) || price < 0) {
        throw badRequest("Invalid item price.");
      }

      summary.subtotal += price * quantity;
      summary.items.push({
        productId: String(item.productId || "").trim(),
        slug: String(item.slug || "").trim(),
        name: String(item.name || "").trim(),
        image: String(item.image || "").trim(),
        price,
        size: item.size ? String(item.size).trim() : undefined,
        color: item.color ? String(item.color).trim() : undefined,
        quantity,
      });

      return summary;
    },
    { items: [], subtotal: 0 },
  );
}

function calculateShipping(subtotal, shippingMethod = "standard") {
  if (shippingMethod === "express") {
    return 15;
  }

  return 0;
}

function normalizeShippingAddress(input) {
  const shippingAddress = input || {};
  const addressLine1 = String(shippingAddress.addressLine1 || shippingAddress.address || "").trim();
  const addressLine2 = String(shippingAddress.addressLine2 || shippingAddress.apartment || "").trim();
  const city = String(shippingAddress.city || "").trim();
  const state = String(shippingAddress.state || "").trim();
  const postalCode = String(shippingAddress.postalCode || shippingAddress.zipCode || shippingAddress.zip || "").trim();
  const country = String(shippingAddress.country || "").trim();
  const phone = String(shippingAddress.phone || shippingAddress.mobile || "").trim();

  if (!addressLine1 || !city || !state || !postalCode || !country) {
    throw badRequest("Shipping address is required.");
  }

  return {
    addressLine1,
    addressLine2: addressLine2 || null,
    city,
    state,
    postalCode,
    country,
    phone: phone || null,
  };
}

module.exports = {
  calculateShipping,
  createRazorpayOrder,
  normalizeShippingAddress,
  summarizeOrderItems,
  verifyRazorpaySignature,
};