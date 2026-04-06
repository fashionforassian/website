const { Router } = require("express");
const publicRoutes = require("./public-routes");
const adminRoutes = require("./admin-routes");
const uploadRoutes = require("./upload-routes");

const apiRouter = Router();

apiRouter.use("/api", publicRoutes);
apiRouter.use("/api/admin", adminRoutes);
apiRouter.use("/api", uploadRoutes);

module.exports = { apiRouter };
