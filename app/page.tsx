'use client';

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import EditPanel from './components/EditPanel';

export interface WatchlistItem {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'tv';
  score?: number;
  notes?: string;
}

export interface Categories {
  watched: WatchlistItem[];
  currentlyWatching: WatchlistItem[];
  planningToWatch: WatchlistItem[];
  dropped: WatchlistItem[];
}

const sampleData: Categories = {
  watched: [
    { id: '1', title: 'Inception', poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', type: 'movie', score: 9 },
    { id: '2', title: 'Breaking Bad', poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg', type: 'tv', score: 10 },
    { id: '3', title: 'The Dark Knight', poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', type: 'movie', score: 9 },
  ],
  currentlyWatching: [
    { id: '4', title: 'Stranger Things', poster: 'https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiZjhhN2Q2XkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_SX300.jpg', type: 'tv', score: 8 },
    { id: '5', title: 'Dune', poster: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg', type: 'movie', score: 8 },
    { id: '6', title: 'The Last of Us', poster: 'https://m.media-amazon.com/images/M/MV5BZGUzYTI3NzUtZDI5MS00MGZiLTk0YWItMzg3Y2JlZTk1NTZiXkEyXkFqcGdeQXVyNTM0OTY1OQ@@._V1_SX300.jpg', type: 'tv' },
  ],
  planningToWatch: [
    { id: '7', title: 'Oppenheimer', poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg', type: 'movie' },
    { id: '8', title: 'The Wire', poster: 'https://m.media-amazon.com/images/M/MV5BZmY5ZDMxODEtNWIwOS00NjdkLTkyMGYtZGE2NTkzNTdhZmJjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg', type: 'tv' },
    { id: '9', title: 'Interstellar', poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', type: 'movie' },
    { id: '10', title: 'True Detective', poster: 'https://m.media-amazon.com/images/M/MV5BMmRlYmE0NTgtNDZhNS00ZTRkLTk5N2YtNDJhMGM1MjEyMDBmXkEyXkFqcGdeQXVyNjU2NjA5NjM@._V1_SX300.jpg', type: 'tv' },
  ],
  dropped: [
    { id: '11', title: 'The Walking Dead', poster: 'https://m.media-amazon.com/images/M/MV5BZmFlMTA0MmUtNWVmOC00ZmE1LWFmMDYtZTJhYjJhNGVjYTU5XkEyXkFqcGdeQXVyMTAzMDM4MjM0._V1_SX300.jpg', type: 'tv', score: 5 },
  ],
};

export default function Home() {
  const [categories, setCategories] = useState<Categories>(sampleData);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingItem, setEditingItem] = useState<{ item: WatchlistItem; category: keyof Categories } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('watchlist');
    if (saved) {
      setCategories(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(categories));
  }, [categories]);

  const addItem = (item: WatchlistItem, category: keyof Categories) => {
    setCategories(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
  };

  const updateItem = (id: string, category: keyof Categories, updates: Partial<WatchlistItem>) => {
    setCategories(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteItem = (id: string, category: keyof Categories) => {
    setCategories(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
    setEditingItem(null);
  };

  const moveItem = (
    itemId: string,
    sourceCategory: keyof Categories,
    destinationCategory: keyof Categories,
    destinationIndex: number
  ) => {
    const sourceItems = [...categories[sourceCategory]];
    const item = sourceItems.find(i => i.id === itemId);

    if (!item) return;

    const newSourceItems = sourceItems.filter(i => i.id !== itemId);
    const destItems = sourceCategory === destinationCategory ? newSourceItems : [...categories[destinationCategory]];

    destItems.splice(destinationIndex, 0, item);

    setCategories(prev => ({
      ...prev,
      [sourceCategory]: newSourceItems,
      [destinationCategory]: destItems
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'watchlist.json';
    link.click();
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setCategories(data);
      } catch (err) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <main style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddItem={addItem}
        onExport={exportData}
        onImport={importData}
      />
      <MainContent
        categories={categories}
        sidebarOpen={sidebarOpen}
        onItemClick={(item, category) => setEditingItem({ item, category })}
        onMoveItem={moveItem}
      />
      {editingItem && (
        <EditPanel
          item={editingItem.item}
          onClose={() => setEditingItem(null)}
          onUpdate={(updates) => updateItem(editingItem.item.id, editingItem.category, updates)}
          onDelete={() => deleteItem(editingItem.item.id, editingItem.category)}
        />
      )}
    </main>
  );
}
