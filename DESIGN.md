---
name: DamTap
description: "Тёплый рисованный маркетплейс еды со скидкой в Астане; реализация утверждённого макета."
colors:
  primary: "#006F73"
  primary-dark: "#005558"
  sky: "#00BFFF"
  sky-soft: "#D9F3FB"
  green: "#32CD32"
  green-soft: "#E3F7E0"
  cream: "#F7FBF5"
  text: "#12302F"
  text-muted: "#6B7F7E"
  discount: "#FF7A1A"
  white: "#FFFFFF"
  ink: "#101C29"
  muted-readable: "#526765"
  sale-text: "#B73E00"
  sale-soft: "#FFF2DA"
  discount-text: "#4D2000"
  step: "#4F8500"
  border: "#DCE6DF"
  offers: "#EEF8E9"
  business: "#B7ECFA"
  overlay: "#12302F80"
typography:
  display:
    fontFamily: "Caveat, cursive"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Nunito, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Nunito, sans-serif"
    fontSize: "16px"
    lineHeight: 1.55
  label:
    fontFamily: "Nunito, sans-serif"
    fontSize: "14px"
    fontWeight: 800
  hero-body:
    fontFamily: "Nunito, sans-serif"
    fontSize: "17px"
    lineHeight: 1.55
  card-title:
    fontFamily: "Nunito, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.3
  card-meta:
    fontFamily: "Nunito, sans-serif"
    fontSize: "14px"
  price:
    fontFamily: "Nunito, sans-serif"
    fontSize: "16px"
    fontWeight: 900
  compact-label:
    fontFamily: "Nunito, sans-serif"
    fontSize: "12px"
    lineHeight: 1.25
  category:
    fontFamily: "Nunito, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.25
  step-title:
    fontFamily: "Nunito, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.2
  step-body:
    fontFamily: "Nunito, sans-serif"
    fontSize: "15px"
    lineHeight: 1.5
  business-title:
    fontFamily: "Nunito, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
  footer-brand:
    fontFamily: "Nunito, sans-serif"
    fontSize: "24px"
    fontWeight: 1000
  dialog-title:
    fontFamily: "Nunito, sans-serif"
    fontSize: "27px"
    fontWeight: 700
    lineHeight: 1.2
  demo-note:
    fontFamily: "Nunito, sans-serif"
    fontSize: "13px"
rounded:
  card: "16px"
  button: "12px"
  pill: "999px"
  small: "8px"
  hero-edge: "50% 50% 0 0 / 100% 100% 0 0"
  blob: "30% 18% 24% 10% / 12% 16% 19% 23%"
spacing:
  page-gutter: "24px"
  page-gutter-mobile: "16px"
  section-space: "72px"
  section-space-tablet: "48px"
  section-space-mobile: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    typography: "{typography.label}"
    padding: "12px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.button}"
    padding: "12px 24px"
  search:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px"
  offer-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "12px"
    width: "260px"
  discount:
    backgroundColor: "{colors.discount}"
    textColor: "{colors.discount-text}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
---

# Design System: DamTap

## Overview

**Creative North Star: "Утверждённый рисованный DamTap"**

Визуальный источник — пользовательский design/mockup.png. Это фиксация реализованного макета, а не новая айдентика. Тёплые рисованные продукты, жители и город Астана сочетаются с компактной, ясной витриной.

Готовые иллюстрации из DamTap_Assets_Pack_1 и DamTap_Food_Assets_Pack_2 сохранены в public/images как WebP, конвертированные из PNG. Их не перерисовывают; заголовки, описания и интерфейсные подписи остаются настоящим HTML-текстом.

**Key Characteristics:**

- Рисованная тёплая еда и городская среда.
- Зелёно-бирюзово-голубая палитра и светлые поверхности.
- Nunito для интерфейса, Caveat для рукописного акцента.

## Colors

Бирюзовый управляет действиями, зелёный поддерживает тему спасения еды, голубой задаёт светлую иллюстрированную среду. Нормативные значения — во frontmatter; CSS-источник — app/globals.css.

