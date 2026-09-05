const express = require("express");
const cors = require("cors");

const { getNews } = require("./services/newsService");

const {
  generateReport
} = require("./services/reportService");

const app = express();

app.use(cors());
app.use(express.json());

// Hosting platforms (Render, Railway) inject their own port.
// Fall back to 5000 for local development.
const PORT = process.env.PORT || 5000;


// Home route
app.get("/", (req, res) => {
  res.send("News Pulse Backend is running!");
});


// News API
app.get("/api/news", async (req, res) => {
  try {

    const articles = await getNews();

    res.json({
      success: true,
      articles: articles
    });

  } catch (error) {

    console.error(
      "Error fetching news:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch news"
    });
  }
});


// News Report API
app.get("/api/report", async (req, res) => {
  try {

    const report = await generateReport();

    res.json({
      success: true,
      report: report
    });

  } catch (error) {

    console.error(
      "Report generation error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to generate report"
    });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(
    `News Pulse Backend running on port ${PORT}`
  );
});