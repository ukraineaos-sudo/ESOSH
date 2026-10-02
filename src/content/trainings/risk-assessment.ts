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
 * RU: Курс «Оцінка ризиків» — 3 модулі, відео + тест (uk), сертифікат uk/en.
 * EN: Risk-assessment course — 3 modules; quiz stays uk (video language); cert uk/en PDFs.
 */
export const riskAssessmentTraining: TrainingDetail = {
  slug: "risk-assessment",
  href: "/education/trainings/risk-assessment",
  title: {
    uk: "Оцінка ризиків. Базовий курс",
    en: "Risk assessment. Awareness course",
    de: "Risikobewertung. Basiskurs",
    es: "Evaluación de riesgos. Curso básico",
    fr: "Évaluation des risques. Cours de base",
    az: "Risklərin qiymətləndirilməsi. Əsas kurs",
    kk: "Тәуекелді бағалау. Негізгі курс",
  },
  summary: {
    uk: "Три модулі про культуру безпеки, системну оцінку ризиків та ієрархію заходів контролю. Після кожного відео — тест з 5 питань.",
    en: "Three modules on safety culture, systematic risk assessment, and the hierarchy of controls. After each video — a 5-question quiz (Ukrainian, matching the video).",
    de: "Drei Module zu Sicherheitskultur, systematischer Risikobewertung und der Hierarchie der Kontrollmaßnahmen. Nach jedem Video — ein Test mit 5 Fragen (Ukrainisch, passend zum Video).",
    es: "Tres módulos sobre cultura de seguridad, evaluación sistemática de riesgos y la jerarquía de medidas de control. Tras cada vídeo — un test de 5 preguntas (en ucraniano, como el vídeo).",
    fr: "Trois modules sur la culture de sécurité, l’évaluation systématique des risques et la hiérarchie des mesures de contrôle. Après chaque vidéo — un test de 5 questions (en ukrainien, comme la vidéo).",
    az: "Təhlükəsizlik mədəniyyəti, sistemli risk qiymətləndirilməsi və nəzarət tədbirlərinin iyerarxiyası üzrə üç modul. Hər videodan sonra — 5 suallıq test (ukraynaca, video ilə eyni).",
    kk: "Қауіпсіздік мәдениеті, жүйелі тәуекел бағалауы және бақылау шаралары иерархиясы бойынша үш модуль. Әр бейнеден кейін — 5 сұрақты тест (украин тілінде, бейнемен бірдей).",
  },
  certificateDocId: "trainings/risk-assessment-certificate",
  passThresholdPercent: 75,
  quizUi,
  modules: [
    {
      id: "part-1",
      title: {
        uk: "Частина 1. Культура безпеки та свідоме мислення",
        en: "Part 1. Safety culture and mindful thinking",
        de: "Teil 1. Sicherheitskultur und bewusstes Denken",
        es: "Parte 1. Cultura de seguridad y pensamiento consciente",
        fr: "Partie 1. Culture de sécurité et pensée attentive",
        az: "Hissə 1. Təhlükəsizlik mədəniyyəti və şüurlu düşüncə",
        kk: "1-бөлім. Қауіпсіздік мәдениеті және саналы ойлау",
      },
      videoTitle: {
        uk: "Відео · Частина 1 з 3 — Культура безпеки",
        en: "Video · Part 1 of 3 — Safety culture",
        de: "Video · Teil 1 von 3 — Sicherheitskultur",
        es: "Vídeo · Parte 1 de 3 — Cultura de seguridad",
        fr: "Vidéo · Partie 1 sur 3 — Culture de sécurité",
        az: "Video · 3-dən 1-ci hissə — Təhlükəsizlik mədəniyyəti",
        kk: "Бейне · 3-тің 1-бөлімі — Қауіпсіздік мәдениеті",
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
        uk: "Частина 2. Системна оцінка та матриця ризиків",
        en: "Part 2. Systematic assessment and the risk matrix",
        de: "Teil 2. Systematische Bewertung und Risikomatrix",
        es: "Parte 2. Evaluación sistemática y matriz de riesgos",
        fr: "Partie 2. Évaluation systématique et matrice des risques",
        az: "Hissə 2. Sistemli qiymətləndirmə və risk matrisi",
        kk: "2-бөлім. Жүйелі бағалау және тәуекел матрицасы",
      },
      videoTitle: {
        uk: "Відео · Частина 2 з 3 — Системна оцінка ризиків",
        en: "Video · Part 2 of 3 — Systematic risk assessment",
        de: "Video · Teil 2 von 3 — Systematische Risikobewertung",
        es: "Vídeo · Parte 2 de 3 — Evaluación sistemática de riesgos",
        fr: "Vidéo · Partie 2 sur 3 — Évaluation systématique des risques",
        az: "Video · 3-dən 2-ci hissə — Sistemli risk qiymətləndirilməsi",
        kk: "Бейне · 3-тің 2-бөлімі — Жүйелі тәуекел бағалауы",
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
        uk: "Частина 3. Ієрархія заходів контролю та дії на практиці",
        en: "Part 3. Hierarchy of controls and action in practice",
        de: "Teil 3. Hierarchie der Kontrollmaßnahmen und Handeln in der Praxis",
        es: "Parte 3. Jerarquía de controles y actuación en la práctica",
        fr: "Partie 3. Hiérarchie des mesures de contrôle et action en pratique",
        az: "Hissə 3. Nəzarət tədbirlərinin iyerarxiyası və praktikada hərəkət",
        kk: "3-бөлім. Бақылау шаралары иерархиясы және практикадағы әрекет",
      },
      videoTitle: {
        uk: "Відео · Частина 3 з 3 — Ієрархія заходів контролю",
        en: "Video · Part 3 of 3 — Hierarchy of controls",
        de: "Video · Teil 3 von 3 — Hierarchie der Kontrollmaßnahmen",
        es: "Vídeo · Parte 3 de 3 — Jerarquía de controles",
        fr: "Vidéo · Partie 3 sur 3 — Hiérarchie des mesures de contrôle",
        az: "Video · 3-dən 3-cü hissə — Nəzarət tədbirlərinin iyerarxiyası",
        kk: "Бейне · 3-тің 3-бөлімі — Бақылау шаралары иерархиясы",
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
