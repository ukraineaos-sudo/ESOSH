import type { QuizQuestion, TrainingDetail, TrainingQuizUi } from "./types";

const quizUi: TrainingQuizUi = {
  title: {
    uk: "Перевірка знань",
    en: "Knowledge check",
    de: "Wissenscheck",
    es: "Comprobación de conocimientos",
    fr: "Contrôle des connaissances",
    az: "Bilik yoxlaması",
    kk: "Білім тексерісі",
  },
  submit: {
    uk: "Перевірити відповіді",
    en: "Check answers",
    de: "Antworten prüfen",
    es: "Comprobar respuestas",
    fr: "Vérifier les réponses",
    az: "Cavabları yoxla",
    kk: "Жауаптарды тексеру",
  },
  reset: {
    uk: "Спробувати ще раз",
    en: "Try again",
    de: "Erneut versuchen",
    es: "Intentar de nuevo",
    fr: "Réessayer",
    az: "Yenidən cəhd edin",
    kk: "Қайта көру",
  },
  incomplete: {
    uk: "Оберіть відповідь на кожне запитання, щоб перевірити результат.",
    en: "Select an answer for every question to check your result.",
    de: "Wählen Sie für jede Frage eine Antwort, um Ihr Ergebnis zu prüfen.",
    es: "Seleccione una respuesta para cada pregunta para comprobar su resultado.",
    fr: "Sélectionnez une réponse pour chaque question afin de vérifier votre résultat.",
    az: "Nəticəni yoxlamaq üçün hər suala cavab seçin.",
    kk: "Нәтижені тексеру үшін әр сұраққа жауап таңдаңыз.",
  },
  scoreLabel: {
    uk: "Результат: {score} з {total}",
    en: "Score: {score} of {total}",
    de: "Ergebnis: {score} von {total}",
    es: "Resultado: {score} de {total}",
    fr: "Score : {score} sur {total}",
    az: "Nəticə: {score} / {total}",
    kk: "Нәтиже: {score} / {total}",
  },
  correctLabel: {
    uk: "Правильно",
    en: "Correct",
    de: "Richtig",
    es: "Correcto",
    fr: "Correct",
    az: "Düzgün",
    kk: "Дұрыс",
  },
  wrongLabel: {
    uk: "Неправильно",
    en: "Incorrect",
    de: "Falsch",
    es: "Incorrecto",
    fr: "Incorrect",
    az: "Yanlış",
    kk: "Қате",
  },
};

function q(
  id: number,
  questionUk: string,
  optionsUk: [string, string, string, string] | [string, string, string, string, string],
  correctIndex: 1 | 2 | 3 | 4 | 5,
): QuizQuestion {
  const letters = ["A", "B", "C", "D", "E"] as const;
  const options: QuizQuestion["options"] = {};
  optionsUk.forEach((text, index) => {
    options[letters[index]] = { uk: text };
  });
  return {
    id,
    question: { uk: questionUk },
    options,
    correct: letters[correctIndex - 1],
  };
}

/**
 * RU: Курс «Оцінювання ризиків: вступний курс» — 3 модулі, відео + тест (uk), сертифікат uk/en.
 * EN: Risk Assessment: Awareness Course — 3 modules; quiz stays uk (video language); cert uk/en PDFs.
 */
