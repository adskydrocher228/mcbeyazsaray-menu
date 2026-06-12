import styles from './DeptTabs.module.css';

const TABS = [
  {
    id: 'Mutfak',
    label: 'Mutfak',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M6 2v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2"/>
        <line x1="9" y1="11" x2="9" y2="22"/>
        <path d="M20 2v20M17 2c0 4.418 1.343 8 3 8"/>
      </svg>
    ),
  },
  {
    id: 'Bar',
    label: 'Bar',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M8 2h8M4 6h16M6 6l2 14h8l2-14M10 10v6M14 10v6"/>
      </svg>
    ),
  },
];

export default function DeptTabs({ activeDept, onChange }) {
  return (
    <nav className={styles.nav} aria-label="Bölüm seçimi">
      <div className={styles.wrapper}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`dept-tab-${tab.id.toLowerCase()}`}
            className={`${styles.tab} ${activeDept === tab.id ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
            aria-selected={activeDept === tab.id}
            role="tab"
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        {/* Sliding indicator */}
        <div
          className={styles.indicator}
          style={{ left: activeDept === 'Mutfak' ? '0%' : '50%' }}
          aria-hidden="true"
        />
      </div>
    </nav>
  );
}
