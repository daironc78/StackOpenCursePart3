require("dotenv").config();

const URI_MONGO_DB = process.env.URI_MONGO_DB;
const PORT = process.env.PORT;

module.exports = {
  URI_MONGO_DB,
  PORT
};