const logger = require("./logger");

/**
 * Middleware to log request details.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Next middleware function.
 */
const requestLogger = (request, _response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

/**
 * Middleware to handle unknown endpoints.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

/**
 * Middleware to handle errors.
 * @param {Object} error - Error object.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Next middleware function.
 */
const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: "Validation Error", details: error.message });
  } else if (error.name === "CastError") {
    return response.status(400).json({ error: "Malformed ID", details: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};