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
1. Публичная страница: `src/app/[locale]/**/page.tsx` → `getPage()` dual-read → CMS blocks **или** legacy `src/content/pages/{uk|en}/**` **или** `ContentTranslationPending` для новых локалей без тела
2. Layout подключает reference CSS + `NextIntlClientProvider` (`nav`, `contact`, `consent`, `enrollment`, `trainings`, `content`, `docs`) + `ConsentProvider` + условный `BinotelWidgets`
3. Chrome: `Header` / `Footer` → footer читает `site_settings` (fallback на `SITE`); ссылки Privacy / Cookies / cookie settings
4. Контакты: `ContactForm` → `POST /api/contact` → zod (`privacyConsent: true`) → `deliverContact` (Brevo → иначе webhook)
5. Форма вступу: `/join/apply` → Turnstile gate → `EnrollmentForm` → `POST /api/enrollment` (+ `cf-turnstile-response`) → Neon `applications`/`members` + private Blob; адмін `/admin/applications`
6. Admin: `/admin` shell (sidebar + sticky chrome) → session cookie → `/api/admin/*` → Neon/Blob
   - Live UX: header chip «нові заявки» polls `GET /api/admin/applications?status=new` ~30s (stops on 401); applications list same interval + `esosh:admin-apps-refresh` event
   - News CMS (Phase A–C): `/admin/content/news` = **єдиний каталог** новин; public `/news` + homepage = published **uk** `news_posts` (`listPublishedCmsNews` → `NEWS_CONTENT_LOCALE`); UI-локаль лишається для chrome/посилань `/{locale}/news/{slug}`. Legacy TSX fallback лише **uk** для статей; не вимагаємо перекладів новин
   - Import: `npm run db:import-news` (`scripts/import-legacy-news.mjs`, docs `docs/NEWS_IMPORT.md`) — після імпорту всі TSX-статті в адмін-списку (edit/hide/delete як нові)
   - Leadership CMS: `/admin/content/leadership` → `leadership_people`; public About grid = `LeadershipSection` (DB published або legacy fallback). Seed: `npm run db:seed-leadership`
   - Pages CMS room **прихована** до WYSIWYG + імпорту; див. `docs/PAGES_CMS.md`; enrollment CRM statuses unchanged (`APPLICATION_STATUSES`)
7. Consent / cookies: first-party banner (`esosh_consent`); Binotel **только после** `communications === true`; YouTube embeds на тренінгах **только после** `marketing === true` (`YoutubeConsentEmbed`)
8. Trainings: `TrainingLesson` → sequential `modules[]` (YouTube + quiz each; anti forward-seek) → server score `POST /api/trainings/[slug]/score` ≥ `passThresholdPercent` + name confirm → certificate: **named PDF** when `courseCode` set (`POST` issue + `GET ?downloadToken=`, Neon `training_certificates`) else static locale PDF via pass token `GET ?token=`; video IDs may be empty until upload (`videoPending`)
9. Политики: `/privacy-policy`, `/cookie-policy` (uk+en) — типовые тексты UA/международные (по решению заказчика без отдельного юр. review)

## Точки входа
| Вход | Путь |
|---|---|
| Locale layout | `src/app/[locale]/layout.tsx` |
| Page loader (dual-read) | `src/content/get-page.ts` |
| Route registry (legacy) | `src/content/page-loaders.ts` |
| Contact API | `src/app/api/contact/route.ts` |
| Enrollment API | `src/app/api/enrollment/**` |
| Enrollment classify / quiz | `src/lib/enrollment/**` |
| Trainings catalog / quiz content | `src/content/trainings/**` |
| Training quiz UI / YouTube gate | `src/components/trainings/**` (`TrainingLesson`, `YoutubeConsentEmbed`, `TrainingQuiz`) |
| Training score / certificate API | `src/app/api/trainings/[slug]/{score,certificate}/route.ts` + `src/lib/trainings/**` |
| Training named PDF (runtime) | `src/lib/trainings/certificate-pdf.ts` + assets `public/assets/certificate/**` (pdf-lib + Noto Sans) |
| Training static cert PDFs (legacy) | `scripts/generate-training-certificate.py` → `public/docs/trainings/*` |
| Admin UI | `src/app/admin/**` |
| Admin API | `src/app/api/admin/**` |
| DB schema | `src/db/schema.ts` |
| Public consent | `src/lib/consent.ts` + `src/components/consent/**` |
| Binotel widgets | `src/components/BinotelWidgets.tsx` + `src/lib/binotel.ts` |
| i18n routing | `src/i18n/routing.ts` |
| Site constants (fallback) | `src/lib/site.ts` (`SITE`, `ROUTES`) |
| Runtime contacts | `src/lib/site-settings.ts` |

