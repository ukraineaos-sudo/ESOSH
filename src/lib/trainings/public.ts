import type {
  PublicQuizQuestion,
  PublicTrainingDetail,
  QuizOptionId,
  QuizQuestion,
  TrainingDetail,
} from "@/content/trainings/types";

/** RU: Прибрати correct з клієнтського payload. EN: Strip answer keys for client props. */
export function toPublicTraining(training: TrainingDetail): PublicTrainingDetail {
  return {
    ...training,
    modules: training.modules.map((mod) => ({
      ...mod,
      quiz: mod.quiz.map(({ correct: _correct, ...q }): PublicQuizQuestion => {
        void _correct;
        return q;
      }),
    })),
  };
}

/** RU: Карта правильних відповідей модуля. EN: Module answer key map. */
export function answerKeyForModule(
  training: TrainingDetail,
  moduleId: string,
): Map<number, QuizOptionId> | null {
  const mod = training.modules.find((m) => m.id === moduleId);
  if (!mod) return null;
  const map = new Map<number, QuizOptionId>();
  for (const q of mod.quiz) map.set(q.id, q.correct);
  return map;
}

export function assertQuizQuestions(questions: QuizQuestion[]): boolean {
  return questions.every((q) => typeof q.correct === "string" && q.correct.length === 1);
}
