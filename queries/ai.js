const db = require("../db/dbConfig");
// require("dotenv").config();

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const systemPromptForArticleSummary = require("../helpers/aiData");
// const aiKey = process.env.ANTHROPIC_API_KEY;

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20240620",
  max_tokens: 2000,
  temperature: 0,
  system: systemPromptForArticleSummary,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Why is the ocean salty?",
        },
      ],
    },
  ],
});
console.log(msg);

const addQuestionsAndAnswers = async (
  question,
  age_range,
  case_files_article_id
) => {
  try {
    if (age_range === "younger") {
      return await db.any(
        "INSERT INTO questions_younger(question, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, case_files_article_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          question.question,
          question.correct_answer,
          question.incorrect_answer1,
          question.incorrect_answer2,
          question.incorrect_answer3,
          case_files_article_id,
        ]
      );
    }
    if (age_range === "older") {
      return await db.any(
        "INSERT INTO questions_older(question, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, case_files_article_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          question.question,
          question.correct_answer,
          question.incorrect_answer1,
          question.incorrect_answer2,
          question.incorrect_answer3,
          case_files_article_id,
        ]
      );
    }
  } catch (error) {
    return error;
  }
};

module.exports = { addQuestionsAndAnswers };
