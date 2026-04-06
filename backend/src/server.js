const { app } = require("./app");
const { env } = require("./config/env");

function startServer() {
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });
}

module.exports = { startServer };
