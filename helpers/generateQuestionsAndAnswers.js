const Anthropic = require("@anthropic-ai/sdk");
const anthropic = new Anthropic();
const {
  systemPromptForArticleQuestions,
} = require("./aiData");

//http://localhost:3003/api/ai/questions
const generateQuestionsAndAnswers = async (summary) => {
  const articleQuestionsAndAnswers = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4096,
    temperature: 0,
    system: systemPromptForArticleQuestions,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: summary.summary_young + summary.summary_old,
          },
        ],
      },
    ],
  });
  const parsed = JSON.parse(articleQuestionsAndAnswers.content[0].text);
  return { ...parsed, article_id: summary.article_id };
};

module.exports = { generateQuestionsAndAnswers };
