const translateText = require("../helpers/translateText");
const { addCaseFile } = require("../queries/caseFiles");

async function addTranslatedArticles(threeArticles) {
    const addedArticles = []
    for (let newFile of threeArticles) {
        //   console.log("New file", newFile);
        //  *** if language_code !== en, then run translate helper function ***
        let translatedContent = newFile.text;
        let translatedTitle = newFile.title;
        // Translate content and title if the language is not English
        if (country.language_code !== "en") {
            translatedContent = await translateText(newFile.txt, "en");
            translatedTitle = await translateText(newFile.title, "en");
            console.log(translatedContent);
          }
        const addedCaseFile = await addCaseFile({
          countries_id: country.id,
          article_id: newFile.id,
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
    return addedArticles;
}
  
  module.exports = addTranslatedArticles;
  