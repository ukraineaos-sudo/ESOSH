import type { LocalizedString } from "./types";

/** RU: Локалізований рядок з EN-fallback для вторинних локалей. */
function L(uk: string, en: string): LocalizedString {
  return { uk, en, de: en, es: en, fr: en, az: en, kk: en };
}

export type OilGasSiteSafetyIntroSection = {
  title: LocalizedString;
  paragraphs: LocalizedString[];
  bullets?: LocalizedString[];
};

/**
 * RU: Вступ курсу OGS (опис з листа замовника).
 * EN: Oil-gas course intro (client-provided description).
 */
export type OilGasSiteSafetyIntroCopy = {
  sections: OilGasSiteSafetyIntroSection[];
  /** Use `{email}` for mailto. */
  inviteTrainings: LocalizedString;
  /** Use `{app}` for eRisk-Control link. */
  inviteApp: LocalizedString;
  closing: LocalizedString;
  signName: LocalizedString;
  signRole: LocalizedString;
  emailDisplay: string;
  emailHref: string;
  appDisplay: string;
  appHref: string;
};

export const oilGasSiteSafetyIntro: OilGasSiteSafetyIntroCopy = {
  sections: [
    {
      title: L("Чому ми рекомендуємо цей курс", "Why we recommend this course"),
      paragraphs: [
        L(
          "Розпізнати небезпеку, оцінити можливі наслідки та обрати безпечні дії — навички, необхідні кожному працівнику нафтогазової галузі. В умовах війни їхнє значення ще більше зростає. Щоб підтримати працівників і допомогти розвивати ризикоорієнтоване мислення, наша спілка фахівців із безпеки та здоров’я на роботі створила цей безоплатний курс.",
          "Recognizing hazards, assessing possible consequences, and choosing safe actions are skills every oil and gas worker needs. In wartime their importance grows further. To support workers and help develop risk-based thinking, our community of occupational safety and health professionals created this free course.",
        ),
      ],
    },
    {
      title: L("Для кого та чого ви навчитеся", "Who it is for and what you will learn"),
      paragraphs: [
        L(
          "Курс призначений для працівників нафтогазової галузі. На прикладі установок підготовки газу ви навчитеся:",
          "The course is intended for oil and gas industry workers. Using gas processing facilities as examples, you will learn to:",
        ),
      ],
      bullets: [
        L(
          "розпізнавати небезпеки на робочому місці;",
          "recognize hazards at the workplace;",
        ),
        L(
          "оцінювати ймовірність і тяжкість можливих наслідків за допомогою матриці ризиків;",
          "assess the likelihood and severity of possible consequences using a risk matrix;",
        ),
        L(
          "обирати заходи захисту відповідно до ієрархії заходів контролю.",
          "choose protective measures according to the hierarchy of controls.",
        ),
      ],
    },
    {
      title: L("На чому ґрунтується курс", "What the course is based on"),
      paragraphs: [
        L(
          "Матеріали спираються на принципи Директиви 89/391/ЄЕС, положення ухваленого Верховною Радою Закону України «Про безпеку та здоров’я працівників на роботі» та Правила безпеки в нафтогазодобувній промисловості (НПАОП 11.1-1.16-23).",
          "The materials draw on the principles of Directive 89/391/EEC, the Law of Ukraine “On Safety and Health of Workers at Work” adopted by the Verkhovna Rada, and the Safety Rules in the Oil and Gas Production Industry (NPAOP 11.1-1.16-23).",
        ),
        L(
          "Для підготовки й представлення матеріалів використано інструменти ШІ.",
          "AI tools were used to prepare and present the materials.",
        ),
      ],
    },
    {
      title: L("Як отримати сертифікат", "How to get a certificate"),
      paragraphs: [
        L(
          "Опрацюйте матеріали та пройдіть підсумковий тест. Набравши щонайменше 80% правильних відповідей, введіть своє ім’я та завантажте сертифікат. Реєстрація не потрібна.",
          "Study the materials and take the final test. After scoring at least 80% correct answers, enter your name and download the certificate. No registration is required.",
        ),
      ],
    },
    {
      title: L(
        "Для подальшого навчання та практики",
        "For further training and practice",
      ),
      paragraphs: [],
    },
  ],
  inviteTrainings: L(
    "Щодо поглиблених тренінгів «Фахівець з оцінки ризиків» і навчання для підприємств пишіть: {email}.",
    "For in-depth “Risk Assessment Specialist” trainings and enterprise learning, write to {email}.",
  ),
  inviteApp: L(
    "Для оцінювання ризиків спробуйте наш ШІ-застосунок {app}.",
    "For risk assessment, try our AI application {app}.",
  ),
  closing: L("Бажаємо безпечної роботи!", "We wish you safe work!"),
  signName: L("Ольга Богданова", "Olha Bohdanova"),
  signRole: L(
    "Голова правління ГС «Європейське співтовариство з охорони праці»",
    "Chair of the Board, NGO “European Society of Occupational Safety and Health”",
  ),
  emailDisplay: "office@esosh.net",
  emailHref: "mailto:office@esosh.net",
  appDisplay: "eRisk-Control",
  appHref: "https://eriskcontrol.com/uk",
};
