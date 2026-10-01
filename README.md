# Veebiraamistike API

See on valmis Cloudflare Worker + D1 API. Muuda näidisandmed enda sündmusteks ja juuruta API oma Cloudflare'i kontole.

## Enne alustamist

Sul on vaja:

- Node.js-i ja npm-i;
- GitHubi kontot;
- tasuta Cloudflare'i kontot.

Kui sul ei ole Cloudflare'i kontot:

1. ava [Cloudflare'i konto loomine](https://dash.cloudflare.com/sign-up);
2. sisesta e-posti aadress ja parool;
3. vajuta **Create Account**;
4. ava Cloudflare'i saadetud kiri ja kinnita oma e-posti aadress.

## Mis on Wrangler?

Wrangler on Cloudflare'i käsureatööriist. Selle abil käivitame API kohapeal, loome D1 andmebaasi ja juurutame Workeri.

Wranglerit ei ole vaja arvutisse eraldi globaalselt paigaldada. See on selle projekti `package.json` failis olemas ja käsk `npm install` paigaldab selle projekti sisse.

## 1. Paigalda projekt

```bash
npm install
```

Kontrolli, et Wrangler paigaldati:

```bash
npx wrangler --version
```

Tulemuseks peab olema versiooninumbriga rida.

## 2. Asenda näidisandmed

Ava `migrations/0001_create_events.sql` ja asenda `INSERT INTO events` järel olevad näidisread oma sündmustega.

Pane sündmuste pildid kausta `public/images/`. Kirjuta andmetesse pildi tee kujul:

```text
/images/minu-pilt.webp
```

Vähemalt üks sündmus võib olla ilma pildita. Selle `image_url` väärtus on `NULL`.

## 3. Käivita kohapeal

```bash
npm run db:local
npm run dev
```

Ava <http://localhost:8787/api/events>.

## 4. Loo enda andmebaas

Logi Wrangleriga enda Cloudflare'i kontole:

```bash
npx wrangler login
```

Käsk avab brauseris Cloudflare'i sisselogimise. Logi sisse ja luba Wranglerile juurdepääs.

Kui brauseriga sisselogimine ei lõpe edukalt, kasuta:

```bash
npx wrangler login --device
```

Kontrolli sisselogimist:

```bash
npx wrangler whoami
```

Seejärel loo andmebaas:

```bash
npx wrangler d1 create events-db
```

Kui Wrangler küsib **Would you like Wrangler to add it on your behalf?**, vasta `No` (`N`). D1 sidumine on `wrangler.jsonc`-is juba olemas.

Kui vastasid enne seda kogemata `Yes`, sisesta sidumise nimeks `DB`, mitte vaikeväärtust `events_db`: API kood kasutab binding-ut nimega `DB`. Kohaliku arenduse küsimusele **For local dev, do you want to connect to the remote resource instead of a local resource?** vasta `No` (`N` või Enter).

Kopeeri käsu väljundist `database_id` faili `wrangler.jsonc` rea `ASENDA_OMA_DATABASE_ID` asemele.

Kontrolli, et `wrangler.jsonc`-is on ainult üks D1 sidumine ja selle nimi on `DB`.

## 5. Juuruta

```bash
npm run db:remote
npm run deploy
```

Wrangler kuvab API aadressi. Kontrolli seda, lisades lõppu `/api/events`:

```text
https://events-api.SINU-ALAMDOMEEN.workers.dev/api/events
```

## Mida võib muuta?

Seminaris 3 muuda ainult:

- `migrations/0001_create_events.sql` sündmuste ridu;
- `public/images/` pilte;
- `wrangler.jsonc` välja `database_id`.

Ära muuda veel faili `src/index.ts`. API loomise, muutmise ja kustutamise lõpp-punkte kasutame seminaris 5.
