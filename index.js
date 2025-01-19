const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to handle JSON requests

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// HELP
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// GET ALL
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// GET FOR ID
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.put("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;

  const note = notes.find((note) => note.id === id);
  if (!note) {
    return response.status(404).json({
      error: "note not found",
    });
  }

  const updatedNote = {
    ...note,
    content: body.content || note.content,
    important: body.important !== undefined ? body.important : note.important,
  };

  notes = notes.map((note) => (note.id !== id ? note : updatedNote));

  response.json(updatedNote);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// SAVE NEW NOTE
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});
app.use(cors());
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
