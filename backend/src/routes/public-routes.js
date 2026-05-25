const { Router } = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { requireUserAuth } = require("../middleware/auth");
const {
  getProducts,
  getProductBySlugHandler,
  getCategories,
  createOrderHandler,
  createRazorpayCheckoutHandler,
  confirmRazorpayOrderHandler,
  getOrderByIdHandler,
  createSubscriberHandler,
  createContactHandler,
  syncAuthSessionHandler,
} = require("../controllers/public-controller");

const router = Router();

router.get("/products", asyncHandler(getProducts));
router.get("/products/:slug", asyncHandler(getProductBySlugHandler));
router.get("/categories", asyncHandler(getCategories));
router.post("/orders", asyncHandler(createOrderHandler));
router.post("/checkout/razorpay/order", asyncHandler(createRazorpayCheckoutHandler));
router.post("/orders/confirm", asyncHandler(confirmRazorpayOrderHandler));
router.get("/orders/:id", asyncHandler(getOrderByIdHandler));
router.post("/subscribers", asyncHandler(createSubscriberHandler));
router.post("/contact", asyncHandler(createContactHandler));
router.post("/auth/session", requireUserAuth, asyncHandler(syncAuthSessionHandler));

module.exports = router;
