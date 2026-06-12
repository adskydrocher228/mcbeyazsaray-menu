import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { parseMenuCSV, groupBy } from './utils';
import { CATEGORY_ICONS } from './constants';
import Header from './components/Header';
import DeptTabs from './components/DeptTabs';
import CategoryBar from './components/CategoryBar';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import ScrollToTop from './components/ScrollToTop';
import styles from './App.module.css';

export default function App() {
  const [allItems,       setAllItems]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeDept,     setActiveDept]     = useState('Mutfak');
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedItem,   setSelectedItem]   = useState(null);
  const [contentKey,     setContentKey]     = useState(0); // triggers fade animation

  // Load CSV once
  useEffect(() => {
    fetch('menu.csv')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(text => { setAllItems(parseMenuCSV(text)); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // When dept changes, reset category filter
  const handleDeptChange = useCallback((dept) => {
    setActiveDept(dept);
    setActiveCategory(null);
    setSearchQuery('');
    setContentKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // When category changes
  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setContentKey(k => k + 1);
  }, []);

  // Search
  const handleSearchChange = useCallback((q) => {
    setSearchQuery(q);
    setActiveCategory(null);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => setSelectedItem(null), []);

  // ── Derived data ─────────────────────────────────────────────
  const isSearching = searchQuery.trim().length > 0;

  // Items to display
  const displayedItems = useMemo(() => {
    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      return allItems.filter(i =>
        i.urun.toLowerCase().includes(q)     ||
        i.kategori.toLowerCase().includes(q) ||
        i.icerik.toLowerCase().includes(q)   ||
        i.bolum.toLowerCase().includes(q)
      );
    }
    let items = allItems.filter(i => i.bolum === activeDept);
    if (activeCategory) items = items.filter(i => i.kategori === activeCategory);
    return items;
  }, [allItems, activeDept, activeCategory, searchQuery, isSearching]);

  // Grouped by category
  const groupedItems = useMemo(() => groupBy(displayedItems, i => i.kategori || '—'), [displayedItems]);

  // Category list for the active dept
  const categories = useMemo(() => {
    const deptItems = allItems.filter(i => i.bolum === activeDept);
    return [...new Set(deptItems.map(i => i.kategori).filter(Boolean))];
  }, [allItems, activeDept]);

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
      />

      {/* Department tabs — hidden during search */}
      {!isSearching && (
        <DeptTabs activeDept={activeDept} onChange={handleDeptChange} />
      )}

      {/* Category pills — hidden during search */}
      {!isSearching && (
        <CategoryBar
          categories={categories}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />
      )}

      <main className={styles.main}>
        {/* Loading */}
        {loading && (
          <div className={styles.stateCenter}>
            <div className={styles.spinner} aria-hidden="true" />
            <p>Menü yükleniyor…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className={styles.stateCenter}>
            <p className={styles.errorMsg}>
              Menü yüklenirken hata oluştu.<br />
              <small>Lütfen sayfayı yenileyin.</small>
            </p>
          </div>
        )}

        {/* Search result header */}
        {isSearching && !loading && (
          <div className={styles.searchBanner}>
            <span>
              <strong>"{searchQuery}"</strong> için{' '}
              <strong>{displayedItems.length}</strong> sonuç bulundu
            </span>
            <button className={styles.clearSearchBtn} onClick={handleSearchClear}>
              Temizle ✕
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && displayedItems.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h2>Sonuç bulunamadı</h2>
            <p>Farklı bir arama terimi deneyin.</p>
          </div>
        )}

        {/* Menu sections */}
        {!loading && !error && (
          <div className={styles.sections} key={contentKey} aria-live="polite">
            {[...groupedItems.entries()].map(([cat, items], sectionIdx) => (
              <section
                key={cat}
                id={`section-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                className={styles.section}
                style={{ animationDelay: `${sectionIdx * 50}ms` }}
                aria-labelledby={`section-heading-${sectionIdx}`}
              >
                {/* Section Header */}
                <header className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle} id={`section-heading-${sectionIdx}`}>
                    {CATEGORY_ICONS[cat] && (
                      <span className={styles.sectionIcon}>{CATEGORY_ICONS[cat]}</span>
                    )}
                    {cat}
                  </h2>
                  <div className={styles.sectionOrnament} aria-hidden="true">✦ ✦ ✦</div>
                </header>

                {/* Items grid */}
                <div className={styles.grid} role="list">
                  {items.map((item, idx) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      searchQuery={isSearching ? searchQuery : ''}
                      onClick={setSelectedItem}
                      animDelay={idx * 35}
                    />
                  ))}
                </div>

                {/* Divider (not after last section) */}
                {sectionIdx < groupedItems.size - 1 && (
                  <div className={styles.divider} aria-hidden="true" />
                )}
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerOrnament} aria-hidden="true">— ❦ —</div>
        <p className={styles.footerNote}>
          Tüm fiyatlar 2026 sezonu için TL olarak belirtilmiştir.
        </p>
        <p className={styles.footerSub}>© 2026 MC Beyaz Saray Otel</p>
      </footer>

      {/* Detail Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={handleCloseModal} />
      )}

      {/* Scroll to top */}
      <ScrollToTop />
    </>
  );
}
