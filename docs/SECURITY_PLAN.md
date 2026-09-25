# План по безопасности ESOSH

Статус: рабочий backlog. Обновлять по мере закрытия пунктов.  
Контекст: международный публичный сайт + анкета с ПДн/документами + staff `/admin`.

## Сделано в коде (текущий спринт)

- [x] Санитизация CMS HTML перед публичным `dangerouslySetInnerHTML` (лёгкий allowlist без jsdom; isomorphic-dompurify убран — вешал compile/SSR)
- [x] Origin-check на `POST /api/admin/login`
- [x] Production: отказ создавать bootstrap-админа со слабым паролем (`admin` / &lt; 8 символов)
- [x] Production: запрет `ENROLLMENT_BLOB_ACCESS=public`
- [x] Enrollment upload: magic-byte sniff (JPEG/PNG/PDF), лимит **20 файлов** и **40 МБ суммарно** на заявку (поверх лимитов 5 МБ фото / 10 МБ документ)

## Предложенные лимиты (к внедрению)

### Rate limiting (п.2 аудита) — TODO

Рекомендация (на IP, скользящее окно; лучше Upstash Redis / Vercel WAF, не in-memory на serverless):

| Эндпоинт | Лимит | Окно |
|----------|-------|------|
| `POST /api/admin/login` | 5 попыток | 15 минут |
| `POST /api/contact` | 10 | 1 час |
| `POST /api/enrollment` | 5 | 1 час |
| `POST /api/enrollment/preview` | 30 | 1 час |

Ответ при превышении: `429` + `Retry-After`.  
Honeypot оставить. Логировать только факт 429 без PII тела.

### Upload (п.3) — частично закрыто

| Параметр | Значение | Статус |
|----------|----------|--------|
| Фото | ≤ 5 МБ, JPEG/PNG + magic | есть |
| Документ | ≤ 10 МБ, PDF/JPEG/PNG + magic | есть |
| Число файлов / заявка | ≤ 20 | **сделано** |
| Суммарный размер | ≤ 40 МБ | **сделано** |
| Срок хранения файлов/заявок | политика юриста + job очистки | TODO |
| Audit скачивания файлов в admin | лог who/when/fileId | TODO |

## Отложено по решению продукта

1. **Google Authenticator (TOTP) для admin** — после текущего парольного контура; обязателен перед широким международным приёмом заявок с документами.
2. **Security regression suite** (brute force, фейковая cookie, editor→admin-only, MIME spoof, CSRF, XSS CMS, чужой файл) — при выходе на рынок.
3. **Полный CSRF-token framework** — низкий приоритет при `SameSite=Lax` + Origin; пересмотреть вместе с TOTP.

## Остальной backlog (по ходу)

### Админ-периметр
- [ ] TOTP / Google Authenticator (см. выше)
- [ ] Rate limit login (таблица выше)
- [ ] Инвариант: каждый `/api/admin/*` кроме login вызывает `getAdminSession` (lint/тест-список routes)
- [ ] Audit log: login success/fail, CSV export, file download
- [ ] Session revoke all / «выйти везде» уже частично при смене пароля — проверить покрытие

### Публичные API / антиабуз
- [ ] Rate limit contact + enrollment (+ preview)
- [ ] Единый error envelope без утечки stack в неожиданных catch

### Файлы и ПДн
- [ ] Политика retention + периодическая очистка Blob/БД
- [ ] Запрет/алерт в CI если в env production выставлен public Blob
- [ ] Санитизация HTML также на **записи** в admin CMS (defense in depth)

### Контент / XSS
- [x] Sanitize на чтении/рендере
- [ ] Sanitize на записи admin API pages/news
- [ ] Ревью `ctaHref` в CMS (только http(s)/относительные пути)

### Ops / конфигурация
- [ ] Production: сильный `ADMIN_BOOTSTRAP_*`, смена пароля сразу
- [ ] Private Blob только; webhook/Brevo secrets не в логах
- [ ] DPA с Vercel / Neon / Blob / Brevo / Binotel (вне репо)
- [ ] Утверждённые Privacy/Cookie тексты (юрист) — см. `CODE_MAP.md`

### Тесты безопасности (выход на рынок)
- [ ] Фейковая / короткая cookie → 401
- [ ] Editor на admin-only → 403
- [ ] Enrollment bad signature / too many files → 400
- [ ] File GET без сессии / чужой id → 401/404
- [ ] Contact/enrollment bad Origin → 403
- [ ] CMS richText со script → вырезается в HTML

## Принятые допущения

- Middleware Edge проверяет только наличие cookie; доверие — к `getAdminSession` в API.
- «Взлом недопустим» = целевой уровень; гарантия абсолютной безопасности невозможна — снижаем вероятность и ущерб.

## История

- 2026-09-24 — создан план; закрыты sanitize CMS, origin login, weak bootstrap prod, public blob prod ban, upload magic + batch limits.
