const express = require("express");
require("dotenv").config();

const case_files = express.Router();
const { getAllCountries } = require("../queries/countries");
const {
  getCaseFilesByCountry,
  getLatestCaseFile,
  getAllNewCaseFiles
} = require("../queries/caseFiles");
const deleteOldCaseFiles = require("../helpers/deleteOldCaseFiles");
const fetchArticles = require("../helpers/fetchArticles");


// http://localhost:3003/api/case_files/news-from-australia
case_files.get("/news-from-australia", async (req, res) => {
  try {
    deleteOldCaseFiles()
    const caseFiles = await getLatestCaseFile();
    if (!caseFiles[0]) {
      const allCountries = await getAllCountries();
      if (!allCountries[0]) {
        res.status(500).json({ error: "Error fetching countries" });
      }
      const checkCaseFiles = await getAllNewCaseFiles()
      if(!checkCaseFiles[0]){
        fetchArticles(allCountries)
      }
    }
    res.status(200).json({ message: "Success adding articles!" });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//INDEX CASE FILES http://localhost:3003/api/case_files/1
case_files.get("/:countries_id", async (req, res) => {
  const { countries_id } = req.params;
  const allCaseFilesByCountry = await getCaseFilesByCountry(countries_id);
  console.log("Case files by country", allCaseFilesByCountry);

  if (allCaseFilesByCountry[0]) {
    res.status(200).json(allCaseFilesByCountry);
  } else {
    res.status(500).json({ error: "Error fetching case files" });
  }
});

module.exports = case_files;
