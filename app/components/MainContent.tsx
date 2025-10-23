'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './MainContent.module.css';
import type { Categories, WatchlistItem } from '../page';

interface MainContentProps {
  categories: Categories;
  sidebarOpen: boolean;
  onItemClick: (item: WatchlistItem, category: keyof Categories) => void;
  onMoveItem: (
    itemId: string,
    sourceCategory: keyof Categories,
    destinationCategory: keyof Categories,
    destinationIndex: number
  ) => void;
}

const categoryConfig = {
  watched: { title: 'Watched', key: 'watched' as const },
  currentlyWatching: { title: 'Currently Watching', key: 'currentlyWatching' as const },
  planningToWatch: { title: 'Planning to Watch', key: 'planningToWatch' as const },
  dropped: { title: 'Dropped', key: 'dropped' as const },
};

export default function MainContent({ categories, sidebarOpen, onItemClick, onMoveItem }: MainContentProps) {
  const [activeFilters, setActiveFilters] = useState<Record<keyof Categories, 'all' | 'movie' | 'tv'>>({
    watched: 'all',
    currentlyWatching: 'all',
    planningToWatch: 'all',
    dropped: 'all',
  });

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceCategory = source.droppableId as keyof Categories;
    const destinationCategory = destination.droppableId as keyof Categories;

    onMoveItem(draggableId, sourceCategory, destinationCategory, destination.index);
  };

  const toggleFilter = (category: keyof Categories) => {
    setActiveFilters(prev => {
      const current = prev[category];
      const next = current === 'all' ? 'movie' : current === 'movie' ? 'tv' : 'all';
      return { ...prev, [category]: next };
    });
  };

  const filterItems = (items: WatchlistItem[], filter: 'all' | 'movie' | 'tv') => {
    if (filter === 'all') return items;
    return items.filter(item => item.type === filter);
  };

  return (
    <div className={`${styles.container} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.grid}>
          {Object.values(categoryConfig).map((config) => {
            const filteredItems = filterItems(categories[config.key], activeFilters[config.key]);

            return (
              <div key={config.key} className={styles.category}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{config.title}</h2>
                  <button
                    className={styles.filterButton}
                    onClick={() => toggleFilter(config.key)}
                  >
                    {activeFilters[config.key] === 'all' ? 'All' :
                     activeFilters[config.key] === 'movie' ? 'Movies' : 'TV Shows'}
                  </button>
                </div>

                <Droppable droppableId={config.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${styles.itemsGrid} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
                    >
                      {filteredItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${styles.itemCard} ${snapshot.isDragging ? styles.dragging : ''}`}
                              onClick={() => onItemClick(item, config.key)}
                            >
                              <div className={styles.posterContainer}>
                                <img
                                  src={item.poster}
                                  alt={item.title}
                                  className={styles.poster}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=No+Poster';
                                  }}
                                />
                                {item.score && (
                                  <div className={styles.score}>{item.score}</div>
                                )}
                              </div>
                              <div className={styles.itemTitle}>{item.title}</div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
