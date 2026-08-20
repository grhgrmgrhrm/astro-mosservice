# AGENTS.md — конвенции проекта astro-mosservice

## Назначение

Сайт СТО «МосСервис» (ремонт форсунок Common Rail, ТНВД, диагностика в Минске).
Astro 5 + TypeScript (strict) + Tailwind 3. Статическая генерация (`output: 'static'`).

## Команды

```bash
npm run dev      # http://localhost:4321
npm run build    # сборка в dist/
npm run preview  # предпросмотр сборки
```

Перегенерация изображений (после замены исходников в `_originals/`):
```bash
node scripts/optimize-service-images.mjs   # картинки услуг → -card, -full, logo-sm
node scripts/generate-icons.mjs            # PWA-иконки
```

## Критичные конвенции

### Единый источник данных — `src/data/siteConfig.ts`

Все реквизиты, телефоны, адрес, координаты, режим работы, ссылки на карты/мессенджеры — **только** в этом файле.
Компоненты импортируют `siteConfig` и берут значения оттуда. Не хардкодить адрес/телефон в разметке.

При изменении режима работы или телефона:
1. Обновить `src/data/siteConfig.ts`
2. Обновить футер в markdown-статьях `src/content/services/*.md` (там телефон и часы работы продублированы текстом)
3. Проверить `SchemaOrg.astro` — `openingHoursSpecification` должен совпадать с `siteConfig.workingHoursIso`

### Изображения — 2 версии под размер контейнера

Картинки услуг хранятся в 3 вариантах (генерируются скриптом):
- `*-card.webp` (480×320) — для `ServiceCard` (карточки на главной и в каталоге)
- `*-full.webp` (800×500) — для страницы услуги `[slug].astro`
- `logo_*-sm.webp` (200×140) — для блока брендов
- Оригиналы — в `public/images/services/_originals/` (не используются на сайте)

Hero — адаптивный `srcset`:
- `hero-desktop.webp` (1920×1080)
- `hero-mobile.webp` (800×1000)
- `preload` в `<head>` только на главной (`type === 'home'`)

**Правило:** при добавлении новой картинки услуги — положить оригинал в `_originals/` и запустить `optimize-service-images.mjs`.
Не использовать оригиналы напрямую в `<img>` — только оптимизированные версии.

### Frontmatter услуг (`src/content/services/*.md`)

Zod-схема в `src/content/config.ts`:
```yaml
title: string
metaTitle?: string          # SEO-заголовок (если не задан — генерируется из title)
description: string         # SEO-описание
category: enum              # common-rail | gasoline | tnvd | brands | diagnostics | commercial
icon: string                # имя иконки lucide (default: Wrench)
image: string               # путь к картинке (используется в OG и как база для -card/-full)
featured: boolean           # показывать на главной (default: false)
priceFrom: string           # "от 45 BYN"
executionTime: string       # "от 2 часов"
relatedServices: string[]   # slug связанных услуг (для InternalLinks)
```

Поле `image` в frontmatter — путь к **оригиналу** (например `/images/services/01-common-rail.webp`).
Он используется для OG-превью. Компоненты конвертируют его в `-card`/`-full` через `image.replace(/\.webp$/, '-card.webp')`.

### SEO — что уже настроено

- Schema.org JSON-LD: `AutoRepair`, `Service` (с `Offer`), `FAQPage`, `BreadcrumbList` — в `SchemaOrg.astro` и `Breadcrumbs.astro`
- Open Graph + Twitter Card с `og:image:width/height/alt`, `og:site_name`, `og:locale=ru_RU`
- Canonical на каждой странице
- `robots: index, follow` в `Layout.astro`
- Sitemap через `@astrojs/sitemap`
- `prefetch` включён (`prefetchAll: true`, `hover`)

**aggregateRating в SchemaOrg** — оставлен по решению владельца. Google запрещает самовольный рейтинг без реальных отзывов на сторонних платформах. Если появятся реальные отзывы — заменить или убрать.

### Аналитика — `src/components/Analytics.astro`

Заглушка с `YANDEX_METRIKA_ID`. Активируется после замены на реальный номер счётчика.
Цели: `click_phone`, `click_messenger`, `click_map` (через `reachGoal`).

### a11y (WCAG 2.1)

- Skip-link в `Layout.astro` → `<main id="main-content">`
- `focus-visible` стили в `global.css`
- `aria-current="page"` на активном пункте меню (в `Header.astro`)
- Мобильное меню: `aria-expanded`, `aria-controls`, закрытие по Escape

## Что НЕ делать

- Не подключать `articles/` к сайту — это черновики, задел на будущий блог
- Не использовать Google Fonts CDN — шрифты self-hosted через `@fontsource/inter`
- Не использовать `astro:assets` `<Image>` — используется ручная оптимизация через `sharp` (скрипты в `scripts/`)
- Не хардкодить адрес/телефон/часы в компонентах — только через `siteConfig`
- Не добавлять `aggregateRating` в новые Schema.org-блоки без реальных отзывов

## Структура изображений (кратко)

```
public/images/
├── hero/
│   ├── hero-desktop.webp    # 1920×1080, ~84 KB
│   ├── hero-mobile.webp     # 800×1000, ~61 KB
│   └── hero.webp            # оригинал (281 KB, не используется)
├── og/                      # Open Graph картинки (оригиналы, для соцсетей)
└── services/
    ├── *-card.webp          # 480×320 — ServiceCard
    ├── *-full.webp          # 800×500 — [slug].astro
    ├── logo_*-sm.webp       # 200×140 — блок брендов
    └── _originals/          # бэкап оригиналов
```
