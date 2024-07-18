require("dotenv").config();
const { v2 } = require("@google-cloud/translate");
const fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;

const base64Credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

const jsonString = Buffer.from(base64Credentials, "base64").toString("utf-8");

const credentials = JSON.parse(jsonString);

fs.writeFileSync("/tmp/translation.json", JSON.stringify(credentials));

process.env.GOOGLE_APPLICATION_CREDENTIALS = "/tmp/translation.json";

const translate = new Translate();

async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    console.log(`Translation: ${text} => (${targetLanguage}) ${translation}`);
    return translation;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
}

module.exports = translateText;
