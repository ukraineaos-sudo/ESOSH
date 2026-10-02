import type { TrainingDetail, TrainingQuizUi } from "./types";

const quizUi: TrainingQuizUi = {
  title: {
    uk: "Перевірка знань",
    en: "Knowledge check",
  },
  submit: {
    uk: "Перевірити відповіді",
    en: "Check answers",
  },
  reset: {
    uk: "Спробувати ще раз",
    en: "Try again",
  },
  incomplete: {
    uk: "Оберіть відповідь на кожне запитання, щоб перевірити результат.",
    en: "Select an answer for every question to check your result.",
  },
  scoreLabel: {
    uk: "Результат: {score} з {total}",
    en: "Score: {score} of {total}",
  },
  correctLabel: {
    uk: "Правильно",
    en: "Correct",
  },
  wrongLabel: {
    uk: "Неправильно",
    en: "Incorrect",
  },
};

/** RU: Тренінг «Дії під час атак БПЛА». EN: UAV-attacks training with quiz. */
export const uavAttacksTraining: TrainingDetail = {
  slug: "uav-attacks",
  href: "/education/trainings/uav-attacks",
  title: {
    uk: "Дії під час атак БПЛА",
    en: "Actions during UAV attacks",
    de: "Verhalten bei UAV-Angriffen",
    es: "Actuación durante ataques con UAV",
    fr: "Conduite à tenir lors d’attaques par UAV",
    az: "PİA hücumları zamanı hərəkətlər",
    kk: "UAV шабуылдары кезіндегі әрекеттер",
  },
  summary: {
    uk: "Відеотренінг про безпечні дії цивільних під час атак безпілотників, з перевіркою знань після перегляду.",
    en: "A video training on civilian safety actions during UAV attacks, with a knowledge check after watching.",
    de: "Videoschulung zu sicherem Verhalten von Zivilpersonen bei Drohnenangriffen, mit Wissenscheck nach dem Anschauen.",
    es: "Formación en vídeo sobre actuaciones de seguridad de civiles durante ataques con drones, con comprobación de conocimientos tras el visionado.",
    fr: "Formation vidéo sur les actions de sécurité des civils lors d’attaques de drones, avec contrôle des connaissances après le visionnage.",
    az: "PİA (drones) hücumları zamanı mülki şəxslərin təhlükəsiz hərəkətləri üzrə video təlim, baxışdan sonra bilik yoxlaması ilə.",
    kk: "Ұшқышсыз ұшақтар шабуылы кезінде бейбіт тұрғындардың қауіпсіз әрекеттері бойынша бейне тренинг, қарағаннан кейін білім тексерісімен.",
  },
  certificateDocId: "trainings/uav-attacks-certificate",
  passThresholdPercent: 80,
  quizUi,
  modules: [
    {
      id: "main",
      title: {
        uk: "Модуль 1",
        en: "Module 1",
      },
      videoTitle: {
        uk: "Відео: Дії під час атак БПЛА",
        en: "Video: Actions during UAV attacks",
      },
      youtubeId: "7k3REZ12lpo",
      quiz: [
    {
      id: 1,
      question: {
        uk: "Яка тактична ознака названа головною відмінністю FPV-дрона від ударного камікадзе типу «Шахед»?",
        en: "Which tactical feature is named as the main difference between an FPV drone and a Shahed-type kamikaze strike UAV?",
      },
      options: {
        A: {
          uk: "Наявність живого оператора, який прицільно шукає рухомі об'єкти",
          en: "A live operator who deliberately searches for moving targets",
        },
        B: {
          uk: "Здатність рухатися на гранично малих висотах вздовж міських вулиць",
          en: "The ability to fly at extremely low altitude along city streets",
        },
        C: {
          uk: "Застосування виключно осколкової бойової частини спрямованої дії",
          en: "Use of an exclusively fragmentation warhead with directed effect",
        },
      },
      correct: "A",
    },
    {
      id: 2,
      question: {
        uk: "Яку дихальну техніку рекомендовано застосовувати для фізіологічного зниження частоти пульсу?",
        en: "Which breathing technique is recommended to physiologically lower the pulse rate?",
      },
      options: {
        A: {
          uk: "Затримку дихання на вісім секунд одразу після глибокого видиху",
          en: "Holding the breath for eight seconds right after a deep exhale",
        },
        B: {
          uk: "Повільний вдих на три рахунки та подовжений видих на шість рахунків",
          en: "A slow inhale for a count of three and a prolonged exhale for a count of six",
        },
        C: {
          uk: "Серію коротких інтенсивних вдихів через ніс протягом однієї хвилини",
          en: "A series of short intense nasal inhales for one minute",
        },
      },
      correct: "B",
    },
    {
      id: 3,
      question: {
        uk: "Яке технічне рішення для вікон блокує від 90 до 95% руйнівної енергії вибухової хвилі?",
        en: "Which window protection solution blocks 90–95% of the destructive energy of a blast wave?",
      },
      options: {
        A: {
          uk: "Поєднання ударостійкого скла триплекс та важких металевих ролет",
          en: "A combination of impact-resistant triplex glass and heavy metal roller shutters",
        },
        B: {
          uk: "Наклеювання багатошарової малярної стрічки або армованого скотчу",
          en: "Applying multiple layers of masking tape or reinforced duct tape",
        },
        C: {
          uk: "Встановлення легких зовнішніх металевих ґрат проти кумуляцій",
          en: "Installing light external metal grilles against shaped charges",
        },
      },
      correct: "A",
    },
    {
      id: 4,
      question: {
        uk: "Що згідно з інструкцією необхідно робити, якщо безпілотник уже пікірує у ваш напрямок?",
        en: "According to the guidance, what should you do if a UAV is already diving toward you?",
      },
      options: {
        A: {
          uk: "Лягти на спину, підняти руки догори та широко відкрити очі",
          en: "Lie on your back, raise your arms, and open your eyes wide",
        },
        B: {
          uk: "Бігти по прямій траєкторії на максимальній швидкості до дверей",
          en: "Sprint in a straight line at maximum speed toward a door",
        },
        C: {
          uk: "Здійснювати спринт змійкою, різко змінюючи вектор кожні 7-10 м",
          en: "Sprint in a zigzag, sharply changing direction every 7–10 m",
        },
      },
      correct: "C",
    },
    {
      id: 5,
      question: {
        uk: "Яке положення тіла слід прийняти пішоходу під час неминучого скиду вибухівки або вибуху?",
        en: "What body position should a pedestrian take during an imminent explosive drop or blast?",
      },
      options: {
        A: {
          uk: "Впасти обличчям вниз, ноги разом у бік вибуху, відкрити свій рот",
          en: "Drop face-down, keep legs together toward the blast, and open your mouth",
        },
        B: {
          uk: "Лягти на бік, підтягнути ноги до живота та міцно стиснути зуби",
          en: "Lie on your side, pull your knees to your stomach, and clench your teeth",
        },
        C: {
          uk: "Сісти на коліна спиною до епіцентру й закрити вуха обома руками",
          en: "Kneel with your back to the epicenter and cover your ears with both hands",
        },
      },
      correct: "A",
    },
    {
      id: 6,
      question: {
        uk: "Який протокол дій визначено для цивільного автомобіля у разі виявлення атаки ворожого БПЛА?",
        en: "What action protocol is defined for a civilian car if a hostile UAV attack is detected?",
      },
      options: {
        A: {
          uk: "Збільшити швидкість до максимуму, намагаючись відірватися від дрона",
          en: "Increase speed to the maximum and try to outrun the drone",
        },
        B: {
          uk: "Зупинитися, негайно залишити салон та розбігтися у різні боки",
          en: "Stop, leave the cabin immediately, and run in different directions",
        },
        C: {
          uk: "З'їхати на узбіччя та сховатися безпосередньо під днищем машини",
          en: "Pull onto the shoulder and hide directly under the vehicle",
        },
      },
      correct: "B",
    },
    {
      id: 7,
      question: {
        uk: "Які внутрішні локації житлового будинку визначено як небезпечні («червоні зони») при атаці FPV?",
        en: "Which interior locations of a residential building are defined as dangerous (“red zones”) during an FPV attack?",
      },
      options: {
        A: {
          uk: "Ванні кімнати та повністю ізольовані коридори без будь-яких вікон",
          en: "Bathrooms and fully enclosed corridors without any windows",
        },
        B: {
          uk: "Відкриті балкони, верхні поверхи споруди та відкриті сходові клітини",
          en: "Open balconies, upper floors of the building, and open stairwells",
        },
        C: {
          uk: "Цокольні приміщення та глибокі підвали з залізобетонним перекриттям",
          en: "Basement spaces and deep cellars with reinforced-concrete floors",
        },
      },
      correct: "B",
    },
    {
      id: 8,
      question: {
        uk: "Який проміжок часу визначено як «критичне вікно» для нанесення тактичного повторного удару?",
        en: "Which time interval is defined as the “critical window” for a tactical follow-up strike?",
      },
      options: {
        A: {
          uk: "Інтервал тривалістю від десяти до п’ятнадцяти хвилин після атаки",
          en: "An interval of ten to fifteen minutes after the attack",
        },
        B: {
          uk: "Проміжок часу від сорока п’яти до шістдесяти хвилин після вибуху",
          en: "A period of forty-five to sixty minutes after the blast",
        },
        C: {
          uk: "Період тривалістю від двох до чотирьох хвилин від моменту влучання",
          en: "A period of two to four minutes from the moment of impact",
        },
      },
      correct: "A",
    },
    {
      id: 9,
      question: {
        uk: "На яку мінімальну дистанцію від місця першого влучання необхідно відійти для безпеки?",
        en: "What minimum distance from the first impact site should you move away for safety?",
      },
      options: {
        A: {
          uk: "Відстань від сорока до сімдесяти метрів",
          en: "A distance of forty to seventy meters",
        },
        B: {
          uk: "Відстань від ста до двохсот метрів укриття",
          en: "A distance of one hundred to two hundred meters to shelter",
        },
        C: {
          uk: "Відстань від чотирьохсот до шестисот метрів",
          en: "A distance of four hundred to six hundred meters",
        },
      },
      correct: "B",
    },
    {
      id: 10,
      question: {
        uk: "Чому категорично заборонено публікувати в мережі фото та відеоматеріали з місць прильотів?",
        en: "Why is it strictly forbidden to post photos and videos from impact sites online?",
      },
      options: {
        A: {
          uk: "Це провокує миттєве перевантаження базових станцій мобільного зв’язку",
          en: "It instantly overloads mobile base stations",
        },
        B: {
          uk: "Це порушує юридичні авторські права операторів відеофіксації подій",
          en: "It violates the copyright of operators filming the events",
        },
        C: {
          uk: "Це дозволяє аналітикам ворога встановити координати для другого дрона",
          en: "It lets enemy analysts establish coordinates for a second drone",
        },
      },
      correct: "C",
    },
  ],
    },
  ],
};
