CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  starts_at   TEXT    NOT NULL,
  location    TEXT    NOT NULL DEFAULT '',
  tags        TEXT    NOT NULL DEFAULT '[]',
  url         TEXT,
  image_url   TEXT
);

-- ASENDA NEED READ OMA SÜNDMUSTEGA.
-- Pildi tee vastab failile kaustas public/images/.
INSERT INTO events (title, description, starts_at, location, tags, url, image_url) VALUES
  (
    'TypeScripti töötuba',
    'Praktiline töötuba TypeScripti põhimõtetest.',
    '2026-10-01T17:30',
    'Haapsalu kolledž, arvutiklass 204',
    '["IT","TypeScript","töötuba"]',
    'https://www.tlu.ee/haapsalu',
    '/images/typescripti-tootuba.svg'
  ),
  (
    'Külalisloeng UX-ist',
    'Disainer ja arendaja räägivad koostööst.',
    '2026-10-14T18:00',
    'Haapsalu kolledž, auditoorium 101',
    '["UX","loeng"]',
    NULL,
    '/images/ux-loeng.svg'
  ),
  (
    'Tudengiprojektide näitus',
    'Semestri projektide avalik esitlus.',
    '2026-12-10T16:00',
    'Haapsalu kolledži fuajee',
    '["näitus","tudengielu"]',
    NULL,
    NULL
  );