## Источники истины
| Concern | Location |
|---|---|
| Legacy тело страниц | `src/content/pages/{uk,en}/**` |
| CMS pages / news / leadership | Neon `pages`, `news_posts`, `leadership_people` (public news feed = published `news_posts` only) |
| Legacy news TSX (article fallback + import source) | `src/content/pages/{uk,en}/news/*.tsx` |
| Metadata / sitemap inventory | `src/content/page-metadata.json` (+ CMS news in `sitemap.ts`) |
| Media inventory (legacy) | `src/content/media-manifest.json` |
| Uploaded media | Vercel Blob + `media_assets` |
| Nav / form / consent / trainings / content / docs UI strings | `messages/{uk,en,de,es,fr,az,kk}.json` |
| Footer markup | `src/content/chrome/**` (uk chrome; EN chrome + `localePrefix` for all prefixed locales) |
| Visual parity CSS | `src/styles/reference.css` (+ navigation/contact/enrollment/consent/trainings/refinements) |
| Trainings listing + quiz copy | `src/content/trainings/**` (`tier`: basic\|professional; `trainingsListingCopy`; pages → `TrainingsCatalog`; `pickLocalized` — no silent fallback) |
| Admin UI CSS | `src/app/admin/admin.css` |
| Contact validation | `src/lib/contact.ts` (`appLocaleSchema`) |
| Contact delivery | `src/lib/contact/deliver-contact.ts` (Brevo `brevo-contact.ts`, webhook fallback) |
| Consent cookie / categories | `src/lib/consent.ts` (`CONSENT_POLICY_VERSION`, `PRIVACY_NOTICE_VERSION`) |
| Privacy / Cookie pages | `src/content/pages/{uk,en}/privacy-policy.tsx`, `cookie-policy.tsx` |
| Enrollment form | `src/components/EnrollmentCaptchaGate.tsx` + `EnrollmentForm.tsx` + `TurnstileWidget.tsx` + `src/styles/enrollment.css` |
| Turnstile verify | `src/lib/turnstile.ts` (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) |
| Enrollment schema / classify / files / notify / Brevo | `src/lib/enrollment/**` |
| Applications / members | Neon `applications`, `members`, `application_files`, `application_events` |
| Member registry filters/stats | `src/lib/admin/member-registry.ts` + `/admin/members` + `GET /api/admin/members` |
| Training certificates registry | `src/lib/admin/training-certificates.ts` + `/admin/certificates` + `GET|DELETE /api/admin/certificates` + `GET /api/admin/certificates/export` |
| Binotel widget URLs | `src/lib/binotel.ts` |
| Phones / social fallback | `src/lib/site.ts` |
| Locale path helpers | `src/lib/locale.ts` (`localizedPath`, `switchLocalePath`, `hasLegacyPageContent`) |
| PDF docs resolution | `src/lib/docs.ts` (`DOC_INVENTORY`, `resolveLocaleDoc`) + `LocaleDocLink`; naming `public/docs/README.md` |
| PDF files on disk | `public/docs/*-{locale}.pdf` (today: uk+en only); trainings certs `public/docs/trainings/*-certificate-{uk\|en}.pdf` |
| Local media | `public/images/**` |

