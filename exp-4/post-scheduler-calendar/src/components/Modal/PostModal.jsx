import { useState, useEffect, useCallback } from 'react';

const PLATFORMS = ['Instagram', 'Twitter/X', 'LinkedIn', 'Facebook', 'YouTube'];
const STATUSES = ['draft', 'scheduled', 'published'];
const COLORS = ['#6b5ce7', '#e1306c', '#1d9bf0', '#0a66c2', '#1877f2', '#ff0000'];

export default function PostModal({ initialPost, dateKey, onSave, onDelete, onClose }) {
  const isEditing = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [platform, setPlatform] = useState(initialPost?.platform ?? PLATFORMS[0]);
  const [time, setTime] = useState(initialPost?.time ?? '09:00');
  const [status, setStatus] = useState(initialPost?.status ?? 'draft');
  const [color, setColor] = useState(initialPost?.color ?? COLORS[0]);

  // Reset local form state whenever the modal is opened for a different post/day
  useEffect(() => {
    setTitle(initialPost?.title ?? '');
    setPlatform(initialPost?.platform ?? PLATFORMS[0]);
    setTime(initialPost?.time ?? '09:00');
    setStatus(initialPost?.status ?? 'draft');
    setColor(initialPost?.color ?? COLORS[0]);
  }, [initialPost, dateKey]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!title.trim()) return;
      onSave({
        id: initialPost?.id,
        title: title.trim(),
        platform,
        time,
        status,
        color,
        dateKey: initialPost?.dateKey ?? dateKey,
      });
    },
    [title, platform, time, status, color, initialPost, dateKey, onSave]
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{isEditing ? 'Edit Post' : 'New Post'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Product launch teaser"
              autoFocus
            />
          </label>

          <label>
            Platform
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label>
            Time
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>

          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label>
            Color
            <div className="color-swatches">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`swatch ${color === c ? 'swatch--active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </label>

          <div className="modal__actions">
            {isEditing && (
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => onDelete(initialPost.id)}
              >
                Delete
              </button>
            )}
            <div className="modal__actions-right">
              <button type="button" className="btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                {isEditing ? 'Save Changes' : 'Schedule Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
