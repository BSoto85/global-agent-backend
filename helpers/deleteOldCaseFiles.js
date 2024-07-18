const {
  getLatestCaseFile,
  deleteOldArticles,
} = require("../queries/caseFiles");

const checkDate = (article_publish_date) => {
  const articleDate = new Date(article_publish_date);
  const currentDate = new Date();
  const differeneInDatesInMs = currentDate - articleDate;
  const msToDay = 1000 * 60 * 60 * 24;
  return (differeneInDatesInMs / msToDay).toFixed(1);
};

async function deleteOldCaseFiles() {
  const latestFile = await getLatestCaseFile();
  const daysSinceLastArticlePost = checkDate(latestFile.publish_date);
  // console.log("Days since last post", daysSinceLastArticlePost);
  if (daysSinceLastArticlePost > 1) {
    const deletedArticles = await deleteOldArticles();
  }
}

module.exports = deleteOldCaseFiles;