- **Primary:** primary / primary-dark — действия, ссылки, логотип, навигация и фокус.
- **Secondary:** sky / sky-soft / business — небесный акцент и деловой баннер; green / green-soft / offers / step — мягкие зелёные поверхности и номера шагов.
- **Tertiary:** discount — яркая оранжевая заливка только скидочного бейджа; discount-text — его контрастная подпись. sale-text / sale-soft — читаемые цена и таймер на светлом фоне.
- **Neutral:** cream — фон страницы; white — карточки и поля; ink / text — основной текст; muted-readable — второстепенный текст и placeholder; border — границы; overlay — затемнение. Исходный text-muted сохранён, но для мелкого текста используется более контрастный muted-readable.

**The Token Rule.** Цвета и скругления задаются существующими CSS-токенами; новые значения сначала добавляются в систему токенов.

## Typography

Nunito (sans-serif) — весь основной интерфейс. Caveat (cursive) — рукописный заголовок героя и номера шагов. Оба шрифта подключены через next/font/google с кириллицей.

Frontmatter фиксирует намеренную текущую шкалу, а не прежние компактные размеры. Заголовок героя — clamp(40px, 5vw, 64px), line-height (1.05); описание — (17px / 1.55), на телефоне (16px / 1.55). Секции — (28px, 700, 1.2); название карточки — (16px, 700, 1.3), заведение — (14px), цена — (16px, 900), прежняя цена и таймер — (12px). Категории — (15px, 700, 1.25). Шаги: заголовок (20px, 700, 1.2), описание (15px / 1.5), номер Caveat (28px, 700). Бизнес-заголовок — (32px), до (1000px) — (28px); описание — (16px / 1.55), подписи преимуществ — (14px / 1.4). Логотип в шапке — (28px, 1000), в футере — (24px, 1000). Подписи мобильной навигации — (12px, 800, 1.25). Таймер использует табличные цифры. Существующие диалоги сохраняют заголовок (27px), основной текст (14px) и пояснение (13px).

**The Real Text Rule.** Все значимые надписи — HTML; мелкий декоративный текст и надписи на досках из макета не воспроизводятся.

## Layout

Общий контейнер — min(1200px, 100% − 2 × page-gutter). Боковые поля (24px), до (767px) — (16px). Вертикальный интервал секций — (72px), до (1199px) — (48px), до (767px) — (40px). Это утверждённая корректировка геометрии исходного макета; цвета, тексты, DOM и ассеты сохраняются.

На десктопе шапка (72px), меню с шагом (28px), иконки действий с шагом (16px); эффективный промежуток между брендом и меню (40px: gap 24px + margin 16px). Герой высотой (560px): блок текста шириной (560px) с внутренним полем (40px), панорама позади. Поиск ограничен (880px), имеет минимум (72px) и перекрывает нижнюю границу героя на половину своей высоты. Между нижним краем поиска и категориями — (56px).

Категории: картинка (88 × 88px), ширина кнопки (112px), промежуток (24px), подпись ниже с шагом (10px). Лента карточек прокручивается горизонтально: карточка (260px), внутреннее поле (12px), фото (4:3), промежуток (20px); сама секция имеет поле (24px). Пять исходных предложений сохраняются в ленте, а число одновременно видимых определяется контейнером. Три шага стоят в равных колонках с промежутком (32px); иллюстрации (200px) используют contain и выровнены снизу. После шагов сохраняется интервал section-space.

Бизнес-блок на десктопе: поле (40px), две колонки с иллюстрацией справа и промежутком (32px). Преимущества идут в четыре колонки с промежутком (24px), иконки (56px), расстояние до подписи (12px). Футер — три колонки, выровненные сверху, с промежутком (32px), вертикальным полем (32px) и верхним интервалом section-space.

До (1199px) текст героя центрируется отдельным блоком: ширина (560px), внутреннее поле (32px); панорама расположена ниже отдельной полосой (280px), object-position (36% 50%). Так лицо героя и «Нур Алем» остаются видимыми при ширинах (1024px) и (768px). До (1000px) меню скрывается, а три колонки шагов сохраняются до телефонного порога.

