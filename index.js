const app = require("./app"); // la aplicación Express real
const config = require("./utils/config");
const logger = require("./utils/logger");

/**
 * Route to get information about the service.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.get("/info", (_request, response) => {
  response.send(
    `<p>Service phonebook success</p> <br /> ${new Date()}`
  );
});

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});