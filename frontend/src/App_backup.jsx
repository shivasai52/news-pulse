import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const REFRESH_TIME = 10 * 60;

function App() {
  const [allNews, setAllNews] = useState([]);
  const [news, setNews] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(REFRESH_TIME);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Current article number for each source
  const [articleIndex, setArticleIndex] = useState(0);

  // Get all articles from backend
  const loadNews = async () => {
    try {
      setRefreshing(true);
      setError("");

      console.log("Fetching news...");

      const response = await axios.get(
        "http://localhost:5000/api/news"
      );

      if (response.data.success) {
        const articles = response.data.articles || [];

        console.log(
          "Total articles received:",
          articles.length
        );

        setAllNews(articles);

        setLastUpdated(new Date());
        setSecondsLeft(REFRESH_TIME);
      }
    } catch (err) {
      console.error("News error:", err);
      setError("Unable to load latest news.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Select one article from every source
  const showNewsForIndex = (index, articles = allNews) => {
    const sources = [
      "BBC",
      "Times of India",
      "The Guardian",
      "Hacker News",
      "NPR"
    ];

    const selected = [];

    sources.forEach((source) => {
      const sourceArticles = articles.filter(
        (article) => article.source === source
      );

      if (sourceArticles.length > 0) {
        const article =
          sourceArticles[
            index % sourceArticles.length
          ];

        selected.push(article);
      }
    });

    setNews(selected);
  };

  // Initial load
  useEffect(() => {
    loadNews();
  }, []);

  // When backend data arrives, show article #1
  useEffect(() => {
    if (allNews.length > 0) {
      showNewsForIndex(articleIndex);
    }
  }, [allNews]);

  // Countdown
  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          return REFRESH_TIME;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  // Automatic refresh every 10 minutes
  useEffect(() => {
    const automaticRefresh = setInterval(() => {
      console.log(
        "⏰ 10 minutes completed - changing news"
      );

      handleNewsChange();
    }, REFRESH_TIME * 1000);

    return () => clearInterval(automaticRefresh);
  }, [allNews, articleIndex]);

  // Change to next article from every source
  const handleNewsChange = async () => {
    if (allNews.length === 0) {
      await loadNews();
      return;
    }

    const nextIndex =
      articleIndex + 1;

    setArticleIndex(nextIndex);

    showNewsForIndex(
      nextIndex,
      allNews
    );

    setSecondsLeft(REFRESH_TIME);
    setLastUpdated(new Date());

    console.log(
      `Showing article set ${nextIndex + 1}`
    );
  };

  // Search
  const filteredNews = news.filter(
    (article) => {
      const text =
        search.toLowerCase();

      return (
        article.title
          ?.toLowerCase()
          .includes(text) ||
        article.description
          ?.toLowerCase()
          .includes(text) ||
        article.source
          ?.toLowerCase()
          .includes(text)
      );
    }
  );

  // Timer
  const formatTime = (seconds) => {
    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="header-content">

          <div className="logo-section">

            <div className="logo">
              📰
            </div>

            <div>
              <h1>NEWS PULSE</h1>

              <p>
                Stay informed. Stay updated.
              </p>
            </div>

          </div>

          <button
            className="refresh-button"
            onClick={handleNewsChange}
            disabled={refreshing}
          >
            🔄{" "}
            {refreshing
              ? "Updating..."
              : "Refresh News"}
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="news-container">

        <div className="news-toolbar">

          <div>

            <h2>
              Latest News
            </h2>

            {lastUpdated && (
              <p className="updated-text">
                Last updated:{" "}
                {lastUpdated.toLocaleTimeString()}
              </p>
            )}

          </div>


          {/* TIMER */}

          <div className="timer">

            <span className="timer-icon">
              ⏱️
            </span>

            <div>

              <span className="timer-label">
                Next update
              </span>

              <strong>
                {formatTime(secondsLeft)}
              </strong>

            </div>

          </div>

        </div>


        {/* SEARCH */}

        <div className="search-section">

          <input
            type="text"
            placeholder="🔍 Search news..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          <span className="article-count">
            {filteredNews.length} articles
          </span>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="status-box">

            <div className="spinner"></div>

            <p>
              Loading latest news...
            </p>

          </div>

        )}


        {/* ERROR */}

        {error && !loading && (

          <div className="error-box">

            <span>⚠️</span>

            <div>

              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button
              onClick={loadNews}
            >
              Try Again
            </button>

          </div>

        )}


        {/* NEWS CARDS */}

        {!loading &&
          !error && (

          <div className="news-grid">

            {filteredNews.map(
              (article, index) => (

                <article
                  className="news-card"
                  key={
                    `${article.url}-${index}`
                  }
                >

                  <div className="card-top">

                    <span className="source-badge">
                      {article.source}
                    </span>

                    <span className="news-number">
                      #{index + 1}
                    </span>

                  </div>


                  <h3>
                    {article.title}
                  </h3>


                  <p className="description">
                    {article.description ||
                      "No description available."}
                  </p>


                  {article.publishedAt && (

                    <p className="published">
                      🕒{" "}
                      {new Date(
                        article.publishedAt
                      ).toLocaleString()}
                    </p>

                  )}


                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="read-more"
                  >
                    Read Full Story →
                  </a>

                </article>

              )
            )}

          </div>

        )}

      </main>


      {/* FOOTER */}

      <footer className="footer">

        <p>
          📰 News Pulse
        </p>

        <p>
          Automatically changes news every 10 minutes
        </p>

      </footer>

    </div>
  );
}

export default App;