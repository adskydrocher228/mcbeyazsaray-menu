import { useEffect, useRef } from 'react';
import { CATEGORY_ICONS } from '../constants';
import styles from './ItemModal.module.css';

/** Split ingredient string by comma, trim each piece */
function parseIngredients(raw) {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export default function ItemModal({ item, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!item) return;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const icon = CATEGORY_ICONS[item.kategori] || '';
  const categoryLabel = (icon ? icon + ' ' : '') + (item.kategori || item.bolum);
  const ingredients = parseIngredients(item.icerik);

  return (
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-name"
    >
      <div className={styles.card}>

        {/* Close button */}
        <button ref={closeRef} className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
          ✕
        </button>

        {/* ── TOP SECTION ── */}
        <div className={styles.topSection}>
          {/* Category badge */}
          <div className={styles.badge}>{categoryLabel}</div>

          {/* Item name */}
          <h2 id="modal-item-name" className={styles.name}>{item.urun}</h2>

          {/* Variant tag e.g. "2 Kişilik" */}
          {item.varyant && (
            <span className={styles.variantTag}>{item.varyant}</span>
          )}
        </div>

        {/* ── DESCRIPTION BLOCK ── */}
        {item.aciklama && (
          <div className={styles.descriptionBlock}>
            <svg className={styles.quoteIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
            </svg>
            <p className={styles.description}>{item.aciklama}</p>
          </div>
        )}

        {/* ── DIVIDER ── */}
        <div className={styles.divider} aria-hidden="true">
          <span className={styles.dividerLine} />
          <span className={styles.dividerChar}>❦</span>
          <span className={styles.dividerLine} />
        </div>

        {/* ── INGREDIENTS as CHIPS ── */}
        {ingredients.length > 0 && (
          <div className={styles.ingredientsSection}>
            <div className={styles.sectionHeader}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                <path d="M12 8v4l3 3"/>
              </svg>
              <h3 className={styles.sectionLabel}>İçindekiler</h3>
            </div>
            <div className={styles.chipsGrid}>
              {ingredients.map((ing, i) => (
                <span key={i} className={styles.chip} style={{ animationDelay: `${i * 40}ms` }}>
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── SERVICE NOTE ── */}
        {item.servisNotu && (
          <div className={styles.serviceNote}>
            <div className={styles.serviceNoteIcon} aria-hidden="true">🍽️</div>
            <div>
              <p className={styles.serviceNoteLabel}>Servis Notu</p>
              <p className={styles.serviceNoteText}>{item.servisNotu}</p>
            </div>
          </div>
        )}

        {/* ── PRICE FOOTER ── */}
        <div className={styles.priceRow}>
          <div className={styles.priceMeta}>
            <span className={styles.priceLabel}>Fiyat</span>
            <span className={styles.priceSeason}>2026 sezonu</span>
          </div>
          <span className={styles.price}>{item.fiyat || '—'}</span>
        </div>

      </div>
    </div>
  );
}
