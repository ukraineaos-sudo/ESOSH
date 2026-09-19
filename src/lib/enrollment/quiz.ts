/** RU: Тест Кодексу поведінки (v1). EN: Codex quiz v1. */
export const CODEX_QUIZ_VERSION = "codex-v1";

export type CodexQuestionPublic = {
  id: string;
  promptUk: string;
  options: { id: string; labelUk: string }[];
};

type CodexQuestion = CodexQuestionPublic & { correctOptionId: string };

const CODEX_QUESTIONS_PRIVATE: CodexQuestion[] = [
  {
    id: "q1",
    promptUk: "Що є пріоритетом учасника ESOSH у професійній діяльності?",
    options: [
      { id: "a", labelUk: "Швидкість виконання робіт будь-якою ціною" },
      { id: "b", labelUk: "Безпека та здоров’я людей" },
      { id: "c", labelUk: "Лише формальне виконання інструкцій без оцінки ризиків" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q2",
    promptUk: "Як учасник має ставитися до конфіденційної інформації колег і роботодавця?",
    options: [
      { id: "a", labelUk: "Можна поширювати у соцмережах для обговорення" },
      { id: "b", labelUk: "Зберігати конфіденційність і не розголошувати без підстав" },
      { id: "c", labelUk: "Передавати будь-кому за усним проханням" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q3",
    promptUk: "Що робити при виявленні небезпечної ситуації?",
    options: [
      { id: "a", labelUk: "Ігнорувати, якщо це не ваша зона відповідальності" },
      { id: "b", labelUk: "Повідомити відповідальних і сприяти усуненню ризику" },
      { id: "c", labelUk: "Чекати письмового наказу, навіть за наявної загрози життю" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q4",
    promptUk: "Як учасник ESOSH має ставитися до колег і різноманітності?",
    options: [
      { id: "a", labelUk: "Поважати гідність, рівність і доброчесність" },
      { id: "b", labelUk: "Допускати дискримінацію, якщо так зручніше команді" },
      { id: "c", labelUk: "Оцінювати людей лише за посадою" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q5",
    promptUk: "Чи можна подавати недостовірні дані про кваліфікацію?",
    options: [
      { id: "a", labelUk: "Так, якщо це прискорить вступ" },
      { id: "b", labelUk: "Ні, інформація має бути правдивою і перевірюваною" },
      { id: "c", labelUk: "Так, якщо документи «майже» відповідають" },
    ],
    correctOptionId: "b",
  },
];

/** RU: Відсоток правильних відповідей (лише сервер). EN: Score quiz server-side only. */
export function scoreCodexQuiz(answers: Record<string, string>): number {
  if (CODEX_QUESTIONS_PRIVATE.length === 0) return 0;
  let correct = 0;
  for (const q of CODEX_QUESTIONS_PRIVATE) {
    if (answers[q.id] === q.correctOptionId) correct += 1;
  }
  return Math.round((correct / CODEX_QUESTIONS_PRIVATE.length) * 100);
}

/** RU: Питання без правильних відповідей. EN: Public quiz without answers. */
export function publicCodexQuiz() {
  return {
    version: CODEX_QUIZ_VERSION,
    questions: CODEX_QUESTIONS_PRIVATE.map(({ id, promptUk, options }) => ({
      id,
      promptUk,
      options,
    })),
  };
}

/** RU: Статичний експорт питань для UI (без answers). EN: Static public questions for UI. */
export const CODEX_QUESTIONS_PUBLIC: CodexQuestionPublic[] = CODEX_QUESTIONS_PRIVATE.map(
  ({ id, promptUk, options }) => ({ id, promptUk, options }),
);
