// REQUIERES
const { PORT } = require("./utils/config");
const Phonebook = require("./models/phonebook");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");


/**
 * Express application instance.
 */
const app = express();

/**
 * Middleware to parse JSON bodies.
 */
app.use(cors()); // Allow cross-origin requests
app.use(express.static("dist")); // Serve static files from the "dist" directory
app.use(express.json()); // Parse JSON bodies

/**
 * Middleware to log requests using Morgan.
 */
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan("tiny"),
  //morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/**
 * Middleware to log request details.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Next middleware function.
 */
const requestLogger = (request, _response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

/**
 * Route to get information about the phonebook.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.get("/info", (_request, response) => {
  Phonebook.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people </p> <br /> ${new Date()}`
    );
  });
});

/**
 * Route to get all persons.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.get("/api/persons", (_request, response, next) => {
  Phonebook.find({}).then((contacts) => {
    response.json(contacts);
  }).catch(error => next(error));
});

/**
 * Route to get a person by ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id).then((contact) => {
    if (contact) {
      response.json(contact);
    } else {
      response.status(404).json({
        error: "Person not found",
        details: `Person with id ${request.params.id} not found`
      }).end();
    }
  }).catch(error => next(error));
});

/**
 * Route to delete a person by ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id).then((contact) => {
    if (contact) {
      response.status(204).end();
    } else {
      response.status(404).json({
        error: "Person not found",
        details: `Person with id ${request.params.id} not found`
      }).end();
    }
  }).catch(error => next(error));
});

/**
 * Route to add a new person.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.post("/api/persons", (request, response, next) => {
  let body = request.body;
  let error = [];
  if (!body.name || !body.phone) {
    if (!body.name) {
      error = error.concat({ name: "name missing" });
    }

    if (!body.phone) {
      error = error.concat({ phone: "number missing" });
    }

    return response.status(400).json({
      error: "Validation Error",
      details: error
    });
  }

  Phonebook.findOne({ name: body.name }).then(existingContact => {
    if (existingContact) {
      existingContact.phone = body.phone;
      existingContact.save().then(updatedContact => {
        response.json(updatedContact);
      }).catch(error => next(error));
      return;
    }

    const contact = new Phonebook({
      name: body.name,
      phone: body.phone,
    });
    
    contact.save().then(savedPerson => {
      response.json(savedPerson);
    }).catch(error => next(error));
  }).catch(error => next(error));
});

/**
 * Route to update a person by ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  let error = [];
  if (!body.name || !body.phone) {
    if (!body.name) {
      error = error.concat({ name: "name missing" });
    }

    if (!body.phone) {
      error = error.concat({ phone: "number missing" });
    }

    return response.status(400).json({
      error: "Validation Error",
      details: error
    });
  }

  const updatedPerson = {
    name: body.name,
    phone: body.phone,
  };

  //Phonebook.schema.path('name').validate(body.name).catch(error => next(error));
  //Phonebook.schema.path('phone').validate(body.phone).catch(error => next(error));

  Phonebook.findByIdAndUpdate(request.params.id, updatedPerson, { new: true, runValidators: true, context: "query" })
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({
          error: "Person not found",
          details: `Person with id ${request.params.id} not found`
        }).end();
      }
    })
    .catch((error) => next(error));
  
});

/**
 * Middleware to handle unknown endpoints.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint); // Handle unknown endpoints

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

app.use(errorHandler); // Handle errors
/**
 * Starts the server on the specified port.
 * @param {number} PORT - Port number.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
