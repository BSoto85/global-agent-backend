const express = require("express");
const ai = express.Router();

const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic();
const {
  systemPromptForArticleSummary,
  hardCodedArticle,
} = require("../helpers/aiData");
const { getAllNewCaseFiles } = require("../queries/caseFiles");
const { updateYoungerSummary, updateOlderSummary } = require("../queries/ai");

ai.put("/summary", async (req, res) => {
  const newFiles = await getAllNewCaseFiles();
  for (const file of newFiles) {
    const articleSummary = await anthropic.messages.create({
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
              text: req.body,
            },
          ],
        },
      ],
    });
    const updatedYoungerSummary = await updateYoungerSummary(
      articleSummary.choices[0].message.content.youngerSummary,
      hardCodedArticle.case_files_article_id
    );
    const updatedOlderSummary = await updateOlderSummary(
      articleSummary.choices[0].message.content.olderSummary,
      hardCodedArticle.case_files_article_id
    );
    if (updateYoungerSummary && updateOlderSummary) {
      res
        .status(200)
        .json({ message: "Success in updating summary in case files" });
    } else {
      res
        .status(500)
        .json({ message: "Server error, could not update summaries" });
    }
    // console.log("Updated Summary", updatedSummary);
  }
});

// ai.post("/questions_and_answers", async (req, res) => {});

module.exports = ai;
