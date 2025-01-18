var express = require('express')
var morgan = require('morgan')

/**
 * Express application instance.
 */
const app = express();

/**
 * Middleware to parse JSON bodies.
 */
app.use(express.json());

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
 * Array of person objects.
 * @type {Array<{id: number, name: string, number: string}>}
 */
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

/**
 * Route to get information about the phonebook.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.get("/info", (_request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people </p> <br /> ${new Date()}`
  );
});

/**
 * Route to get all persons.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.get("/api/persons", (_request, response) => {
  response.json(persons);
});

/**
 * Route to get a person by ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

/**
 * Route to delete a person by ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

/**
 * Generates a new unique ID for a person.
 * @returns {number} New unique ID.
 */
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

/**
 * Route to add a new person.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("body", body);
  let error = [];
  if (!body.name || !body.number) {
    console.log("name or number missing");

    if (!body.name) {
      console.log("name missing");
      error = error.concat({ name: "name missing" });
    }

    if (!body.number) {
      console.log("number missing");
      error = error.concat({ number: "number missing" });
    }

    return response.status(400).json({
      error: error,
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: error.concat({ name: "name must be unique" }),
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

/**
 * Middleware to handle unknown endpoints.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

/**
 * Starts the server on the specified port.
 * @param {number} PORT - Port number.
 */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
