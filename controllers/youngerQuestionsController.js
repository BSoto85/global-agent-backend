const express = require("express");
const youngerQuestions = express.Router();

const { getAllYoungerQuestionsAndAnswers } = require("../queries/ai");
const {
  getAllYoungerQuestions,
} = require("../queries/ai");

//http://localhost:3003/api/younger_questions
youngerQuestions.get("/", async (req, res) => {
  const getAllQuestionsAndAnswers = await getAllYoungerQuestions();
  if (getAllQuestionsAndAnswers[0]) {
    res.status(200).json(getAllQuestionsAndAnswers);
  } else {
    res.status(500).json({ error: "Error fetching younger questions" });
  }
});

//http://localhost:3003/api/younger_questions/:case_files_id
youngerQuestions.get("/:article_id", async (req, res) => {
  const { article_id } = req.params;
  const allYoungerQuestions = await getAllYoungerQuestionsAndAnswers(
    article_id
  );
  if (allYoungerQuestions[0]) {
    res.status(200).json(allYoungerQuestions);
  } else {
    res.status(500).json({ error: "Error fetching younger questions" });
  }
});
module.exports = youngerQuestions;
