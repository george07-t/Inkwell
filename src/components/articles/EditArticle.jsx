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
    // eslint-disable-next-line
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

  // Always send ISO string or null for publish_date
  const getPublishDateValue = () => {
    if (!formData.publish_date) return null;
    return formData.publish_date;
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
      const response = await articleService.updateArticle(id, submitData);
      navigate(`/articles/${response.slug}`);
    } catch (error) {
      setErrors(error.response?.data || { general: 'Failed to update article' });
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

  const getNowDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
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

            {formData.status === 'published' ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="btn btn-outline"
                  disabled={loading || !hasChanges()}
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !hasChanges()}
                >
                  {loading ? 'Saving...' : 'Publish Article'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="btn btn-primary"
                disabled={loading || !hasChanges()}
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
            )}
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

export default EditArticle;