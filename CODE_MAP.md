# CODE_MAP — ESOSH marketing site

## Назначение
Публичный двуязычный сайт ассоциации ESOSH: миграция с [esosh.net](https://www.esosh.net/) + staff-кабинет `/admin` (замена Webflow CMS). Хостинг — Vercel.

## Stack
- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4, next-intl, zod
- Admin CMS: Neon Postgres (Drizzle) + Vercel Blob
- Package manager: npm
- Tests: Node.js `node:test` (`tests/site.test.mjs`)

## Архитектурные потоки
1. Публичная страница: `src/app/[locale]/**/page.tsx` → `getPage()` dual-read → CMS blocks **или** legacy `src/content/pages/{uk|en}/**`
2. Layout подключает reference CSS + `NextIntlClientProvider` (`nav`, `contact`) + `BinotelWidgets`
3. Chrome: `Header` / `Footer` → footer читает `site_settings` (fallback на `SITE`)
4. Контакты: `ContactForm` → `POST /api/contact` → zod → `deliverContact` (webhook)
5. Форма вступу: `/join/apply` → `EnrollmentForm` → `POST /api/enrollment` → Neon `applications`/`members` + private Blob; адмін `/admin/applications`
6. Admin: `/admin` shell → session cookie → `/api/admin/*` → Neon/Blob
7. Binotel: GetCall + chat widgets с `widgets.binotel.com`

## Точки входа
| Вход | Путь |
|---|---|
| Locale layout | `src/app/[locale]/layout.tsx` |
| Page loader (dual-read) | `src/content/get-page.ts` |
| Route registry (legacy) | `src/content/page-loaders.ts` |
| Contact API | `src/app/api/contact/route.ts` |
| Enrollment API | `src/app/api/enrollment/**` |
| Enrollment classify / quiz | `src/lib/enrollment/**` |
| Admin UI | `src/app/admin/**` |
| Admin API | `src/app/api/admin/**` |
| DB schema | `src/db/schema.ts` |
| Binotel widgets | `src/components/BinotelWidgets.tsx` + `src/lib/binotel.ts` |
| i18n routing | `src/i18n/routing.ts` |
| Site constants (fallback) | `src/lib/site.ts` (`SITE`, `ROUTES`) |
| Runtime contacts | `src/lib/site-settings.ts` |

## Источники истины
| Concern | Location |
|---|---|
| Legacy тело страниц | `src/content/pages/{uk,en}/**` |
| CMS pages / news | Neon `pages`, `news_posts` |
| Metadata / sitemap inventory | `src/content/page-metadata.json` (+ CMS news in `sitemap.ts`) |
| Media inventory (legacy) | `src/content/media-manifest.json` |
| Uploaded media | Vercel Blob + `media_assets` |
| Nav / form UI strings | `messages/{uk,en}.json` (`nav`, `contact`) |
| Footer markup | `src/content/chrome/**` |
| Visual parity CSS | `src/styles/reference.css` (+ navigation/contact/refinements) |
| Admin UI CSS | `src/app/admin/admin.css` |
| Contact validation | `src/lib/contact.ts` |
| Contact delivery | `src/lib/contact/deliver-contact.ts` |
| Enrollment form | `src/components/EnrollmentForm.tsx` + `src/styles/enrollment.css` |
| Enrollment schema / classify / files / notify | `src/lib/enrollment/**` |
| Applications / members | Neon `applications`, `members`, `application_files`, `application_events` |
| Binotel widget URLs | `src/lib/binotel.ts` |
| Phones / social fallback | `src/lib/site.ts` |
| PDF docs | `public/docs/*-{uk\|en}.pdf` |
| Local media | `public/images/**` |

## Публичные контракты
- Locales: `uk` (default, no prefix), `en` (`/en/...`), `localeDetection: false`
- Routes: зеркало slug esosh.net; список — `page-loaders` / `page-metadata`; CMS может перекрыть маршрут после publish
- Contact API body: `{ name, email, message, locale?, company? }`
  - honeypot `company` → `{ ok: true }` без доставки
  - invalid → 400; bad origin → 403; unavailable webhook → 503; delivery fail → 502
- Enrollment: `POST /api/enrollment` multipart (`payload` JSON + files); `POST /api/enrollment/preview`; success = запис у Neon (листи — best-effort webhook)
- Admin: `/admin/login`, session cookie `esosh_admin_session`, roles `admin` | `editor`
- Env: `NEXT_PUBLIC_SITE_URL`, `CONTACT_WEBHOOK_*`, `ENROLLMENT_WEBHOOK_*` (опц., fallback на contact), `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_SESSION_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_PASSWORD` (см. `.env.example`)
- Binotel: публичные widget URLs на `widgets.binotel.com`

## Проверки
- `npm run lint`
- `npm run build`
- `npm test` (после build; поднимает `next start` + mock webhook)
- `npm run db:push` — применить схему на Neon

## Инварианты
- Нет ложного успеха формы без webhook
- Нет Webflow runtime-скриптов в HTML
- Binotel GetCall + chat присутствуют (паритет live)
- Без `DATABASE_URL` публичный сайт работает на legacy TSX / `SITE` fallback; админка показывает unavailable
- Honeypot и contact API не ослабляются админкой
- Sitemap покрывает все записи `page-metadata.json` (+ опционально CMS news)

## Известные пробелы (продукт)
1. Доставка контактної форми не налаштована без `CONTACT_WEBHOOK_URL`
2. EN-копія UI форми вступу (реліз 1 — українською; маршрут `/en/join/apply` уже є)
3. Текст питань тесту Кодексу — v1-заглушка; замінити офіційним банком ESOSH
4. Кастомний домен через Wix — окремо
