const mongoose = require("mongoose");
const { URI_MONGO_DB } = require("../utils/config");

if (process.argv.length<3) {
  console.log("give password as argument");
  process.exit(1);
}

const url = URI_MONGO_DB;

mongoose.set("strictQuery", false);

mongoose.connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  phone: {
    type: Number,
    min: [6, "Must be at least 6, got {VALUE}"],
    max: 12,
    required: true
  }
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);

if (process.argv.length == 5 && process.argv.length > 3) {
  const name = process.argv[3].trim();
  const phone = process.argv[4].trim();

  if (!name || !phone || isNaN(phone)) {
    console.log("Name or phone number is missing, or phone number is not a number");
    process.exit(1);
  };

  const phonebook = new Phonebook({
    name: name,
    phone: phone
  });

  phonebook.save().then(contact => {
    console.log("added, contact:", contact.name, "- number:", contact.phone, "to phonebook");
    mongoose.connection.close();
  });
}
else {
  Phonebook.find({}).then(contacts => {
    console.log("phonebook:");
    
    contacts.forEach(contact => {
      console.log("contact:", contact.name, "- number:", contact.phone, "to phonebook");
    });
    mongoose.connection.close();
  });
}