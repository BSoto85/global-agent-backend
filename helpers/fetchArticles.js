const { addCaseFile } = require("../queries/caseFiles");
const { addSummary } = require("../queries/ai");

const URL = process.env.BASE_URL;
const key = process.env.API_KEY;

function getFormattedDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();

  // Function to ensure two digits for month and day
  const formatTwoDigits = (num) => (num < 10 ? "0" + num : num);

  const formattedDate = `${year}-${formatTwoDigits(month)}-${formatTwoDigits(
    day
  )}`;
  return formattedDate;
}

const currentDate = getFormattedDate();

async function addArticles(allCountries) {
  allCountries.map(async (country) => {
    const url = `${URL}?source-country=${country.country_code}&language=en&date=${currentDate}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": key,
      },
    });
    console.log("Response", response);
    if (!response.ok) {
      //   console.error(response.status);
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    console.log("Data", data);
    const threeArticles = data.top_news[0].news.slice(0, 3);
    // console.log("Articles", threeArticles);
    // res.json(threeArticles);
    // case_files.post("/news-from-australia", async (req, res) => {
    //   try {
    for (let newFile of threeArticles) {
      //   console.log("New file", newFile);
      // const articleSummary = await anthropic.messages.create({
      //   model: "claude-3-5-sonnet-20240620",
      //   max_tokens: 2000,
      //   temperature: 0,
      //   system: systemPromptForArticleSummary,
      //   messages: [
      //     {
      //       role: "user",
      //       content: [
      //         {
      //           type: "text",
      //           text: newFile.text,
      //         },
      //       ],
      //     },
      //   ],
      // });
      console.log("Article summary", articleSummary);
      const addedCaseFile = await addCaseFile({
        countries_id: country.id,
        article_id: newFile.id,
        article_content: newFile.text,
        article_title: newFile.title,
        publish_date: newFile.publish_date,
        photo_url: newFile.image,
        // summary_young: articleSummary.choices[0].message.content.youngerSummary,
        // summary_old: articleSummary.choices[0].message.content.olderSummary,
      });
      console.log("Added file", addedCaseFile);
    }
  });
}

module.exports = addArticles;
