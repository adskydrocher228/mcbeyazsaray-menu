/**
 * parseMenuCSV — robust CSV parser for menu.csv
 * Handles quoted fields, embedded commas, and embedded newlines.
 */
export function parseMenuCSV(rawText) {
  const rows = tokenizeCSV(rawText);
  const items = [];

  for (const row of rows) {
    if (!row || row.length < 4) continue;
    const [pos, bolum, kategori, urun, varyant, icerik, aciklama, servisNotu, fiyat] = row;
    const posNum = parseInt(pos, 10);
    if (isNaN(posNum)) continue;
    if (!urun || urun.trim() === '') continue;
    if (!bolum || bolum.trim() === '') continue;

    items.push({
      id:         posNum,
      bolum:      bolum.trim(),
      kategori:   (kategori || '').trim(),
      urun:       urun.trim(),
      varyant:    (varyant || '').trim(),
      icerik:     (icerik || '').trim(),
      aciklama:   (aciklama || '').trim(),
      servisNotu: (servisNotu || '').trim(),
      fiyat:      normalizeFiyat(fiyat),
    });
  }

  return items;
}

function normalizeFiyat(raw) {
  if (!raw) return '';
  const s = raw.trim().replace(/\s*TL\s*$/, '').trim();
  return s ? s + ' TL' : '';
}

function tokenizeCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += ch; i++; continue;
    }

    if (ch === '"')  { inQuotes = true; i++; continue; }
    if (ch === ',')  { row.push(field); field = ''; i++; continue; }
    if (ch === '\r' && text[i + 1] === '\n') {
      row.push(field); rows.push(row); row = []; field = ''; i += 2; continue;
    }
    if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = ''; i++; continue;
    }
    field += ch; i++;
  }
  if (field || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

/** Group items array by a key function */
export function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

/** Highlight query substring in text, returns array of {text, highlighted} */
export function highlightText(text, query) {
  if (!query || !text) return [{ text: text || '', highlighted: false }];
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return [{ text, highlighted: false }];
  return [
    { text: text.slice(0, idx), highlighted: false },
    { text: text.slice(idx, idx + query.length), highlighted: true },
    ...highlightText(text.slice(idx + query.length), query),
  ];
}
