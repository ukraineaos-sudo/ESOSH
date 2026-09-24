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
2. Layout подключает reference CSS + `NextIntlClientProvider` (`nav`, `contact`, `consent`) + `ConsentProvider` + условный `BinotelWidgets`
3. Chrome: `Header` / `Footer` → footer читает `site_settings` (fallback на `SITE`); ссылки Privacy / Cookies / cookie settings
4. Контакты: `ContactForm` → `POST /api/contact` → zod (`privacyConsent: true`) → `deliverContact` (webhook)
5. Форма вступу: `/join/apply` → `EnrollmentForm` → `POST /api/enrollment` → Neon `applications`/`members` + private Blob; адмін `/admin/applications`
6. Admin: `/admin` shell (sidebar + sticky chrome) → session cookie → `/api/admin/*` → Neon/Blob
   - Live UX: header chip «нові заявки» polls `GET /api/admin/applications?status=new` ~30s (stops on 401); applications list same interval + `esosh:admin-apps-refresh` event
   - Pages CMS room hidden until separate TZ; enrollment CRM statuses unchanged (`APPLICATION_STATUSES`)
7. Consent / cookies: first-party banner (`esosh_consent`); Binotel **только после** `communications === true`
8. Политики: `/privacy-policy`, `/cookie-policy` (uk+en) — draft pending legal review

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
| Public consent | `src/lib/consent.ts` + `src/components/consent/**` |
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
| Nav / form / consent UI strings | `messages/{uk,en}.json` (`nav`, `contact`, `consent`) |
| Footer markup | `src/content/chrome/**` |
| Visual parity CSS | `src/styles/reference.css` (+ navigation/contact/enrollment/consent/refinements) |
| Admin UI CSS | `src/app/admin/admin.css` |
| Contact validation | `src/lib/contact.ts` |
| Contact delivery | `src/lib/contact/deliver-contact.ts` |
| Consent cookie / categories | `src/lib/consent.ts` (`CONSENT_POLICY_VERSION`, `PRIVACY_NOTICE_VERSION`) |
| Privacy / Cookie pages | `src/content/pages/{uk,en}/privacy-policy.tsx`, `cookie-policy.tsx` |
| Enrollment form | `src/components/EnrollmentForm.tsx` + `src/styles/enrollment.css` |
| Enrollment schema / classify / files / notify / Brevo | `src/lib/enrollment/**` |
| Applications / members | Neon `applications`, `members`, `application_files`, `application_events` |
| Member registry filters/stats | `src/lib/admin/member-registry.ts` + `/admin/members` + `GET /api/admin/members` |
| Binotel widget URLs | `src/lib/binotel.ts` |
| Phones / social fallback | `src/lib/site.ts` |
| PDF docs | `public/docs/*-{uk\|en}.pdf` |
| Local media | `public/images/**` |

## Публичные контракты
- Locales: `uk` (default, no prefix), `en` (`/en/...`), `localeDetection: false`
- Routes: зеркало slug esosh.net; список — `page-loaders` / `page-metadata`; CMS может перекрыть маршрут после publish
- Contact API body: `{ name, email, message, locale?, company?, privacyConsent: true }`
  - без `privacyConsent: true` → 400; honeypot `company` → `{ ok: true }` без доставки (згода не змінює honeypot-семантику)
  - invalid → 400; bad origin → 403; unavailable webhook → 503; delivery fail → 502
- Public consent cookie: `esosh_consent` (JSON categories + `version` + `ts`); mirror `localStorage`; bump `CONSENT_POLICY_VERSION` → banner знову
- Privacy/Cookie pages: `/privacy-policy`, `/cookie-policy` (+ `/en/...`); статус текстів: **draft pending legal review**
- Enrollment: `POST /api/enrollment` multipart (`payload` JSON + files); `POST /api/enrollment/preview`; success = запис у Neon (лист адміну — Brevo best-effort; інше — webhook)
  - Blob файлів заявок: **private за замовчуванням**; `ENROLLMENT_BLOB_ACCESS=public` лише явно
  - `testAnswers` у payload **не** зберігаються (лише `testScore` + `quizVersion`); `testPassedAt` лише при score ≥ 100
  - honeypot → `{ ok: true, honeypot: true }`; duplicate idempotency → `{ ok, duplicate, applicationPublicId, autoLevel, autoLevelLabelUk }`
