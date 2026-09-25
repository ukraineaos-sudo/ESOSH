/**
 * Import legacy news TSX into Neon `news_posts`.
 *
 * Prerequisites: `DATABASE_URL` in `.env` (same as admin CMS).
 *
 * Commands (repo root):
 * ```bash
 * npm run db:import-news -- --dry-run   # parse only, no writes
 * npm run db:import-news                # insert missing uk/en articles
 * npm run db:import-news -- --upsert    # refresh content; keep draft status if already hidden
 * ```
 *
 * After import: open `/admin/content/news` — усі імпортовані записи зʼявляються в єдиному списку
 * («На сайті» / «Чернетка») і керуються як нові: редагування, приховування, видалення
 * (підтвердження словом «так»).
 *
 * Public `/news` and homepage read **published** rows from DB (newest first). Article URLs
 * `/news/{slug}` unchanged; CMS dual-read prefers DB over legacy TSX for the same slug.
 *
 * Without `DATABASE_URL`: public listings are empty (no crash); individual legacy article pages
 * still work via dual-read.
 *
 * Coverage (Phase C): script imports every `src/content/pages/{uk,en}/news/*.tsx`. Re-run is
 * idempotent (skip existing unless `--upsert`). Dry-run and import both print **locale parity**
 * gaps when a slug exists only in one language.
 *
 * Known residual (not an import failure): `en/z-dnem-budivelnika` has no UK TSX in the capture
 * from esosh.net — EN row is in DB/admin; UK counterpart was never in the repo. Adding UK
 * copy is a content task (new draft in NewsManager or new TSX + re-import), not a script bug.
 *
 * Do not leave unexplained «legacy-only» admin islands: after a successful import, the admin
 * news list is the catalog. Remaining TSX files are fallback for dual-read / re-import source.
 */
