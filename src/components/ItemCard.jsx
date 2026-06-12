import { highlightText } from '../utils';
import styles from './ItemCard.module.css';

function HighlightedText({ text, query }) {
  if (!query || !text) return <>{text}</>;
  const parts = highlightText(text, query);
  return (
    <>
      {parts.map((p, i) =>
        p.highlighted ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>
      )}
    </>
  );
}

export default function ItemCard({ item, searchQuery, onClick, animDelay = 0 }) {
  const shortDesc = item.aciklama || item.icerik || '';

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(item); }
  };

  return (
    <article
      className={`${styles.card} ${item.servisNotu ? styles.hasNote : ''}`}
      onClick={() => onClick(item)}
      onKeyDown={handleKey}
      tabIndex={0}
      role="listitem"
      aria-label={`${item.urun}${item.fiyat ? ', ' + item.fiyat : ''}`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Gold left accent bar */}
      <div className={styles.accentBar} aria-hidden="true" />

      {/* Top row: name + price */}
      <div className={styles.top}>
        <h3 className={styles.name}>
          <HighlightedText text={item.urun} query={searchQuery} />
        </h3>
        {item.fiyat && (
          <span className={styles.price}>{item.fiyat}</span>
        )}
      </div>

      {/* Variant (e.g. "2 Kişilik") */}
      {item.varyant && (
        <p className={styles.variant}>{item.varyant}</p>
      )}

      {/* Short description / ingredients */}
      {shortDesc && (
        <p className={styles.desc}>
          <HighlightedText text={shortDesc} query={searchQuery} />
        </p>
      )}

      {/* Info icon hint */}
      <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
      </svg>
    </article>
  );
}
