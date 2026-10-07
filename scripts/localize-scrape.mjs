#!/usr/bin/env node
/**
 * Rebuilds src/content/<locale>/pages/home.json from the live WordPress homepages
 * (https://www.hollywoodwhitening.com/ + /de/ /es/ /ru/).
 *
 * The four live pages share one Flatsome template, so their <main> text extracts to
 * the same sequence of lines; copy is picked by line index (LINE below) and stays
 * 1:1 with the live site. Two things are layered on top and are NOT on the live site:
 *
 *   OVERRIDES  corrections to live machine translation (brand/product/business names
 *              kept in their original form, mistranslated short labels fixed).
 *   DESIGN     strings for UI the new design adds (eyebrows, stats, chips, aria labels).
 *              Translated for this project — have a native speaker review these.
 *
 * Usage: node scripts/localize-scrape.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.hollywoodwhitening.com";
const LOCALES = ["en", "de", "es", "ru"];
const OUT = path.resolve(import.meta.dirname, "../src/content");

/* ------------------------------------------------------------------ */
/* Extraction                                                          */
/* ------------------------------------------------------------------ */

const ENTITIES = {
  "&nbsp;": " ", "&amp;": "&", "&#038;": "&", "&quot;": '"', "&#039;": "'", "&#39;": "'",
  "&#8217;": "’", "&rsquo;": "’", "&#8216;": "‘", "&#8220;": "“", "&#8221;": "”",
  "&#8230;": "…", "&#x2122;": "™", "&#8482;": "™", "&#8211;": "–", "&#8212;": "—",
  "&laquo;": "«", "&raquo;": "»", "&copy;": "©",
};
const decode = (s) => s.replace(/&[#\w]+;/g, (e) => ENTITIES[e] ?? e);

function mainLines(html) {
  let h = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  h = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  // Instagram feed markup varies between fetches; drop it so indices stay stable.
  h = h.replace(/<div[^>]*sbi[\s\S]*?<\/div>/g, "");
  // Headings keep a "## " marker line (empty headings included) — LINE indices rely on it.
  h = h.replace(/<(h[1-6])[^>]*>/g, "\n## ").replace(/<(p|li|div|br|a|span|button|summary)[^>]*>/g, "\n");
  h = h.replace(/<[^>]+>/g, " ");
  const out = [];
  for (const raw of decode(h).split("\n")) {
    const l = raw.replace(/\s+/g, " ").trim();
    if (!l || /^\d+$/.test(l) || /^#(text|gap|section)|^[{}]|font-size|line-height|text-align|padding|color:|^@media/.test(l)) continue;
    if (out.at(-1) !== l) out.push(l);
  }
  return out;
}

function mainLinks(html) {
  const h = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const links = [];
  for (const m of h.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    links.push({ href: decodeURI(m[1].replace(ORIGIN, "")), text: decode(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim() });
  }
  return links;
}

function meta(html) {
  const pick = (re) => decode(html.match(re)?.[1] ?? "");
  return { title: pick(/<title>([^<]*)<\/title>/), description: pick(/<meta name="description" content="([^"]*)"/) };
}

/* ------------------------------------------------------------------ */
/* Line map (indices into the shared extraction)                       */
/* ------------------------------------------------------------------ */

// Indices are against the extraction above (headings collapse to their own line).
const LINE = {
  heroBody: 4,
  globalTitle: 9, globalBody: 10, becomeProvider: 11, learnMore: 12,
  packagesTitle: 13,
  starBadge: 15, starTreatments: 20, starTier: 21, starFeatures: [22, 23, 24, 25],
  cometBadge: 30, cometTreatments: 35, cometTier: 36, cometFeatures: [37, 38, 39, 40],
  galaxyBadge: 44, galaxyTreatments: 49, galaxyTier: 50, galaxyFeatures: [51, 52, 53, 54],
  callForPrice: 19,
  techEyebrow: 57, techBody: [58, 59],
  whyEyebrow: 62, whyTitle: 63, whyBody: [64, 65], getStarted: 66,
  trendKicker: 67, trendTitle: 68, trendQuote: 69, trendAttribution: 70,
  testimonialsTitle: 71, testimonialsEyebrow: 72,
  testimonials: [[74, 75, 76], [78, 79, 80], [82, 83, 84], [86, 87, 88]],
  blogEyebrow: 128, blogTitle: 129, postCategory: 130, readMore: 158,
  faqTitle: 159,
  faqs: [
    { q: 160, a: [161] },
    { q: 162, a: [163, 164] },
    { q: 165, a: [166, 167] },
    { q: 168, a: [169] },
    { q: 170, a: [171, 172, 173] },
    { q: 174, a: [175, 176] },
    { q: 177, a: [178], list: [179, 180, 181, 182] },
    { q: 183, a: [184, 185, 186] },
  ],
  providerTitle: 187, providerBody: [188, 189],
};

/* ------------------------------------------------------------------ */
/* Corrections to live machine translation                             */
/* ------------------------------------------------------------------ */

// Proper names stay as on the English site in every locale.
const TESTIMONIAL_NAMES = ["Sailunaglow", "Sunny Smile", "Hollywood by Chelsea", "Smile by Sophie"];

const OVERRIDES = {
  en: {
    testimonialLocations: ["Australia", "USA", "England, UK", "Scotland, UK"],
    trendKicker: "Yellow’s out… White’s in!", // live is all caps
    treatments: (n) => `${n} Treatments Inc`, // live mixes "Inc" / "inc"
  },
  de: {
    trendKicker: "Gelb ist raus… Weiß ist rein!", // live is all caps
    tiers: ["Preis-Leistung", "Ultimativ", "Profi"], // live: WERT / ULTIMATIV / ERNST
    treatments: (n) => `${n} Behandlungen inkl.`, // live mixes "20 Treatments Inc"
    features: { "#1 Hollywood Branding": "#1 Hollywood Whitening™ Branding" },
    providerTitle: "Werden Sie Hollywood Whitening™ Anbieter", // live: "Hollywood-Aufhellungsanbieter"
  },
  es: {
    trendKicker: "¡El amarillo está fuera… el blanco está dentro!", // live is all caps
    tiers: ["Valor", "Definitivo", "Profesional"], // live: VALOR / ÚLTIMO / GRAVE
    treatments: (n) => `${n} tratamientos incluidos`,
    features: { "#1 Marca de Hollywood": "Marca Hollywood Whitening™ n.º 1" },
    providerTitle: "Conviértase en proveedor de Hollywood Whitening™", // live: "…de blanqueamiento de Hollywood"
  },
  ru: {
    tiers: ["Выгодный", "Максимум", "Профи"], // live: ЦЕНИТЬ ("to value") / ОКОНЧАТЕЛЬНЫЙ / СЕРЬЕЗНЫЙ
    treatments: (n) => `${n} процедур в комплекте`, // live: "40 процедур, включая" / "20 Treatments Inc"
    features: {
      "#1 Голливудский брендинг": "Брендинг Hollywood Whitening™ №1",
      "Высокий уровень требовательности": "Требует регулярного обслуживания",
    },
    whyEyebrow: "Почему стоит выбрать Hollywood Whitening?", // live: "…отбеливание зубов в стиле Голливуда?"
    providerTitle: "Станьте партнёром Hollywood Whitening™", // live: "…по отбеливанию зубов в Голливуде!"
  },
};

/* ------------------------------------------------------------------ */
/* Strings for UI the new design adds (not on the live site)           */
/* ------------------------------------------------------------------ */

const DESIGN = {
  en: {
    heroTitleLight: "Join the Revolution.",
    explorePackages: "Explore Packages",
    getStartedToday: "Get Started Today",
    avgRating: "average package rating",
    trust: "Trusted worldwide by professionals",
    videoPause: "Pause background video", videoPlay: "Play background video",
    stats: ["Years empowering smiles", "Continents with offices", "Annual whitening industry", "Average package rating"],
    statsLabel: "Hollywood Whitening in numbers",
    marquee: ["Official Business Packages", "Trusted Worldwide by Professionals", "Extraordinary Results", "Remote Training & Business Support", "Star One™ · Comet 2™ · Galaxy™"],
    globalEyebrow: "Worldwide Network",
    regions: ["Europe", "Asia", "North America"],
    globalCaption: { kicker: "Global presence", text: "Offices spanning Europe, Asia & North America" },
    supportTitle: "Everything you need to shine",
    packagesEyebrow: "Business Packages",
    packagesIntro: "Everything you need to launch — the machine, treatments, branding and training — in one complete package.",
    mostPopular: "Most Popular", completePackage: "Complete Package",
    ratingCount: "{n} ratings", ratingAria: "Rated {r} out of 5 based on {n} customer ratings",
    results: "{n}/10 Results", getStartedWith: "Get Started with {name}",
    techTitle: ["Perfected product.", "Beautiful design.", "Extraordinary results."],
    techHighlights: [
      ["Innovative Technology", "Refined by intuitive equipment functionality."],
      ["Perfected Product", "Superior products for extraordinary results."],
      ["Beautiful Design", "Aesthetically pleasing, fitting seamlessly into any professional setting."],
      ["Business Structure", "A proven model that is easy to understand and implement."],
    ],
    discoverScience: "Discover the Science",
    chipTraining: ["Remote training", "Legal requirements and marketing guidance included."],
    chipWavelengths: ["Triple Wavelengths", "Comet 2™ — mobile & fixed use, 10/10 results."],
    techImageAlt: "Close-up of a Hollywood Whitening light head",
    techGalleryAlt: "Hollywood Whitening treatment in progress",
    startBusiness: "Start Your Business Today",
    pillars: [
      ["Comprehensive Training", "Remote training covering every aspect of our products, legal requirements and marketing guidance."],
      ["Cutting-edge Machines", "High-end, effective whitening devices engineered for world-class results."],
      ["Proven Business Model", "Easy to understand and implement — ideal for opening your own whitening centre."],
      ["Trusted Worldwide", "A globally recognised brand your customers want and your competitors envy."],
    ],
    trendBadge: "Desired brand", trendImageAlt: "A white banana — yellow's out, white's in",
    testimonialsIntro: "Real words from Hollywood Whitening providers around the world.",
    readArticle: "Read article",
    faqEyebrow: "Clear answers",
    faqIntro: "Thinking about starting a teeth whitening business? Here are the questions we hear most.",
    providerPill: "Join our elite network", compareCta: "Compare Business Packages",
    globalImageAlt: "Two smiling men looking at a Hollywood Whitening product box",
  },
  de: {
    heroTitleLight: "Werden Sie Teil der Revolution.",
    explorePackages: "Pakete entdecken",
    getStartedToday: "Jetzt starten",
    avgRating: "durchschnittliche Paketbewertung",
    trust: "Weltweit von Profis geschätzt",
    videoPause: "Hintergrundvideo pausieren", videoPlay: "Hintergrundvideo abspielen",
    stats: ["Jahre strahlendes Lächeln", "Kontinente mit Niederlassungen", "Jährlicher Markt für Zahnaufhellung", "Durchschnittliche Paketbewertung"],
    statsLabel: "Hollywood Whitening in Zahlen",
    marquee: ["Offizielle Geschäftspakete", "Weltweit von Profis geschätzt", "Außergewöhnliche Ergebnisse", "Online-Schulung & Business-Support", "Star One™ · Comet 2™ · Galaxy™"],
    globalEyebrow: "Weltweites Netzwerk",
    regions: ["Europa", "Asien", "Nordamerika"],
    globalCaption: { kicker: "Globale Präsenz", text: "Niederlassungen in Europa, Asien und Nordamerika" },
    supportTitle: "Alles, was Sie zum Strahlen brauchen",
    packagesEyebrow: "Geschäftspakete",
    packagesIntro: "Alles für Ihren Start – Gerät, Behandlungen, Branding und Schulung – in einem Komplettpaket.",
    mostPopular: "Am beliebtesten", completePackage: "Komplettpaket",
    ratingCount: "{n} Bewertungen", ratingAria: "Bewertet mit {r} von 5, basierend auf {n} Kundenbewertungen",
    results: "Ergebnis: {n}/10", getStartedWith: "Mit {name} starten",
    techTitle: ["Perfektioniertes Produkt.", "Ansprechendes Design.", "Außergewöhnliche Ergebnisse."],
    techHighlights: [
      ["Innovative Technologie", "Durch intuitive Gerätebedienung verfeinert."],
      ["Perfektioniertes Produkt", "Erstklassige Produkte für außergewöhnliche Ergebnisse."],
      ["Ansprechendes Design", "Ästhetisch und passend für jedes professionelle Ambiente."],
      ["Geschäftsstruktur", "Ein bewährtes Modell – leicht verständlich und umsetzbar."],
    ],
    discoverScience: "Die Wissenschaft entdecken",
    chipTraining: ["Online-Schulung", "Inklusive rechtlicher Anforderungen und Marketing-Beratung."],
    chipWavelengths: ["Dreifache Wellenlängen", "Comet 2™ – mobil & stationär, Ergebnis 10/10."],
    techImageAlt: "Nahaufnahme eines Hollywood Whitening Lichtkopfs",
    techGalleryAlt: "Hollywood Whitening Behandlung",
    startBusiness: "Starten Sie Ihr Geschäft",
    pillars: [
      ["Umfassende Schulung", "Online-Schulung zu allen Produkten, rechtlichen Anforderungen und Marketing."],
      ["Modernste Geräte", "Hocheffektive High-End-Geräte für erstklassige Ergebnisse."],
      ["Bewährtes Geschäftsmodell", "Leicht verständlich und umsetzbar – ideal für Ihr eigenes Zahnaufhellungszentrum."],
      ["Weltweit vertraut", "Eine weltweit anerkannte Marke, die Ihre Kunden wollen und Ihre Konkurrenten beneiden."],
    ],
    trendBadge: "Beliebteste Marke", trendImageAlt: "Eine weiße Banane – Gelb ist raus, Weiß ist rein",
    testimonialsIntro: "Echte Stimmen von Hollywood Whitening Anbietern weltweit.",
    readArticle: "Artikel lesen",
    faqEyebrow: "Klare Antworten",
    faqIntro: "Sie möchten ein Zahnaufhellungs-Business starten? Hier sind die häufigsten Fragen.",
    providerPill: "Werden Sie Teil unseres Netzwerks", compareCta: "Geschäftspakete vergleichen",
    globalImageAlt: "Zwei lächelnde Männer mit einer Hollywood Whitening Produktverpackung",
  },
  es: {
    heroTitleLight: "Únase a la revolución.",
    explorePackages: "Ver paquetes",
    getStartedToday: "Empiece hoy",
    avgRating: "valoración media de los paquetes",
    trust: "La confianza de profesionales de todo el mundo",
    videoPause: "Pausar vídeo de fondo", videoPlay: "Reproducir vídeo de fondo",
    stats: ["Años potenciando sonrisas", "Continentes con oficinas", "Industria anual del blanqueamiento", "Valoración media de los paquetes"],
    statsLabel: "Hollywood Whitening en cifras",
    marquee: ["Paquetes de negocio oficiales", "La confianza de profesionales de todo el mundo", "Resultados extraordinarios", "Formación online y soporte comercial", "Star One™ · Comet 2™ · Galaxy™"],
    globalEyebrow: "Red mundial",
    regions: ["Europa", "Asia", "Norteamérica"],
    globalCaption: { kicker: "Presencia global", text: "Oficinas en Europa, Asia y Norteamérica" },
    supportTitle: "Todo lo que necesita para brillar",
    packagesEyebrow: "Paquetes de negocio",
    packagesIntro: "Todo lo necesario para empezar — la máquina, los tratamientos, la marca y la formación — en un paquete completo.",
    mostPopular: "Más popular", completePackage: "Paquete completo",
    ratingCount: "{n} valoraciones", ratingAria: "Valorado con {r} de 5 en base a {n} valoraciones de clientes",
    results: "Resultados {n}/10", getStartedWith: "Empezar con {name}",
    techTitle: ["Producto perfeccionado.", "Diseño atractivo.", "Resultados extraordinarios."],
    techHighlights: [
      ["Tecnología innovadora", "Perfeccionada con un funcionamiento intuitivo del equipo."],
      ["Producto perfeccionado", "Productos superiores para resultados extraordinarios."],
      ["Diseño atractivo", "Estético y adaptable a cualquier entorno profesional."],
      ["Estructura de negocio", "Un modelo probado, fácil de entender y aplicar."],
    ],
    discoverScience: "Descubra la ciencia",
    chipTraining: ["Formación online", "Incluye requisitos legales y orientación de marketing."],
    chipWavelengths: ["Longitudes de onda triples", "Comet 2™ — uso móvil y fijo, resultados 10/10."],
    techImageAlt: "Primer plano de un cabezal de luz Hollywood Whitening",
    techGalleryAlt: "Tratamiento Hollywood Whitening en curso",
    startBusiness: "Empiece su negocio hoy",
    pillars: [
      ["Formación completa", "Formación online sobre nuestros productos, requisitos legales y marketing."],
      ["Máquinas de vanguardia", "Dispositivos de alta gama y eficacia para resultados de primer nivel."],
      ["Modelo de negocio probado", "Fácil de entender y aplicar — ideal para abrir su propio centro de blanqueamiento."],
      ["Confianza mundial", "Una marca reconocida mundialmente que sus clientes desean y su competencia envidia."],
    ],
    trendBadge: "Marca más deseada", trendImageAlt: "Un plátano blanco — fuera el amarillo, dentro el blanco",
    testimonialsIntro: "Opiniones reales de proveedores Hollywood Whitening de todo el mundo.",
    readArticle: "Leer artículo",
    faqEyebrow: "Respuestas claras",
    faqIntro: "¿Piensa iniciar un negocio de blanqueamiento dental? Estas son las preguntas más frecuentes.",
    providerPill: "Únase a nuestra red de élite", compareCta: "Comparar paquetes de negocio",
    globalImageAlt: "Dos hombres sonrientes mirando una caja de producto Hollywood Whitening",
  },
  ru: {
    heroTitleLight: "Присоединяйтесь к революции.",
    explorePackages: "Смотреть пакеты",
    getStartedToday: "Начать сегодня",
    avgRating: "средний рейтинг пакетов",
    trust: "Нам доверяют профессионалы по всему миру",
    videoPause: "Приостановить фоновое видео", videoPlay: "Воспроизвести фоновое видео",
    stats: ["Лет дарим улыбки", "Континента с офисами", "Ежегодный рынок отбеливания", "Средний рейтинг пакетов"],
    statsLabel: "Hollywood Whitening в цифрах",
    marquee: ["Официальные бизнес-пакеты", "Нам доверяют профессионалы по всему миру", "Исключительные результаты", "Онлайн-обучение и бизнес-поддержка", "Star One™ · Comet 2™ · Galaxy™"],
    globalEyebrow: "Международная сеть",
    regions: ["Европа", "Азия", "Северная Америка"],
    globalCaption: { kicker: "Глобальное присутствие", text: "Офисы в Европе, Азии и Северной Америке" },
    supportTitle: "Всё, что нужно для успеха",
    packagesEyebrow: "Бизнес-пакеты",
    packagesIntro: "Всё для старта — аппарат, процедуры, брендинг и обучение — в одном полном пакете.",
    mostPopular: "Самый популярный", completePackage: "Полный пакет",
    ratingCount: "оценок: {n}", ratingAria: "Рейтинг {r} из 5 на основе {n} отзывов клиентов",
    results: "Результаты {n}/10", getStartedWith: "Начать с {name}",
    techTitle: ["Совершенный продукт.", "Красивый дизайн.", "Исключительные результаты."],
    techHighlights: [
      ["Инновационные технологии", "Интуитивно понятное управление оборудованием."],
      ["Совершенный продукт", "Продукты высшего качества для исключительных результатов."],
      ["Красивый дизайн", "Эстетично и органично вписывается в любой профессиональный интерьер."],
      ["Бизнес-модель", "Проверенная модель, простая для понимания и внедрения."],
    ],
    discoverScience: "Узнать о науке",
    chipTraining: ["Онлайн-обучение", "Правовые требования и маркетинговые рекомендации включены."],
    chipWavelengths: ["Тройные длины волн", "Comet 2™ — мобильное и стационарное использование, результат 10/10."],
    techImageAlt: "Крупный план светового модуля Hollywood Whitening",
    techGalleryAlt: "Процедура Hollywood Whitening",
    startBusiness: "Начните свой бизнес",
    pillars: [
      ["Комплексное обучение", "Онлайн-обучение по всем продуктам, правовым требованиям и маркетингу."],
      ["Передовое оборудование", "Эффективные аппараты высокого класса для результатов мирового уровня."],
      ["Проверенная бизнес-модель", "Проста в понимании и внедрении — идеально для открытия собственного центра."],
      ["Доверие по всему миру", "Всемирно признанный бренд, который хотят ваши клиенты и которому завидуют конкуренты."],
    ],
    trendBadge: "Желанный бренд", trendImageAlt: "Белый банан — жёлтый вне игры, белый в моде",
    testimonialsIntro: "Реальные отзывы партнёров Hollywood Whitening со всего мира.",
    readArticle: "Читать статью",
    faqEyebrow: "Понятные ответы",
    faqIntro: "Думаете открыть бизнес по отбеливанию зубов? Вот самые частые вопросы.",
    providerPill: "Присоединяйтесь к нашей элитной сети", compareCta: "Сравнить бизнес-пакеты",
    globalImageAlt: "Двое улыбающихся мужчин смотрят на упаковку Hollywood Whitening",
  },
};

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

const stripHeading = (s) => s.replace(/^##\s*/, "").trim();
const tidy = (locale, s) => {
  let t = stripHeading(s);
  if (locale === "en") t = t.replace(/\s+\?/g, "?").replace(/(\w)’(\w)/g, "$1'$2");
  return t;
};
const sentence = (s) => s.charAt(0) + s.slice(1).toLowerCase(); // "YELLOW’S OUT…" → "Yellow’s out…"

function build(locale, lines, links, pageMeta) {
  const L = (i) => tidy(locale, lines[i] ?? "");
  const O = OVERRIDES[locale];
  const D = DESIGN[locale];
  const feature = (i) => O.features?.[L(i)] ?? L(i);
  const treatments = (i, n) => (O.treatments ? O.treatments(n) : L(i));
  const pkg = (prefix, n, tierIndex) => ({
    badge: L(LINE[`${prefix}Badge`]),
    tier: O.tiers?.[tierIndex] ?? sentence(L(LINE[`${prefix}Tier`])),
    treatments: treatments(LINE[`${prefix}Treatments`], n),
    features: LINE[`${prefix}Features`].map(feature),
  });

  // Blog links in <main> appear in display order; each post links twice (image, then title),
  // so keep titled links, one per URL. The first five are the five "News & Tips" posts.
  const seen = new Set();
  const posts = links
    .filter((l) => /\/blog\/.+/.test(l.href) && l.text && !seen.has(l.href) && seen.add(l.href))
    .slice(0, 5);

  return {
    meta: { title: pageMeta.title, description: pageMeta.description },
    hero: {
      titleLight: D.heroTitleLight,
      body: L(LINE.heroBody),
      ctaPrimary: D.getStartedToday,
      ctaSecondary: D.explorePackages,
      avgRating: D.avgRating,
      trust: D.trust,
      videoPause: D.videoPause,
      videoPlay: D.videoPlay,
    },
    stats: { label: D.statsLabel, items: D.stats },
    marquee: [D.marquee[0], O.trendKicker ?? L(LINE.trendKicker), ...D.marquee.slice(1)],
    global: {
      eyebrow: D.globalEyebrow,
      title: L(LINE.globalTitle),
      body: L(LINE.globalBody),
      regions: D.regions,
      caption: D.globalCaption,
      imageAlt: D.globalImageAlt,
      supportTitle: D.supportTitle,
      supportText: L(LINE.heroBody + 1),
      becomeProvider: L(LINE.becomeProvider),
      learnMore: L(LINE.learnMore),
    },
    packages: {
      eyebrow: D.packagesEyebrow,
      title: L(LINE.packagesTitle),
      intro: D.packagesIntro,
      mostPopular: D.mostPopular,
      completePackage: D.completePackage,
      ratingCount: D.ratingCount,
      ratingAria: D.ratingAria,
      results: D.results,
      getStartedWith: D.getStartedWith,
      callForPrice: L(LINE.callForPrice),
      items: { "star-one": pkg("star", 20, 0), "comet-2": pkg("comet", 40, 1), galaxy: pkg("galaxy", 50, 2) },
    },
    technology: {
      eyebrow: L(LINE.techEyebrow),
      title: D.techTitle,
      body: LINE.techBody.map(L),
      highlights: D.techHighlights.map(([title, text]) => ({ title, text })),
      cta: D.discoverScience,
      chipTraining: { title: D.chipTraining[0], text: D.chipTraining[1] },
      chipWavelengths: { title: D.chipWavelengths[0], text: D.chipWavelengths[1] },
      imageAlt: D.techImageAlt,
      galleryAlt: D.techGalleryAlt,
    },
    why: {
      eyebrow: O.whyEyebrow ?? L(LINE.whyEyebrow),
      title: L(LINE.whyTitle),
      body: LINE.whyBody.map(L),
      cta: D.startBusiness,
      pillars: D.pillars.map(([title, text]) => ({ title, text })),
    },
    trend: {
      kicker: O.trendKicker ?? L(LINE.trendKicker),
      title: L(LINE.trendTitle),
      quote: L(LINE.trendQuote),
      attribution: L(LINE.trendAttribution),
      badge: D.trendBadge,
      imageAlt: D.trendImageAlt,
    },
    testimonials: {
      eyebrow: L(LINE.testimonialsEyebrow),
      title: L(LINE.testimonialsTitle),
      intro: D.testimonialsIntro,
      items: LINE.testimonials.map(([, loc, quote], i) => ({
        name: TESTIMONIAL_NAMES[i],
        location: O.testimonialLocations?.[i] ?? L(loc),
        quote: L(quote),
      })),
    },
    blogFaq: {
      blogEyebrow: L(LINE.blogEyebrow).replace(/!$/, ""),
      blogTitle: L(LINE.blogTitle),
      readMore: L(LINE.readMore),
      readArticle: D.readArticle,
      category: L(LINE.postCategory),
      posts: posts.map((p) => ({ title: p.text, href: p.href })),
      faqEyebrow: D.faqEyebrow,
      faqTitle: L(LINE.faqTitle),
      faqIntro: D.faqIntro,
      faqs: LINE.faqs.map((f) => ({
        q: L(f.q),
        a: f.a.map(L),
        ...(f.list ? { list: f.list.map(L) } : {}),
      })),
    },
    provider: {
      pill: D.providerPill,
      title: O.providerTitle ?? L(LINE.providerTitle),
      body: LINE.providerBody.map(L),
      primary: L(LINE.becomeProvider),
      secondary: D.compareCta,
    },
  };
}

for (const locale of LOCALES) {
  const url = `${ORIGIN}/${locale === "en" ? "" : `${locale}/`}`;
  const html = await (await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } })).text();
  const content = build(locale, mainLines(html), mainLinks(html), meta(html));
  const file = path.join(OUT, locale, "pages", "home.json");
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(content, null, 2) + "\n");
  console.log(`✓ ${locale} → ${path.relative(process.cwd(), file)}`);
}
