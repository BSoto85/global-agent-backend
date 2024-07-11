// DEPENDENCIES
const cors = require("cors");
const express = require("express");

const authController = require("./controllers/authController");
const countriesController = require("./controllers/countriesController");
const youngerQuestionsController = require("./controllers/youngerQuestionsController");
const questionsOlderController = require("./controllers/questionsOlderController");
const statsController = require("./controllers/statsController");
const caseFilesController = require("./controllers/caseFilesController");
const aiController = require("./controllers/aiController");

// CONFIGURATION
const app = express();

// MIDDLEWARE
app.use(cors());

app.use((req, _res, next) => {
  console.log("Origin Requested:", req.headers.origin);
  next();
});

app.use(express.json());

app.use("/api/auth", authController);
app.use("/api/countries", countriesController);
app.use("/api/younger_questions", youngerQuestionsController);
app.use("/api/older_questions/", questionsOlderController);
app.use("/api/stats", statsController);
app.use("/api/case_files", caseFilesController);
app.use("/api/ai", aiController);

// ROUTES
app.get("/", (_req, res) => {
  res.send("Welcome to Global Agent Backend Server");
});

// 404 PAGE
app.get("*", (_req, res) => {
  res.status(404).send("Page not found");
});

// EXPORT
module.exports = app;
