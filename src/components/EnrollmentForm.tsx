"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type {
  CompanySize,
  CourseType,
  CpdStatus,
  EducationLevel,
  EnrollmentCourseInput,
} from "@/lib/enrollment/classify";
import type { ClassifyResult } from "@/lib/enrollment/classify";
import { LEVEL_LABELS_UK, REVIEW_BUSINESS_DAYS, type LevelCode } from "@/lib/enrollment/levels";
import { CODEX_QUESTIONS_PUBLIC } from "@/lib/enrollment/quiz";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { EnrollmentAttachmentsDropzone } from "@/components/EnrollmentAttachmentsDropzone";
import { isAppLocale } from "@/lib/locale";
import {
  ENROLLMENT_MIN_AGE,
  isBirthDateAtLeastAge,
  maxBirthDateForMinAge,
} from "@/lib/enrollment/age";
import {
  countryFlagUrl,
  countryLabel,
  defaultCountryForLocale,
  filterEnrollmentCountries,
  isEnrollmentCountryCode,
  type EnrollmentCountryCode,
} from "@/lib/enrollment/countries";
import {
  ENROLLMENT_INDUSTRY_IDS,
  formatIndustryForStorage,
  industryLabel,
  isEnrollmentIndustryId,
  type EnrollmentIndustryId,
} from "@/lib/enrollment/industries";
import {
  countryDialPrefix,
  isValidEnrollmentPhone,
  withCountryDialPrefix,
} from "@/lib/enrollment/phone";

type FormIssue = {
  fieldId: string;
  step: number;
  label: string;
  message: string;
};

type Draft = {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  country: EnrollmentCountryCode;
  city: string;
  phone: string;
  email: string;
  secondaryEmail: string;
  profileUrl: string;
  jobTitle: string;
  organization: string;
  industryIds: EnrollmentIndustryId[];
  industryOther: string;
  companySize: CompanySize | "";
  oshFunctions: boolean | null;
  totalYears: string;
  oshYears: string;
  responsibilities: string;
  educationLevel: EducationLevel | "";
  profileEducation: boolean | null;
  institution: string;
  speciality: string;
  graduationYear: string;
  courses: EnrollmentCourseInput[];
  attachments: File[];
  cpdStatus: CpdStatus | "";
  cpdActivities: string[];
  cpdDescription: string;
  codeRead: boolean;
  testAnswers: Record<string, string>;
  truthConfirm: boolean;
  codeAccept: boolean;
  privacyConsent: boolean;
  serviceMessages: boolean;
  marketingConsent: boolean;
};

const STORAGE_KEY = "esosh-enrollment-draft-v3";
const STEPS = 7;
const BIRTH_DATE_MIN = "1920-01-01";

const COURSE_TYPES: CourseType[] = [
  "esosh_21",
  "iosh_ms",
  "nebosh_award",
  "esosh_130",
  "nebosh_igc",
  "esosh_15y",
  "nebosh_diploma",
  "nvq5",
  "other",
];

const CPD_ACTIVITY_VALUES = [
  "навчання",
  "конференції",
  "тренерство",
  "виступи",
  "публікації",
  "робочі групи",
  "інше",
] as const;

const emptyCourse = (): EnrollmentCourseInput => ({
  courseType: "esosh_21",
  courseName: "",
  provider: "",
  courseYear: new Date().getFullYear(),
  hours: null,
  certificateNo: "",
});

function initialDraft(defaultCountry: EnrollmentCountryCode): Draft {
  return {
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    country: defaultCountry,
    city: "",
    phone: countryDialPrefix(defaultCountry),
    email: "",
    secondaryEmail: "",
    profileUrl: "",
    jobTitle: "",
    organization: "",
    industryIds: [],
    industryOther: "",
    companySize: "",
    oshFunctions: null,
    totalYears: "",
    oshYears: "",
    responsibilities: "",
    educationLevel: "",
    profileEducation: null,
    institution: "",
    speciality: "",
    graduationYear: "",
    courses: [],
    attachments: [],
    cpdStatus: "",
    cpdActivities: [],
    cpdDescription: "",
    codeRead: false,
    testAnswers: {},
    truthConfirm: false,
    codeAccept: false,
    privacyConsent: false,
    serviceMessages: false,
    marketingConsent: false,
  };
}