- Admin: `/admin/login` (username + password), session cookie `esosh_admin_session`, roles `admin` | `editor`; зміна пароля `/admin/security` → `POST /api/admin/password` (мін. 8 символів; інші сесії відкликаються)
  - Поки `mustChangePassword`: write-API (`POST/PATCH/PUT/DELETE`) → `403 password_change_required`; GET списки дозволені
  - **Не залишати admin/admin у production**
- Admin bootstrap: якщо `admin_users` порожня — створює користувача з `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` (default `admin` / `admin`, `must_change_password`); **не залишати admin/admin у production**
- Admin DELETE: `DELETE /api/admin/applications/[id]` і `DELETE /api/admin/members/[id]` — тіло `{ confirm: "так" }`; заявка каскадно чистить `application_files`/`application_events` (+ best-effort Blob); видалення члена лише відв’язує заявки (`member_id` → null), не видаляє їх
- Admin members registry: `GET /api/admin/members?q&status&level&industry&oshFunctions&minOshYears` → `{ items, stats, facets }`; статистика рахується по **відфільтрованому** набору; профіль з `members.profile` + fallback з останньої заявки
- Admin application PATCH: `confirmed`/`confirmed_no_level` → member active; `rejected`/`needs_info` → member знову `candidate` (level null)
- Admin file GET: `/api/admin/applications/[id]/files/[fileId]?disposition=inline|attachment` (inline — перегляд у вкладці, attachment — збереження)
- Env: `NEXT_PUBLIC_SITE_URL`, `CONTACT_WEBHOOK_*`, `ENROLLMENT_WEBHOOK_*` (опц.), `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, `ENROLLMENT_ADMIN_EMAIL`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `ENROLLMENT_BLOB_ACCESS` (опц., default private), `ADMIN_SESSION_SECRET` (docs; сесія = random token + SHA256 у БД), `ADMIN_BOOTSTRAP_USERNAME`, `ADMIN_BOOTSTRAP_PASSWORD` (см. `.env.example`)
- Binotel: публичные widget URLs на `widgets.binotel.com`; **загрузка только после consent `communications`**
- Env для consent **не** потрібен (first-party cookie)

## Проверки
- `npm run lint`
- `npm run build`
- `npm test` (после build; поднимает `next start` + mock webhook; unit `tests/consent-parse.test.mjs`)
- `npm run db:push` — применить схему на Neon

## Инварианты
- Нет ложного успеха формы без webhook
- Нет Webflow runtime-скриптов в HTML
- Binotel GetCall + chat **не** в DOM без згоди `communications`
- Без `DATABASE_URL` публичный сайт работает на legacy TSX / `SITE` fallback; админка показывает unavailable
- Honeypot и contact API не ослабляются админкой
- Contact / enrollment без явної privacy-згоди не приймаються як валідні
- Sitemap покрывает все записи `page-metadata.json` (+ опционально CMS news)
- Тексти Privacy/Cookie — draft; не маркетинг «GDPR compliant» до review юриста

## Чеклист для юриста ESOSH (після деплою draft)
1. Підтвердити найменування контролера, адресу, ЄДРПОУ / реєстраційні дані в Privacy.
2. Підтвердити строки зберігання заявок і контактних звернень.
3. Підтвердити класифікацію Binotel і наявність договорів із провайдерами (Vercel, Neon, Blob, Brevo, Binotel).
4. Замінити draft-дисклеймер на затверджені тексти; bump `PRIVACY_NOTICE_VERSION` / `CONSENT_POLICY_VERSION`.

## Известные пробелы (продукт)
1. Доставка контактної форми не налаштована без `CONTACT_WEBHOOK_URL`
2. EN-копія UI форми вступу (реліз 1 — українською; маршрут `/en/join/apply` уже є)
3. Текст питань тесту Кодексу — v1-заглушка; замінити офіційним банком ESOSH
4. Кастомний домен через Wix — окремо
5. Brevo Domains для `esosh.net` ще без DKIM/DMARC (deliverability warning у Brevo)
6. Privacy/Cookie тексти — **draft pending legal review** (див. чеклист вище)
