import { useRef, useEffect } from 'react';
import { CATEGORY_ICONS } from '../constants';
import styles from './CategoryBar.module.css';

export default function CategoryBar({ categories, activeCategory, onChange }) {
  const barRef = useRef(null);
  const activePillRef = useRef(null);

  // Auto-scroll active pill into view
  useEffect(() => {
    if (activePillRef.current && barRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategory]);

  return (
    <nav className={styles.nav} aria-label="Kategori seçimi">
      <div className={styles.pills} ref={barRef} role="tablist">
        {/* "All" pill */}
        <button
          id="cat-pill-all"
          className={`${styles.pill} ${activeCategory === null ? styles.active : ''}`}
          onClick={() => onChange(null)}
          role="tab"
          aria-selected={activeCategory === null}
          ref={activeCategory === null ? activePillRef : null}
        >
          Tümü
        </button>

        {categories.map(cat => {
          const icon = CATEGORY_ICONS[cat] || '';
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              id={`cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              className={`${styles.pill} ${isActive ? styles.active : ''}`}
              onClick={() => onChange(cat)}
              role="tab"
              aria-selected={isActive}
              ref={isActive ? activePillRef : null}
            >
              {icon && <span className={styles.pillIcon}>{icon}</span>}
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
