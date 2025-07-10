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

  // Just return the string from the input, do NOT convert to Date or ISO
const getPublishDateValue = () => {
  if (!formData.publish_date) return null;
  // Convert local datetime-local string to UTC ISO string
  const local = new Date(formData.publish_date);
  return local.toISOString();
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const submitData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        publish_date: formData.status === 'draft' && getPublishDateValue() ? getPublishDateValue() : null,
      };
      const response = await articleService.createArticle(submitData);
      navigate(`/articles/${response.slug}`);
    } catch (error) {
      setErrors(error.response?.data || { general: 'Failed to create article' });
    } finally {
      setLoading(false);
    }
  };

  // Always save as draft, regardless of dropdown
  const handleSaveAsDraft = async () => {
    setLoading(true);
    setErrors({});
    try {
      const submitData = {
        title: formData.title,
        content: formData.content,
        status: 'draft',
        publish_date: getPublishDateValue(),
      };
      const response = await articleService.createArticle(submitData);
      navigate(`/articles/${response.slug}`);
    } catch (error) {
      setErrors(error.response?.data || { general: 'Failed to create article' });
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

  const getNowDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
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
            <div className="content-stats" style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <span>Words: {getWordCount()}</span>
              <span>Estimated read time: {getEstimatedReadTime()} min</span>
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
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

            {formData.status === 'draft' && (
              <div className="form-group" style={{ flex: 2 }}>
                <label htmlFor="publish_date">Schedule Publication (Optional)</label>
                <input
                  type="datetime-local"
                  id="publish_date"
                  name="publish_date"
                  value={formData.publish_date}
                  onChange={handleChange}
                  min={getNowDateTime()}
                />
                {errors.publish_date && <span className="field-error">{errors.publish_date}</span>}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            {formData.status === 'published' ? (
              <>
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
                  {loading ? 'Publishing...' : 'Publish Article'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;