import type { LocalizedString } from "./types";

/**
 * RU: Вступний блок сторінки «Оцінювання ризиків: вступний курс» (клієнтський текст + EN).
 * EN: Intro block for Risk Assessment: Awareness Course (client UK + EN).
 */
export type RiskAssessmentIntroCopy = {
  title: LocalizedString;
  paragraphs: LocalizedString[];
  /** Use `{email}` placeholder for the mailto link. */
  inviteTrainings: LocalizedString;
  /** Use `{app}` placeholder for the eRisk-Control link. */
  inviteApp: LocalizedString;
  appBlurb: LocalizedString;
  closing: LocalizedString;
  signName: LocalizedString;
  signOrg: LocalizedString;
  emailDisplay: string;
  emailHref: string;
  appDisplay: string;
  appHref: string;
};

export const riskAssessmentIntro: RiskAssessmentIntroCopy = {
  title: {
    uk: "Чому ми рекомендуємо цей курс",
    en: "Why we recommend this course",
    de: "Why we recommend this course",
    es: "Why we recommend this course",
    fr: "Why we recommend this course",
    az: "Why we recommend this course",
    kk: "Why we recommend this course",
  },
  paragraphs: [
    {
      uk: "Україна рухається до членства в Європейському Союзі, де ключовою вимогою з безпеки праці є Рамкова директива 89/391/ЄЕС. Вона зобов'язує усіх роботодавців оцінювати та контролювати ризики для безпеки та здоров’я працівників. І справді користь оцінювання ризиків як інструменту безпеки загально відома. Його принципи допомагають помічати небезпеки, передбачати можливі наслідки та обирати безпечніші дії — на роботі й удома.",
      en: "Ukraine is moving toward membership of the European Union, where a key occupational safety requirement is Framework Directive 89/391/EEC. It obliges all employers to assess and control risks to workers’ safety and health. Indeed, the value of risk assessment as a safety tool is widely recognized. Its principles help you notice hazards, anticipate possible consequences, and choose safer actions — at work and at home.",
      de: "Ukraine is moving toward membership of the European Union, where a key occupational safety requirement is Framework Directive 89/391/EEC. It obliges all employers to assess and control risks to workers’ safety and health. Indeed, the value of risk assessment as a safety tool is widely recognized. Its principles help you notice hazards, anticipate possible consequences, and choose safer actions — at work and at home.",
      es: "Ukraine is moving toward membership of the European Union, where a key occupational safety requirement is Framework Directive 89/391/EEC. It obliges all employers to assess and control risks to workers’ safety and health. Indeed, the value of risk assessment as a safety tool is widely recognized. Its principles help you notice hazards, anticipate possible consequences, and choose safer actions — at work and at home.",
      fr: "Ukraine is moving toward membership of the European Union, where a key occupational safety requirement is Framework Directive 89/391/EEC. It obliges all employers to assess and control risks to workers’ safety and health. Indeed, the value of risk assessment as a safety tool is widely recognized. Its principles help you notice hazards, anticipate possible consequences, and choose safer actions — at work and at home.",
      az: "Ukraine is moving toward membership of the European Union, where a key occupational safety requirement is Framework Directive 89/391/EEC. It obliges all employers to assess and control risks to workers’ safety and health. Indeed, the value of risk assessment as a safety tool is widely recognized. Its principles help you notice hazards, anticipate possible consequences, and choose safer actions — at work and at home.",
      kk: "Ukraine is moving toward membership of the European Union, where a key occupational safety requirement is Framework Directive 89/391/EEC. It obliges all employers to assess and control risks to workers’ safety and health. Indeed, the value of risk assessment as a safety tool is widely recognized. Its principles help you notice hazards, anticipate possible consequences, and choose safer actions — at work and at home.",
    },
    {
      uk: "Як спільнота фахівців із безпеки та здоров’я на роботі, ми дбаємо про вашу безпеку та запрошуємо пройти цей курс безоплатно. Ви ознайомитеся з ризикоорієнтованим мисленням, матрицею оцінювання ризиків та ієрархією заходів контролю, щоб застосовувати ці знання для захисту себе й інших.",
      en: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn risk-based thinking, the risk assessment matrix, and the hierarchy of controls, so you can apply this knowledge to protect yourself and others.",
      de: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn risk-based thinking, the risk assessment matrix, and the hierarchy of controls, so you can apply this knowledge to protect yourself and others.",
      es: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn risk-based thinking, the risk assessment matrix, and the hierarchy of controls, so you can apply this knowledge to protect yourself and others.",
      fr: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn risk-based thinking, the risk assessment matrix, and the hierarchy of controls, so you can apply this knowledge to protect yourself and others.",
      az: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn risk-based thinking, the risk assessment matrix, and the hierarchy of controls, so you can apply this knowledge to protect yourself and others.",
      kk: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn risk-based thinking, the risk assessment matrix, and the hierarchy of controls, so you can apply this knowledge to protect yourself and others.",
    },
    {
      uk: "Курс підготовлено на основі матеріалів і рекомендацій Міжнародної організації праці (ILO), Європейського агентства з безпеки та гігієни праці (EU-OSHA) та положень Рамкової директиви Ради 89/391/ЄЕС. Для опрацювання й представлення матеріалів використано інструменти штучного інтелекту.",
      en: "The course was prepared based on materials and recommendations of the International Labour Organization (ILO), the European Agency for Safety and Health at Work (EU-OSHA), and the provisions of Council Framework Directive 89/391/EEC. Artificial intelligence tools were used to process and present the materials.",
      de: "The course was prepared based on materials and recommendations of the International Labour Organization (ILO), the European Agency for Safety and Health at Work (EU-OSHA), and the provisions of Council Framework Directive 89/391/EEC. Artificial intelligence tools were used to process and present the materials.",
      es: "The course was prepared based on materials and recommendations of the International Labour Organization (ILO), the European Agency for Safety and Health at Work (EU-OSHA), and the provisions of Council Framework Directive 89/391/EEC. Artificial intelligence tools were used to process and present the materials.",
      fr: "The course was prepared based on materials and recommendations of the International Labour Organization (ILO), the European Agency for Safety and Health at Work (EU-OSHA), and the provisions of Council Framework Directive 89/391/EEC. Artificial intelligence tools were used to process and present the materials.",
      az: "The course was prepared based on materials and recommendations of the International Labour Organization (ILO), the European Agency for Safety and Health at Work (EU-OSHA), and the provisions of Council Framework Directive 89/391/EEC. Artificial intelligence tools were used to process and present the materials.",
      kk: "The course was prepared based on materials and recommendations of the International Labour Organization (ILO), the European Agency for Safety and Health at Work (EU-OSHA), and the provisions of Council Framework Directive 89/391/EEC. Artificial intelligence tools were used to process and present the materials.",
    },
  ],
  inviteTrainings: {
    uk: "Запрошуємо на наші поглиблені тренінги «Фахівець з оцінки ризиків», курси для підприємств з практикою оцінювання та контролю ризиків на робочих місцях — {email}.",
    en: "We invite you to our in-depth trainings “Risk Assessment Specialist” and enterprise courses with practice in assessing and controlling risks at workplaces — {email}.",
    de: "We invite you to our in-depth trainings “Risk Assessment Specialist” and enterprise courses with practice in assessing and controlling risks at workplaces — {email}.",
    es: "We invite you to our in-depth trainings “Risk Assessment Specialist” and enterprise courses with practice in assessing and controlling risks at workplaces — {email}.",
    fr: "We invite you to our in-depth trainings “Risk Assessment Specialist” and enterprise courses with practice in assessing and controlling risks at workplaces — {email}.",
    az: "We invite you to our in-depth trainings “Risk Assessment Specialist” and enterprise courses with practice in assessing and controlling risks at workplaces — {email}.",
    kk: "We invite you to our in-depth trainings “Risk Assessment Specialist” and enterprise courses with practice in assessing and controlling risks at workplaces — {email}.",
  },
  inviteApp: {
    uk: "Познайомтеся з нашим ШІ-застосунком для оцінювання ризиків {app}.",
    en: "Get to know our AI application for risk assessment {app}.",
    de: "Get to know our AI application for risk assessment {app}.",
    es: "Get to know our AI application for risk assessment {app}.",
    fr: "Get to know our AI application for risk assessment {app}.",
    az: "Get to know our AI application for risk assessment {app}.",
    kk: "Get to know our AI application for risk assessment {app}.",
  },
  appBlurb: {
    uk: "eRisk-Control — оцінка професійних ризиків за хвилини / ШІ-платформа.",
    en: "eRisk-Control — occupational risk assessment in minutes / AI platform.",
    de: "eRisk-Control — occupational risk assessment in minutes / AI platform.",
    es: "eRisk-Control — occupational risk assessment in minutes / AI platform.",
    fr: "eRisk-Control — occupational risk assessment in minutes / AI platform.",
    az: "eRisk-Control — occupational risk assessment in minutes / AI platform.",
    kk: "eRisk-Control — occupational risk assessment in minutes / AI platform.",
  },
  closing: {
    uk: "Бажаємо безпечної роботи!",
    en: "We wish you safe work!",
    de: "We wish you safe work!",
    es: "We wish you safe work!",
    fr: "We wish you safe work!",
    az: "We wish you safe work!",
    kk: "We wish you safe work!",
  },
  signName: {
    uk: "Голова Правління Ольга Богданова",
    en: "Chair of the Board Olha Bohdanova",
    de: "Chair of the Board Olha Bohdanova",
    es: "Chair of the Board Olha Bohdanova",
    fr: "Chair of the Board Olha Bohdanova",
    az: "Chair of the Board Olha Bohdanova",
    kk: "Chair of the Board Olha Bohdanova",
  },
  signOrg: {
    uk: "ГС «Європейське співтовариство з охорони праці»",
    en: "NGO “European Society of Occupational Safety and Health”",
    de: "NGO “European Society of Occupational Safety and Health”",
    es: "NGO “European Society of Occupational Safety and Health”",
    fr: "NGO “European Society of Occupational Safety and Health”",
    az: "NGO “European Society of Occupational Safety and Health”",
    kk: "NGO “European Society of Occupational Safety and Health”",
  },
  emailDisplay: "office@esosh.net",
  emailHref: "mailto:office@esosh.net",
  appDisplay: "eRisk-Control",
  appHref: "https://eriskcontrol.com/uk",
};
