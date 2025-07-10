import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleServices';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    publish_date: '',
  });
  const [originalArticle, setOriginalArticle] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setFetchLoading(true);
      const response = await articleService.getArticle(id);
      setOriginalArticle(response);
      
      // Format publish_date for datetime-local input
      let publishDate = '';
      if (response.publish_date) {
        publishDate = new Date(response.publish_date).toISOString().slice(0, 16);
      }
      
      setFormData({
        title: response.title,
        content: response.content,
        status: response.status,
        publish_date: publishDate,
      });
    } catch (error) {
      setErrors({ general: 'Failed to load article' });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Prepare data for submission
      const submitData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
      };

      // Only include publish_date if it's set
      if (formData.publish_date) {
        submitData.publish_date = new Date(formData.publish_date).toISOString();
      } else {
        submitData.publish_date = null;
      }

      const response = await articleService.updateArticle(id, submitData);
      navigate(`/articles/${response.slug}`);
    } catch (error) {
      setErrors(error.response?.data || { general: 'Failed to update article' });
    } finally {
      setLoading(false);
    }
  };

  const getWordCount = () => {
    return formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getEstimatedReadTime = () => {
    const wordCount = getWordCount();
    return Math.max(1, Math.round(wordCount / 200));
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  const hasChanges = () => {
    if (!originalArticle) return false;
    
    const originalPublishDate = originalArticle.publish_date 
      ? new Date(originalArticle.publish_date).toISOString().slice(0, 16)
      : '';
    
    return (
      formData.title !== originalArticle.title ||
      formData.content !== originalArticle.content ||
      formData.status !== originalArticle.status ||
      formData.publish_date !== originalPublishDate
    );
  };

  if (fetchLoading) return <div className="loading">Loading article...</div>;
  if (!originalArticle) return <div className="error">Article not found</div>;

  return (
    <div className="edit-article-container">
      <div className="edit-article-card">
        <h1>Edit Article</h1>
        
        {errors.general && <div className="error">{errors.general}</div>}
        
        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <label htmlFor="title">Article Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your article"
              required
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your thoughts, stories, and ideas..."
              rows="15"
              required
            />
            {errors.content && <span className="field-error">{errors.content}</span>}
            
            <div className="content-stats">
              <span>Words: {getWordCount()}</span>
              <span>Estimated read time: {getEstimatedReadTime()} min</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Save as Draft</option>
                <option value="published">Publish Now</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="publish_date">Schedule Publication (Optional)</label>
              <input
                type="datetime-local"
                id="publish_date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleChange}
                min={getTomorrowDate()}
              />
              {errors.publish_date && <span className="field-error">{errors.publish_date}</span>}
            </div>
          </div>

          {hasChanges() && (
            <div className="changes-indicator">
              <p>⚠️ You have unsaved changes</p>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(`/articles/${originalArticle.slug}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !hasChanges()}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="article-info">
          <h3>Article Information</h3>
          <p><strong>Created:</strong> {new Date(originalArticle.created_at).toLocaleDateString()}</p>
          <p><strong>Last Updated:</strong> {new Date(originalArticle.updated_at).toLocaleDateString()}</p>
          <p><strong>Current Status:</strong> {originalArticle.status}</p>
          <p><strong>Slug:</strong> {originalArticle.slug}</p>
        </div>
      </div>
    </div>
  );
};

const styles = `
.edit-article-container {
  max-width: 800px;
  margin: 0 auto;
}

.edit-article-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.edit-article-card h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.content-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.changes-indicator {
  background-color: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ffeaa7;
}

.changes-indicator p {
  margin: 0;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.article-info {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 4px;
  border-top: 3px solid #007bff;
}

.article-info h3 {
  color: #333;
  margin-bottom: 1rem;
}

.article-info p {
  margin: 0.5rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .edit-article-card {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .content-stats {
    flex-direction: column;
    gap: 0.25rem;
  }
}
`;

// Add styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default EditArticle;