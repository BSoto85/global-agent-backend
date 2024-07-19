const getFormattedCurrentDate = require("./getFormattedCurrentDate.js");
require("dotenv").config();
const URL = process.env.BASE_URL;
const key = process.env.NEWS_API_KEY;

async function fetchArticles(country, currentDate) {
    const url = `${URL}?source-country=${country.country_code}&language=${country.language_code}&date=${currentDate}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
        "x-api-key": key,
        },
    });
    if (response.ok) {
        const data = await response.json();
        const allArticles = data.top_news[0].news;
        const middle = Math.floor(allArticles.length / 2);
        const threeArticles = [
        allArticles[0],
        allArticles[middle],
        allArticles[allArticles.length - 1],
        ];
        return threeArticles  
    } else {
        console.log(`Error fetching articles from ${country.name}`)
    }
}
  
  module.exports = fetchArticles;
  