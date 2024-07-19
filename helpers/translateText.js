require("dotenv").config();
const { v2 } = require("@google-cloud/translate");
const fs = require("fs");
const { proc } = require("../db/dbConfig");
const { Translate } = require("@google-cloud/translate").v2;

// using google cloud
// const translateConfig = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
// const translate = new Translate({
//   type: process.env.TRANSLATE_TYPE,
//   project_id: process.env.TRANSLATE_PROJECT_ID,
//   private_key_id: process.env.TRANSLATE_PRIVATE_KEY_ID,
//   private_key: process.env.TRANSLATE_PRIVATE_KEY,
//   client_email: process.env.TRANSLATE_CLIENY_EMAIL,
//   client_id: process.env.TRANSLATE_CLIENT_ID,
//   auth_uri: process.env.TRANSLATE_AUTH_URI,
//   token_uri: process.env.TRANSLATE_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.TRANSLATE_AUTH_CERT_URL,
//   client_x509_cert_url: process.env.TRANSLATE_CLIENT_CERT_URL,
//   universe_domain: process.env.TRANSLATE_UNIVERSE_DOMAIN,
// });

const base64Credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
// console.log("Base 64", base64Credentials);

const jsonString = Buffer.from(base64Credentials, "base64").toString("utf-8");
// console.log("JSON string", jsonString);

const credentials = JSON.parse(jsonString);
// console.log("Credentials", credentials);

fs.writeFileSync("/tmp/translation.json", JSON.stringify(credentials));
// const translator = require("../tmp/translation.json");

process.env.GOOGLE_APPLICATION_CREDENTIALS = "/tmp/translation.json";
// process.env.GOOGLE_APPLICATION_CREDENTIALS = translator;
// console.log("File", process.env.GOOGLE_APPLICATION_CREDENTIALS);

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
