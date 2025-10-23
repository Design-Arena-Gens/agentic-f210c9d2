'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';
import SearchBox from './SearchBox';
import type { WatchlistItem, Categories } from '../page';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddItem: (item: WatchlistItem, category: keyof Categories) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export default function Sidebar({ isOpen, onToggle, onAddItem, onExport, onImport }: SidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof Categories>('planningToWatch');
  const [manualMode, setManualMode] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualPoster, setManualPoster] = useState('');
  const [manualType, setManualType] = useState<'movie' | 'tv'>('movie');

  const handleAddManual = () => {
    if (!manualTitle.trim()) return;

    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      title: manualTitle,
      poster: manualPoster || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster',
      type: manualType
    };

    onAddItem(newItem, selectedCategory);
    setManualTitle('');
    setManualPoster('');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>Watchlist</h1>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Add to List</h3>

            <div className={styles.modeToggle}>
              <button
                className={!manualMode ? styles.active : ''}
                onClick={() => setManualMode(false)}
              >
                Search
              </button>
              <button
                className={manualMode ? styles.active : ''}
                onClick={() => setManualMode(true)}
              >
                Manual
              </button>
            </div>

            {!manualMode ? (
              <SearchBox
                onSelect={(item) => onAddItem(item, selectedCategory)}
              />
            ) : (
              <div className={styles.manualForm}>
                <input
                  type="text"
                  placeholder="Title"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Poster URL (optional)"
                  value={manualPoster}
                  onChange={(e) => setManualPoster(e.target.value)}
                  className={styles.input}
                />
                <select
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as 'movie' | 'tv')}
                  className={styles.select}
                >
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
                <button onClick={handleAddManual} className={styles.addButton}>
                  Add
                </button>
              </div>
            )}

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as keyof Categories)}
              className={styles.select}
            >
              <option value="planningToWatch">Planning to Watch</option>
              <option value="currentlyWatching">Currently Watching</option>
              <option value="watched">Watched</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Data</h3>
            <div className={styles.dataButtons}>
              <button onClick={onExport} className={styles.dataButton}>
                Export
              </button>
              <label className={styles.dataButton}>
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <button
        className={`${styles.toggleButton} ${!isOpen ? styles.toggleButtonClosed : ''}`}
        onClick={onToggle}
      >
        {isOpen ? '←' : '→'}
      </button>
    </>
  );
}
