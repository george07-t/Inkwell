import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleServices';
import { useAuth } from '../../context/AuthContext';

const ArticleDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticle(slug);
      setArticle(response);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Article not found');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view this article');
      } else {
        setError('Failed to load article');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleService.deleteArticle(article.id);
        navigate('/my-articles');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = isAuthenticated && user && article && user.id === article.author;

  if (loading) return <div className="loading">Loading article...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!article) return <div className="error">Article not found</div>;

  return (
    <div className="article-detail-container">
      <article className="article-content">
        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="meta-left">
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
            
            {article.status === 'draft' && (
              <div className="draft-badge">
                📝 Draft
              </div>
            )}
          </div>

          {isAuthor && (
            <div className="author-actions">
              <Link 
                to={`/edit-article/${article.id}`}
                className="btn btn-secondary"
              >
                ✏️ Edit Article
              </Link>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                🗑️ Delete Article
              </button>
            </div>
          )}
        </header>

        <div className="article-body">
          {article.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            )
          ))}
        </div>

        <footer className="article-footer">
          <div className="article-info">
            <p>
              <strong>Created:</strong> {formatDate(article.created_at)}
            </p>
            {article.updated_at !== article.created_at && (
              <p>
                <strong>Last updated:</strong> {formatDate(article.updated_at)}
              </p>
            )}
            {article.publish_date && (
              <p>
                <strong>Scheduled publish:</strong> {formatDate(article.publish_date)}
              </p>
            )}
          </div>

          <div className="navigation-links">
            <Link to="/" className="btn btn-outline">
              ← Back to Articles
            </Link>
            {isAuthenticated && (
              <Link to="/my-articles" className="btn btn-outline">
                My Articles
              </Link>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};

const styles = `
.article-detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.article-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.article-header {
  border-bottom: 2px solid #eee;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
}

.article-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.meta-left {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.article-author {
  font-weight: 600;
  color: #333;
}

.draft-badge {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.author-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.article-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 3rem;
}

.article-paragraph {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.article-footer {
  border-top: 1px solid #eee;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.article-info {
  color: #666;
  font-size: 0.9rem;
}

.article-info p {
  margin-bottom: 0.5rem;
}

.navigation-links {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .article-content {
    padding: 1rem;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .meta-left {
    flex-direction: column;
    gap: 0.5rem;
  }

  .author-actions {
    flex-direction: column;
  }

  .article-footer {
    flex-direction: column;
    gap: 2rem;
  }

  .navigation-links {
    flex-direction: column;
  }
}
`;

// Add styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ArticleDetail;