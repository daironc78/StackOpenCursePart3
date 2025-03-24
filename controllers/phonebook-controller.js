const PhonebookRouter = require("express").Router();
const Phonebook = require("../models/phonebook");

/**
 * Route to get all persons.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next function.
 */
PhonebookRouter.get("/", (_request, response, next) => {
  Phonebook.find({}).then((contacts) => {
    response.json(contacts);
  }).catch(error => next(error));
});

/**
 * Route to get a person by ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next function.
 */
PhonebookRouter.get("/:id", (request, response, next) => {
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
 * @param {Function} next - Express next function.
 */
PhonebookRouter.delete("/:id", (request, response, next) => {
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
 * @param {Function} next - Express next function.
 */
PhonebookRouter.post("/", (request, response, next) => {
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
 * @param {Function} next - Express next function.
 */
PhonebookRouter.put("/:id", (request, response, next) => {
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

module.exports = PhonebookRouter;