const db = require("../db/dbConfig");

// CREATE
const addCaseFile = async (file) => {
  try {
    const newCaseFile = await db.one(
      `INSERT INTO case_files(countries_id, article_content, article_title, publish_date, article_id, photo_url, summary_young, summary_old) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        file.countries_id,
        file.article_content,
        file.article_title,
        file.publish_date,
        file.article_id,
        file.photo_url,
        file.summary_young,
        file.summary_old,
      ]
    );
    return newCaseFile;
  } catch (error) {
    return error;
  }
};

const getCaseFilesByCountry = async (countries_id) => {
  try {
    const allCaseFilesByCountry = await db.any(
      `SELECT * FROM case_files WHERE case_files.countries_id = $1`,
      countries_id
    );
    return allCaseFilesByCountry;
  } catch (error) {
    return error;
  }
};

//GET case files ater posting to case fiels table
const getAllNewCaseFiles = async () => {
  try {
    const allCaseFiles = await db.any("SELECT * FROM case_files");
    return allCaseFiles;
  } catch (error) {
    return error;
  }
};

//GET publish date for latest article in the case_files table
const getLatestCaseFile = async () => {
  try {
    const latestCaseFile = await db.one(
      "SELECT publish_date FROM case_files ORDER BY publish_date DESC LIMIT 1"
    );
    return latestCaseFile;
  } catch (error) {
    return error;
  }
};

// DELETE all articles that are older than 1 day
const deleteOldArticles = async () => {
  try {
    const deletedArticles = await db.any("DELETE FROM case_files");
    return deletedArticles;
  } catch (error) {
    return error;
  }
};

module.exports = {
  addCaseFile,
  getCaseFilesByCountry,
  getLatestCaseFile,
  deleteOldArticles,
  getAllNewCaseFiles,
};
