import styles from './Header.module.css';

// SVG Crown logo recreated to match the printed menu
function CrownSVG() {
  return (
    <svg
      className={styles.crownSvg}
      viewBox="0 0 90 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Crown shape */}
      <path
        d="M45 4 L57 24 L76 10 L69 34 L21 34 L14 10 L33 24 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Base lines */}
      <line x1="21" y1="34" x2="69" y2="34" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="23" y1="39" x2="67" y2="39" stroke="currentColor" strokeWidth="1.2"/>
      {/* Jewel dots */}
      <circle cx="45" cy="4"  r="2.5" fill="currentColor"/>
      <circle cx="76" cy="10" r="2.5" fill="currentColor"/>
      <circle cx="14" cy="10" r="2.5" fill="currentColor"/>
    </svg>
  );
}

export default function Header({ searchQuery, onSearchChange, onSearchClear }) {
  return (
    <header className={styles.header} id="top">
      {/* Decorative texture overlay */}
      <div className={styles.texture} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoMark} aria-label="MC Beyaz Saray">
          <CrownSVG />
          <span className={styles.monogram}>MC</span>
        </div>

        {/* Titles */}
        <div className={styles.titles}>
          <div className={styles.ornamentLine} aria-hidden="true">
            <span className={styles.ornamentChar}>❦</span>
            <span className={styles.yearLabel}>2026 Menü</span>
            <span className={styles.ornamentChar}>❦</span>
          </div>

          <h1 className={styles.hotelName}>MC Beyaz Saray</h1>
          <p className={styles.tagline}>Otel Restoranı & Bar</p>
        </div>

        {/* Search */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="menu-search"
              type="search"
              className={styles.searchInput}
              placeholder="Yemek veya içecek ara…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              autoComplete="off"
              aria-label="Menüde ara"
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                onClick={onSearchClear}
                aria-label="Aramayı temizle"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
