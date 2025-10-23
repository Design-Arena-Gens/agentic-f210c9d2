'use client';

import { useState, useEffect } from 'react';
import styles from './SearchBox.module.css';
import type { WatchlistItem } from '../page';

interface SearchResult {
  title: string;
  poster: string;
  type: 'movie' | 'tv';
  year?: string;
}

interface SearchBoxProps {
  onSelect: (item: WatchlistItem) => void;
}

export default function SearchBox({ onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const movieResults = await searchMovies(query);
        const tvResults = await searchTVShows(query);
        setResults([...movieResults, ...tvResults].slice(0, 8));
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const searchMovies = async (term: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=movie&limit=5`
      );
      const data = await response.json();

      return data.results?.map((item: any) => ({
        title: item.trackName,
        poster: item.artworkUrl100?.replace('100x100', '600x600') || '',
        type: 'movie' as const,
        year: item.releaseDate?.split('-')[0]
      })) || [];
    } catch {
      return [];
    }
  };

  const searchTVShows = async (term: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`
      );
      const data = await response.json();

      return data.slice(0, 5).map((item: any) => ({
        title: item.show?.name || '',
        poster: item.show?.image?.original || item.show?.image?.medium || '',
        type: 'tv' as const,
        year: item.show?.premiered?.split('-')[0]
      }));
    } catch {
      return [];
    }
  };

  const handleSelect = (result: SearchResult) => {
    const newItem: WatchlistItem = {
      id: Date.now().toString(),
      title: result.title,
      poster: result.poster || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster',
      type: result.type
    };

    onSelect(newItem);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search movies & TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowResults(true)}
        className={styles.input}
      />

      {showResults && results.length > 0 && (
        <div className={styles.results}>
          {results.map((result, index) => (
            <div
              key={index}
              className={styles.resultItem}
              onClick={() => handleSelect(result)}
            >
              {result.poster && (
                <img
                  src={result.poster}
                  alt={result.title}
                  className={styles.resultPoster}
                />
              )}
              <div className={styles.resultInfo}>
                <div className={styles.resultTitle}>{result.title}</div>
                <div className={styles.resultMeta}>
                  {result.type === 'movie' ? 'Movie' : 'TV Show'}
                  {result.year && ` • ${result.year}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className={styles.loading}>Searching...</div>
      )}
    </div>
  );
}
