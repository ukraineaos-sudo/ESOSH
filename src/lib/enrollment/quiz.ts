/**
 * RU: Тест Кодексу з Google Form ESOSH (10 питань).
 * Ключ correctOptionId попередній — клієнт підтвердить офіційні відповіді пізніше.
 * EN: Codex quiz from the ESOSH Google Form. Answer key is provisional.
 */
export const CODEX_QUIZ_VERSION = "codex-google-v1";

export type CodexQuestionPublic = {
  id: string;
  promptUk: string;
  options: { id: string; labelUk: string }[];
};

type CodexQuestion = CodexQuestionPublic & { correctOptionId: string };

const CODEX_QUESTIONS_PRIVATE: CodexQuestion[] = [
  {
    id: "q1",
    promptUk: "У центрі дій членів ЄСОП повинна бути наступна якість людини:",
    options: [
      { id: "a", labelUk: "Чесність" },
      { id: "b", labelUk: "Мудрість" },
      { id: "c", labelUk: "Доброта" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q2",
    promptUk: "Мета Кодексу Поведінки учасників ЄСОП — встановити…",
    options: [
      { id: "a", labelUk: "правила виключення з організації" },
      { id: "b", labelUk: "законодавчі вимоги" },
      { id: "c", labelUk: "критерії для належного виконання професійних обов’язків" },
    ],
    correctOptionId: "c",
  },
  {
    id: "q3",
    promptUk: "Бачення ЄСОП:",
    options: [
      { id: "a", labelUk: "Більше знань!" },
      { id: "b", labelUk: "Життя – найвища цінність." },
      { id: "c", labelUk: "Безпека понад усе!" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q4",
    promptUk: "Місія ЄСОП:",
    options: [
      { id: "a", labelUk: "Формувати безпечне мислення та лідерство з безпеки праці" },
      { id: "b", labelUk: "Знати більше за інших" },
      { id: "c", labelUk: "Карати винних у нещасних випадках" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q5",
    promptUk: "Мета ЄСОП:",
    options: [
      { id: "a", labelUk: "Збирати прозору звітність щодо травматизму" },
      { id: "b", labelUk: "Розвивати професійну компетенцію та стати джерелом розвитку для інших" },
      { id: "c", labelUk: "Виконувати свою роботу сумлінно" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q6",
    promptUk: "Основний принцип ЄСОП:",
    options: [
      { id: "a", labelUk: "Постійне удосконалення" },
      { id: "b", labelUk: "Широка комунікація" },
      { id: "c", labelUk: "Співпраця з усіма, хто бажає" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q7",
    promptUk: "Учасники ЄСОП не повинні допускати…",
    options: [
      { id: "a", labelUk: "просування власних інтересів" },
      { id: "b", labelUk: "помилок в процесі навчання" },
      { id: "c", labelUk: "корупційних правопорушень" },
    ],
    correctOptionId: "c",
  },
  {
    id: "q8",
    promptUk: "Учасники ЄСОП беруть на себе зобов’язання утримуватися:",
    options: [
      { id: "a", labelUk: "від будь-якої дискримінації" },
      { id: "b", labelUk: "від будь-яких дискусій" },
      { id: "c", labelUk: "від будь-яких конфліктів" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q9",
    promptUk:
      "Про загрози або підозри можливих корупційних правопорушень або факти їх настання учасник ЄСОП повинен повідомити:",
    options: [
      { id: "a", labelUk: "Правління ЄСОП" },
      { id: "b", labelUk: "Правоохоронні органи" },
      { id: "c", labelUk: "Національне антикорупційне бюро України" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q10",
    promptUk: "За наявності підстав вважати, що учасник порушив Кодекс поведінки, Правління ЄСОП у праві:",
    options: [
      { id: "a", labelUk: "звернутися до правоохоронних органів" },
      { id: "b", labelUk: "одразу виключити з членів співтовариства" },
      { id: "c", labelUk: "вимагати роз'яснень чи додаткової інформації" },
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
export function scoreCodexQuizCount(answers: Record<string, string>): { correct: number; total: number } {
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
  ({ id, promptUk, options }) => ({ id, promptUk, options }),
);
