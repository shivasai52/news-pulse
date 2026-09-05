function NewsCard({ article }) {
  return (
    <div className="news-card">
      <p className="source">{article.source}</p>

      <h2>{article.title}</h2>

      <p className="description">{article.description}</p>

      <button className="read-button">
        Read More →
      </button>
    </div>
  );
}

export default NewsCard;