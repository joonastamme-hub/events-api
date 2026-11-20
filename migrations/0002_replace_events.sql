DELETE FROM events;

INSERT INTO events (title, description, starts_at, location, tags, url, image_url) VALUES
  (
    'Mõisate saladused',
    'Giidiga retk, kus tutvume Raplamaa mõisakultuuri, mõisnike elu ja vanade hoonetega seotud lugudega.',
    '2026-09-19T12:00',
    'Alu mõis, Raplamaa',
    '["retk","mõisad","ajalugu"]',
    NULL,
    NULL
  ),
  (
    'Öine ajaloorännak Raplas',
    'Õhtune jalutuskäik läbi Rapla, kus avastame vanu hooneid, kadunud paiku ja kohaliku ajalooga seotud legende.',
    '2026-09-26T20:00',
    'Rapla keskväljak',
    '["ekskursioon","kodulugu","ajalugu"]',
    NULL,
    '/images/retk.png'
  ),
  (
    'Oma suguvõsa jälgedel',
    'Praktiline töötuba algajatele, kus õpime koostama sugupuud ning otsima esivanemate kohta teavet arhiiviallikatest.',
    '2026-10-10T11:00',
    'Rapla Kultuurikeskus',
    '["töötuba","genealoogia","arhiiv"]',
    NULL,
    NULL
  ),
  (
    'Eesti elu 1990ndatel',
    'Vestlusõhtu Eesti pöördelisest kümnendist: taasiseseisvumine, kroon, läänekaubad, popkultuur ja muutuv igapäevaelu.',
    '2026-10-24T18:00',
    'Rapla Kultuurikeskus',
    '["vestlusõhtu","lähiajalugu","Eesti"]',
    NULL,
    NULL
  );