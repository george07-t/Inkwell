import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/articleServices';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page) => {
    try {
      setLoading(true);
      const response = await articleService.getPublicArticles(page);
      setArticles(response.results);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <div className="loading">Loading articles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Inkwell</h1>
        <p>Discover amazing stories from our community of writers</p>
      </div>

      <div className="articles-section">
        <h2>Latest Articles</h2>

        {articles.length === 0 ? (
          <div className="no-articles">
            <p>No articles published yet. Be the first to share your story!</p>
          </div>
        ) : (
          <>
            <div className="articles-grid">
              {articles.map((article) => (
                <article key={article.id} className="article-card">
                  <h3 className="article-title">
                    <Link to={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <div className="article-meta">
                    <span className="article-author">
                      By {article.author_username}
                    </span>
                    <span className="article-date">
                      {formatDate(article.created_at)}
                    </span>
                    <span className="article-read-time">
                      {article.estimated_read_time} min read
                    </span>
                  </div>

                  <div className="article-actions">
                    <Link
                      to={`/articles/${article.slug}`}
                      className="btn btn-outline"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>

                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = `
.home-container {
  max-width: 1000px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-section p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.articles-section h2 {
  margin-bottom: 2rem;
  color: #333;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.article-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.article-title a {
  text-decoration: none;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.article-title a:hover {
  color: #007bff;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
}

.article-actions {
  margin-top: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.pagination-info {
  color: #666;
  font-weight: 500;
}

.no-articles {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
`;

// Add styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default Home;