function normalizeStoredIndustryIds(raw: unknown): EnrollmentIndustryId[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is EnrollmentIndustryId => typeof id === "string" && isEnrollmentIndustryId(id));
}

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `k-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStoredDraft(defaultCountry: EnrollmentCountryCode): { draft: Draft; step: number } {
  if (typeof window === "undefined") return { draft: initialDraft(defaultCountry), step: 1 };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { draft: initialDraft(defaultCountry), step: 1 };
    const parsed = JSON.parse(raw) as Partial<Draft> & {
      step?: number;
      industry?: string;
    };
    const country =
      typeof parsed.country === "string" && isEnrollmentCountryCode(parsed.country)
        ? parsed.country
        : defaultCountry;
    const draft: Draft = {
      ...initialDraft(defaultCountry),
      ...parsed,
      country,
      industryIds: normalizeStoredIndustryIds(parsed.industryIds),
      industryOther: typeof parsed.industryOther === "string" ? parsed.industryOther : "",
      attachments: [],
      courses: Array.isArray(parsed.courses)
        ? parsed.courses.map((c) => ({ ...emptyCourse(), ...c }))
        : [],
    };
    const step =
      parsed.step && parsed.step >= 1 && parsed.step <= STEPS ? parsed.step : 1;
    return { draft, step };
  } catch {
    return { draft: initialDraft(defaultCountry), step: 1 };
  }
}

function injectControlProps(
  children: ReactNode,
  props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string },
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{
      id?: string;
      "aria-describedby"?: string;
      "aria-invalid"?: boolean | "true" | "false";
    }>;
    const tag = typeof el.type === "string" ? el.type : null;
    if (tag === "input" || tag === "select" || tag === "textarea" || tag === null) {
      return cloneElement(el, {
        id: el.props.id ?? props.id,
        "aria-invalid": props["aria-invalid"] ? true : el.props["aria-invalid"],
        "aria-describedby": props["aria-describedby"] ?? el.props["aria-describedby"],
      });
    }
    return child;
  });
}

function graduationYearOptions(now = new Date()): number[] {
  const max = now.getFullYear();
  const min = 1950;
  const years: number[] = [];
  for (let y = max; y >= min; y -= 1) years.push(y);
  return years;
}

function parseStepperNumber(value: string | number | null | undefined): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function stepDecimals(step: number): number {
  const text = String(step);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

function NumberStepper({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  decreaseLabel,
  increaseLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  id?: string;
  value: string | number;
  onChange: (next: string) => void;
  min?: number;
  max?: number;
  step?: number;
  decreaseLabel: string;
  increaseLabel: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  const numeric = parseStepperNumber(value);
  const atMin = min != null && numeric != null && numeric <= min;
  const atMax = max != null && numeric != null && numeric >= max;

  function bump(delta: number) {
    const base = numeric ?? (delta > 0 ? (min ?? 0) : (max ?? 0));
    let next = base + delta;
    if (min != null) next = Math.max(min, next);
    if (max != null) next = Math.min(max, next);
    next = Number(next.toFixed(stepDecimals(step)));
    onChange(String(next));
  }

  return (
    <div className="enrollment-stepper">
      <button
        type="button"
        className="enrollment-stepper__btn"
        aria-label={decreaseLabel}
        disabled={atMin}
        onClick={() => bump(-step)}
      >
        −
      </button>
      <input
        id={id}
        className="form-input text-field w-input enrollment-stepper__input"
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      />
      <button
        type="button"
        className="enrollment-stepper__btn"
        aria-label={increaseLabel}
        disabled={atMax}
        onClick={() => bump(step)}
      >
        +
      </button>
    </div>
  );
}

type EnrollmentFormProps = {
  /** Token from Turnstile gate / step-7 widget; null when captcha disabled. */
  turnstileToken?: string | null;
  onTurnstileToken?: (token: string | null) => void;
  turnstileSiteKey?: string;
};

/** RU: 7-крокова форма вступу за ТЗ. EN: Multi-step enrollment form. */
export function EnrollmentForm({
  turnstileToken = null,
  onTurnstileToken,
  turnstileSiteKey,
}: EnrollmentFormProps = {}) {
  const t = useTranslations("enrollment");
  const rawLocale = useLocale();
  const locale = isAppLocale(rawLocale) ? rawLocale : "uk";
  /** Codex quiz prompts exist only in uk/en — use en for other UI locales (explicit, not silent body swap). */
  const quizLocale = locale === "uk" ? "uk" : "en";
  const defaultCountry = defaultCountryForLocale(locale);
  const birthDateMax = useMemo(() => maxBirthDateForMinAge(ENROLLMENT_MIN_AGE), []);
  const stored = useState(() => readStoredDraft(defaultCountry))[0];
  const [step, setStep] = useState(stored.step);
  const [draft, setDraft] = useState<Draft>(stored.draft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [localCaptchaToken, setLocalCaptchaToken] = useState<string | null>(turnstileToken);
  const [blockingIssues, setBlockingIssues] = useState<FormIssue[]>([]);
  const [industryQuery, setIndustryQuery] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryBoxRef = useRef<HTMLDivElement | null>(null);
  const industryBoxRef = useRef<HTMLDivElement | null>(null);
  const countryOptions = useMemo(() => filterEnrollmentCountries(countryQuery), [countryQuery]);
  const industryOptions = useMemo(() => {
    const q = industryQuery.trim().toLowerCase();
    if (!q) return [...ENROLLMENT_INDUSTRY_IDS];
    return ENROLLMENT_INDUSTRY_IDS.filter((id) => industryLabel(id, locale).toLowerCase().includes(q));
  }, [industryQuery, locale]);
  const graduationYears = useMemo(() => graduationYearOptions(), []);

  useEffect(() => {
    if (!countryOpen && !industryOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!(event.target instanceof Node)) return;
      if (countryOpen) {
        const root = countryBoxRef.current;
        if (root && !root.contains(event.target)) setCountryOpen(false);
      }
      if (industryOpen) {
        const root = industryBoxRef.current;
        if (root && !root.contains(event.target)) setIndustryOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (countryOpen) setCountryOpen(false);
      if (industryOpen) setIndustryOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [countryOpen, industryOpen]);
  const [result, setResult] = useState<{
    kind: "ok" | "duplicate" | "honeypot";
    applicationPublicId?: string;
    autoLevelLabel?: string;
    memberPublicId?: string;
  } | null>(null);
  const [idempotencyKey] = useState(newIdempotencyKey);
  const [liveClassify, setLiveClassify] = useState<ClassifyResult | null>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState(false);

  const captchaToken = localCaptchaToken ?? turnstileToken;

  function setCaptchaToken(next: string | null) {
    setLocalCaptchaToken(next);
    onTurnstileToken?.(next);
  }

  useEffect(() => {
    setLocalCaptchaToken(turnstileToken);
  }, [turnstileToken]);

  function levelLabel(code: string | undefined, fallbackUk?: string): string {
    if (!code) return fallbackUk || "";
    if (code in LEVEL_LABELS_UK) {
      return t(`levels.${code as LevelCode}`);
    }
    return fallbackUk || code;
  }

  function quizPrompt(q: (typeof CODEX_QUESTIONS_PUBLIC)[number]): string {
    return quizLocale === "en" ? q.promptEn : q.promptUk;
  }

  function quizOptionLabel(opt: { labelUk: string; labelEn: string }): string {
    return quizLocale === "en" ? opt.labelEn : opt.labelUk;
  }

  useEffect(() => {
    const { attachments, ...rest } = draft;
    void attachments;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...rest,
          step,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [draft, step]);

  useEffect(() => {
    const ready =
      Boolean(draft.companySize) &&
      draft.oshFunctions !== null &&
      Boolean(draft.educationLevel) &&
      draft.profileEducation !== null &&
      Boolean(draft.cpdStatus);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (!ready) {
        setLiveClassify(null);
        return;
      }
      try {
        const response = await fetch("/api/enrollment/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            oshFunctions: draft.oshFunctions,
            oshYears: Number(draft.oshYears) || 0,
            companySize: draft.companySize,
            profileEducation: draft.profileEducation,
            educationLevel: draft.educationLevel,
            courses: draft.courses,
            cpdStatus: draft.cpdStatus,
            testAnswers: draft.testAnswers,
          }),
        });
        const data = await response.json();
        if (response.ok && data.ok) {
          setPreviewUnavailable(false);
          setLiveClassify({
            level: data.level,
            labelUk: data.labelUk,
            requiresManualReview: data.requiresManualReview,
            matchedRules: data.matchedRules,
            criteria: data.criteria,
            nextLevelHintUk: data.nextLevelHintUk,
          });
        } else {
          setPreviewUnavailable(true);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPreviewUnavailable(true);
      }
    }, 350);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [draft]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function setFieldError(fieldId: string, message: string | null) {
    setErrors((prev) => {
      if (!message) {
        if (!(fieldId in prev)) return prev;
        const next = { ...prev };
        delete next[fieldId];
        return next;
      }
      if (prev[fieldId] === message) return prev;
      return { ...prev, [fieldId]: message };
    });
  }

  /** RU: Перевірка дати при втраті фокусу. EN: Validate birth date on blur. */
  function validateBirthDateField(value: string = draft.birthDate) {
    const birth = isBirthDateAtLeastAge(value, ENROLLMENT_MIN_AGE);
    if (!birth.ok) {
      setFieldError(
        "birthDate",
        birth.reason === "underage" ? t("errors.birthDateUnderage") : t("errors.birthDate"),
      );
      return false;
    }
    setFieldError("birthDate", null);
    return true;
  }

  /** RU: Перевірка телефону при втраті фокусу. EN: Validate phone on blur. */
  function validatePhoneField(
    value: string = draft.phone,
    country: EnrollmentCountryCode = draft.country,
  ) {
    if (!isValidEnrollmentPhone(value, country)) {
      setFieldError("phone", t("errors.phone"));
      return false;
    }
    setFieldError("phone", null);
    return true;
  }

  function collectStepIssues(current: number): FormIssue[] {
    const issues: FormIssue[] = [];
    const add = (fieldId: string, message: string, label: string) => {
      issues.push({ fieldId, step: current, message, label });
    };
    if (current === 1) {
      if (draft.lastName.trim().length < 2) add("lastName", t("errors.lastName"), t("fields.lastName"));
      if (draft.firstName.trim().length < 2) add("firstName", t("errors.firstName"), t("fields.firstName"));
      const birth = isBirthDateAtLeastAge(draft.birthDate, ENROLLMENT_MIN_AGE);
      if (!birth.ok) {
        add(
          "birthDate",
          birth.reason === "underage" ? t("errors.birthDateUnderage") : t("errors.birthDate"),
          t("fields.birthDate"),
        );
      }
      if (!isEnrollmentCountryCode(draft.country)) add("country", t("errors.country"), t("fields.country"));
      if (!draft.city.trim()) add("city", t("errors.city"), t("fields.city"));
      if (!isValidEnrollmentPhone(draft.phone, draft.country)) {
        add("phone", t("errors.phone"), t("fields.phone"));
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) add("email", t("errors.email"), t("fields.email"));
    }
    if (current === 2) {
      if (!draft.jobTitle.trim()) add("jobTitle", t("errors.jobTitle"), t("fields.jobTitle"));
      if (draft.industryIds.length === 0) add("industry", t("errors.industry"), t("fields.industry"));
      if (draft.industryIds.includes("other") && !draft.industryOther.trim()) {
        add("industryOther", t("errors.industryOther"), t("fields.industryOther"));
      }
      if (!draft.companySize) add("companySize", t("errors.companySize"), t("fields.companySize"));
      if (draft.oshFunctions === null) add("oshFunctions", t("errors.yesNo"), t("fields.oshFunctions"));
      if (draft.oshYears === "" || Number.isNaN(Number(draft.oshYears))) {
        add("oshYears", t("errors.oshYears"), t("fields.oshYears"));
      }
      if (!draft.responsibilities.trim()) add("responsibilities", t("errors.responsibilities"), t("fields.responsibilities"));
      if (draft.responsibilities.length > 1500) {
        add("responsibilities", t("errors.responsibilitiesMax"), t("fields.responsibilities"));
      }
    }
    if (current === 3) {
      if (!draft.educationLevel) add("educationLevel", t("errors.educationLevel"), t("fields.educationLevel"));
      if (draft.profileEducation === null) {
        add("profileEducation", t("errors.yesNo"), t("fields.profileEducation"));
      }
      if (draft.educationLevel && draft.educationLevel !== "other") {
        if (!draft.institution.trim()) add("institution", t("errors.institution"), t("fields.institution"));
        if (!draft.speciality.trim()) add("speciality", t("errors.speciality"), t("fields.speciality"));
        if (!draft.graduationYear.trim()) add("graduationYear", t("errors.graduationYear"), t("fields.graduationYear"));
      }
    }
    if (current === 4) {
      draft.courses.forEach((c, i) => {
        if (!c.courseName.trim()) {
          add(`courseName_${i}`, t("errors.courseName"), t("courseNameLabel", { n: i + 1 }));
        }
        if (!c.provider.trim()) {
          add(`provider_${i}`, t("errors.provider"), t("courseProviderLabel", { n: i + 1 }));
        }
      });
    }
    if (current === 5) {
      if (!draft.cpdStatus) add("cpdStatus", t("errors.cpdStatus"), t("fields.cpdStatus"));
    }
    if (current === 6) {
      if (!draft.codeRead) add("codeRead", t("errors.codeRead"), t("fields.codeRead"));
      for (const q of CODEX_QUESTIONS_PUBLIC) {
        if (!draft.testAnswers[q.id]) {
          const prompt = quizPrompt(q);
          add(
            `test_${q.id}`,
            t("errors.testAnswer"),
            t("testIssueLabel", { prompt: prompt.slice(0, 48) }),
          );
        }
      }
    }
    if (current === 7) {
      if (!draft.truthConfirm) add("truthConfirm", t("errors.truthRequired"), t("fields.truthConfirm"));
      if (!draft.codeAccept) add("codeAccept", t("errors.consentRequired"), t("fields.codeAccept"));
      if (!draft.privacyConsent) add("privacyConsent", t("errors.consentRequired"), t("fields.privacyConsent"));
      if (!draft.serviceMessages) {
        add("serviceMessages", t("errors.consentRequired"), t("fields.serviceMessages"));
      }
    }
    return issues;
  }

  function applyIssues(issues: FormIssue[]): boolean {
    const next: Record<string, string> = {};
    for (const issue of issues) next[issue.fieldId] = issue.message;
    setErrors(next);
    setBlockingIssues(issues);
    return issues.length === 0;
  }

  function validateAllSteps(): FormIssue[] {
    const all: FormIssue[] = [];
    for (let s = 1; s <= STEPS; s++) all.push(...collectStepIssues(s));
    applyIssues(all);
    return all;
  }

  function jumpToIssue(issue: FormIssue) {
    setStep(issue.step);
    setTimeout(() => {
      const el = document.getElementById(`enrollment-field-${issue.fieldId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      const control = document.getElementById(`enrollment-control-${issue.fieldId}`);
      if (control && "focus" in control) {
        (control as HTMLElement).focus({ preventScroll: true });
      }
    }, 50);
  }

  function scrollEnrollmentTop() {
    window.setTimeout(() => {
      document.getElementById("enrollment-scroll-anchor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function goNext() {
    const issues = collectStepIssues(step);
    if (!applyIssues(issues)) {
      jumpToIssue(issues[0]);
      return;
    }
    setBlockingIssues([]);
    setIndustryOpen(false);
    setCountryOpen(false);
    setStep((s) => Math.min(STEPS, s + 1));
    scrollEnrollmentTop();
  }

  function goBack() {
    setIndustryOpen(false);
    setCountryOpen(false);
    setStep((s) => Math.max(1, s - 1));
    scrollEnrollmentTop();
  }

  function toggleIndustry(id: EnrollmentIndustryId) {
    setDraft((prev) => {
      const selected = prev.industryIds.includes(id);
      const industryIds = selected
        ? prev.industryIds.filter((x) => x !== id)
        : [...prev.industryIds, id];
      return {
        ...prev,
        industryIds,
        industryOther: industryIds.includes("other") ? prev.industryOther : "",
      };
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await submitEnrollment();
  }

  /** RU: Подача лише з кроку 7 / кнопки «Подати»; не з «Далі». EN: Submit only from step 7 button. */
  async function submitEnrollment() {
    if (submitting) return;
    const issues = validateAllSteps();
    if (issues.length > 0) {
      setSubmitError(null);
      jumpToIssue(issues[0]);
      return;
    }
    if (turnstileSiteKey && !captchaToken) {
      setSubmitError(t("submitErrors.captcha_required"));
      setStep(7);
      setTimeout(() => {
        document.getElementById("enrollment-field-turnstile")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setBlockingIssues([]);
    try {
      const payload = {
        lastName: draft.lastName.trim(),
        firstName: draft.firstName.trim(),
        middleName: draft.middleName.trim(),
        birthDate: draft.birthDate,
        country: draft.country,
        city: draft.city.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
        secondaryEmail: draft.secondaryEmail.trim(),
        profileUrl: draft.profileUrl.trim(),
        jobTitle: draft.jobTitle.trim(),
        organization: draft.organization.trim(),
        industryIds: draft.industryIds,
        industryOther: draft.industryOther.trim(),
        industry: formatIndustryForStorage(draft.industryIds, locale, draft.industryOther),
        companySize: draft.companySize,
        oshFunctions: draft.oshFunctions,
        totalYears: draft.totalYears === "" ? null : Number(draft.totalYears),
        oshYears: Number(draft.oshYears),
        responsibilities: draft.responsibilities.trim(),
        educationLevel: draft.educationLevel,
        profileEducation: draft.profileEducation,
        institution: draft.institution.trim(),
        speciality: draft.speciality.trim(),
        graduationYear: draft.graduationYear === "" ? null : Number(draft.graduationYear),
        courses: draft.courses.map((c) => ({
          ...c,
          hours: c.hours ?? null,
          certificateNo: c.certificateNo || null,
        })),
        cpdStatus: draft.cpdStatus,
        cpdActivities: draft.cpdActivities,
        cpdDescription: draft.cpdDescription.trim(),
        codeRead: true as const,
        testAnswers: draft.testAnswers,
        truthConfirm: true as const,
        codeAccept: true as const,
        privacyConsent: true as const,
        serviceMessages: true as const,
        marketingConsent: draft.marketingConsent,
        locale,
        idempotencyKey,
        company: "",
      };

      const form = new FormData();
      form.set("payload", JSON.stringify(payload));
      if (captchaToken) form.set("cf-turnstile-response", captchaToken);
      draft.attachments.forEach((f, i) => form.append(`attachment_${i}`, f));

      const response = await fetch("/api/enrollment", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data.error === "unavailable" || data.error === "blob_unavailable") {
          setSubmitError(t("submitErrors.unavailable"));
        } else if (
          data.error === "captcha_required" ||
          data.error === "captcha_invalid" ||
          data.error === "captcha_unavailable"
        ) {
          setCaptchaToken(null);
          setSubmitError(t(`submitErrors.${data.error}`));
        } else if (data.error === "email_conflict") {
          setSubmitError(t("submitErrors.emailConflict"));
        } else if (
          data.error === "too_large" ||
          data.error === "bad_type" ||
          data.error === "bad_signature" ||
          data.error === "too_many_files" ||
          data.error === "total_too_large"
        ) {
          setSubmitError(t(`submitErrors.${data.error}`));
        } else if (data.error === "invalid_fields" && Array.isArray(data.issues)) {
          const mapped: FormIssue[] = data.issues.map(
            (issue: { path?: (string | number)[]; message?: string }) => {
              const key = String(issue.path?.[0] || "payload");
              return {
                fieldId: key,
                step: 1,
                message: issue.message || t("errors.checkField"),
                label: key,
              };
            },
          );
          setBlockingIssues(mapped);
          setSubmitError(t("submitErrors.invalidFields"));
        } else {
          const detail = data.error ? ` (${data.error})` : "";
          setSubmitError(t("submitErrors.generic", { detail }));
        }
        return;
      }
      sessionStorage.removeItem(STORAGE_KEY);
      if (data.honeypot) {
        setResult({ kind: "honeypot" });
        return;
      }
      if (data.duplicate) {
        setResult({
          kind: "duplicate",
          applicationPublicId: data.applicationPublicId,
          autoLevelLabel:
            levelLabel(data.autoLevel, data.autoLevelLabelUk) ||
            LEVEL_LABELS_UK[data.autoLevel as keyof typeof LEVEL_LABELS_UK] ||
            "",
        });
        return;
      }
      setResult({
        kind: "ok",
        applicationPublicId: data.applicationPublicId,
        autoLevelLabel:
          levelLabel(data.autoLevel, data.autoLevelLabelUk) ||
          LEVEL_LABELS_UK[data.autoLevel as keyof typeof LEVEL_LABELS_UK] ||
          "",
        memberPublicId: data.memberPublicId,
      });
    } catch {
      setSubmitError(t("submitErrors.network"));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    if (result.kind === "honeypot") {
      return (
        <div className="enrollment-success" role="status">
          <h2 className="h2 is--margin-bottom-16">{t("success.thanks")}</h2>
          <p className="regular-l">{t("success.honeypot")}</p>
        </div>
      );
    }
    return (
      <div className="enrollment-success" role="status">
        <h2 className="h2 is--margin-bottom-16">
          {result.kind === "duplicate" ? t("success.duplicate") : t("success.received")}
        </h2>
        {result.applicationPublicId ? (
          <p className="regular-l is--margin-bottom-12">
            {t("success.applicationId")} <strong>{result.applicationPublicId}</strong>
          </p>
        ) : null}
        {result.kind === "ok" && result.memberPublicId ? (
          <p className="regular-l is--margin-bottom-12">
            {t("success.memberId")} <strong>{result.memberPublicId}</strong>
          </p>
        ) : null}
        {result.autoLevelLabel ? (
          <p className="regular-l is--margin-bottom-12">
            {t("success.levelPreview", { level: result.autoLevelLabel, days: REVIEW_BUSINESS_DAYS })}
          </p>
        ) : (
          <p className="regular-l is--margin-bottom-12">
            {t("success.levelPending", { days: REVIEW_BUSINESS_DAYS })}
          </p>
        )}
        {result.kind === "duplicate" ? (
          <p className="regular-l">{t("success.duplicateNote")}</p>
        ) : (
          <p className="regular-l">{t("success.emailNote")}</p>
        )}
      </div>
    );
  }

  const liveLevel = liveClassify
    ? levelLabel(liveClassify.level, liveClassify.labelUk)
    : "";

  return (
    <div className="enrollment-form-wrap" id="enrollment-scroll-anchor">
      <div className="enrollment-progress" aria-label={t("progressAria")}>
        {Array.from({ length: STEPS }, (_, i) => (
          <div
            key={i}
            className={`enrollment-progress__step${i + 1 === step ? " is-active" : ""}${i + 1 < step ? " is-done" : ""}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <p className="regular-s enrollment-step-label">{t("stepLabel", { step, total: STEPS })}</p>
      <p className="enrollment-required-legend">
        {t("requiredLegendBefore")}
        <span className="enrollment-req">{t("requiredMark")}</span>
        {t("requiredLegendAfter")}
      </p>

      {liveClassify && step >= 2 ? (
        <div className="enrollment-level-box" role="status">
          <p className="enrollment-level-box__title">{t("previewLevel", { level: liveLevel })}</p>
          <p className="enrollment-level-box__text">{t("previewFinalNote")}</p>
        </div>
      ) : previewUnavailable && step >= 2 ? (
        <p className="enrollment-hint enrollment-warn" role="status">
          {t("previewUnavailable")}
        </p>
      ) : null}

      {blockingIssues.length > 0 ? (
        <div className="enrollment-issues" role="alert">
          <p className="enrollment-issues__title">{t("issuesTitle")}</p>
          <ul className="enrollment-issues__list">
            {blockingIssues.map((issue) => (
              <li key={`${issue.step}-${issue.fieldId}`}>
                <button type="button" className="enrollment-issues__link" onClick={() => jumpToIssue(issue)}>
                  {t("issueStep", { step: issue.step, label: issue.label })}
                </button>
                <span className="enrollment-issues__msg"> — {issue.message}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form className="enrollment-form" onSubmit={onSubmit} noValidate>
        <div className="site-honeypot" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        {step === 1 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">{t("stepTitles.1")}</legend>
            <Field id="lastName" label={t("fields.lastName")} required error={errors.lastName}>
              <input
                className="form-input text-field w-input"
                value={draft.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </Field>
            <Field id="firstName" label={t("fields.firstName")} required error={errors.firstName}>
              <input
                className="form-input text-field w-input"
                value={draft.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </Field>
            <Field id="middleName" label={t("fields.middleName")}>
              <input
                className="form-input text-field w-input"
                value={draft.middleName}
                onChange={(e) => update("middleName", e.target.value)}
              />
            </Field>
            <Field
              id="birthDate"
              label={t("fields.birthDate")}
              required
              error={errors.birthDate}
              hint={t("birthDateHint")}
            >
              <input
                className="form-input text-field w-input"
                type="date"
                min={BIRTH_DATE_MIN}
                max={birthDateMax}
                value={draft.birthDate}
                onChange={(e) => {
                  update("birthDate", e.target.value);
                  if (errors.birthDate) setFieldError("birthDate", null);
                }}
                onBlur={(e) => validateBirthDateField(e.target.value)}
                required
              />
            </Field>
            <Field
              id="country"
              label={t("fields.country")}
              required
              error={errors.country}
            >
              <div className="enrollment-country" ref={countryBoxRef}>
                <button
                  type="button"
                  className="enrollment-country__trigger form-input text-field"
                  aria-expanded={countryOpen}
                  aria-controls="enrollment-country-list"
                  onClick={() => setCountryOpen((open) => !open)}
                >
                  <img
                    className="enrollment-country__flag"
                    src={countryFlagUrl(draft.country)}
                    alt=""
                    width={20}
                    height={15}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="enrollment-country__name">{countryLabel(draft.country)}</span>
                  <span className="enrollment-country__chevron" aria-hidden="true">
                    ▾
                  </span>
                </button>
                {countryOpen ? (
                  <div className="enrollment-country__panel" id="enrollment-country-list">
                    <input
                      className="form-input text-field w-input enrollment-country__search"
                      value={countryQuery}
                      onChange={(e) => setCountryQuery(e.target.value)}
                      placeholder={t("countrySearchPlaceholder")}
                      autoComplete="off"
                      autoFocus
                      aria-label={t("countrySearchPlaceholder")}
                    />
                    <ul className="enrollment-country__list" role="listbox">
                      {countryOptions.map((code) => (
                        <li key={code}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={draft.country === code}
                            className={
                              draft.country === code
                                ? "enrollment-country__option is-selected"
                                : "enrollment-country__option"
                            }
                            onClick={() => {
                              const nextPhone = withCountryDialPrefix(
                                draft.phone,
                                code,
                                draft.country,
                              );
                              setDraft((prev) => ({
                                ...prev,
                                country: code,
                                phone: nextPhone,
                              }));
                              setCountryQuery("");
                              setCountryOpen(false);
                              if (nextPhone !== countryDialPrefix(code)) {
                                validatePhoneField(nextPhone, code);
                              } else {
                                setFieldError("phone", null);
                              }
                            }}
                          >
                            <img
                              className="enrollment-country__flag"
                              src={countryFlagUrl(code)}
                              alt=""
                              width={20}
                              height={15}
                              loading="lazy"
                              decoding="async"
                            />
                            <span className="enrollment-country__name">{countryLabel(code)}</span>
                          </button>
                        </li>
                      ))}
                      {countryOptions.length === 0 ? (
                        <li className="enrollment-country__empty">{t("countryNoResults")}</li>
                      ) : null}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Field>
            <Field id="city" label={t("fields.city")} required error={errors.city}>
              <input
                className="form-input text-field w-input"
                value={draft.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </Field>
            <Field id="phone" label={t("fields.phone")} required error={errors.phone}>
              <input
                className="form-input text-field w-input"
                value={draft.phone}
                onChange={(e) => {
                  update("phone", e.target.value);
                  if (errors.phone) setFieldError("phone", null);
                }}
                onBlur={(e) => validatePhoneField(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="+…"
              />
            </Field>
            <Field id="email" label={t("fields.email")} required error={errors.email}>
              <input
                className="form-input text-field w-input"
                type="email"
                value={draft.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field id="secondaryEmail" label={t("fields.secondaryEmail")}>
              <input
                className="form-input text-field w-input"
                type="email"
                value={draft.secondaryEmail}
                onChange={(e) => update("secondaryEmail", e.target.value)}
              />
            </Field>
            <Field id="profileUrl" label={t("fields.profileUrl")}>
              <input
                className="form-input text-field w-input"
                type="url"
                value={draft.profileUrl}
                onChange={(e) => update("profileUrl", e.target.value)}
              />
            </Field>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">{t("stepTitles.2")}</legend>
            <Field id="jobTitle" label={t("fields.jobTitle")} required error={errors.jobTitle}>
              <input
                className="form-input text-field w-input"
                value={draft.jobTitle}
                onChange={(e) => update("jobTitle", e.target.value)}
              />
            </Field>
            <Field id="organization" label={t("fields.organization")}>
              <input
                className="form-input text-field w-input"
                value={draft.organization}
                onChange={(e) => update("organization", e.target.value)}
              />
            </Field>
            <Field
              id="industry"
              label={t("fields.industry")}
              required
              error={errors.industry}
              hint={t("industryHint")}
            >
              <div className="enrollment-industry">
                <div className="enrollment-industry__combo" ref={industryBoxRef}>
                  <button
                    type="button"
                    className="enrollment-industry__trigger form-input text-field"
                    aria-expanded={industryOpen}
                    aria-controls="enrollment-industry-list"
                    onClick={() => setIndustryOpen((open) => !open)}
                  >
                    <span className="enrollment-industry__trigger-text">
                      {draft.industryIds.length > 0
                        ? t("industrySelected", { count: draft.industryIds.length })
                        : t("industryPlaceholder")}
                    </span>
                    <span className="enrollment-industry__chevron" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  {industryOpen ? (
                    <div className="enrollment-industry__panel" id="enrollment-industry-list">
                      <input
                        className="form-input text-field w-input enrollment-industry__search"
                        value={industryQuery}
                        onChange={(e) => setIndustryQuery(e.target.value)}
                        placeholder={t("industrySearchPlaceholder")}
                        autoComplete="off"
                        autoFocus
                        aria-label={t("industrySearchPlaceholder")}
                      />
                      <ul className="enrollment-industry__list" role="group" aria-label={t("fields.industry")}>
                        {industryOptions.map((id) => {
                          const checked = draft.industryIds.includes(id);
                          const optionId = `enrollment-industry-option-${id}`;
                          return (
                            <li key={id}>
                              <label className="enrollment-industry__option" htmlFor={optionId}>
                                <input
                                  id={optionId}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleIndustry(id)}
                                />
                                <span>{industryLabel(id, locale)}</span>
                              </label>
                            </li>
                          );
                        })}
                        {industryOptions.length === 0 ? (
                          <li className="enrollment-industry__empty">{t("industryNoResults")}</li>
                        ) : null}
                      </ul>
                    </div>
                  ) : null}
                </div>
                {draft.industryIds.length > 0 ? (
                  <ul className="enrollment-industry__chips" aria-label={t("fields.industry")}>
                    {draft.industryIds.map((id) => (
                      <li key={id}>
                        <button
                          type="button"
                          className="enrollment-industry__chip"
                          aria-label={`${t("industryRemove")}: ${industryLabel(id, locale)}`}
                          onClick={() => toggleIndustry(id)}
                        >
                          {industryLabel(id, locale)}
                          <span aria-hidden="true"> ×</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Field>
            {draft.industryIds.includes("other") ? (
              <Field
                id="industryOther"
                label={t("fields.industryOther")}
                required
                error={errors.industryOther}
              >
                <input
                  className="form-input text-field w-input"
                  value={draft.industryOther}
                  onChange={(e) => update("industryOther", e.target.value)}
                />
              </Field>
            ) : null}
            <Field id="companySize" label={t("fields.companySize")} required error={errors.companySize}>
              <select
                className="form-input text-field w-select"
                value={draft.companySize}
                onChange={(e) => update("companySize", e.target.value as CompanySize | "")}
              >
                <option value="">{t("choose")}</option>
                <option value="le20">{t("companySizeOptions.le20")}</option>
                <option value="21_50">{t("companySizeOptions.21_50")}</option>
                <option value="gt50">{t("companySizeOptions.gt50")}</option>
              </select>
            </Field>
            <ChoiceGroup
              id="oshFunctions"
              label={t("fields.oshFunctions")}
              expand={t("oshExpand")}
              required
              error={errors.oshFunctions}
            >
              <label>
                <input
                  type="radio"
                  name="oshFunctions"
                  checked={draft.oshFunctions === true}
                  onChange={() => update("oshFunctions", true)}
                />{" "}
                {t("yes")}
              </label>
              <label>
                <input
                  type="radio"
                  name="oshFunctions"
                  checked={draft.oshFunctions === false}
                  onChange={() => update("oshFunctions", false)}
                />{" "}
                {t("no")}
              </label>
            </ChoiceGroup>
            <Field id="totalYears" label={t("fields.totalYears")}>
              <NumberStepper
                value={draft.totalYears}
                onChange={(next) => update("totalYears", next)}
                min={0}
                max={60}
                step={0.5}
                decreaseLabel={t("stepperDecrease")}
                increaseLabel={t("stepperIncrease")}
              />
            </Field>
            <Field
              id="oshYears"
              label={t("fields.oshYears")}
              expand={t("oshExpand")}
              required
              error={errors.oshYears}
            >
              <NumberStepper
                value={draft.oshYears}
                onChange={(next) => update("oshYears", next)}
                min={0}
                max={60}
                step={0.5}
                decreaseLabel={t("stepperDecrease")}
                increaseLabel={t("stepperIncrease")}
              />
            </Field>
            <Field
              id="responsibilities"
              label={t("fields.responsibilities")}
              required
              error={errors.responsibilities}
              hint={t("charCount", { count: draft.responsibilities.length })}
            >
              <textarea
                className="form-input text-field w-input"
                rows={5}
                maxLength={1500}
                value={draft.responsibilities}
                onChange={(e) => update("responsibilities", e.target.value)}
              />
            </Field>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">{t("stepTitles.3")}</legend>
            <Field id="educationLevel" label={t("fields.educationLevel")} required error={errors.educationLevel}>
              <select
                className="form-input text-field w-select"
                value={draft.educationLevel}
                onChange={(e) => update("educationLevel", e.target.value as EducationLevel | "")}
              >
                <option value="">{t("choose")}</option>
                <option value="vocational">{t("educationOptions.vocational")}</option>
                <option value="junior_bachelor">{t("educationOptions.junior_bachelor")}</option>
                <option value="bachelor">{t("educationOptions.bachelor")}</option>
                <option value="master">{t("educationOptions.master")}</option>
                <option value="phd">{t("educationOptions.phd")}</option>
                <option value="doctor">{t("educationOptions.doctor")}</option>
                <option value="other">{t("educationOptions.other")}</option>
              </select>
            </Field>
            <ChoiceGroup
              id="profileEducation"
              label={t("fields.profileEducation")}
              expand={t("oshExpand")}
              required
              error={errors.profileEducation}
            >
              <label>
                <input
                  type="radio"
                  name="profileEducation"
                  checked={draft.profileEducation === true}
                  onChange={() => update("profileEducation", true)}
                />{" "}
                {t("yes")}
              </label>
              <label>
                <input
                  type="radio"
                  name="profileEducation"
                  checked={draft.profileEducation === false}
                  onChange={() => update("profileEducation", false)}
                />{" "}
                {t("no")}
              </label>
            </ChoiceGroup>
            <Field
              id="institution"
              label={t("fields.institution")}
              required={Boolean(draft.educationLevel && draft.educationLevel !== "other")}
              error={errors.institution}
            >
              <input
                className="form-input text-field w-input"
                value={draft.institution}
                onChange={(e) => update("institution", e.target.value)}
              />
            </Field>
            <Field
              id="speciality"
              label={t("fields.speciality")}
              required={Boolean(draft.educationLevel && draft.educationLevel !== "other")}
              error={errors.speciality}
            >
              <input
                className="form-input text-field w-input"
                value={draft.speciality}
                onChange={(e) => update("speciality", e.target.value)}
              />
            </Field>
            <Field
              id="graduationYear"
              label={t("fields.graduationYear")}
              required={Boolean(draft.educationLevel && draft.educationLevel !== "other")}
              error={errors.graduationYear}
            >
              <select
                className="form-input text-field w-select"
                value={draft.graduationYear}
                onChange={(e) => update("graduationYear", e.target.value)}
              >
                <option value="">{t("choose")}</option>
                {graduationYears.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">{t("stepTitles.4")}</legend>
            {draft.courses.map((course, index) => (
              <div key={index} className="enrollment-course">
                <div className="enrollment-course__head">
                  <strong>{t("courseHeading", { n: index + 1 })}</strong>
                  <button
                    type="button"
                    className="btn is--secondary w-button"
                    onClick={() => update("courses", draft.courses.filter((_, i) => i !== index))}
                  >
                    {t("courseRemove")}
                  </button>
                </div>
                <Field id={`courseType_${index}`} label={t("fields.courseType")}>
                  <select
                    className="form-input text-field w-select"
                    value={course.courseType}
                    onChange={(e) => {
                      const courses = [...draft.courses];
                      courses[index] = { ...course, courseType: e.target.value as CourseType };
                      update("courses", courses);
                    }}
                  >
                    {COURSE_TYPES.map((value) => (
                      <option key={value} value={value}>
                        {t(`courseTypes.${value}`)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  id={`courseName_${index}`}
                  label={t("fields.courseName")}
                  required
                  error={errors[`courseName_${index}`]}
                >
                  <input
                    className="form-input text-field w-input"
                    value={course.courseName}
                    onChange={(e) => {
                      const courses = [...draft.courses];
                      courses[index] = { ...course, courseName: e.target.value };
                      update("courses", courses);
                    }}
                  />
                </Field>
                <Field
                  id={`provider_${index}`}
                  label={t("fields.provider")}
                  required
                  error={errors[`provider_${index}`]}
                >
                  <input
                    className="form-input text-field w-input"
                    value={course.provider}
                    onChange={(e) => {
                      const courses = [...draft.courses];
                      courses[index] = { ...course, provider: e.target.value };
                      update("courses", courses);
                    }}
                  />
                </Field>
                <Field id={`courseYear_${index}`} label={t("fields.courseYear")}>
                  <NumberStepper
                    value={course.courseYear || ""}
                    onChange={(next) => {
                      const courses = [...draft.courses];
                      courses[index] = {
                        ...course,
                        courseYear: next === "" ? 0 : Number(next),
                      };
                      update("courses", courses);
                    }}
                    min={1950}
                    max={new Date().getFullYear()}
                    step={1}
                    decreaseLabel={t("stepperDecrease")}
                    increaseLabel={t("stepperIncrease")}
                  />
                </Field>
                <Field id={`hours_${index}`} label={t("fields.hours")}>
                  <NumberStepper
                    value={course.hours ?? ""}
                    onChange={(next) => {
                      const courses = [...draft.courses];
                      courses[index] = {
                        ...course,
                        hours: next === "" ? null : Number(next),
                      };
                      update("courses", courses);
                    }}
                    min={0}
                    max={1000}
                    step={1}
                    decreaseLabel={t("stepperDecrease")}
                    increaseLabel={t("stepperIncrease")}
                  />
                </Field>
                <Field id={`certificateNo_${index}`} label={t("fields.certificateNo")}>
                  <input
                    className="form-input text-field w-input"
                    value={course.certificateNo || ""}
                    onChange={(e) => {
                      const courses = [...draft.courses];
                      courses[index] = { ...course, certificateNo: e.target.value };
                      update("courses", courses);
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="btn is--secondary w-button"
              onClick={() => update("courses", [...draft.courses, emptyCourse()])}
            >
              {t("courseAdd")}
            </button>
          </fieldset>
        ) : null}

        {step === 5 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">{t("stepTitles.5")}</legend>
            <Field
              id="cpdStatus"
              label={t("fields.cpdStatus")}
              expand={t("cpdExpand")}
              required
              error={errors.cpdStatus}
            >
              <select
                className="form-input text-field w-select"
                value={draft.cpdStatus}
                onChange={(e) => update("cpdStatus", e.target.value as CpdStatus | "")}
              >
                <option value="">{t("choose")}</option>
                <option value="participating">{t("cpdStatusOptions.participating")}</option>
                <option value="ready">{t("cpdStatusOptions.ready")}</option>
                <option value="want_info">{t("cpdStatusOptions.want_info")}</option>
                <option value="not_ready">{t("cpdStatusOptions.not_ready")}</option>
              </select>
            </Field>
            <ChoiceGroup
              id="cpdActivities"
              label={t("fields.cpdActivities")}
              role="group"
              className="enrollment-checks"
            >
              {CPD_ACTIVITY_VALUES.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={draft.cpdActivities.includes(item)}
                    onChange={(e) => {
                      update(
                        "cpdActivities",
                        e.target.checked
                          ? [...draft.cpdActivities, item]
                          : draft.cpdActivities.filter((x) => x !== item),
                      );
                    }}
                  />{" "}
                  {t(`cpdActivities.${item}`)}
                </label>
              ))}
            </ChoiceGroup>
            <Field
              id="cpdDescription"
              label={t("fields.cpdDescription")}
              hint={t("charCount", { count: draft.cpdDescription.length })}
            >
              <textarea
                className="form-input text-field w-input"
                rows={4}
                maxLength={1500}
                value={draft.cpdDescription}
                onChange={(e) => update("cpdDescription", e.target.value)}
              />
            </Field>
          </fieldset>
        ) : null}

        {step === 6 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">{t("stepTitles.6")}</legend>
            <p className="regular-l is--margin-bottom-16">
              {t("codexIntro")}{" "}
              <Link href="/join/codex" target="_blank" className="is--link">
                {t("codexLink")}
              </Link>
              .
            </p>
            <div className="enrollment-field" id="enrollment-field-codeRead">
              <label className="enrollment-consent-card" htmlFor="enrollment-control-codeRead">
                <input
                  id="enrollment-control-codeRead"
                  type="checkbox"
                  checked={draft.codeRead}
                  onChange={(e) => update("codeRead", e.target.checked)}
                  aria-invalid={Boolean(errors.codeRead)}
                  aria-describedby={errors.codeRead ? "enrollment-error-codeRead" : undefined}
                />
                <span>
                  {t("codexReadLabel")}
                  <span className="enrollment-req"> {t("requiredMark")}</span>
                </span>
              </label>
              {errors.codeRead ? (
                <p className="site-form-error" id="enrollment-error-codeRead" role="alert">
                  {errors.codeRead}
                </p>
              ) : null}
            </div>
            {CODEX_QUESTIONS_PUBLIC.map((q) => (
              <ChoiceGroup
                key={q.id}
                id={`test_${q.id}`}
                label={quizPrompt(q)}
                required
                error={errors[`test_${q.id}`]}
                className="enrollment-radios enrollment-radios--stack"
              >
                {q.options.map((opt) => (
                  <label key={opt.id}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={draft.testAnswers[q.id] === opt.id}
                      onChange={() =>
                        update("testAnswers", { ...draft.testAnswers, [q.id]: opt.id })
                      }
                    />{" "}
                    {quizOptionLabel(opt)}
                  </label>
                ))}
              </ChoiceGroup>
            ))}
            <p className="regular-s">{t("codexSpecialistNote")}</p>
          </fieldset>
        ) : null}

        {step === 7 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">{t("stepTitles.7")}</legend>
            {liveClassify ? (
              <div className="enrollment-summary">
                <p className="bold-l is--margin-bottom-8">{t("summaryTitle")}</p>
                <p className="regular-l">
                  {draft.lastName} {draft.firstName}, {draft.email}
                </p>
                <p className="regular-l">
                  {draft.jobTitle}
                  {draft.organization ? `, ${draft.organization}` : ""}
                </p>
                <p className="regular-l is--margin-top-12">
                  {t("summaryLevel")} <strong>{liveLevel}</strong>
                </p>
                <p className="regular-s is--margin-top-8">{t("previewFinalNote")}</p>
              </div>
            ) : previewUnavailable ? (
              <p className="enrollment-hint enrollment-warn" role="status">
                {t("previewUnavailable")}
              </p>
            ) : null}
            <EnrollmentAttachmentsDropzone
              files={draft.attachments}
              onChange={(next) => update("attachments", next)}
              title={t("attachments.title")}
              hint={t("attachments.hint")}
              dropLabel={t("attachments.drop")}
              browseLabel={t("attachments.browse")}
              removeLabel={t("attachments.remove")}
              emptyLabel={t("attachments.empty")}
              optionalLabel={t("optional")}
              errorTooMany={t("attachments.errorTooMany")}
              errorTotalSize={t("attachments.errorTotalSize")}
              errorFile={t("attachments.errorFile")}
            />
            {turnstileSiteKey ? (
              <div
                className="enrollment-captcha-step"
                id="enrollment-field-turnstile"
                role="group"
                aria-labelledby="enrollment-captcha-step-title"
              >
                <p id="enrollment-captcha-step-title" className="enrollment-question">
                  {t("captcha.stepConfirm")}
                  <span className="enrollment-req"> {t("requiredMark")}</span>
                </p>
                <TurnstileWidget
                  siteKey={turnstileSiteKey}
                  language={locale}
                  onSuccess={(next) => setCaptchaToken(next)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => setCaptchaToken(null)}
                />
                {!captchaToken ? (
                  <p className="site-form-error is--margin-top-8" role="alert">
                    {t("captcha.required")}
                  </p>
                ) : null}
              </div>
            ) : null}
            <fieldset className="enrollment-consents">
              <legend className="enrollment-question">{t("consentsLegend")}</legend>
              <p className="regular-s is--margin-bottom-8">{t("consentsLead")}</p>
              <label
                id="enrollment-field-truthConfirm"
                className="enrollment-consent-card"
                htmlFor="enrollment-control-truthConfirm"
              >
                <input
                  id="enrollment-control-truthConfirm"
                  type="checkbox"
                  checked={draft.truthConfirm}
                  onChange={(e) => update("truthConfirm", e.target.checked)}
                />
                <span>
                  {t("truthConfirm")}
                  <span className="enrollment-req"> {t("requiredMark")}</span>
                </span>
              </label>
              <label
                id="enrollment-field-codeAccept"
                className="enrollment-consent-card"
                htmlFor="enrollment-control-codeAccept"
              >
                <input
                  id="enrollment-control-codeAccept"
                  type="checkbox"
                  checked={draft.codeAccept}
                  onChange={(e) => update("codeAccept", e.target.checked)}
                />
                <span>
                  {t("codeAccept")}
                  <span className="enrollment-req"> {t("requiredMark")}</span>
                </span>
              </label>
              <label
                id="enrollment-field-privacyConsent"
                className="enrollment-consent-card"
                htmlFor="enrollment-control-privacyConsent"
              >
                <input
                  id="enrollment-control-privacyConsent"
                  type="checkbox"
                  checked={draft.privacyConsent}
                  onChange={(e) => update("privacyConsent", e.target.checked)}
                />
                <span>
                  {t("privacyConsent")}{" "}
                  <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    {t("privacyLink")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link href="/cookie-policy" target="_blank" rel="noopener noreferrer">
                    {t("cookieLink")}
                  </Link>
                  <span className="enrollment-req"> {t("requiredMark")}</span>
                </span>
              </label>
              <label
                id="enrollment-field-serviceMessages"
                className="enrollment-consent-card"
                htmlFor="enrollment-control-serviceMessages"
              >
                <input
                  id="enrollment-control-serviceMessages"
                  type="checkbox"
                  checked={draft.serviceMessages}
                  onChange={(e) => update("serviceMessages", e.target.checked)}
                />
                <span>
                  {t("serviceMessages")}
                  <span className="enrollment-req"> {t("requiredMark")}</span>
                </span>
              </label>
              <label
                className="enrollment-consent-card enrollment-consent-card--optional"
                htmlFor="enrollment-control-marketingConsent"
              >
                <input
                  id="enrollment-control-marketingConsent"
                  type="checkbox"
                  checked={draft.marketingConsent}
                  onChange={(e) => update("marketingConsent", e.target.checked)}
                />
                <span>
                  {t("marketingConsent")} <em>{t("optional")}</em>
                </span>
              </label>
              {errors.truthConfirm ||
              errors.codeAccept ||
              errors.privacyConsent ||
              errors.serviceMessages ? (
                <p className="site-form-error" role="alert">
                  {t("consentsError")}
                </p>
              ) : null}
            </fieldset>
            {submitError ? (
              <p className="site-form-error" role="alert">
                {submitError}
              </p>
            ) : null}
          </fieldset>
        ) : null}

        <div className="enrollment-actions">
          {step > 1 ? (
            <button type="button" className="btn is--secondary w-button" onClick={goBack}>
              {t("back")}
            </button>
          ) : (
            <span />
          )}
          {step < STEPS ? (
            <button type="button" className="btn is--primary w-button" onClick={goNext}>
              {t("next")}
            </button>
          ) : (
            <button
              type="button"
              className="btn is--primary w-button"
              disabled={submitting}
              onClick={() => {
                void submitEnrollment();
              }}
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  expand,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  expand?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const controlId = `enrollment-control-${id}`;
  const labelId = `enrollment-label-${id}`;
  const errorId = `enrollment-error-${id}`;
  const hintId = `enrollment-hint-${id}`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="enrollment-field" id={`enrollment-field-${id}`}>
      <label className="enrollment-question" htmlFor={controlId} id={labelId}>
        {label}
        {expand ? <span className="enrollment-expand"> ({expand})</span> : null}
        {required ? (
          <span className="enrollment-req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {injectControlProps(children, {
        id: controlId,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}
      {hint ? (
        <p className="enrollment-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="site-form-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceGroup({
  id,
  label,
  expand,
  required,
  error,
  children,
  role = "radiogroup",
  className = "enrollment-radios",
}: {
  id: string;
  label: string;
  expand?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  role?: "radiogroup" | "group";
  className?: string;
}) {
  const labelId = `enrollment-label-${id}`;
  const errorId = `enrollment-error-${id}`;

  return (
    <div className="enrollment-field" id={`enrollment-field-${id}`}>
      <p className="enrollment-question" id={labelId}>
        {label}
        {expand ? <span className="enrollment-expand"> ({expand})</span> : null}
        {required ? (
          <span className="enrollment-req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </p>
      <div
        role={role}
        aria-labelledby={labelId}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={className}
      >
        {children}
      </div>
      {error ? (
        <p className="site-form-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
