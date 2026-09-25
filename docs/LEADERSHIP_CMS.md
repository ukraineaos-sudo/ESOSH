# Керівний склад (CMS)

Адмінка: `/admin/content/leadership`  
Публіка: блок на `/about-esosh` і `/en/about-esosh` (`LeadershipSection`).

## Як користуватися
1. Додати / редагувати імʼя UK+EN, посаду UK+EN, фото (Медіа).
2. ↑↓ — порядок на сайті.
3. Статус **На сайті** / **Приховано**.
4. Видалення — підтвердження «так».

## БД
Таблиця `leadership_people`.  
Перший заповнення з legacy:

```bash
npm run db:seed-leadership
npm run db:seed-leadership -- --force   # перезаписати
```

Якщо таблиця порожня або БД недоступна — на сайті показується вбудований fallback (6 карток з захоплення).
