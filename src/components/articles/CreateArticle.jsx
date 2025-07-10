import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleServices';

const CreateArticle = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    publish_date: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      }

      const response = await articleService.createArticle(submitData);
      navigate(`/articles/${response.slug}`);
    } catch (error) {
      setErrors(error.response?.data || { general: 'Failed to create article' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    const draftData = {
      ...formData,
      status: 'draft'
    };
    setFormData(draftData);
    
    // Trigger form submission with draft status
    const event = { preventDefault: () => {} };
    await handleSubmit(event);
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

  return (
    <div className="create-article-container">
      <div className="create-article-card">
        <h1>Write New Article</h1>
        
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

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="btn btn-outline"
              disabled={loading}
            >
              Save as Draft
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 
               formData.status === 'published' ? 'Publish Article' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = `
.create-article-container {
  max-width: 800px;
  margin: 0 auto;
}

.create-article-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.create-article-card h1 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.article-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .create-article-card {
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

export default CreateArticle;