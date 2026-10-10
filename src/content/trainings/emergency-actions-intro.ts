import type { LocalizedString } from "./types";

/**
 * RU: Вступ «Дії у надзвичайних ситуаціях. Базовий курс».
 * EN: Intro for Actions in emergency situations. Basic course.
 */
export type EmergencyActionsIntroCopy = {
  title: LocalizedString;
  paragraphs: LocalizedString[];
  /** Use `{email}` placeholder for the mailto link. */
  inviteTrainings: LocalizedString;
  signName: LocalizedString;
  signOrg: LocalizedString;
  emailDisplay: string;
  emailHref: string;
};

export const emergencyActionsIntro: EmergencyActionsIntroCopy = {
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
      uk: "В умовах війни готовність до небезпек особливо важлива. Завчасна підготовка, зрозумілий порядок дій і практичні навички допомагають зменшити розгубленість, швидше ухвалювати зважені рішення та захистити себе й людей поруч.",
      en: "In wartime, readiness for hazards is especially important. Advance preparation, a clear course of action, and practical skills help reduce confusion, make sound decisions faster, and protect yourself and people nearby.",
      de: "In wartime, readiness for hazards is especially important. Advance preparation, a clear course of action, and practical skills help reduce confusion, make sound decisions faster, and protect yourself and people nearby.",
      es: "In wartime, readiness for hazards is especially important. Advance preparation, a clear course of action, and practical skills help reduce confusion, make sound decisions faster, and protect yourself and people nearby.",
      fr: "In wartime, readiness for hazards is especially important. Advance preparation, a clear course of action, and practical skills help reduce confusion, make sound decisions faster, and protect yourself and people nearby.",
      az: "In wartime, readiness for hazards is especially important. Advance preparation, a clear course of action, and practical skills help reduce confusion, make sound decisions faster, and protect yourself and people nearby.",
      kk: "In wartime, readiness for hazards is especially important. Advance preparation, a clear course of action, and practical skills help reduce confusion, make sound decisions faster, and protect yourself and people nearby.",
    },
    {
      uk: "Як спільнота фахівців із безпеки та здоров’я на роботі, ми дбаємо про вашу безпеку та запрошуємо пройти цей курс безоплатно. Ви ознайомитеся з основними принципами дій у надзвичайних ситуаціях, щоб краще розпізнавати загрози та розуміти, як реагувати на них. Знання дають основу для правильних рішень, а регулярне практичне відпрацювання допомагає діяти впевненіше навіть в умовах стресу.",
      en: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn the basic principles of action in emergency situations so you can better recognize threats and understand how to respond. Knowledge provides a foundation for the right decisions, and regular practical drills help you act more confidently even under stress.",
      de: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn the basic principles of action in emergency situations so you can better recognize threats and understand how to respond. Knowledge provides a foundation for the right decisions, and regular practical drills help you act more confidently even under stress.",
      es: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn the basic principles of action in emergency situations so you can better recognize threats and understand how to respond. Knowledge provides a foundation for the right decisions, and regular practical drills help you act more confidently even under stress.",
      fr: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn the basic principles of action in emergency situations so you can better recognize threats and understand how to respond. Knowledge provides a foundation for the right decisions, and regular practical drills help you act more confidently even under stress.",
      az: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn the basic principles of action in emergency situations so you can better recognize threats and understand how to respond. Knowledge provides a foundation for the right decisions, and regular practical drills help you act more confidently even under stress.",
      kk: "As a community of occupational safety and health professionals, we care about your safety and invite you to take this course free of charge. You will learn the basic principles of action in emergency situations so you can better recognize threats and understand how to respond. Knowledge provides a foundation for the right decisions, and regular practical drills help you act more confidently even under stress.",
    },
    {
      uk: "Курс підготовлено на основі рекомендацій ДСНС, Збройних Сил України та Міністерства охорони здоров’я України з використанням інструментів штучного інтелекту для представлення матеріалів. Курс має навчально-інформаційний характер і не замінює практичної підготовки, професійної допомоги чи актуальних вказівок уповноважених служб.",
      en: "The course was prepared based on recommendations of the State Emergency Service of Ukraine (SES), the Armed Forces of Ukraine, and the Ministry of Health of Ukraine, using artificial intelligence tools to present the materials. The course is educational and informational and does not replace practical training, professional assistance, or current instructions from authorised services.",
      de: "The course was prepared based on recommendations of the State Emergency Service of Ukraine (SES), the Armed Forces of Ukraine, and the Ministry of Health of Ukraine, using artificial intelligence tools to present the materials. The course is educational and informational and does not replace practical training, professional assistance, or current instructions from authorised services.",
      es: "The course was prepared based on recommendations of the State Emergency Service of Ukraine (SES), the Armed Forces of Ukraine, and the Ministry of Health of Ukraine, using artificial intelligence tools to present the materials. The course is educational and informational and does not replace practical training, professional assistance, or current instructions from authorised services.",
      fr: "The course was prepared based on recommendations of the State Emergency Service of Ukraine (SES), the Armed Forces of Ukraine, and the Ministry of Health of Ukraine, using artificial intelligence tools to present the materials. The course is educational and informational and does not replace practical training, professional assistance, or current instructions from authorised services.",
      az: "The course was prepared based on recommendations of the State Emergency Service of Ukraine (SES), the Armed Forces of Ukraine, and the Ministry of Health of Ukraine, using artificial intelligence tools to present the materials. The course is educational and informational and does not replace practical training, professional assistance, or current instructions from authorised services.",
      kk: "The course was prepared based on recommendations of the State Emergency Service of Ukraine (SES), the Armed Forces of Ukraine, and the Ministry of Health of Ukraine, using artificial intelligence tools to present the materials. The course is educational and informational and does not replace practical training, professional assistance, or current instructions from authorised services.",
    },
  ],
  inviteTrainings: {
    uk: "Запрошуємо на наші поглиблені тренінги з дій у надзвичайних ситуаціях і практичні навчання на робочих місцях з урахуванням особливостей вашого підприємства — {email}.",
    en: "We invite you to our in-depth trainings on emergency actions and practical workplace drills tailored to your enterprise — {email}.",
    de: "We invite you to our in-depth trainings on emergency actions and practical workplace drills tailored to your enterprise — {email}.",
    es: "We invite you to our in-depth trainings on emergency actions and practical workplace drills tailored to your enterprise — {email}.",
    fr: "We invite you to our in-depth trainings on emergency actions and practical workplace drills tailored to your enterprise — {email}.",
    az: "We invite you to our in-depth trainings on emergency actions and practical workplace drills tailored to your enterprise — {email}.",
    kk: "We invite you to our in-depth trainings on emergency actions and practical workplace drills tailored to your enterprise — {email}.",
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
};
