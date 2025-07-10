import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/articleServices';

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const fetchMyArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getMyArticles();
      setArticles(response.results || response);
    } catch (error) {
      setError('Failed to fetch your articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleService.deleteArticle(articleId);
        setArticles(articles.filter(article => article.id !== articleId));
      } catch (error) {
        setError('Failed to delete article');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status}`}>
        {status === 'published' ? '✓ Published' : '📝 Draft'}
      </span>
    );
  };

  if (loading) return <div className="loading">Loading your articles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-articles-container">
      <div className="page-header">
        <h1>My Articles</h1>
        <Link to="/create-article" className="btn btn-primary">
          ✏️ Write New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="no-articles">
          <h3>You haven't written any articles yet</h3>
          <p>Start sharing your thoughts with the world!</p>
          <Link to="/create-article" className="btn btn-primary">
            Write Your First Article
          </Link>
        </div>
      ) : (
        <div className="articles-table">
          {articles.map((article) => (
            <div key={article.id} className="article-row">
              <div className="article-info">
                <h3 className="article-title">
                  <Link to={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                <div className="article-meta">
                  {getStatusBadge(article.status)}
                  <span className="article-date">
                    Created: {formatDate(article.created_at)}
                  </span>
                  <span className="article-read-time">
                    {article.estimated_read_time} min read
                  </span>
                </div>
              </div>
              
              <div className="article-actions">
                <Link 
                  to={`/articles/${article.slug}`}
                  className="btn btn-outline"
                >
                  View
                </Link>
                <Link 
                  to={`/edit-article/${article.id}`}
                  className="btn btn-secondary"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(article.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = `
.my-articles-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.page-header h1 {
  color: #333;
  margin: 0;
}

.no-articles {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-articles h3 {
  color: #666;
  margin-bottom: 1rem;
}

.no-articles p {
  color: #888;
  margin-bottom: 2rem;
}

.articles-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.article-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.article-row:hover {
  background-color: #f8f9fa;
}

.article-row:last-child {
  border-bottom: none;
}

.article-info {
  flex: 1;
}

.article-title a {
  text-decoration: none;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.article-title a:hover {
  color: #007bff;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.published {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background-color: #fff3cd;
  color: #856404;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.article-actions .btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .article-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .article-actions {
    justify-content: flex-end;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
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

export default MyArticles;