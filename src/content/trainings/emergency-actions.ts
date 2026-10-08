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
 * RU: Курс «Порядок дій громадян…» — 3 модулі, відео + тест (uk); іменний сертифікат.
 * EN: Citizen emergency-actions course — 3 modules; quiz stays uk (video language); named cert.
 */
export const emergencyActionsTraining: TrainingDetail = {
  slug: "emergency-actions",
  href: "/education/trainings/emergency-actions",
  title: {
    uk: "Порядок дій громадян у разі виникнення надзвичайних ситуацій",
    en: "Citizen actions in emergency situations",
    de: "Handlungsablauf für Bürgerinnen und Bürger in Notfällen",
    es: "Procedimiento de actuación ciudadana en emergencias",
    fr: "Conduite à tenir des citoyens en cas de situations d’urgence",
    az: "Fövqəladə hallarda vətəndaşların hərəkət qaydası",
    kk: "Төтенше жағдайлар кезінде азаматтардың әрекет тәртібі",
  },
  summary: {
    uk: "Три модулі: протоколи виживання, техногенні загрози й блекаут, базова цивільна захищеність. Після кожного відео — тест з 5 питань.",
    en: "Three modules: survival protocols, technological threats and blackout, and basic civil protection. After each video — a 5-question quiz (Ukrainian, matching the video).",
    de: "Drei Module: Überlebensprotokolle, technogene Bedrohungen und Blackout sowie grundlegender Zivilschutz. Nach jedem Video — ein Test mit 5 Fragen (Ukrainisch, passend zum Video).",
    es: "Tres módulos: protocolos de supervivencia, amenazas tecnológicas y apagón, y protección civil básica. Tras cada vídeo — un test de 5 preguntas (en ucraniano, como el vídeo).",
    fr: "Trois modules : protocoles de survie, menaces technologiques et black-out, et protection civile de base. Après chaque vidéo — un test de 5 questions (en ukrainien, comme la vidéo).",
    az: "Üç modul: sağ qalma protokolları, texnogen təhdidlər və blakaut, baza mülki müdafiə. Hər videodan sonra — 5 suallıq test (ukraynaca, video ilə eyni).",
    kk: "Үш модуль: өмір сүру хаттамалары, техногендік қауіптер мен блекаут, базалық азаматтық қорғаныс. Әр бейнеден кейін — 5 сұрақты тест (украин тілінде, бейнемен бірдей).",
  },
  courseCode: "EA",
  duration: {
    uk: "30 хвилин",
    en: "30 minutes",
  },
  certificateTitles: {
    uk: "ПОРЯДОК ДІЙ ГРОМАДЯН У РАЗІ ВИНИКНЕННЯ НАДЗВИЧАЙНИХ СИТУАЦІЙ",
    en: "CITIZEN ACTIONS IN EMERGENCY SITUATIONS",
  },
  passThresholdPercent: 75,
  showSeekHint: false,
  quizUi,
  modules: [
    {
      id: "part-1",
      title: {
        uk: "Модуль 1. Протоколи виживання",
        en: "Module 1. Survival protocols",
        de: "Modul 1. Überlebensprotokolle",
        es: "Módulo 1. Protocolos de supervivencia",
        fr: "Module 1. Protocoles de survie",
        az: "Modul 1. Sağ qalma protokolları",
        kk: "1-модуль. Өмір сүру хаттамалары",
      },
      videoTitle: {
        uk: "Відео · Модуль 1 з 3 — Протоколи виживання",
        en: "Video · Module 1 of 3 — Survival protocols",
        de: "Video · Modul 1 von 3 — Überlebensprotokolle",
        es: "Vídeo · Módulo 1 de 3 — Protocolos de supervivencia",
        fr: "Vidéo · Module 1 sur 3 — Protocoles de survie",
        az: "Video · 3-dən 1-ci modul — Sağ qalma protokolları",
        kk: "Бейне · 3-тің 1-модулі — Өмір сүру хаттамалары",
      },
      youtubeId: "DVmUUiFjJT8",
      quiz: [
        q(
          101,
          "Обстріл уже почався, а безпечно дістатися офіційного укриття неможливо. Яке місце у приміщенні доцільніше обрати?",
          [
            "Біля несучої зовнішньої стіни, але якомога далі від меблів та побутової техніки.",
            "У внутрішньому коридорі, відокремленому від вулиці щонайменше двома стінами.",
            "У кімнаті з найбільшою кількістю вікон, щоб контролювати ситуацію назовні.",
            "Біля вхідних дверей квартири, щоб мати можливість негайно залишити приміщення.",
          ],
          2,
        ),
        q(
          102,
          "Після вибуху в будівлі ви відчули запах газу. Яка послідовність дій найбільш правильна?",
          [
            "Увімкнути освітлення, перевірити приміщення та після цього перекрити подачу газу.",
            "Відчинити всі вікна, запалити ліхтар або свічку та визначити місце можливого витоку.",
            "Спочатку перевірити ліфт, забрати необхідні речі та лише потім залишити будівлю.",
            "Не використовувати відкритий вогонь, оцінити ризики та евакуюватися безпечним шляхом.",
          ],
          4,
        ),
        q(
          103,
          "Людина опинилася під завалами після руйнування будівлі. Як доцільніше подавати сигнал рятувальникам?",
          [
            "Постійно голосно кричати, навіть коли поруч працює важка техніка або інші механізми.",
            "Намагатися самостійно розбирати уламки та одночасно періодично кликати на допомогу.",
            "Берегти сили та подавати періодичні сигнали стуком, свистком, світлом або телефоном.",
            "Запалити невелике джерело вогню, щоб світло або дим допомогли визначити місцезнаходження.",
          ],
          3,
        ),
        q(
          104,
          "Ви помітили безхазяйну сумку з дротами у громадському місці. Яка дія відповідає алгоритму безпеки?",
          [
            "Не торкатися предмета, відійти тим самим шляхом, попередити людей і повідомити служби.",
            "Перенести предмет подалі від людей, після чого відійти та повідомити екстрені служби.",
            "Оглянути предмет з близької відстані, не торкаючись його, щоб точніше описати службам.",
            "Накрити предмет щільною тканиною або іншим матеріалом і після цього залишити ділянку.",
          ],
          1,
        ),
        q(
          105,
          "Обстріл застав вас в автомобілі на відкритій ділянці. Який принцип є правильним?",
          [
            "За будь-яких умов залишатися в автомобілі, оскільки кузов забезпечує достатній захист.",
            "Негайно вибігти з автомобіля незалежно від інтенсивності вибухів і наявності укриття.",
            "Продовжити рух автомобілем, навіть якщо для цього потрібно їхати через відкриту ділянку.",
            "Оцінити обстановку і, якщо це безпечно, залишити авто та перейти до надійнішого укриття.",
          ],
          4,
        ),
      ],
    },
    {
      id: "part-2",
      title: {
        uk: "Модуль 2. Техногенні загрози, блекаут та психологічна стійкість",
        en: "Module 2. Technological threats, blackout, and psychological resilience",
        de: "Modul 2. Technogene Bedrohungen, Blackout und psychische Resilienz",
        es: "Módulo 2. Amenazas tecnológicas, apagón y resiliencia psicológica",
        fr: "Module 2. Menaces technologiques, black-out et résilience psychologique",
        az: "Modul 2. Texnogen təhdidlər, blakaut və psixoloji dayanıqlıq",
        kk: "2-модуль. Техногендік қауіптер, блекаут және психологиялық тұрақтылық",
      },
      videoTitle: {
        uk: "Відео · Модуль 2 з 3 — Техногенні загрози та блекаут",
        en: "Video · Module 2 of 3 — Technological threats and blackout",
        de: "Video · Modul 2 von 3 — Technogene Bedrohungen und Blackout",
        es: "Vídeo · Módulo 2 de 3 — Amenazas tecnológicas y apagón",
        fr: "Vidéo · Module 2 sur 3 — Menaces technologiques et black-out",
        az: "Video · 3-dən 2-ci modul — Texnogen təhdidlər və blakaut",
        kk: "Бейне · 3-тің 2-модулі — Техногендік қауіптер және блекаут",
      },
      youtubeId: "r2Wa8dodc0g",
      quiz: [
        q(
          201,
          "Де допускається робота бензинового або дизельного генератора під час блекауту?",
          [
            "У добре провітрюваному гаражі, якщо ворота повністю відкриті протягом роботи генератора.",
            "На відкритому повітрі, приблизно за шість метрів або більше від вікон і вентиляції.",
            "На балконі багатоповерхового будинку, якщо двері до житлового приміщення зачинені.",
            "У підвалі з примусовою вентиляцією, якщо вихлопна труба спрямована назовні будівлі.",
          ],
          2,
        ),
        q(
          202,
          "Служби повідомили про хімічну аварію та наказали евакуюватися. Як обирають напрямок руху?",
          [
            "Завжди рухаються проти вітру, незалежно від речовини, рельєфу та офіційного маршруту.",
            "Завжди піднімаються на найвищу точку місцевості, оскільки небезпечні гази важчі за повітря.",
            "Виходять із траєкторії хмари, часто поперек вітру, але пріоритет мають офіційні вказівки.",
            "Рухаються разом із напрямком вітру, щоб швидше залишити район промислового підприємства.",
          ],
          3,
        ),
        q(
          203,
          "Яке твердження про йодну профілактику під час радіаційної аварії відповідає матеріалу курсу?",
          [
            "Калію йодид приймають тільки після офіційного повідомлення про необхідність профілактики.",
            "Калію йодид бажано прийняти одразу після повідомлення про будь-яку радіаційну небезпеку.",
            "Розчин Люголя можна використовувати як рівноцінну заміну таблеткам калію йодиду.",
            "Йодна профілактика забезпечує загальний захист організму від усіх видів радіаційного впливу.",
          ],
          1,
        ),
        q(
          204,
          "Людина під час небезпеки завмерла і майже не реагує. Яка допомога є найбільш доцільною?",
          [
            "Голосно повторювати кілька команд одночасно, щоб швидше вивести людину зі стану ступору.",
            "Дати людині час самостійно прийняти рішення та не втручатися, поки вона не почне діяти.",
            "Активно струсити людину за плечі та змусити її фізично рухатися у потрібному напрямку.",
            "Спокійно встановити контакт, дати одну коротку команду й після виконання перейти до наступної.",
          ],
          4,
        ),
        q(
          205,
          "Яка інформаційна поведінка найбільше підтримує психологічну стійкість під час тривалої кризи?",
          [
            "Постійно стежити за повідомленнями з максимальної кількості джерел, щоб не пропустити зміни.",
            "Перевіряти кілька офіційних джерел через розумні інтервали та паралельно виконувати завдання.",
            "Тимчасово повністю відмовитися від новин, щоб інформаційний потік не впливав на емоційний стан.",
            "Порівнювати офіційні повідомлення з анонімними каналами та орієнтуватися на більшість версій.",
          ],
          2,
        ),
      ],
    },
    {
      id: "part-3",
      title: {
        uk: "Модуль 3. Базова цивільна захищеність: готовність, евакуація, життя",
        en: "Module 3. Basic civil protection: readiness, evacuation, life",
        de: "Modul 3. Grundlegender Zivilschutz: Bereitschaft, Evakuierung, Leben",
        es: "Módulo 3. Protección civil básica: preparación, evacuación, vida",
        fr: "Module 3. Protection civile de base : préparation, évacuation, vie",
        az: "Modul 3. Baza mülki müdafiə: hazırlıq, evakuasiya, həyat",
        kk: "3-модуль. Базалық азаматтық қорғаныс: дайындық, эвакуация, өмір",
      },
      videoTitle: {
        uk: "Відео · Модуль 3 з 3 — Базова цивільна захищеність",
        en: "Video · Module 3 of 3 — Basic civil protection",
        de: "Video · Modul 3 von 3 — Grundlegender Zivilschutz",
        es: "Vídeo · Módulo 3 de 3 — Protección civil básica",
        fr: "Vidéo · Module 3 sur 3 — Protection civile de base",
        az: "Video · 3-dən 3-cü modul — Baza mülki müdafiə",
        kk: "Бейне · 3-тің 3-модулі — Базалық азаматтық қорғаныс",
      },
      youtubeId: "abdouxTudRU",
      quiz: [
        q(
          301,
          "Який принцип формування тривожного рюкзака відповідає матеріалу курсу?",
          [
            "Основний критерій — максимальний запас речей, навіть якщо через вагу рюкзак важко переносити.",
            "Найважчі предмети потрібно розміщувати зверху, щоб їх можна було швидко дістати при евакуації.",
            "Вага має відповідати можливостям людини, а речі швидкого доступу розміщують зверху або зовні.",
            "Документи, аптечку та електроніку краще розміщувати в центрі рюкзака разом із запасом їжі.",
          ],
          3,
        ),
        q(
          302,
          "Під час евакуації з багатоповерхового будинку небезпека вже безпосередня. Як слід діяти?",
          [
            "Спускатися сходами і не витрачати час на речі або комунікації, якщо це затримує евакуацію.",
            "Спочатку перекрити всі комунікації та забрати речі, навіть якщо для цього потрібно повернутися.",
            "Використати ліфт, якщо він ще працює, щоб швидше залишити верхні поверхи та уникнути натовпу.",
            "Зачекати, поки основний потік людей залишить будівлю, і лише після цього починати евакуацію.",
          ],
          1,
        ),
        q(
          303,
          "Ви опинилися у щільному натовпі, який рухається до виходу. Яка тактика найбільш безпечна?",
          [
            "Пробиратися проти потоку до менш завантаженої частини приміщення, використовуючи вільні проміжки.",
            "Рухатися разом із потоком, поступово зміщуючись до вільнішої ділянки або краю натовпу.",
            "Зупинитися біля стіни чи огорожі, щоб основна маса людей могла пройти повз вас до виходу.",
            "Намагатися рухатися швидше за загальний потік, щоб якомога раніше залишити небезпечну зону.",
          ],
          2,
        ),
        q(
          304,
          "Як правильно допомагати малорухомій або літній людині під час евакуації сходами?",
          [
            "Взяти її за руку та швидко вести вниз, не витрачаючи часу на пояснення своїх дій.",
            "Іти попереду на кілька сходинок та просити людину повторювати ваші рухи у тому самому темпі.",
            "Підтримувати її ззаду та пришвидшувати рух, якщо позаду починає накопичуватися потік людей.",
            "Пояснити свої дії, запропонувати опору та рухатися у темпі, що дозволяє зберігати рівновагу.",
          ],
          4,
        ),
        q(
          305,
          "Мобільний зв’язок під час кризи нестабільний або може повністю зникнути. Яка підготовка найкраща?",
          [
            "Зберегти всі контакти лише у телефоні та підтримувати постійний зв’язок із членами родини.",
            "Заздалегідь визначити місця зустрічі, записати важливі номери й завантажити офлайн-карту.",
            "Домовитися, що кожен самостійно обере місце перебування, а зв’язок відновлять після кризи.",
            "Використовувати месенджери як основний резервний канал, оскільки вони працюють без мобільної мережі.",
          ],
          2,
        ),
      ],
    },
  ],
};
