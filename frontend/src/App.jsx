import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const REFRESH_TIME = 10 * 60;

function App() {
  const [view, setView] = useState("news");

  const [allNews, setAllNews] = useState([]);
  const [news, setNews] = useState([]);

  const [report, setReport] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [secondsLeft, setSecondsLeft] =
    useState(REFRESH_TIME);

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const [articleIndex, setArticleIndex] =
    useState(0);


  // =========================
  // GET NEWS
  // =========================

  const loadNews = async () => {
    try {
      setRefreshing(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/news"
      );

      if (response.data.success) {
        const articles =
          response.data.articles || [];

        setAllNews(articles);

        showNewsForIndex(
          articleIndex,
          articles
        );

        setLastUpdated(new Date());

        setSecondsLeft(
          REFRESH_TIME
        );
      }

    } catch (error) {

      console.error(
        "News error:",
        error
      );

      setError(
        "Unable to load latest news."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // =========================
  // SHOW NEWS
  // =========================

  const showNewsForIndex = (
    index,
    articles = allNews
  ) => {

    const sources = [
      "BBC",
      "Times of India",
      "The Guardian",
      "Hacker News",
      "NPR"
    ];

    const selected = [];

    sources.forEach((source) => {

      const sourceArticles =
        articles.filter(
          (article) =>
            article.source === source
        );

      if (
        sourceArticles.length > 0
      ) {

        const article =
          sourceArticles[
            index %
            sourceArticles.length
          ];

        selected.push(article);
      }

    });

    setNews(selected);
  };


  // =========================
  // LOAD REPORT
  // =========================

  const loadReport = async () => {

    try {

      setReportLoading(true);

      const response =
        await axios.get(
          "http://localhost:5000/api/report"
        );

      if (response.data.success) {

        setReport(
          response.data.report
        );

      }

    } catch (error) {

      console.error(
        "Report error:",
        error
      );

    } finally {

      setReportLoading(false);

    }
  };


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    loadNews();
    loadReport();

  }, []);


  // =========================
  // TIMER
  // =========================

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSecondsLeft(
          (previous) => {

            if (previous <= 1) {

              return REFRESH_TIME;

            }

            return previous - 1;

          }
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);


  // =========================
  // AUTOMATIC 10 MIN REFRESH
  // =========================

  useEffect(() => {

    const automaticRefresh =
      setInterval(async () => {

        console.log(
          "10 minutes completed."
        );

        await handleNewsChange();

        await loadReport();

      }, REFRESH_TIME * 1000);

    return () =>
      clearInterval(
        automaticRefresh
      );

  }, [
    allNews,
    articleIndex
  ]);


  // =========================
  // REFRESH NEWS
  // =========================

  const handleNewsChange =
    async () => {

      if (
        allNews.length === 0
      ) {

        await loadNews();

        return;

      }

      const nextIndex =
        articleIndex + 1;

      setArticleIndex(
        nextIndex
      );

      showNewsForIndex(
        nextIndex,
        allNews
      );

      setSecondsLeft(
        REFRESH_TIME
      );

      setLastUpdated(
        new Date()
      );

      console.log(
        "News changed."
      );

    };


  // =========================
  // MANUAL REFRESH
  // =========================

  const handleRefresh =
    async () => {

      await handleNewsChange();

      await loadReport();

    };


  // =========================
  // TIMER FORMAT
  // =========================

  const formatTime =
    (seconds) => {

      const minutes =
        Math.floor(
          seconds / 60
        );

      const remainingSeconds =
        seconds % 60;

      return `${String(
        minutes
      ).padStart(
        2,
        "0"
      )}:${String(
        remainingSeconds
      ).padStart(
        2,
        "0"
      )}`;

    };


  // =========================
  // SEARCH
  // =========================

  const filteredNews =
    news.filter(
      (article) => {

        const text =
          search.toLowerCase();

        return (

          article.title
            ?.toLowerCase()
            .includes(text)

          ||

          article.description
            ?.toLowerCase()
            .includes(text)

          ||

          article.source
            ?.toLowerCase()
            .includes(text)

        );

      }
    );


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

              <h1>
                NEWS PULSE
              </h1>

              <p>
                Stay informed. Stay updated.
              </p>

            </div>

          </div>


          {/* NAVIGATION */}

          <div className="navigation">

            <button
              className={
                view === "news"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() =>
                setView("news")
              }
            >
              📰 Latest News
            </button>

            <button
              className={
                view === "report"
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => {

                setView("report");

                loadReport();

              }}
            >
              📊 News Report
            </button>

          </div>

        </div>

      </header>


      {/* =========================
          NEWS VIEW
      ========================= */}

      {view === "news" && (

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

              <span>
                ⏱️
              </span>

              <div>

                <span>
                  Next update
                </span>

                <strong>
                  {formatTime(
                    secondsLeft
                  )}
                </strong>

              </div>

            </div>


            {/* REFRESH */}

            <button
              className="refresh-button"
              onClick={
                handleRefresh
              }
              disabled={
                refreshing
              }
            >

              {refreshing
                ? "🔄 Updating..."
                : "🔄 Refresh News"}

            </button>

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

            <span>
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

          {error &&
            !loading && (

            <div className="error-box">

              ⚠️

              <p>
                {error}
              </p>

              <button
                onClick={
                  loadNews
                }
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

                      <span>
                        #{index + 1}
                      </span>

                    </div>


                    <h3>
                      {article.title}
                    </h3>


                    <p className="description">

                      {article.description}

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
                      href={
                        article.url
                      }
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

      )}


      {/* =========================
          REPORT VIEW
      ========================= */}

      {view === "report" && (

        <main className="report-container">

          <div className="report-header">

            <div>

              <h2>
                📊 News Verification Report
              </h2>

              <p>
                Automated monitoring of news sources,
                article metadata and refresh status.
              </p>

            </div>

            <button
              className="refresh-button"
              onClick={
                loadReport
              }
              disabled={
                reportLoading
              }
            >

              {reportLoading
                ? "🔄 Checking..."
                : "🔄 Check Now"}

            </button>

          </div>


          {!reportLoading &&
            report && (

            <>

              {/* SUMMARY */}

              <div className="report-summary">

                <div className="report-card">

                  <span>
                    📰
                  </span>

                  <small>
                    Total Articles
                  </small>

                  <strong>
                    {report.totalArticles}
                  </strong>

                </div>


                <div className="report-card">

                  <span>
                    🌐
                  </span>

                  <small>
                    Sources Checked
                  </small>

                  <strong>
                    {report.sourcesChecked}
                  </strong>

                </div>


                <div className="report-card">

                  <span>
                    ✅
                  </span>

                  <small>
                    Sources Working
                  </small>

                  <strong>
                    {report.sourcesWorking}
                  </strong>

                </div>


                <div className="report-card">

                  <span>
                    ♻️
                  </span>

                  <small>
                    Duplicate Articles
                  </small>

                  <strong>
                    {report.duplicateArticles}
                  </strong>

                </div>

              </div>


              {/* REFRESH MONITORING */}

              <section className="report-section">

                <h3>
                  ⏱️ Refresh Monitoring
                </h3>

                <div className="monitoring-grid">

                  <div>

                    <span>
                      Refresh Interval
                    </span>

                    <strong>
                      {report.refreshInterval}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Refresh Status
                    </span>

                    <strong className="success-text">
                      ✅ {report.refreshStatus}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Last Checked
                    </span>

                    <strong>
                      {new Date(
                        report.checkedAt
                      ).toLocaleString()}
                    </strong>

                  </div>

                </div>

              </section>


              {/* SOURCE STATUS */}

              <section className="report-section">

                <h3>
                  🌐 Source Verification
                </h3>

                <div className="source-table">

                  <div className="source-row source-heading">

                    <span>
                      Source
                    </span>

                    <span>
                      Status
                    </span>

                    <span>
                      Articles
                    </span>

                    <span>
                      Verification
                    </span>

                  </div>


                  {report.sources.map(
                    (source) => (

                      <div
                        className="source-row"
                        key={
                          source.name
                        }
                      >

                        <span>
                          {source.name}
                        </span>

                        <span>

                          {source.status ===
                          "Working"
                            ? "🟢 Working"
                            : "🔴 Failed"}

                        </span>

                        <span>
                          {source.articles}
                        </span>

                        <span>

                          {source.sourceVerified
                            ? "✅ Verified Source"
                            : "❌ Not Available"}

                        </span>

                      </div>

                    )
                  )}

                </div>

              </section>


              {/* ARTICLE CHECKS */}

              <section className="report-section">

                <h3>
                  🔍 Article Checks
                </h3>

                <div className="checks-grid">

                  <div>
                    <span>
                      Titles Available
                    </span>

                    <strong>
                      ✅ Checked
                    </strong>
                  </div>


                  <div>
                    <span>
                      URLs Available
                    </span>

                    <strong>
                      ✅ Checked
                    </strong>
                  </div>


                  <div>
                    <span>
                      Publication Dates
                    </span>

                    <strong>
                      ✅ Checked
                    </strong>
                  </div>


                  <div>
                    <span>
                      Duplicate Articles
                    </span>

                    <strong>
                      {report.duplicateArticles ===
                      0
                        ? "✅ None"
                        : `⚠️ ${report.duplicateArticles}`}
                    </strong>
                  </div>

                </div>

              </section>


              {/* EXPLANATION */}

              <section className="report-note">

                <strong>
                  ℹ️ What this report means
                </strong>

                <p>

                  The system verifies that the configured
                  news sources are reachable and checks
                  basic article information such as title,
                  URL and publication date. It also checks
                  for duplicate article URLs.

                </p>

                <p>

                  This report does not claim that every
                  news statement is factually true. Actual
                  claim-level fact checking would require
                  an additional verification system.

                </p>

              </section>

            </>

          )}

        </main>

      )}


      {/* FOOTER */}

      <footer className="footer">

        <p>
          📰 News Pulse
        </p>

        <p>
          Sources monitored automatically
        </p>

      </footer>

    </div>
  );
}

export default App;