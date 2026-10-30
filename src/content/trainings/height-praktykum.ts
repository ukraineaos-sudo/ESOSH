import type { TrainingListItem } from "./types";

/**
 * RU: Каталожна картка інтерактивного практикуму «роботи на висоті» (статичний SPA у public/).
 * EN: Catalog card for the interactive height praktykum (static SPA under public/).
 * Not a video/quiz TrainingDetail — served as /praktykum/height/.
 */
export const heightPraktykumListItem: TrainingListItem = {
  slug: "height-praktykum",
  // Explicit index.html avoids Next trailing-slash 308 that drops directory index.
  href: "/praktykum/height/index.html",
  staticAsset: true,
  tier: "basic",
  title: {
    uk: "Безпека робіт на висоті: інтерактивний практикум",
    en: "Work at height: interactive workshop",
    de: "Arbeiten in der Höhe: interaktiver Workshop",
    es: "Trabajos en altura: práctica interactiva",
    fr: "Travaux en hauteur : atelier interactif",
    az: "Hündürlükdə işlər: interaktiv praktikum",
    kk: "Биіктіктегі жұмыс: интерактивті практикум",
  },
  summary: {
    uk: "Вісім етапів із 3D-сценами, дослідженням об’єктів і ситуаційними рішеннями. Безкоштовно, без облікового запису. Не замінює офіційного навчання чи допуску.",
    en: "Eight stages with 3D scenes, object exploration, and situational decisions. Free, no account. Does not replace formal training or work permits.",
    de: "Acht Etappen mit 3D-Szenen, Objekterkundung und Situationsentscheidungen. Kostenlos, ohne Konto. Ersetzt keine formale Schulung oder Freigabe.",
    es: "Ocho etapas con escenas 3D, exploración de objetos y decisiones situacionales. Gratis, sin cuenta. No sustituye la formación formal ni el permiso de trabajo.",
    fr: "Huit étapes avec scènes 3D, exploration d’objets et décisions situationnelles. Gratuit, sans compte. Ne remplace pas une formation officielle ni une autorisation.",
    az: "3D səhnələr, obyektlərin öyrənilməsi və situasiya qərarları ilə səkkiz mərhələ. Pulsuz, hesab olmadan. Rəsmi təlimi və ya icazəni əvəz etmir.",
    kk: "3D көріністер, нысандарды зерттеу және жағдайлық шешімдермен сегіз кезең. Тегін, тіркелгісіз. Ресми оқытуды немесе рұқсатты алмастырмайды.",
  },
};
