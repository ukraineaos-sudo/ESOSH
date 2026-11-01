import type {
  QuizQuestion,
  TrainingDetail,
  TrainingPractice3d,
  TrainingQuizUi,
} from "./types";

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
  optionsUk: [string, string, string, string],
  correctIndex: 1 | 2 | 3 | 4,
): QuizQuestion {
  const letters = ["A", "B", "C", "D"] as const;
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

const practice3d: TrainingPractice3d = {
  title: {
    uk: "3D-практикум для закріплення",
    en: "3D practice to reinforce learning",
    de: "3D-Übung zur Vertiefung",
    es: "Práctica 3D para consolidar lo aprendido",
    fr: "Pratique 3D pour consolider les acquis",
    az: "Möhkəmləndirmə üçün 3D praktikum",
    kk: "Бекітуге арналған 3D практикум",
  },
  summary: {
    uk: "Огляньте майданчик, натискайте на обладнання та порівнюйте навчальні стани. Це закріплення після тестів — без балів і таймера. Сертифікат від моделі не залежить.",
    en: "Explore the site, tap equipment, and compare training states. Reinforcement after the quizzes — no scores or timer. The certificate does not depend on this model.",
    de: "Erkunden Sie die Anlage, tippen Sie auf Geräte und vergleichen Sie Lernzustände. Vertiefung nach den Tests — ohne Punkte und Timer. Das Zertifikat hängt nicht vom Modell ab.",
    es: "Explore el área, pulse el equipo y compare estados formativos. Refuerzo tras los tests — sin puntuación ni temporizador. El certificado no depende del modelo.",
    fr: "Explorez le site, touchez les équipements et comparez les états pédagogiques. Consolidation après les tests — sans notes ni minuteur. Le certificat ne dépend pas du modèle.",
    az: "Meydançanı gəzin, avadanlığa toxunun və təlim vəziyyətlərini müqayisə edin. Testlərdən sonra möhkəmləndirmə — balsız və taymersiz. Sertifikat modeldən asılı deyil.",
    kk: "Алаңды қарап шығыңыз, жабдықты басыңыз және оқу күйлерін салыстырыңыз. Тесттен кейінгі бекіту — баллсыз және таймерсіз. Сертификат модельге тәуелді емес.",
  },
  pendingLabel: {
    uk: "3D-модель ще готується — інструкції та сцена з’являться пізніше.",
    en: "The 3D model is not ready yet — instructions and the scene will appear later.",
    de: "Das 3D-Modell wird noch vorbereitet — Anleitung und Szene folgen später.",
    es: "El modelo 3D aún se está preparando: las instrucciones y la escena aparecerán más adelante.",
    fr: "Le modèle 3D est en préparation — les instructions et la scène arriveront plus tard.",
    az: "3D model hələ hazırlanır — təlimatlar və səhnə sonra görünəcək.",
    kk: "3D модель әлі дайындалуда — нұсқаулар мен сахна кейін пайда болады.",
  },
  lockedLabel: {
    uk: "Спочатку завершіть усі модулі (відео та тести) — тоді відкриється 3D-практикум.",
    en: "Finish all modules (videos and quizzes) first — then the 3D practice unlocks.",
    de: "Schließen Sie zuerst alle Module (Videos und Tests) ab — dann öffnet sich die 3D-Übung.",
    es: "Complete primero todos los módulos (vídeos y tests): entonces se abrirá la práctica 3D.",
    fr: "Terminez d’abord tous les modules (vidéos et tests) — la pratique 3D s’ouvrira ensuite.",
    az: "Əvvəlcə bütün modulları (video və testlər) bitirin — sonra 3D praktikum açılacaq.",
    kk: "Алдымен барлық модульдерді (бейне және тесттер) аяқтаңыз — содан кейін 3D практикум ашылады.",
  },
  ready: true,
  openAccess: true,
  src: "/praktykum/oil-gas/index.html",
};

/**
 * RU: Курс «Безпека нафтогазового майданчика» — 3 модулі + тести + відкритий 3D.
 * EN: Oil & gas site safety — 3 modules + quizzes + open 3D practice.
 *
 * Answer keys (А=A … Г=D): 1B 2D 3A 4C 5B | 6C 7A 8D 9B 10C | 11D 12B 13A 14C 15A
 */
export const oilGasSiteSafetyTraining: TrainingDetail = {
  slug: "oil-gas-site-safety",
  href: "/education/trainings/oil-gas-site-safety",
  title: {
    uk: "Безпека нафтогазового майданчика",
    en: "Oil and gas site safety",
    de: "Sicherheit auf Öl- und Gasstandorten",
    es: "Seguridad en emplazamientos de petróleo y gas",
    fr: "Sécurité sur les sites pétrolier et gazier",
    az: "Neft-qaz meydançasının təhlükəsizliyi",
    kk: "Мұнай-газ алаңының қауіпсіздігі",
  },
  summary: {
    uk: "Три модулі: ідентифікація небезпек, безпечна робота, дії при зміні умов. Після кожного відео — тест з 5 питань. Нижче — 3D-практикум для інформації.",
    en: "Three modules: hazard identification, safe work, and actions when conditions change. After each video — a 5-question quiz (Ukrainian). Below — 3D practice for information.",
    de: "Drei Module: Gefährdungsermittlung, sicheres Arbeiten und Handeln bei veränderten Bedingungen. Nach jedem Video — ein Test mit 5 Fragen (Ukrainisch). Darunter — 3D-Übung zur Information.",
    es: "Tres módulos: identificación de peligros, trabajo seguro y actuación ante cambios. Tras cada vídeo — un test de 5 preguntas (ucraniano). Abajo — práctica 3D para información.",
    fr: "Trois modules : identification des dangers, travail sûr et actions en cas de changement. Après chaque vidéo — un test de 5 questions (ukrainien). En dessous — pratique 3D pour information.",
    az: "Üç modul: təhlükələrin müəyyənləşdirilməsi, təhlükəsiz iş, şərait dəyişəndə hərəkətlər. Hər videodan sonra — 5 suallıq test (ukraynaca). Aşağıda — məlumat üçün 3D praktikum.",
    kk: "Үш модуль: қауіптерді анықтау, қауіпсіз жұмыс, жағдай өзгергендегі әрекеттер. Әр бейнеден кейін — 5 сұрақты тест (украин тілінде). Төменде — ақпаратқа арналған 3D практикум.",
  },
  courseCode: "OGS",
  duration: {
    uk: "буде уточнено",
    en: "to be confirmed",
  },
  certificateTitles: {
    uk: "БЕЗПЕКА НАФТОГАЗОВОГО МАЙДАНЧИКА",
    en: "OIL AND GAS SITE SAFETY",
  },
  passThresholdPercent: 80,
  showSeekHint: false,
  quizUi,
  practice3d,
  modules: [
    {
      id: "part-1",
      title: {
        uk: "Модуль 1. Ідентифікація небезпек",
        en: "Module 1. Hazard identification",
        de: "Modul 1. Gefährdungsermittlung",
        es: "Módulo 1. Identificación de peligros",
        fr: "Module 1. Identification des dangers",
        az: "Modul 1. Təhlükələrin müəyyənləşdirilməsi",
        kk: "1-модуль. Қауіптерді анықтау",
      },
      videoTitle: {
        uk: "Відео · Модуль 1 з 3 — Ідентифікація небезпек",
        en: "Video · Module 1 of 3 — Hazard identification",
        de: "Video · Modul 1 von 3 — Gefährdungsermittlung",
        es: "Vídeo · Módulo 1 de 3 — Identificación de peligros",
        fr: "Vidéo · Module 1 sur 3 — Identification des dangers",
        az: "Video · 3-dən 1-ci modul — Təhlükələrin müəyyənləşdirilməsi",
        kk: "Бейне · 3-тің 1-модулі — Қауіптерді анықтау",
      },
      youtubeId: "1opmd986LvA",
      quiz: [
        q(
          101,
          "Біля технологічного обладнання немає запаху, видимого витоку чи незвичних звуків. Який висновок найбільш обґрунтований?",
          [
            "Небезпеку можна оцінити за поточними показаннями найближчого манометра.",
            "Безпечність потрібно підтвердити передбаченими для цієї дільниці перевірками.",
            "Безпечність можна підтвердити коротким спостереженням за роботою обладнання.",
            "Небезпеку можна оцінити за відсутністю скарг працівників дільниці.",
          ],
          2,
        ),
        q(
          102,
          "На фланцевому з’єднанні можливий викид середовища під тиском. Що найповніше характеризує ризик для працівника?",
          [
            "Значення робочого тиску та тривалість експлуатації цього з’єднання.",
            "Наявність манометра та відстань до найближчого робочого місця.",
            "Властивості середовища та наявність попереджувального знака біля обладнання.",
            "Імовірність викиду та тяжкість наслідків за фактичних умов.",
          ],
          4,
        ),
        q(
          103,
          "Працівнику видали нові рукавички для роботи з хімічним продуктом. Що насамперед підтверджує правильність їх вибору?",
          [
            "Захисні властивості відповідають продукту та характеру можливого контакту.",
            "Рукавички мають достатню товщину та зручні під час роботи.",
            "Рукавички використовує сусідня бригада на цій самій дільниці.",
            "Виріб має загальне позначення захисту та не має пошкоджень.",
          ],
          1,
        ),
        q(
          104,
          "Насос зупинений, але його кожух знято. Яка обставина залишається непідтвердженою лише за фактом зупинки?",
          [
            "Чи забезпечено достатню освітленість місця для виконання огляду.",
            "Чи є працівник відповідальним за обслуговування цього обладнання.",
            "Чи ізольовано небезпечну енергію та унеможливлено небажаний пуск.",
            "Чи відповідає запланований огляд установленому графіку технічного обслуговування.",
          ],
          3,
        ),
        q(
          105,
          "Для огляду вузла зазвичай підіймаються на майданчик. Запропоновано придатний спосіб огляду з рівня землі. Яка його головна перевага?",
          [
            "Він дозволяє скоротити обговорення небезпек перед виконанням огляду.",
            "Він дозволяє уникнути підйому та пов’язаної небезпеки падіння.",
            "Він дозволяє використати звичайний інструмент замість спеціально підібраного.",
            "Він дозволяє залишити оцінювання умов відповідальному за майданчик.",
          ],
          2,
        ),
      ],
    },
    {
      id: "part-2",
      title: {
        uk: "Модуль 2. Безпечна робота",
        en: "Module 2. Safe work",
        de: "Modul 2. Sicheres Arbeiten",
        es: "Módulo 2. Trabajo seguro",
        fr: "Module 2. Travail en sécurité",
        az: "Modul 2. Təhlükəsiz iş",
        kk: "2-модуль. Қауіпсіз жұмыс",
      },
      videoTitle: {
        uk: "Відео · Модуль 2 з 3 — Безпечна робота",
        en: "Video · Module 2 of 3 — Safe work",
        de: "Video · Modul 2 von 3 — Sicheres Arbeiten",
        es: "Vídeo · Módulo 2 de 3 — Trabajo seguro",
        fr: "Vidéo · Module 2 sur 3 — Travail en sécurité",
        az: "Video · 3-dən 2-ci modul — Təhlükəsiz iş",
        kk: "Бейне · 3-тің 2-модулі — Қауіпсіз жұмыс",
      },
      youtubeId: "pm7QzjyjXk4",
      quiz: [
        q(
          201,
          "Наряд-допуск оформлено, але передбачене ним огородження ще не встановлено. Як має діяти бригада?",
          [
            "Почати після усного погодження з працівником, який видав наряд.",
            "Почати з призначенням спостерігача до завершення встановлення огородження.",
            "Відкласти початок до виконання та підтвердження передбаченого заходу.",
            "Почати зі скороченням складу бригади в зоні виконання робіт.",
          ],
          3,
        ),
        q(
          202,
          "На дільниці є два схожі насоси. Працівник не впевнений, який із них зазначений у завданні. Яка перевірка потрібна?",
          [
            "Звірити позначення обладнання на місці з погодженим завданням.",
            "Звірити розташування обладнання з описом колеги попередньої зміни.",
            "Звірити зовнішній стан обладнання з характером очікуваної несправності.",
            "Звірити показання приладів із типовим режимом роботи потрібного насоса.",
          ],
          1,
        ),
        q(
          203,
          "Особистий газоаналізатор не подає тривоги. Працівник вважає, що це замінює всі перевірки атмосфери перед роботою. Що він не врахував?",
          [
            "Відсутність тривоги підтверджує атмосферу лише за присутності керівника.",
            "Особистий прилад підтверджує атмосферу лише після початку операції.",
            "Відсутність тривоги підтверджує атмосферу лише біля відкритого обладнання.",
            "Особистий прилад не замінює передбачених процедурою підготовчих вимірювань.",
          ],
          4,
        ),
        q(
          204,
          "Ємність відкрили для майбутнього огляду. Яка з наведених обставин сама по собі НЕ підтверджує можливості входу?",
          [
            "Підтверджено виконання потрібної ізоляції джерел небезпечної енергії.",
            "Відкрито люк і протягом певного часу провітрюється ємність.",
            "Організовано передбачені для входу спостереження, зв’язок і рятування.",
            "Виконано передбачений контроль атмосфери та погоджено умови входу.",
          ],
          2,
        ),
        q(
          205,
          "До початку вогневих робіт поруч запланували нову операцію з технологічним продуктом. Початковий допуск її не враховує. Як діяти?",
          [
            "Почати після додаткової перевірки справності власного робочого інструмента.",
            "Почати після збільшення кількості засобів пожежогасіння біля місця.",
            "Погодити сумісність операцій і потрібні заходи до початку роботи.",
            "Погодити між бригадами лише черговість використання спільного проходу.",
          ],
          3,
        ),
      ],
    },
    {
      id: "part-3",
      title: {
        uk: "Модуль 3. Дії при зміні умов",
        en: "Module 3. Actions when conditions change",
        de: "Modul 3. Handeln bei veränderten Bedingungen",
        es: "Módulo 3. Actuación ante cambios de condiciones",
        fr: "Module 3. Actions en cas de changement des conditions",
        az: "Modul 3. Şərait dəyişəndə hərəkətlər",
        kk: "3-модуль. Жағдай өзгергендегі әрекеттер",
      },
      videoTitle: {
        uk: "Відео · Модуль 3 з 3 — Дії при зміні умов",
        en: "Video · Module 3 of 3 — Actions when conditions change",
        de: "Video · Modul 3 von 3 — Handeln bei veränderten Bedingungen",
        es: "Vídeo · Módulo 3 de 3 — Actuación ante cambios de condiciones",
        fr: "Vidéo · Module 3 sur 3 — Actions en cas de changement des conditions",
        az: "Video · 3-dən 3-cü modul — Şərait dəyişəndə hərəkətlər",
        kk: "Бейне · 3-тің 3-модулі — Жағдай өзгергендегі әрекеттер",
      },
      youtubeId: "he1Ftni_pb4",
      quiz: [
        q(
          301,
          "Під час роботи спрацювала газова тривога. До завершення операції залишилося кілька хвилин. Яке рішення відповідає розглянутому порядку дій?",
          [
            "Перевірити показання іншого приладу та визначити потребу припинення роботи.",
            "Попередити керівника про сигнал та завершити розпочату коротку операцію.",
            "Переміститися до краю робочої зони та простежити за зміною показань.",
            "Припинити роботу й виконати встановлений порядок виходу та повідомлення.",
          ],
          4,
        ),
        q(
          302,
          "Після евакуації одного працівника немає на місці збору. Його останнє відоме місце — біля установки. Як діяти?",
          [
            "Організувати перевірку звичного маршруту силами двох працівників бригади.",
            "Передати відповідальному відомості про відсутнього та його можливе місце.",
            "Повернутися до установки після короткого спостереження з безпечної точки.",
            "Залишити місце збору для пошуку працівника на сусідній дільниці.",
          ],
          2,
        ),
        q(
          303,
          "Працівник передає повідомлення про можливу небезпечну подію. Який варіант містить найкориснішу первинну інформацію?",
          [
            "Місце події, спостережувані ознаки, загроза людям та виконані дії.",
            "Ймовірна причина, відповідальний за обладнання та очікуваний строк ремонту.",
            "Модель обладнання, попередні несправності та дата останнього технічного огляду.",
            "Тривалість роботи, склад бригади та запланований час завершення завдання.",
          ],
          1,
        ),
        q(
          304,
          "Інструмент упав із майданчика на порожню огороджену ділянку. Травм немає. Як оцінити подію?",
          [
            "Як підтвердження достатності огородження без потреби подальшого аналізу.",
            "Як порушення порядку зберігання без потреби повідомляти про подію.",
            "Як подію без травми, що потребує повідомлення й аналізу.",
            "Як звичайну виробничу ситуацію після перевірки цілісності самого інструмента.",
          ],
          3,
        ),
        q(
          305,
          "Після газової тривоги прилад більше не сигналізує. Яка підстава потрібна для відновлення припиненої роботи?",
          [
            "Перевірка умов і дозвіл уповноважених осіб за встановленим порядком.",
            "Стабільні показання приладу протягом періоду, визначеного самою бригадою.",
            "Підтвердження колег, що на сусідніх ділянках уже відновлено роботу.",
            "Завершення оповіщення та відсутність видимих змін біля робочого місця.",
          ],
          1,
        ),
      ],
    },
  ],
};