## Публичные контракты
- Locales: `uk` (default, no prefix), `en` `/en/...`, `de` `/de/...`, `es` `/es/...`, `fr` `/fr/...`, `az` `/az/...`, `kk` `/kk/...`; `localeDetection: false`
- Full marketing TSX bodies: all `CONTENT_LOCALES` (`uk|en|de|es|fr|az|kk`) for core routes including education/trainings*; honest `ContentTranslationPending` only when a loader is still missing
- Routes: зеркало slug esosh.net; список — `page-loaders` / `page-metadata`; CMS может перекрыть маршрут после publish
  - Education trainings: `/education/trainings`, `/education/trainings/risk-assessment`, `/education/trainings/uav-attacks`, `/education/trainings/emergency-actions` (+ `/{locale}/...`); quiz/UI strings in `src/content/trainings/**`; certificate PDFs still uk+en only for shipped courses (`DOC_INVENTORY`; `emergency-actions` cert pending)
- Contact API body: `{ name, email, message, locale?, company?, privacyConsent: true }` (`locale` ∈ uk|en|de|es|fr|az|kk)
  - без `privacyConsent: true` → 400; honeypot `company` → `{ ok: true }` без доставки (згода не змінює honeypot-семантику)
  - delivery: Brevo (`BREVO_*` + `CONTACT_ADMIN_EMAIL` або `ENROLLMENT_ADMIN_EMAIL`) → інакше `CONTACT_WEBHOOK_*`
  - invalid → 400; bad origin → 403; unavailable (немає Brevo і webhook) → 503; delivery fail → 502
- Public consent cookie: `esosh_consent` (JSON categories + `version` + `ts`); mirror `localStorage`; bump `CONSENT_POLICY_VERSION` → banner знову
- `readConsentFromDocument` must return a **stable reference** (cached by raw string) — `useSyncExternalStore` getSnapshot; new object each call → React #185 / blank “This page couldn’t load”
- Privacy/Cookie pages: `/privacy-policy`, `/cookie-policy` (+ `/en/...`); типовые тексты UA / international
- Enrollment: `POST /api/enrollment` multipart (`payload` JSON + optional `attachment_*` files + optional `cf-turnstile-response`); legacy `photo` / `experience_*` / `diploma_*` / `certificate_*` ще приймаються; файли **не обов’язкові**; `POST /api/enrollment/preview`; success = запис у Neon (лист адміну — Brevo best-effort; інше — webhook)
  - якщо задано `TURNSTILE_SECRET_KEY` — обов’язковий успішний Cloudflare siteverify; інакше капча вимкнена (dev)
  - Blob файлів заявок: **private за замовчуванням**; `ENROLLMENT_BLOB_ACCESS=public` лише явно
  - `testAnswers` у payload **не** зберігаються (лише `testScore` + `quizVersion`); `testPassedAt` лише при score ≥ 100
  - існуючий `members.primaryEmail`: нова заявка лінкується до картки, **PII картки не overwrite** з публічної анкети (`created: false`, `existingMemberLinked`, `requiresManualReview`); дані лише в `applications.payload`
  - файли заявки: збережений `contentType` = sniff (pdf/jpeg/png); client MIME mismatch → `bad_type`; admin GET: `safeServeContentType` + `X-Content-Type-Options: nosniff`, без `text/html`
  - honeypot → `{ ok: true, honeypot: true }`; duplicate idempotency → `{ ok, duplicate, applicationPublicId, autoLevel, autoLevelLabelUk }`
- Admin: `/admin/login` (username + password), session cookie `esosh_admin_session`, roles `admin` | `editor`; зміна пароля `/admin/security` → `POST /api/admin/password` (мін. 8 символів; інші сесії відкликаються)
  - Блокування write-API через `mustChangePassword` **вимкнено за замовчуванням**; увімкнути: `ADMIN_ENFORCE_PASSWORD_CHANGE=1` → тоді POST/PATCH/PUT/DELETE → `403 password_change_required`; GET списки дозволені
  - **Не залишати admin/admin у production**
