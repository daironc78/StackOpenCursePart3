// REQUIERES
const { PORT } = require('./utils/config')
const Note = require('./models/note')
const express = require("express");
const cors = require("cors");

// CONFIGURACION DE APP
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to handle JSON requests

// GET ALL
app.get("/api/notes", (request, response) => {
  Note.find({}).then(result => {
    response.json(result)
  }).catch(error => {
    console.log('error:',error);
    response.status(500).json({ error: 'Failed to save the note' });
  });
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

  Note.findByIdAndUpdate(id, updatedNote, { new: true })
    .then(result => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({ error: "note not found" });
      }
    })
    .catch(error => {
      console.log('error:', error);
      response.status(500).json({ error: 'Failed to update the note' });
    });
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
    .catch(error => {
      console.log('error:', error);
      response.status(500).json({ error: 'Failed to delete the note' });
    });
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
  }).catch(error => {
    response.status(500).json({ error: 'Failed to save the note' });
  });
});

app.use(cors());
app.use(express.static('dist'))
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
