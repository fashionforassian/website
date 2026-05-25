const nodemailer = require("nodemailer");

const mailerHost = process.env.MAILER_HOST || "";
const mailerPort = Number(process.env.MAILER_PORT || 587);
const mailerSecure = process.env.MAILER_SECURE === "true";
const mailerUser = process.env.MAILER_USER || "";
const mailerPass = process.env.MAILER_PASS || "";
const mailerFrom = process.env.MAILER_FROM || "";

const transporter = nodemailer.createTransport({
  host: mailerHost,
  port: mailerPort,
  secure: mailerSecure,
  auth: mailerUser && mailerPass ? { user: mailerUser, pass: mailerPass } : undefined,
});

async function sendMail({ to, subject, text, html }) {
  if (!mailerHost || !mailerFrom) {
    // Mailer not configured; silently skip
    return;
  }

  const msg = {
    from: mailerFrom,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(msg);
}

function formatOrderItems(items) {
  return items
    .map((it) => `<li>${escapeHtml(it.name)} x ${Number(it.quantity)} — ${Number(it.price).toFixed(2)}</li>`)
    .join("\n");
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>\"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
}

async function sendOrderConfirmationEmail(order) {
  if (!order || !order.customerEmail) return;

  const subject = `Order confirmed — ${order.id}`;
  const html = `
    <p>Hi ${escapeHtml(order.customerName || "Customer")},</p>
    <p>Thanks for your order. We've received your payment and your order <strong>${escapeHtml(order.id)}</strong> is confirmed.</p>
    <p>Order summary:</p>
    <ul>
      ${formatOrderItems(order.items || [])}
    </ul>
    <p>Subtotal: ${Number(order.subtotal).toFixed(2)}</p>
    <p>Shipping: ${Number(order.shipping).toFixed(2)}</p>
    <p>Total: ${Number(order.total).toFixed(2)}</p>
    <p>We'll notify you when your order ships.</p>
    <p>— The Fashion Team</p>
  `;

  await sendMail({ to: order.customerEmail, subject, html, text: `Your order ${order.id} is confirmed.` });
}

async function sendOrderShippedEmail(order) {
  if (!order || !order.customerEmail) return;

  const subject = `Your order has shipped — ${order.id}`;
  const html = `
    <p>Hi ${escapeHtml(order.customerName || "Customer")},</p>
    <p>Your order <strong>${escapeHtml(order.id)}</strong> has been shipped.</p>
    ${order.trackingNumber ? `<p>Tracking number: ${escapeHtml(order.trackingNumber)}</p>` : ""}
    <p>Thank you for shopping with us.</p>
    <p>— The Fashion Team</p>
  `;

  await sendMail({ to: order.customerEmail, subject, html, text: `Your order ${order.id} has shipped.` });
}

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
};
