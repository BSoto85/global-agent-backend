
const { addCaseFile } = require("../queries/caseFiles");
// const translateText = require("../helpers/translateText")

const URL = process.env.BASE_URL;
const key = process.env.NEWS_API_KEY;

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

async function addArticles(allCountries){

    const addedArticles = []

    allCountries.map(async (country) => {
        const url = `${URL}?source-country=${country.country_code}&language=${country.language_code}&date=${currentDate}`;
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

        for (let newFile of threeArticles) {
            //   console.log("New file", newFile);
            // const textInSpanish = await translateText("Hello World", "es")
        //  *** if language_code !== en, then run translate helper function ***
          const addedCaseFile = await addCaseFile({
            countries_id: country.id,
            article_id: newFile.id,
            article_content: newFile.text,
            article_title: newFile.title,
            publish_date: newFile.publish_date,
            photo_url: newFile.image,
          });
          console.log("Added file", addedCaseFile);
          addedArticles.push(addedCaseFile)
        }
      });
      return addedArticles
}

module.exports = addArticles;