- Admin bootstrap: якщо `admin_users` порожня — створює користувача з `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` (default `admin` / `admin`, `must_change_password`); **не залишати admin/admin у production**
- Admin DELETE: `DELETE /api/admin/applications/[id]`, `DELETE /api/admin/members/[id]`, `DELETE /api/admin/news/[id]`, `DELETE /api/admin/certificates` — тіло `{ confirm: "так" }` (+ для сертифікатів `mode: one|course|all`); заявка каскадно чистить `application_files`/`application_events` (+ best-effort Blob); видалення члена лише відв’язує заявки (`member_id` → null), не видаляє їх; відкликання сертифіката не чіпає `training_certificate_counters`
- News public feed: `CmsNewsListItems` → `listPublishedCmsNews()` завжди **uk** CMS (`NEWS_CONTENT_LOCALE`); картки ведуть на `/{uiLocale}/news/{slug}`; без DB / порожня таблиця → порожній список
- News article (`/[locale]/news/[slug]`): тіло з uk CMS → uk legacy TSX; `ContentTranslationPending` для новин не показуємо, якщо uk існує; chrome Header/Footer з UI-локалі
- Home members stub: `HomeMembersStat` → `countJoinedMembers()` (усі рядки `members`); без DB → блок не рендериться
- News import: `npm run db:import-news` (+ `--dry-run` / `--upsert`); див. `docs/NEWS_IMPORT.md`; DELETE news = `{ confirm: "так" }`
- Pages CMS: UI вимкнено — критерії re-enable у `docs/PAGES_CMS.md`
- Admin members registry: `GET /api/admin/members?q&status&level&industry&oshFunctions&minOshYears` → `{ items, stats, facets }`; статистика рахується по **відфільтрованому** набору; профіль з `members.profile` + fallback з останньої заявки
- Admin application PATCH: `confirmed`/`confirmed_no_level` → member active; `rejected`/`needs_info` → demote member лише якщо немає іншої confirmed-заявки (`shouldDemoteMemberAfterApplicationDecision`)
- Admin CRM (applications/members/files/CSV): лише `canManageRegistry` (role `admin`); editor бачить контент, CRM nav/badge приховані
- Admin mutating POST/PATCH/PUT/DELETE: `assertSameOrigin` (`src/lib/http/same-origin.ts`); CSV export/members: `csvCell` formula-safe
- Rate limit (Neon `rate_limit_buckets`): login/contact/enrollment/preview/training_certificate/training_score → 429 + `Retry-After` (схема в `src/db/schema.ts`; міграції `drizzle/0002_*`…`0004_training_certificate_scores.sql` — `db:migrate` або `db:push`)
- Named training certificates: Neon `training_certificates` + `training_certificate_counters`; number `ESOSH-{CODE}-{YEAR}-{######}`; identity = `sha256(slug + NUL + normalizedName)` (anonymous, no memberId); quiz score stored at issue (`score`/`score_total`/`score_percent` from signed pass token); download via long-lived `downloadToken`; admin registry `/admin/certificates`
- Enrollment POST: compensating rollback (blobs + application cascade; orphan member лише якщо `created` у цьому запиті)
- News CMS: draft/deleted slug → `notFound()` без legacy TSX fallback (`getCmsNewsPresence`); DELETE = soft `status=deleted`
- Admin file GET: `/api/admin/applications/[id]/files/[fileId]?disposition=inline|attachment` (inline — перегляд у вкладці, attachment — збереження)
- Env: `NEXT_PUBLIC_SITE_URL`, `CONTACT_ADMIN_EMAIL` (опц., fallback `ENROLLMENT_ADMIN_EMAIL`), `CONTACT_WEBHOOK_*` (опц. fallback), `ENROLLMENT_WEBHOOK_*` (опц.), `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `ENROLLMENT_ADMIN_EMAIL`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `ENROLLMENT_BLOB_ACCESS` (опц., default private), `ADMIN_SESSION_SECRET` (docs; сесія = random token + SHA256 у БД), `ADMIN_BOOTSTRAP_USERNAME`, `ADMIN_BOOTSTRAP_PASSWORD`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, опц. `TRAINING_PASS_SECRET` (см. `.env.example`)
- Binotel: публичные widget URLs на `widgets.binotel.com`; **загрузка только после consent `communications`**
- YouTube (trainings): YouTube IFrame API + `youtube-nocookie` через `YoutubeConsentEmbed`; **только после consent `marketing`**; forward-seek limited; quiz locked until video end; score via `POST /api/trainings/[slug]/score` (answer keys server-only); named cert: `POST /api/trainings/[slug]/certificate` (pass token + name, same-origin) → `GET ?downloadToken=`; static cert courses: `GET ?token=` (HMAC pass token)
- Locale layout must pass client namespaces used by `"use client"` trees: `nav`, `contact`, `consent`, `enrollment`, `trainings`, `content`, `docs` (missing namespace → raw `namespace.key` in UI)
- Env для consent **не** потрібен (first-party cookie)
- Enrollment admin deep-link у Brevo: `resolveAdminOrigin()` — localhost → request origin; поки `esosh.net` на старому хості → `https://esosh.vercel.app/admin/...`
## Проверки
- `npm run lint`
- `npm run build`
- `npm test` (после build; поднимает `next start` + mock webhook; unit `tests/consent-parse.test.mjs`, `tests/security-hygiene.test.mjs`, `tests/audit-fix-wiring.test.mjs`)
- `npm run db:generate` — SQL-міграції з `src/db/schema.ts` у `drizzle/`
- `npm run db:migrate` — застосувати pending міграції (`drizzle-kit migrate`)
- `npm run db:push` — швидкий sync схеми на Neon без journal (dev); для rate limit / certificates у git — міграції `0002_*`, `0003_*`

