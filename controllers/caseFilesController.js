const express = require("express");
require("dotenv").config();
const case_files = express.Router();
const { getAllCountries } = require("../queries/countries");
const {
  getCaseFilesByCountry,
  getLatestCaseFile,
  getAllNewCaseFiles,
} = require("../queries/caseFiles");
const deleteOldCaseFiles = require("../helpers/deleteOldCaseFiles");
const addArticles = require("../helpers/oldAddArticles.js");
const { getSummaries } = require("../helpers/aiGetSummary");
const { addSummaries } = require("../helpers/addSummaries");
const {
  generateQuestionsAndAnswers,
} = require("../helpers/aiGenerateQuestions");
const {
  addYoungerQuestionAndAnswers,
  addOlderQuestionAndAnswers,
} = require("../queries/ai");
const translateText = require("../helpers/translateText");
const getFormattedCurrentDate = require("./getFormattedCurrentDate.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//Comment why using delay
// http://localhost:3003/api/case_files/world_news
case_files.get("/world_news", async (req, res) => {
  try {
    // console.log(translateText("Hello World!", "es"));
    await deleteOldCaseFiles();
    const checkCaseFiles = await getAllNewCaseFiles();
    if (!checkCaseFiles[0]) {
      const allCountries = await getAllCountries();
      if (!allCountries[0]) {
        throw new Error(" Error fetching countries");
      }
      // ##############################
      // const addedArticles = await addArticles(allCountries);
      // ##############################

      // const currentDate = getFormattedCurrentDate();
      let addedArticles = [];
// fetchArticles
      const currentDate = getFormattedCurrentDate();
      for (let country of allCountries) {

        const threeArticles = await fetchArticles(country, currentDate)
        // addArticles
        for (let newFile of threeArticles) {
          //   console.log("New file", newFile);
          //  *** if language_code !== en, then run translate helper function ***
          let translatedContent = newFile.text;
          let translatedTitle = newFile.title;
          // Translate content and title if the language is not English
          if (country.language_code !== "en") {
            // if (country.language_code === "en") {
              translatedContent = await translateText(newFile.txt, "en");
              translatedTitle = await translateText(newFile.title, "en");
              console.log(translatedContent);
            }
            // addArticles
            
          const addedCaseFile = await addCaseFile({
            countries_id: country.id,
            article_id: newFile.id,
            // article_content: newFile.text,
            // article_title: newFile.title,
            article_content: translatedContent,
            article_title: translatedTitle,
            publish_date: newFile.publish_date,
            photo_url: newFile.image,
          });
          // console.log("Added file", addedCaseFile);
          addedArticles.push({
            articleContent: addedCaseFile.article_content,
            articleId: addedCaseFile.article_id,
          });
        }
        delay(1000); 

      }
        
// ............


      // ##############################
      // res.status(200).json({ message: "Success adding articles!" })
      console.log(`Success adding ${addedArticles.length} articles!`);
      if (addedArticles.length === 0) {
        throw new Error(" Error adding articles");
      }
      const summariesArr = await addSummaries(addedArticles);
      //For younger questions
      for (const summary of summariesArr) {
        const getQuestionsAndAnswers = await generateQuestionsAndAnswers(
          summary
        );
        // console.log("%%%%", getQuestionsAndAnswers);
        // await delay(500);
        for (const question of getQuestionsAndAnswers.questionsForYounger) {
          const addedYoungerQuestionAndAnswers =
            await addYoungerQuestionAndAnswers(
              question,
              getQuestionsAndAnswers.article_id
            );
          // console.log(
          //   "Younger questions and answers",
          //   addedYoungerQuestionAndAnswers
          // );
          await delay(1000);
        }
      }
      //For older questions
      for (const summary of summariesArr) {
        const getQuestionsAndAnswers = await generateQuestionsAndAnswers(
          summary
        );
        console.log("%%%%", getQuestionsAndAnswers);
        // await delay(500);
        for (const question of getQuestionsAndAnswers.questionsForOlder) {
          const addedOlderQuestionAndAnswers = await addOlderQuestionAndAnswers(
            question,
            getQuestionsAndAnswers.article_id
          );
          // console.log(
          //   "Younger questions and answers",
          //   addedOlderQuestionAndAnswers
          // );
          await delay(1000);
        }
      }
      res.status(200).json({ message: "Added Summaries and questions" });
    } else {
      res.status(200).json({ message: "Articles are up to date" });
      // console.log("Articles are up to date");
    }
  } catch (error) {
    // console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//INDEX CASE FILES http://localhost:3003/api/case_files/1
case_files.get("/:countries_id", async (req, res) => {
  const { countries_id } = req.params;
  const allCaseFilesByCountry = await getCaseFilesByCountry(countries_id);
  // console.log("Case files by country", allCaseFilesByCountry);
  if (allCaseFilesByCountry[0]) {
    res.status(200).json(allCaseFilesByCountry);
  } else {
    res.status(500).json({ error: "Error fetching case files" });
  }
});

module.exports = case_files;
