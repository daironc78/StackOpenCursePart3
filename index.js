// REQUIERES
const { PORT } = require('./utils/config')
const Note = require('./models/note')
const express = require('express')
const morgan = require('morgan')
const cors = require("cors");

/**
 * Express application instance.
 */
const app = express();

/**
 * Middleware to parse JSON bodies.
 */
app.use(cors()); // Allow cross-origin requests
app.use(express.static('dist')) // Serve static files from the 'dist' directory
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

app.use(requestLogger); // Log requests

app.get("/info", (_request, response) => {
  Note.find({}).then((note) => {
    response.send(
      `<p>Notas has info for ${note.length} materias</p><p>${new Date()}</p>`
    );
  });
});

// GET ALL
app.get("/api/notes", (request, response) => {
  Note.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error));
});

// GET FOR ID
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
});

app.put("/api/notes/:id", (request, response) => {
  const { id } = request.params;
  const body = request.body;

  const updatedNote = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(id, updatedNote, { new: true, runValidators: true, context: 'query' })
    .then(result => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({ error: "note not found" });
      }
    })
    .catch(error => next(error));
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "note not found" });
      }
    })
    .catch(error => next(error));
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  });
  
  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error));
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

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'Validation Error', details: error.message });
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformed ID', details: error.message });
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