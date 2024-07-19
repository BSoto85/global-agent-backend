const {
    addYoungerQuestionAndAnswers,
    addOlderQuestionAndAnswers,
  } = require("../queries/ai");

async function addQuestionsAndAnswers(getQuestionsAndAnswers) {
    for (const question of getQuestionsAndAnswers.questionsForYounger) {
        const addedYoungerQuestionAndAnswers =
          await addYoungerQuestionAndAnswers(
            question,
            getQuestionsAndAnswers.article_id
          );
          console.log("addedYoungerQuestionAndAnswers", addedYoungerQuestionAndAnswers)
        await delay(500);
    }
    for (const question of getQuestionsAndAnswers.questionsForOlder) {
    const addedOlderQuestionAndAnswers = await addOlderQuestionAndAnswers(
        question,
        getQuestionsAndAnswers.article_id
    );
    await delay(500);
    }

}
  
  module.exports = addQuestionsAndAnswers;
  