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

async function getNews() {
  const allArticles = [];

  for (const feedInfo of feeds) {
    try {
      console.log(`Fetching ${feedInfo.name}...`);

      const feed = await parser.parseURL(feedInfo.url);

      const articles = feed.items.slice(0, 10).map((item) => ({
        source: feedInfo.name,
        title: item.title || "No title available",
        description:
          item.contentSnippet ||
          item.content ||
          "No description available",
        url: item.link || "",
        publishedAt:
          item.pubDate ||
          item.isoDate ||
          null
      }));

      allArticles.push(...articles);

      console.log(
        `${feedInfo.name}: ${articles.length} articles`
      );

    } catch (error) {
      console.log(
        `${feedInfo.name} failed: ${error.message}`
      );
    }
  }

  // Remove duplicate URLs
  const uniqueArticles = allArticles.filter(
    (article, index, self) =>
      index ===
      self.findIndex(
        (item) => item.url === article.url
      )
  );

  // IMPORTANT:
  // Return ALL fetched articles, not just 5.
  return uniqueArticles;
}

module.exports = {
  getNews
};