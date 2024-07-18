const db = require("../db/dbConfig");

//PUT to add summary for younger to case files table
const updateYoungerSummary = async (youngerSummary, article_id) => {
  try {
    const addYoungerSummary = await db.one(
      "UPDATE case_files SET summary_young=$1 WHERE article_id=$2 RETURNING summary_young",
      [youngerSummary, article_id]
    );
    return addYoungerSummary;
  } catch (error) {
    return error;
  }
};

//PUT to add summary for older to case files table
const updateOlderSummary = async (olderSummary, article_id) => {
  try {
    const addOlderSummary = await db.one(
      "UPDATE case_files SET summary_old=$1 WHERE article_id=$2 RETURNING summary_old",
      [olderSummary, article_id]
    );
    return addOlderSummary;
  } catch (error) {
    return error;
  }
};

//SELECT all young summaries, old summaries and their article_id FROM case_files table
const getAllSummaries = async () => {
  try {
    const allSummaries = await db.any(
      "SELECT summary_young, summary_old, article_id FROM case_files"
    );
    return allSummaries;
  } catch (error) {
    return error;
  }
};

const addYoungerQuestionAndAnswers = async (youngerQuestion, article_id) => {
  try {
    // console.log("**Query**", youngerQuestion);
    const youngerQuestionAndAnswers = await db.one(
      "INSERT INTO questions_younger(y_question, y_correct_answer, y_incorrect_answer1, y_incorrect_answer2, y_incorrect_answer3, y_case_files_article_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        youngerQuestion.question,
        youngerQuestion.answers[0],
        youngerQuestion.answers[1],
        youngerQuestion.answers[2],
        youngerQuestion.answers[3],
        article_id,
      ]
    );
    // console.log("-----------", youngerQuestionAndAnswers);
    return youngerQuestionAndAnswers;
  } catch (error) {
    return error;
  }
};

const addOlderQuestionAndAnswers = async (olderQuestion, article_id) => {
  try {
    const olderQuestionAndAnswers = await db.one(
      "INSERT INTO questions_older(o_question, o_correct_answer, o_incorrect_answer1, o_incorrect_answer2, o_incorrect_answer3, o_case_files_article_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        olderQuestion.question,
        olderQuestion.answers[0],
        olderQuestion.answers[1],
        olderQuestion.answers[2],
        olderQuestion.answers[3],
        article_id,
      ]
    );
    return olderQuestionAndAnswers;
  } catch (error) {
    return error;
  }
};

const getAllYoungerQuestionsAndAnswers = async (case_files_article_id) => {
  try {
    const allYoungerQuestions = await db.any(
      `SELECT * FROM questions_younger WHERE questions_younger.y_case_files_article_id =$1`,
      case_files_article_id
    );
    return allYoungerQuestions;
  } catch (error) {
    return error;
  }
};

const getAllOlderQuestionsAndAnswers = async (case_files_article_id) => {
  try {
    const allOlderQuestionsAndAnswers = await db.any(
      `SELECT * FROM questions_older WHERE questions_older.o_case_files_article_id = $1`,
      case_files_article_id
    );
    return allOlderQuestionsAndAnswers;
  } catch (error) {
    return error;
  }
};

const getAllYoungerQuestions = async () => {
  try {
    const allQuestions = await db.any("SELECT * from questions_younger");
    return allQuestions;
  } catch (error) {
    return error;
  }
};

const getAllOlderQuestions = async () => {
  try {
    const allQuestions = await db.any("SELECT * from questions_older");
    return allQuestions;
  } catch (error) {
    return error;
  }
};

module.exports = {
  updateYoungerSummary,
  updateOlderSummary,
  getAllYoungerQuestionsAndAnswers,
  getAllOlderQuestionsAndAnswers,
  getAllSummaries,
  addYoungerQuestionAndAnswers,
  addOlderQuestionAndAnswers,
  getAllYoungerQuestions,
  getAllOlderQuestions,
};
