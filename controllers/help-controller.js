const HelpRouter = require("express").Router();

/**
 * Route to get information about the phonebook.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
HelpRouter.get("/", (_request, response) => {
  response.send(
    `<p>Service phonebook success</p> <br /> ${new Date()}`
  );
});

module.exports = HelpRouter;