# Public documents (`public/docs`)

## Naming convention

Locale-specific PDFs use the suffix `-{locale}.pdf`:

| Document | Pattern |
|---|---|
| Code of conduct | `codex-{locale}.pdf` |
| ESOSH regulations | `terms-{locale}.pdf` |
| Public offer | `offer-{locale}.pdf` |
| Training certificates | `trainings/{slug}-certificate-{locale}.pdf` |

Supported `{locale}` values: `uk`, `en`, `de`, `es`, `fr`, `az`, `kk`.

## Inventory (source of truth in code)

Which files actually exist is tracked in `src/lib/docs.ts` → `DOC_INVENTORY`.

- Resolver: `resolveLocaleDoc(docId, locale)` — **never** silently serves another locale’s PDF.
- UI: `LocaleDocLink` shows an explicit “unavailable” state and lists available language links.

## Adding a new locale PDF

1. Place the file at the path matching the pattern above.
2. Add the locale to `DOC_INVENTORY[docId]` in `src/lib/docs.ts`.
3. Do **not** rely on falling back to `uk`/`en` while the UI is in another language.
