const express = require("express");
require("dotenv").config();
const case_files = express.Router();
const { getAllCountries } = require("../queries/countries");
const {
  getCaseFilesByCountry,
  // getAllNewCaseFiles,
} = require("../queries/caseFiles");
// const deleteOldCaseFiles = require("../helpers/deleteOldCaseFiles");
const addTranslatedArticles = require("../helpers/addTranslatedArticles.js");
const { addSummaries } = require("../helpers/addSummaries");
const {
  generateQuestionsAndAnswers,
} = require("../helpers/generateQuestionsAndAnswers.js");
const addQuestionsAndAnswers = require("../helpers/addQuestionsAndAnswers.js")
const { deleteOldArticles } = require("../queries/caseFiles");
const getFormattedCurrentDate = require("../helpers/getFormattedCurrentDate.js");

//Comment why using delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// http://localhost:3003/api/case_files/world_news
case_files.get("/world_news", async (req, res) => {
  try {
    // await deleteOldCaseFiles();
    // const checkCaseFiles = await getAllNewCaseFiles();
    // if (checkCaseFiles.length === 0) {
    await deleteOldArticles()

    const allCountries = await getAllCountries();
    console.log(allCountries)
    if (!allCountries[0]) {
      throw new Error(" Error fetching countries");
    }
    const currentDate = getFormattedCurrentDate();

    for (let country of allCountries) {
      console.log("country", country)
      const threeArticles = await fetchArticles(country, currentDate)
      console.log("Fecthed Three Articles", threeArticles)
      const addedArticles = await addTranslatedArticles(threeArticles)
      delay(1000); 
      console.log(`Success adding ${addedArticles.length} articles!`);
      if (addedArticles.length === 0) {
        throw new Error(" Error adding articles");
      }
      const summariesArr = await addSummaries(addedArticles);
      console.log("Added Summaries", summariesArr)
      for(let summary of summariesArr){
        const getQuestionsAndAnswers = await generateQuestionsAndAnswers(
          summary
        );
        console.log(getQuestionsAndAnswers)
        await addQuestionsAndAnswers(getQuestionsAndAnswers)
      }
      delay(1000);
    }
    res.status(200).json({ message: "Added new articles, summaries and questions" });
    // } else {
    //   res.status(200).json({ message: "Articles are up to date" });
    // }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//INDEX CASE FILES http://localhost:3003/api/case_files/1
case_files.get("/:countries_id", async (req, res) => {
  const { countries_id } = req.params;
  const allCaseFilesByCountry = await getCaseFilesByCountry(countries_id);
  if (allCaseFilesByCountry[0]) {
    res.status(200).json(allCaseFilesByCountry);
  } else {
    res.status(500).json({ error: "Error fetching case files" });
  }
});

module.exports = case_files;
