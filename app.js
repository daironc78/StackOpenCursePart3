const config = require("./utils/config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhonebookRouter = require("./controllers/phonebook-controller");
const HelpRouter = require("./controllers/help-controller");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
logger.info("connecting to", config.URI_MONGO_DB);

mongoose.connect(config.URI_MONGO_DB)
  .then(() => logger.info("connected to MongoDB"))
  .catch(error => logger.error("error connecting to MongoDB:", error.message));

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan("tiny"));

app.use("/api/phonebook", PhonebookRouter);
app.use("/help", HelpRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