export const riskAssessmentTraining: TrainingDetail = {
  slug: "risk-assessment",
  href: "/education/trainings/risk-assessment",
  title: {
    uk: "Оцінювання ризиків: вступний курс",
    en: "Risk Assessment: Awareness Course",
    de: "Risikobewertung: Einführungskurs",
    es: "Evaluación de riesgos: curso de sensibilización",
    fr: "Évaluation des risques : cours de sensibilisation",
    az: "Risklərin qiymətləndirilməsi: giriş kursu",
    kk: "Тәуекелді бағалау: кіріспе курс",
  },
  summary: {
    uk: "Три модулі: ризикоорієнтоване мислення, матриця оцінювання ризиків та ієрархія заходів контролю. Після кожного відео — тест з 5 питань.",
    en: "Three modules: risk-based thinking, the risk assessment matrix, and the hierarchy of controls. After each video — a 5-question quiz (Ukrainian, matching the video).",
    de: "Drei Module: risikobasiertes Denken, Risikobewertungsmatrix und Hierarchie der Kontrollmaßnahmen. Nach jedem Video — ein Test mit 5 Fragen (Ukrainisch, passend zum Video).",
    es: "Tres módulos: pensamiento basado en el riesgo, matriz de evaluación de riesgos y jerarquía de controles. Tras cada vídeo — un test de 5 preguntas (en ucraniano, como el vídeo).",
    fr: "Trois modules : pensée fondée sur les risques, matrice d’évaluation des risques et hiérarchie des mesures de contrôle. Après chaque vidéo — un test de 5 questions (en ukrainien, comme la vidéo).",
    az: "Üç modul: risk əsaslı düşüncə, risklərin qiymətləndirilməsi matrisi və nəzarət tədbirlərinin iyerarxiyası. Hər videodan sonra — 5 suallıq test (ukraynaca, video ilə eyni).",
    kk: "Үш модуль: тәуекелге негізделген ойлау, тәуекелді бағалау матрицасы және бақылау шаралары иерархиясы. Әр бейнеден кейін — 5 сұрақты тест (украин тілінде, бейнемен бірдей).",
  },
  courseCode: "RA",
  duration: {
    uk: "30 хвилин",
    en: "30 minutes",
  },
  certificateTitles: {
    uk: "ОЦІНЮВАННЯ РИЗИКІВ: ВСТУПНИЙ КУРС",
    en: "RISK ASSESSMENT: AWARENESS COURSE",
  },
  /** Static PDF kept as legacy fallback reference; named generator is primary when courseCode is set. */
  certificateDocId: "trainings/risk-assessment-certificate",
  passThresholdPercent: 75,
  quizUi,
  modules: [
    {
      id: "part-1",
      title: {
        uk: "Модуль 1. Ризикоорієнтоване мислення",
        en: "Module 1. Risk-based Thinking",
        de: "Modul 1. Risikobasiertes Denken",
        es: "Módulo 1. Pensamiento basado en el riesgo",
        fr: "Module 1. Pensée fondée sur les risques",
        az: "Modul 1. Risk əsaslı düşüncə",
        kk: "1-модуль. Тәуекелге негізделген ойлау",
      },
      videoTitle: {
        uk: "Відео · Модуль 1 з 3 — Ризикоорієнтоване мислення",
        en: "Video · Module 1 of 3 — Risk-based Thinking",
        de: "Video · Modul 1 von 3 — Risikobasiertes Denken",
        es: "Vídeo · Módulo 1 de 3 — Pensamiento basado en el riesgo",
        fr: "Vidéo · Module 1 sur 3 — Pensée fondée sur les risques",
        az: "Video · 3-dən 1-ci modul — Risk əsaslı düşüncə",
        kk: "Бейне · 3-тің 1-модулі — Тәуекелге негізделген ойлау",
      },
      youtubeId: "bNO7uJzgt1A",
      quiz: [
        q(
          101,
          "Що, згідно з відео, найчастіше стає справжньою причиною більшості нещасних випадків на виробництві?",
          [
            "Повна відсутність будь-яких суворих правил",
            "Ілюзія безпеки та втрата пильності",
            "Використання застарілого обладнання в цеху",
            "Свідоме порушення інструкцій співробітником",
          ],
          2,
        ),
        q(
          102,
          "Яка ключова відмінність між термінами «небезпека» і «ризик» розглядається в цьому навчальному матеріалі?",
          [
            "Небезпека є об’єктивним джерелом, а ризик — ймовірністю взаємодії з ним",
            "Небезпеку завжди можна легко усунути, тоді як ризик є неминучим явищем",
            "Небезпека виникає лише на виробництві, а різні ризики існують скрізь у побуті",
            "Ризик є виключно теоретичним поняттям, а небезпека має фізичну форму",
          ],
          1,
        ),
        q(
          103,
          "З яких трьох послідовних кроків складається базова європейська формула уважності та безпеки?",
          [
            "Зупинився, перевірив, доповів керівнику",
            "Прочитав, підписав, обережно виконав задачу",
            "Побачив, подумав, надійно захистив себе і колег",
            "Знайшов, попередив, швидко ізолював проблему",
          ],
          3,
        ),
        q(
          104,
          "Який із наведених нижче факторів лектор відносить до категорії так званих «невидимих загроз» на роботі?",
          [
            "Кабель живлення, що лежить прямо в проході",
            "Важка коробка на шляху екстреної евакуації",
            "Фізіологічна втома та накопичений стрес",
            "Відкрита нижня шухляда вашого робочого столу в офісі",
          ],
          3,
        ),
        q(
          105,
          "Як правильно діяти згідно з базовим алгоритмом, якщо ви помітили небезпеку, яку можете усунути самі?",
          [
            "Скласти докладний письмовий звіт для фахівця",
            "Невідкладно зупинити весь робочий процес у цеху",
            "Повідомити колег і дочекатися кваліфікованої допомоги",
            "Самостійно і абсолютно безпечно вирішити проблему",
          ],
          4,
        ),
      ],
    },
    {
      id: "part-2",
      title: {
        uk: "Модуль 2. Матриця оцінювання ризиків",
        en: "Module 2. Risk Assessment Matrix",
        de: "Modul 2. Risikobewertungsmatrix",
        es: "Módulo 2. Matriz de evaluación de riesgos",
        fr: "Module 2. Matrice d’évaluation des risques",
        az: "Modul 2. Risklərin qiymətləndirilməsi matrisi",
        kk: "2-модуль. Тәуекелді бағалау матрицасы",
      },
      videoTitle: {
        uk: "Відео · Модуль 2 з 3 — Матриця оцінювання ризиків",
        en: "Video · Module 2 of 3 — Risk Assessment Matrix",
        de: "Video · Modul 2 von 3 — Risikobewertungsmatrix",
        es: "Vídeo · Módulo 2 de 3 — Matriz de evaluación de riesgos",
        fr: "Vidéo · Module 2 sur 3 — Matrice d’évaluation des risques",
        az: "Video · 3-dən 2-ci modul — Risklərin qiymətləndirilməsi matrisi",
        kk: "Бейне · 3-тің 2-модулі — Тәуекелді бағалау матрицасы",
      },
      youtubeId: "A6u6r8lRBTc",
      quiz: [
        q(
          201,
          "Як сучасні міжнародні стандарти, зокрема ISO 45001, визначають поняття ризику на підприємстві?",
          [
            "Як неминучу статистичну похибку під час роботи",
            "Як вплив будь-якої невизначеності на досягнення ваших цілей",
            "Як гарантовану шкоду для здоров’я або майна компанії",
            "Як виключно фінансові збитки через нещасні випадки",
          ],
          2,
        ),
        q(
          202,
          "Яка дія є обов’язковим п’ятим етапом у процесі формалізованої оцінки ризиків на виробництві?",
          [
            "Розробка принципово нових засобів захисту для персоналу",
            "Постійний моніторинг і регулярний перегляд робочих умов",
            "Затвердження всієї документації у вищого керівництва компанії",
            "Проведення загального інструктажу для всіх команд на підприємстві",
          ],
          2,
        ),
        q(
          203,
          "Яка математична формула лежить в основі розрахунку загального бала за стандартною виробничою матрицею ризиків?",
          [
            "Ризик дорівнює ймовірності, помноженій на важкість можливих наслідків",
            "Ризик дорівнює важкості наслідків, поділеній на базову ймовірність",
            "Ризик дорівнює сумі балів ймовірності та важкості можливих наслідків",
            "Ризик дорівнює частоті події, віднятій від загального рівня небезпеки",
          ],
          1,
        ),
        q(
          204,
          "Що вимагають правила системної безпеки, якщо розрахований бал ризику опинився глибоко в «червоній зоні» (наприклад, 16)?",
          [
            "Продовжувати працювати з максимальною обережністю і під наглядом",
            "Негайно зупинити роботу до впровадження нових заходів контролю ризиків",
            "Написати докладну пояснювальну записку і продовжити весь процес",
            "Використовувати додаткові сучасні засоби особистого захисту",
          ],
          2,
        ),
        q(
          205,
          "У чому полягає суть принципу ALARP під час впровадження заходів для зниження виробничих ризиків?",
          [
            "Зведення абсолютно всіх можливих ризиків до нульового базового рівня",
            "Забезпечення максимальної безпеки незалежно від будь-яких фін. витрат",
            "Зниження ризику до рівня розумного балансу із затратами та зусиллями",
            "Повне перекладання відповідальності за безпеку на виконавців",
          ],
          3,
        ),
      ],
    },
    {
      id: "part-3",
      title: {
        uk: "Модуль 3. Ієрархія заходів контролю",
        en: "Module 3. Hierarchy of Controls",
        de: "Modul 3. Hierarchie der Kontrollmaßnahmen",
        es: "Módulo 3. Jerarquía de controles",
        fr: "Module 3. Hiérarchie des mesures de contrôle",
        az: "Modul 3. Nəzarət tədbirlərinin iyerarxiyası",
        kk: "3-модуль. Бақылау шаралары иерархиясы",
      },
      videoTitle: {
        uk: "Відео · Модуль 3 з 3 — Ієрархія заходів контролю",
        en: "Video · Module 3 of 3 — Hierarchy of Controls",
        de: "Video · Modul 3 von 3 — Hierarchie der Kontrollmaßnahmen",
        es: "Vídeo · Módulo 3 de 3 — Jerarquía de controles",
        fr: "Vidéo · Module 3 sur 3 — Hiérarchie des mesures de contrôle",
        az: "Video · 3-dən 3-cü modul — Nəzarət tədbirlərinin iyerarxiyası",
        kk: "Бейне · 3-тің 3-модулі — Бақылау шаралары иерархиясы",
      },
      youtubeId: "xFZQaBMh3fA",
      quiz: [
        q(
          301,
          "Який захід контролю ризиків перебуває на самій вершині перевернутої піраміди і вважається найефективнішим?",
          [
            "Суворі адміністративні та організаційні заходи контролю",
            "Сучасні засоби індивідуального захисту працівників",
            "Повне фізичне усунення самого джерела небезпеки",
            "Заміна небезпечного робочого процесу на безпечніший",
          ],
          3,
        ),
        q(
          302,
          "Чому засоби індивідуального захисту (ЗІЗ) перебувають на самому нижньому рівні ієрархії заходів контролю?",
          [
            "Вони потребують надто великих регулярних фінансових витрат від керівництва",
            "Вони заважають працівникам швидко і максимально якісно виконувати роботу",
            "Вони починають працювати лише тоді, коли небезпека вже діє на вас",
            "Вони потребують постійного оновлення через надто швидкий знос",
          ],
          3,
        ),
        q(
          303,
          "З яких трьох кроків складається концепція динамічної оцінки ризиків безпосередньо на вашому робочому місці?",
          [
            "Запитай, перевір, обережно починай працювати",
            "Зупинись, подумай, потім безпечно дій",
            "Оглянься, повідом, очікуй подальших вказівок",
            "Сплануй, підпиши, швидко виконай свою задачу",
          ],
          2,
        ),
        q(
          304,
          "Що потрібно зробити згідно з правилами динамічної оцінки, якщо під час робіт різко змінилися зовнішні умови (наприклад, пішов злива)?",
          [
            "Продовжити роботу, але збільшити темп для максимально швидкого завершення",
            "Зробити перерву на десять хвилин і потім спокійно повернутися до своїх задач",
            "Зупинитися і провести нову оцінку ризиків через зміну обставин",
            "Одягнути відповідний захисний одяг і ігнорувати всі інші зміни",
          ],
          3,
        ),
        q(
          305,
          "Як сучасна культура безпеки трактує ситуацію, коли працівник самостійно зупиняє відверто небезпечну роботу?",
          [
            "Як ознаку високого професіоналізму та зрілої культури безпеки",
            "Як неприпустиме порушення трудової дисципліни і явний зрив дедлайнів",
            "Як прояв невпевненості працівника у власній кваліфікації та силах",
            "Як дію, що потребує негайного дисциплінарного стягнення і штрафу",
          ],
          1,
        ),
      ],
    },
  ],
};
