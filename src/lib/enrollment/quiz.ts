/**
 * RU: Тест Кодексу з Google Form ESOSH (10 питань).
 * Ключ correctOptionId попередній — клієнт підтвердить офіційні відповіді пізніше.
 * EN: Codex quiz from the ESOSH Google Form. Answer key is provisional.
 */
export const CODEX_QUIZ_VERSION = "codex-google-v1";

export type CodexQuestionPublic = {
  id: string;
  promptUk: string;
  promptEn: string;
  options: { id: string; labelUk: string; labelEn: string }[];
};

type CodexQuestion = CodexQuestionPublic & { correctOptionId: string };

const CODEX_QUESTIONS_PRIVATE: CodexQuestion[] = [
  {
    id: "q1",
    promptUk: "У центрі дій членів ЄСОП повинна бути наступна якість людини:",
    promptEn: "At the centre of ESOSH members’ actions should be this human quality:",
    options: [
      { id: "a", labelUk: "Чесність", labelEn: "Honesty" },
      { id: "b", labelUk: "Мудрість", labelEn: "Wisdom" },
      { id: "c", labelUk: "Доброта", labelEn: "Kindness" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q2",
    promptUk: "Мета Кодексу Поведінки учасників ЄСОП — встановити…",
    promptEn: "The purpose of the ESOSH Code of Conduct is to establish…",
    options: [
      { id: "a", labelUk: "правила виключення з організації", labelEn: "rules for expulsion from the organisation" },
      { id: "b", labelUk: "законодавчі вимоги", labelEn: "legal requirements" },
      {
        id: "c",
        labelUk: "критерії для належного виконання професійних обов’язків",
        labelEn: "criteria for proper performance of professional duties",
      },
    ],
    correctOptionId: "c",
  },
  {
    id: "q3",
    promptUk: "Бачення ЄСОП:",
    promptEn: "ESOSH vision:",
    options: [
      { id: "a", labelUk: "Більше знань!", labelEn: "More knowledge!" },
      { id: "b", labelUk: "Життя – найвища цінність.", labelEn: "Life is the highest value." },
      { id: "c", labelUk: "Безпека понад усе!", labelEn: "Safety above all!" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q4",
    promptUk: "Місія ЄСОП:",
    promptEn: "ESOSH mission:",
    options: [
      {
        id: "a",
        labelUk: "Формувати безпечне мислення та лідерство з безпеки праці",
        labelEn: "Foster safety thinking and occupational safety leadership",
      },
      { id: "b", labelUk: "Знати більше за інших", labelEn: "Know more than others" },
      { id: "c", labelUk: "Карати винних у нещасних випадках", labelEn: "Punish those at fault in accidents" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q5",
    promptUk: "Мета ЄСОП:",
    promptEn: "ESOSH goal:",
    options: [
      {
        id: "a",
        labelUk: "Збирати прозору звітність щодо травматизму",
        labelEn: "Collect transparent injury reporting",
      },
      {
        id: "b",
        labelUk: "Розвивати професійну компетенцію та стати джерелом розвитку для інших",
        labelEn: "Develop professional competence and become a source of growth for others",
      },
      { id: "c", labelUk: "Виконувати свою роботу сумлінно", labelEn: "Perform one’s work diligently" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q6",
    promptUk: "Основний принцип ЄСОП:",
    promptEn: "The core principle of ESOSH:",
    options: [
      { id: "a", labelUk: "Постійне удосконалення", labelEn: "Continuous improvement" },
      { id: "b", labelUk: "Широка комунікація", labelEn: "Broad communication" },
      { id: "c", labelUk: "Співпраця з усіма, хто бажає", labelEn: "Cooperation with everyone who wishes" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q7",
    promptUk: "Учасники ЄСОП не повинні допускати…",
    promptEn: "ESOSH participants must not allow…",
    options: [
      { id: "a", labelUk: "просування власних інтересів", labelEn: "advancing personal interests" },
      { id: "b", labelUk: "помилок в процесі навчання", labelEn: "mistakes during learning" },
      { id: "c", labelUk: "корупційних правопорушень", labelEn: "corruption offences" },
    ],
    correctOptionId: "c",
  },
  {
    id: "q8",
    promptUk: "Учасники ЄСОП беруть на себе зобов’язання утримуватися:",
    promptEn: "ESOSH participants commit to refrain:",
    options: [
      { id: "a", labelUk: "від будь-якої дискримінації", labelEn: "from any discrimination" },
      { id: "b", labelUk: "від будь-яких дискусій", labelEn: "from any discussions" },
      { id: "c", labelUk: "від будь-яких конфліктів", labelEn: "from any conflicts" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q9",
    promptUk:
      "Про загрози або підозри можливих корупційних правопорушень або факти їх настання учасник ЄСОП повинен повідомити:",
    promptEn:
      "About threats or suspicions of possible corruption offences, or facts of their occurrence, an ESOSH participant must notify:",
    options: [
      { id: "a", labelUk: "Правління ЄСОП", labelEn: "The ESOSH Board" },
      { id: "b", labelUk: "Правоохоронні органи", labelEn: "Law enforcement" },
      {
        id: "c",
        labelUk: "Національне антикорупційне бюро України",
        labelEn: "the National Anti-Corruption Bureau of Ukraine",
      },
    ],
    correctOptionId: "a",
  },
  {
    id: "q10",
    promptUk: "За наявності підстав вважати, що учасник порушив Кодекс поведінки, Правління ЄСОП у праві:",
    promptEn:
      "If there are grounds to believe a participant violated the Code of Conduct, the ESOSH Board may:",
    options: [
      { id: "a", labelUk: "звернутися до правоохоронних органів", labelEn: "contact law enforcement" },
      {
        id: "b",
        labelUk: "одразу виключити з членів співтовариства",
        labelEn: "immediately expel the member from the community",
      },
      {
        id: "c",
        labelUk: "вимагати роз'яснень чи додаткової інформації",
        labelEn: "request explanations or additional information",
      },
    ],
    correctOptionId: "c",
  },
];

/** RU: Відсоток правильних відповідей (лише сервер). EN: Score quiz server-side only. */
export function scoreCodexQuiz(answers: Record<string, string>): number {
  const { correct, total } = scoreCodexQuizCount(answers);
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/** RU: Скільки вірних із скількох. EN: Correct count out of total. */
export function scoreCodexQuizCount(answers: Record<string, string>): {
  correct: number;
  total: number;
} {
  const total = CODEX_QUESTIONS_PRIVATE.length;
  let correct = 0;
  for (const q of CODEX_QUESTIONS_PRIVATE) {
    if (answers[q.id] === q.correctOptionId) correct += 1;
  }
  return { correct, total };
}

/** RU: Питання без правильних відповідей. EN: Public quiz without answers. */
export function publicCodexQuiz() {
  return {
    version: CODEX_QUIZ_VERSION,
    questions: CODEX_QUESTIONS_PUBLIC,
  };
}

/** RU: Статичний експорт питань для UI (без answers). EN: Static public questions for UI. */
export const CODEX_QUESTIONS_PUBLIC: CodexQuestionPublic[] = CODEX_QUESTIONS_PRIVATE.map(
  ({ id, promptUk, promptEn, options }) => ({ id, promptUk, promptEn, options }),
);
