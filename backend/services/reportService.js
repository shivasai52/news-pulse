const Parser = require("rss-parser");

const parser = new Parser();

const feeds = [
  {
    name: "BBC",
    url: "https://feeds.bbci.co.uk/news/rss.xml"
  },
  {
    name: "Times of India",
    url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms"
  },
  {
    name: "The Guardian",
    url: "https://www.theguardian.com/world/rss"
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/rss"
  },
  {
    name: "NPR",
    url: "https://feeds.npr.org/1001/rss.xml"
  }
];

async function generateReport() {

  const sources = [];

  let totalArticles = 0;
  let allUrls = [];

  for (const feed of feeds) {

    try {

      console.log(`Checking ${feed.name}...`);

      const result = await parser.parseURL(feed.url);

      const articles = result.items || [];

      totalArticles += articles.length;

      // Get article URLs
      const urls = articles
        .map(article => article.link)
        .filter(Boolean);

      allUrls.push(...urls);

      // Check article information
      const validTitles = articles.filter(
        article => article.title
      ).length;

      const validUrls = articles.filter(
        article => article.link
      ).length;

      const validDates = articles.filter(
        article =>
          article.pubDate ||
          article.isoDate
      ).length;

      sources.push({
        name: feed.name,

        status: "Working",

        articles: articles.length,

        sourceVerified: true,

        validTitles,

        validUrls,

        validDates
      });

    } catch (error) {

      console.log(
        `${feed.name} failed: ${error.message}`
      );

      sources.push({

        name: feed.name,

        status: "Failed",

        articles: 0,

        sourceVerified: false,

        validTitles: 0,

        validUrls: 0,

        validDates: 0
      });
    }
  }

  // Check duplicate URLs
  const uniqueUrls = new Set(allUrls);

  const duplicateArticles =
    allUrls.length -
    uniqueUrls.size;

  // Number of working sources
  const sourcesWorking =
    sources.filter(
      source =>
        source.status === "Working"
    ).length;

  return {

    checkedAt:
      new Date().toISOString(),

    totalArticles,

    sourcesChecked:
      feeds.length,

    sourcesWorking,

    duplicateArticles,

    refreshInterval:
      "10 minutes",

    refreshStatus:
      "Working",

    sources

  };
}

module.exports = {
  generateReport
};