До (767px) герой — сетка с промежутком (20px): заголовок, иллюстрация (200px), описание, кнопки, поиск. Такой порядок задан CSS через display: contents без изменения DOM. Минимальная высота героя (420px) не ограничивает контент: на (390px) он естественно вырастает примерно до (673.8px), чтобы вместить неизменённые текст, картинку и поиск. Поиск находится в потоке, категории начинаются через (56px). Шаги, бизнес и футер становятся одноколоночными; преимущества — в две колонки. Нижняя навигация фиксирована с внешними полями (8px), минимумом высоты (72px), учётом safe-area; под неё зарезервировано (96px).

Контрольные ширины — (1440px), (1024px), (768px), (390px). Актуальные снимки: .impeccable/review/spacing/{1440,1024,768,390}.png. Проверка завершена без переполнения корневого контейнера и пересечений; исправлена обрезка лица героя на (1024px).

## Elevation & Depth

Основная глубина создаётся светлыми цветовыми слоями и готовыми иллюстрациями. Карточки используют мягкую существующую тень search и при наведении поднимаются на (2px) с переходом (.18s, ease). Те же исходные shadow-токены используются у поиска, действий при наведении, нижней навигации и модального окна; значения теней сохранены в sidecar и app/globals.css.

## Shapes

Мягкие формы: карточка и крупный контейнер — card (16px), кнопка — button (12px), внутреннее изображение — small (8px). Метки, иконки и поиск на десктопе используют pill. Подложка текста героя и нижний край панорамы используют отдельные органические radius-токены. На телефоне поиск получает скругление card.

## Components

- **Buttons:** минимум (44px), поле (12px 24px), промежуток (8px); кнопка поиска минимум (48px). Primary — белая надпись на бирюзовом, hover — primary-dark с лёгкой тенью. Outline — белый фон, бирюзовая рамка, hover sky-soft. Фокус видимый: (3px), offset (4px).
- **Search / inputs:** белые поверхности и настоящий label, допустимо визуально скрытый. На десктопе поиск — единая горизонтальная капсула с городом; на телефоне поле над городом и кнопкой. Поля партнёра имеют border и радиус button.
- **Categories:** готовая картинка (88px) над подписью (15px); активная категория обозначена бирюзовым контуром, кнопка имеет aria-pressed.
- **Offer cards:** ширина (260px), поле (12px), фото (4:3), заголовок с минимумом высоты (48px). Готовое фото, скидочный бейдж, избранное, расстояние, HTML-название, заведение, новая и зачёркнутая цена, таймер. Избранное меняет заливку и aria-pressed. Таймер рассчитывается от endsAt каждую секунду; завершённое предложение показывает «Завершено».
- **Navigation:** белая шапка с текстовыми ссылками и иконками. На телефоне — четыре пункта нижней навигации с подписью под иконкой.
- **Illustrated sections:** номера шагов на зелёных кружках; изображения поддерживают текст, не перекрывая его. Бизнес-блок — голубая поверхность с белыми круглыми иконками и готовой иллюстрацией кафе.
- **Dialogs:** белая поверхность card с затемнением, видимым закрытием и возвратом фокуса. Детали предложения и формы используют текущий визуальный язык; данные демонстрационные.

Переходы действий и подъёма карточки длятся (.18s, ease); режим prefers-reduced-motion отключает переходы и плавную прокрутку.

## Do's and Don'ts

### Do:

- Do сохранять композицию и пропорции design/mockup.png при расширении интерфейса.
- Do использовать существующие токены цветов и скруглений из app/globals.css.
- Do сохранять русский HTML-текст, семантику, aria-метки и контраст WCAG AA.
- Do использовать готовые WebP-иллюстрации и проверять их резкость на целевых размерах.
- Do проверять адаптацию на ширинах 1440, 1024, 768 и 390 px.

### Don't:

- Don't заменять иллюстрации перерисовкой в SVG или CSS.
- Don't встраивать интерфейсный текст в картинки или повторять мелкие надписи на досках из макета.
- Don't распространять ярко-оранжевую заливку скидочных бейджей на навигацию и основные действия.
- Don't прятать иллюстрацию героя на планшете или мешать чтению текста изображением.
