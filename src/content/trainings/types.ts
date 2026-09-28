/** RU: Типи контенту тренінгів. EN: Training content types. */

export type LocaleCode = "uk" | "en";

export type LocalizedString = Record<LocaleCode, string>;

export type QuizOptionId = "A" | "B" | "C";

export type QuizQuestion = {
  id: number;
  question: LocalizedString;
  options: Record<QuizOptionId, LocalizedString>;
  correct: QuizOptionId;
};

export type TrainingQuizUi = {
  title: LocalizedString;
  submit: LocalizedString;
  reset: LocalizedString;
  incomplete: LocalizedString;
  scoreLabel: LocalizedString;
  correctLabel: LocalizedString;
  wrongLabel: LocalizedString;
  optionPrefix: Record<QuizOptionId, string>;
};

export type TrainingDetail = {
  slug: string;
  href: string;
  title: LocalizedString;
  summary: LocalizedString;
  videoTitle: LocalizedString;
  youtubeId: string;
  quiz: QuizQuestion[];
  quizUi: TrainingQuizUi;
  /** Public path to locale-matched completion certificate PDF. */
  certificatePdf?: LocalizedString;
  /** Minimum score percent to unlock certificate download (default 80). */
  passThresholdPercent?: number;
};

export type TrainingListItem = {
  slug: string;
  href: string;
  title: LocalizedString;
  summary: LocalizedString;
};
