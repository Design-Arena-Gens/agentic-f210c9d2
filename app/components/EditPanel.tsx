'use client';

import { useState, useEffect } from 'react';
import styles from './EditPanel.module.css';
import type { WatchlistItem } from '../page';

interface EditPanelProps {
  item: WatchlistItem;
  onClose: () => void;
  onUpdate: (updates: Partial<WatchlistItem>) => void;
  onDelete: () => void;
}

export default function EditPanel({ item, onClose, onUpdate, onDelete }: EditPanelProps) {
  const [title, setTitle] = useState(item.title);
  const [poster, setPoster] = useState(item.poster);
  const [notes, setNotes] = useState(item.notes || '');
  const [score, setScore] = useState(item.score);

  useEffect(() => {
    setTitle(item.title);
    setPoster(item.poster);
    setNotes(item.notes || '');
    setScore(item.score);
  }, [item]);

  const handleSave = () => {
    onUpdate({ title, poster, notes, score });
  };

  const handleScoreClick = (value: number) => {
    const newScore = score === value ? undefined : value;
    setScore(newScore);
    onUpdate({ score: newScore });
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClickOutside}>
      <div className={styles.panel}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.content}>
          <img
            src={poster}
            alt={title}
            className={styles.poster}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
            }}
          />

          <div className={styles.details}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              className={styles.titleInput}
            />

            <input
              type="text"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              onBlur={handleSave}
              placeholder="Poster URL"
              className={styles.posterInput}
            />

            <div className={styles.section}>
              <label className={styles.label}>Score</label>
              <div className={styles.scoreGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    className={`${styles.scoreButton} ${score === value ? styles.scoreButtonActive : ''}`}
                    onClick={() => handleScoreClick(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <label className={styles.label}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleSave}
                placeholder="Add notes..."
                className={styles.textarea}
                rows={6}
              />
            </div>

            <button onClick={onDelete} className={styles.deleteButton}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
