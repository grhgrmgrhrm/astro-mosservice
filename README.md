# astro-mosservice

Сайт СТО «МосСервис» — специализированного сервиса по ремонту дизельных и бензиновых форсунок Common Rail, ТНВД и компьютерной диагностике в Минске.

## Технологии

- **Astro 5** — статическая генерация (`output: 'static'`)
- **TypeScript** (strict) — типизация контента через Content Collections + Zod
- **Tailwind CSS 3** — стилизация, кастомная тёмная тема
- **@fontsource/inter** — self-hosted шрифты (woff2, font-display: swap)
- **lucide-astro** — иконки
- **@astrojs/sitemap** — sitemap.xml
- **sharp** (dev) — генерация оптимизированных изображений

## Структура

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Header.astro         # Шапка + мобильное меню (a11y)
│   ├── Footer.astro         # Подвал + ContactWidget
│   ├── ServiceCard.astro    # Карточка услуги (card-изображения 480×320)
│   ├── SchemaOrg.astro      # JSON-LD: AutoRepair, Service, FAQ, Breadcrumb
│   ├── Breadcrumbs.astro    # Хлебные крошки + BreadcrumbList schema
│   ├── InternalLinks.astro  # Перелинковка между услугами
│   ├── ReviewsSlider.astro  # Слайдер отзывов
│   ├── ContactWidget.astro  # Блок контактов + мессенджеры + карты
│   └── Analytics.astro      # Яндекс.Метрика (заглушка-ID, цели на tel/мессенджеры/карты)
├── content/
│   ├── config.ts            # Zod-схема коллекции services
│   └── services/            # 14 markdown-статей услуг
├── data/
│   └── siteConfig.ts        # Единый источник реквизитов, телефонов, адреса, координат
├── layouts/
│   └── Layout.astro         # Базовый layout: head, SEO-метатеги, preload, skip-link
├── pages/
│   ├── index.astro          # Главная (hero, услуги, бренды, отзывы, FAQ)
│   ├── 404.astro            # Кастомная 404
│   ├── faq.astro            # 25 вопросов по категориям
│   ├── o-nas.astro          # О компании
│   ├── kontakty.astro       # Контакты + реквизиты + Яндекс-карта
│   └── uslugi/
│       ├── index.astro      # Каталог услуг с фильтром по категориям
│       └── [slug].astro     # Страница услуги (full-изображения 800×500)
└── styles/
    └── global.css           # Tailwind + prose-стили + a11y (skip-link, focus-visible)

public/
├── manifest.json            # PWA manifest
├── robots.txt               # + ссылка на sitemap
├── favicon.svg              # SVG-фавикон
├── favicon-32.png           # PNG-фавикон (32×32)
├── icons/                   # PWA-иконки (192, 512, 512-maskable, apple-touch-180)
└── images/
    ├── hero/                # hero-desktop.webp (1920×1080), hero-mobile.webp (800×1000)
    ├── og/                  # Open Graph изображения
    └── services/            # Оптимизированные картинки услуг
        ├── *-card.webp      # 480×320 — для карточек (ServiceCard)
        ├── *-full.webp      # 800×500 — для страниц услуг
        ├── logo_*-sm.webp   # 200×140 — для блока брендов
        └── _originals/      # Бэкап оригиналов

scripts/
├── generate-icons.mjs           # Генерация PWA-иконок из SVG (через sharp)
└── optimize-service-images.mjs  # Обрезка и оптимизация картинок услуг
```

## Команды

```bash
npm install          # Установка зависимостей
npm run dev          # Dev-сервер (http://localhost:4321)
npm run build        # Сборка в dist/
npm run preview      # Предпросмотр сборки
```

## Перегенерация изображений

После замены картинок услуг в `public/images/services/_originals/`:

```bash
node scripts/optimize-service-images.mjs   # Картинки услуг (-card, -full, logo-sm)
node scripts/generate-icons.mjs            # PWA-иконки
```

## SEO-инфраструктура

- **Sitemap** — автогенерация через `@astrojs/sitemap` (sitemap-index.xml)
- **robots.txt** — `Allow: /` + ссылка на sitemap
- **Schema.org JSON-LD** — `AutoRepair`, `Service` (с `Offer`), `FAQPage`, `BreadcrumbList`
- **Open Graph** + **Twitter Card** — `og:image:width/height/alt`, `og:site_name`, `og:locale=ru_RU`
- **Canonical** — на каждой странице
- **Prefetch** — `prefetchAll: true`, `defaultStrategy: 'hover'`

## PWA

- `manifest.json` — standalone, тема `#0b0f19`, иконки 192/512/maskable
- `apple-touch-icon` (180×180)
- `theme-color` в `<head>`

## Производительность (Core Web Vitals)

- **Шрифты** — self-hosted через `@fontsource/inter` (6 весов woff2, swap), без Google Fonts CDN
- **Hero** — адаптивный `srcset` (desktop 1920×1080 / mobile 800×1000) + `preload` + `fetchpriority="high"`
- **Картинки услуг** — 2 версии под размер контейнера: `-card` (480×320) и `-full` (800×500)
- **`width`/`height`** на всех `<img>` — устранение CLS
- **`loading="lazy"`** на некритичных изображениях

## Доступность (a11y, WCAG 2.1)

- Skip-link «Перейти к основному содержимому»
- `focus-visible` стили (оранжевый outline)
- `aria-current="page"` на активном пункте меню
- Мобильное меню с `aria-expanded`, `aria-controls`, закрытие по Escape
- Семантический HTML: `<header>`, `<main>`, `<nav>`, `<article>`, `<aside>`, `<footer>`

## Аналитика

- **Яндекс.Метрика** — компонент `Analytics.astro` с заглушкой-ID
- **Цели** (через `reachGoal`): `click_phone`, `click_messenger`, `click_map`
- **Активация:** заменить `YANDEX_METRIKA_ID` в `src/components/Analytics.astro` на реальный номер счётчика

## Важно: единый источник данных

Все реквизиты, телефоны, адрес, координаты, режим работы — в `src/data/siteConfig.ts`.
При изменении данных обновлять **только** этот файл + статьи в `src/content/services/` (телефон и режим работы в футере статей).

## Контент

- **14 услуг** — markdown-статьи в `src/content/services/` с Zod-схемой
- **25 FAQ** — в `src/pages/faq.astro`
- **12 отзывов** — в `src/components/ReviewsSlider.astro`
- **Черновики статей** — `articles/` (не подключены к сайту, задел на блог)
