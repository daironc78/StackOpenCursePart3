const mongoose = require("mongoose");

const PhonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  phone: {
    type: Number,
    min: [1000000, "Must be at least 1000000, got {VALUE}"],
    max: 3999999999,
    required: true
  }
});

PhonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Phonebook", PhonebookSchema);