const { Router } = require("express");
const { requireAdminAuth } = require("../middleware/auth");
const { asyncHandler } = require("../utils/async-handler");
const {
  getAdminSession,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrder,
  getAdminSubscribers,
  getAdminUsers,
  updateAdminUser,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminContacts,
} = require("../controllers/admin-controller");

const router = Router();

router.use(requireAdminAuth);

router.get("/me", asyncHandler(getAdminSession));

router.get("/products", asyncHandler(getAdminProducts));
router.post("/products", asyncHandler(createAdminProduct));
router.put("/products/:id", asyncHandler(updateAdminProduct));
router.delete("/products/:id", asyncHandler(deleteAdminProduct));

router.get("/orders", asyncHandler(getAdminOrders));
router.get("/orders/:id", asyncHandler(getAdminOrderById));
router.put("/orders/:id", asyncHandler(updateAdminOrder));

router.get("/subscribers", asyncHandler(getAdminSubscribers));

router.get("/users", asyncHandler(getAdminUsers));
router.put("/users/:id", asyncHandler(updateAdminUser));

router.get("/categories", asyncHandler(getAdminCategories));
router.post("/categories", asyncHandler(createAdminCategory));
router.put("/categories/:id", asyncHandler(updateAdminCategory));
router.delete("/categories/:id", asyncHandler(deleteAdminCategory));

router.get("/contacts", asyncHandler(getAdminContacts));

module.exports = router;
