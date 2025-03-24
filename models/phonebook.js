// CONFIGURE REQUIERED MODULES
const { URI_MONGO_DB } = require("../utils/config");
const mongoose = require("mongoose");

// CONFIGURE MONGOOSE
mongoose.set("strictQuery", false);
const url = URI_MONGO_DB;

// CONNECT TO MONGODB
mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message);
  });

// CREATE SCHEMA
const noteSchema = new mongoose.Schema({
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

// CONFIGURE SCHEMA
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// EXPORT MODEL
module.exports = mongoose.model("Phonebook", noteSchema);