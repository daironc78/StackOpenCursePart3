const express = require("express");
const app = express();

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

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(requestLogger);

// HELP
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      people.length + 1
    } people </p> <br /> ${new Date()}`
  );
});

// GET ALL
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// GET FOR ID
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

// SAVE NEW NOTE
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
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

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