## Инварианты
- Нет ложного успеха формы без webhook
- Нет Webflow runtime-скриптов в HTML
- Binotel GetCall + chat **не** в DOM без згоди `communications`
- YouTube iframe / player на тренінгах **не** в DOM без згоди `marketing`
- Training certificate: participation PDF after server-side quiz pass; named courses require Neon + pass token to issue, then `downloadToken` for PDF; UI marks participation (not qualification attestation); without `DATABASE_URL` named issue returns 503 (fail closed)
- Без `DATABASE_URL` публичный сайт работает на legacy TSX / `SITE` fallback; админка показывает unavailable; **лента /news и блок новостей на главной** при отсутствии DB — пустые (статьи `/news/{slug}` dual-read **uk** legacy лише якщо CMS-ряду uk немає)
- CMS news draft/deleted для slug → 404 (не воскрешає legacy TSX)
- Public news content locale = `uk` на всіх UI-локалях (kk/de/es/fr/az/en); переклади статей не потрібні
- Honeypot и contact API не ослабляются админкой
- Contact / enrollment без явної privacy-згоди не приймаються як валідні
- Sitemap покрывает все записи `page-metadata.json` (+ опционально CMS news)
- Після `db:import-news` CMS перекриває legacy для тих самих slug; URL не змінюються; unpublish/delete лишає slug «зайнятим»

## Известные пробелы (продукт)
1. Доставка контактної форми: Brevo (як заявки) або `CONTACT_WEBHOOK_URL`; без обох → 503
2. Текст питань тесту Кодексу — v1-заглушка; замінити офіційним банком ESOSH
3. Кастомний домен через Wix — окремо
4. Brevo Domains для `esosh.net` ще без DKIM/DMARC (deliverability warning у Brevo)
5. Security backlog — `docs/SECURITY_PLAN.md` (TOTP admin, rate limit, security tests на виході на ринок)
6. Pages CMS room прихована — потрібні WYSIWYG + імпорт/стратегія (`docs/PAGES_CMS.md`)
7. News locale residual: slug `z-dnem-budivelnika` є лише в EN (немає UK TSX у capture) — EN у DB/admin; UK-контент = окрема контентна задача
