"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type {
  CompanySize,
  CourseType,
  CpdStatus,
  EducationLevel,
  EnrollmentCourseInput,
} from "@/lib/enrollment/classify";
import type { ClassifyResult } from "@/lib/enrollment/classify";
import { LEVEL_LABELS_UK, REVIEW_BUSINESS_DAYS } from "@/lib/enrollment/levels";
import { CODEX_QUESTIONS_PUBLIC } from "@/lib/enrollment/quiz";

type CourseDraft = EnrollmentCourseInput & {
  certFiles: File[];
};

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
  country: string;
  city: string;
  phone: string;
  email: string;
  secondaryEmail: string;
  profileUrl: string;
  photo: File | null;
  jobTitle: string;
  organization: string;
  industry: string;
  companySize: CompanySize | "";
  oshFunctions: boolean | null;
  totalYears: string;
  oshYears: string;
  responsibilities: string;
  experienceFiles: File[];
  educationLevel: EducationLevel | "";
  profileEducation: boolean | null;
  institution: string;
  speciality: string;
  graduationYear: string;
  diplomaFiles: File[];
  courses: CourseDraft[];
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

const STORAGE_KEY = "esosh-enrollment-draft-v1";
const STEPS = 7;

const emptyCourse = (): CourseDraft => ({
  courseType: "esosh_21",
  courseName: "",
  provider: "",
  courseYear: new Date().getFullYear(),
  hours: null,
  certificateNo: "",
  certFiles: [],
});

const initialDraft = (): Draft => ({
  lastName: "",
  firstName: "",
  middleName: "",
  birthDate: "",
  country: "Україна",
  city: "",
  phone: "",
  email: "",
  secondaryEmail: "",
  profileUrl: "",
  photo: null,
  jobTitle: "",
  organization: "",
  industry: "",
  companySize: "",
  oshFunctions: null,
  totalYears: "",
  oshYears: "",
  responsibilities: "",
  experienceFiles: [],
  educationLevel: "",
  profileEducation: null,
  institution: "",
  speciality: "",
  graduationYear: "",
  diplomaFiles: [],
  courses: [],
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
});

const COURSE_LABELS: Record<CourseType, string> = {
  esosh_21: "ESOSH 21 год",
  iosh_ms: "IOSH Managing Safely",
  nebosh_award: "NEBOSH Award",
  esosh_130: "ESOSH 130 год",
  nebosh_igc: "NEBOSH IGC",
  esosh_15y: "ESOSH ≥1,5 року",
  nebosh_diploma: "NEBOSH Diploma",
  nvq5: "NVQ5",
  other: "Інша / еквівалент",
};

const CPD_ACTIVITY_OPTIONS = [
  "навчання",
  "конференції",
  "тренерство",
  "виступи",
  "публікації",
  "робочі групи",
  "інше",
];

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `k-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStoredDraft(): { draft: Draft; step: number } {
  if (typeof window === "undefined") return { draft: initialDraft(), step: 1 };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { draft: initialDraft(), step: 1 };
    const parsed = JSON.parse(raw) as Partial<Draft> & { step?: number };
    const draft: Draft = {
      ...initialDraft(),
      ...parsed,
      photo: null,
      experienceFiles: [],
      diplomaFiles: [],
      courses: Array.isArray(parsed.courses)
        ? parsed.courses.map((c) => ({ ...emptyCourse(), ...c, certFiles: [] }))
        : [],
    };
    const step =
      parsed.step && parsed.step >= 1 && parsed.step <= STEPS ? parsed.step : 1;
    return { draft, step };
  } catch {
    return { draft: initialDraft(), step: 1 };
  }
}

function omitCertFiles(courses: CourseDraft[]) {
  return courses.map((course) => {
    const { certFiles, ...rest } = course;
    void certFiles;
    return rest;
  });
}

/** RU: 7-крокова форма вступу за ТЗ. EN: Multi-step enrollment form. */
export function EnrollmentForm() {
  const stored = useState(readStoredDraft)[0];
  const [step, setStep] = useState(stored.step);
  const [draft, setDraft] = useState<Draft>(stored.draft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [blockingIssues, setBlockingIssues] = useState<FormIssue[]>([]);
  const [result, setResult] = useState<{
    applicationPublicId: string;
    autoLevelLabelUk: string;
    memberPublicId: string;
  } | null>(null);
  const [idempotencyKey] = useState(newIdempotencyKey);
  const [liveClassify, setLiveClassify] = useState<ClassifyResult | null>(null);

  useEffect(() => {
    const { photo, experienceFiles, diplomaFiles, courses, ...rest } = draft;
    void photo;
    void experienceFiles;
    void diplomaFiles;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...rest,
          courses: omitCertFiles(courses),
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
            courses: omitCertFiles(draft.courses),
            cpdStatus: draft.cpdStatus,
            testAnswers: draft.testAnswers,
          }),
        });
        const data = await response.json();
        if (response.ok && data.ok) {
          setLiveClassify({
            level: data.level,
            labelUk: data.labelUk,
            requiresManualReview: data.requiresManualReview,
            matchedRules: data.matchedRules,
            criteria: data.criteria,
            nextLevelHintUk: data.nextLevelHintUk,
          });
        }
      } catch {
        /* ignore abort/network */
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

  function collectStepIssues(current: number): FormIssue[] {
    const issues: FormIssue[] = [];
    const add = (fieldId: string, message: string, label: string) => {
      issues.push({ fieldId, step: current, message, label });
    };
    if (current === 1) {
      if (draft.lastName.trim().length < 2) add("lastName", "Вкажіть прізвище (2–80)", "Прізвище");
      if (draft.firstName.trim().length < 2) add("firstName", "Вкажіть ім’я (2–80)", "Ім’я");
      if (!draft.country.trim()) add("country", "Вкажіть країну", "Країна");
      if (!draft.city.trim()) add("city", "Вкажіть місто", "Місто");
      if (!/^\+?[0-9()\-\s]{8,32}$/.test(draft.phone.trim())) add("phone", "Міжнародний формат телефону", "Телефон");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) add("email", "Некоректний email", "Email");
    }
    if (current === 2) {
      if (!draft.jobTitle.trim()) add("jobTitle", "Вкажіть посаду", "Посада");
      if (!draft.industry.trim()) add("industry", "Вкажіть галузь", "Галузь");
      if (!draft.companySize) add("companySize", "Оберіть розмір організації", "Розмір організації");
      if (draft.oshFunctions === null) add("oshFunctions", "Оберіть Так або Ні", "Функції з БЗР");
      if (draft.oshYears === "" || Number.isNaN(Number(draft.oshYears))) add("oshYears", "Вкажіть стаж БЗР", "Стаж у сфері БЗР");
      if (!draft.responsibilities.trim()) add("responsibilities", "Опишіть обов’язки", "Обов’язки");
      if (draft.responsibilities.length > 1500) add("responsibilities", "Максимум 1500 символів", "Обов’язки");
    }
    if (current === 3) {
      if (!draft.educationLevel) add("educationLevel", "Оберіть рівень освіти", "Рівень освіти");
      if (draft.profileEducation === null) add("profileEducation", "Оберіть Так або Ні", "Профільна освіта");
      if (draft.educationLevel && draft.educationLevel !== "other") {
        if (!draft.institution.trim()) add("institution", "Вкажіть заклад", "Навчальний заклад");
        if (!draft.speciality.trim()) add("speciality", "Вкажіть спеціальність", "Спеціальність");
        if (!draft.graduationYear.trim()) add("graduationYear", "Вкажіть рік", "Рік закінчення");
      }
    }
    if (current === 4) {
      draft.courses.forEach((c, i) => {
        if (!c.courseName.trim()) add(`courseName_${i}`, "Назва курсу", `Курс ${i + 1}: назва`);
        if (!c.provider.trim()) add(`provider_${i}`, "Організація", `Курс ${i + 1}: організація`);
        if (c.courseType !== "other" && c.certFiles.length === 0) {
          add(`certificate_${i}`, "Додайте сертифікат (файли не зберігаються між сесіями — завантажте знову)", `Курс ${i + 1}: сертифікат`);
        }
      });
    }
    if (current === 5) {
      if (!draft.cpdStatus) add("cpdStatus", "Оберіть варіант", "Участь у БПР");
    }
    if (current === 6) {
      if (!draft.codeRead) add("codeRead", "Підтвердіть ознайомлення", "Згода з Кодексом");
      for (const q of CODEX_QUESTIONS_PUBLIC) {
        if (!draft.testAnswers[q.id]) add(`test_${q.id}`, "Оберіть відповідь", `Тест: ${q.promptUk.slice(0, 48)}…`);
      }
    }
    if (current === 7) {
      if (!draft.truthConfirm) add("truthConfirm", "Потрібне підтвердження", "Достовірність даних");
      if (!draft.codeAccept) add("codeAccept", "Потрібна згода", "Кодекс поведінки");
      if (!draft.privacyConsent) add("privacyConsent", "Потрібна згода", "Обробка персональних даних");
      if (!draft.serviceMessages) add("serviceMessages", "Потрібна згода", "Службові повідомлення");
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

  function validateStep(current: number): boolean {
    return applyIssues(collectStepIssues(current));
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
    }, 50);
  }

  function goNext() {
    if (!validateStep(step)) return;
    setBlockingIssues([]);
    setStep((s) => Math.min(STEPS, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const issues = validateAllSteps();
    if (issues.length > 0) {
      setSubmitError(null);
      jumpToIssue(issues[0]);
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
        country: draft.country.trim(),
        city: draft.city.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
        secondaryEmail: draft.secondaryEmail.trim(),
        profileUrl: draft.profileUrl.trim(),
        jobTitle: draft.jobTitle.trim(),
        organization: draft.organization.trim(),
        industry: draft.industry.trim(),
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
        courses: omitCertFiles(draft.courses).map((c) => ({
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
        locale: "uk" as const,
        idempotencyKey,
        company: "",
      };

      const form = new FormData();
      form.set("payload", JSON.stringify(payload));
      if (draft.photo) form.set("photo", draft.photo);
      draft.experienceFiles.forEach((f, i) => form.append(`experience_${i}`, f));
      draft.diplomaFiles.forEach((f, i) => form.append(`diploma_${i}`, f));
      draft.courses.forEach((c, i) => {
        c.certFiles.forEach((f, j) => form.append(`certificate_${i}_${j}`, f));
      });

      const response = await fetch("/api/enrollment", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data.error === "unavailable" || data.error === "blob_unavailable") {
          setSubmitError("Форма тимчасово недоступна (немає DATABASE_URL або Blob). Напишіть на office@esosh.net");
        } else if (data.error === "email_conflict") {
          setSubmitError("Ці email вже пов’язані з різними картками. Зверніться до адміністратора.");
        } else if (data.error === "certificate_required") {
          const idx = typeof data.courseIndex === "number" ? data.courseIndex : 0;
          const issue: FormIssue = {
            fieldId: `certificate_${idx}`,
            step: 4,
            message: "Додайте сертифікат",
            label: `Курс ${idx + 1}: сертифікат`,
          };
          setBlockingIssues([issue]);
          setSubmitError("Для заявленого курсу потрібен файл сертифіката.");
          jumpToIssue(issue);
        } else if (data.error === "invalid_fields" && Array.isArray(data.issues)) {
          const mapped: FormIssue[] = data.issues.map((issue: { path?: (string | number)[]; message?: string }) => {
            const key = String(issue.path?.[0] || "payload");
            return {
              fieldId: key,
              step: 1,
              message: issue.message || "Перевірте поле",
              label: key,
            };
          });
          setBlockingIssues(mapped);
          setSubmitError("Сервер відхилив частину полів. Відкрийте пункт зі списку нижче.");
        } else {
          setSubmitError(
            `Не вдалося надіслати заявку${data.error ? ` (${data.error})` : ""}. Перевірте поля та спробуйте ще раз.`,
          );
        }
        return;
      }
      sessionStorage.removeItem(STORAGE_KEY);
      setResult({
        applicationPublicId: data.applicationPublicId,
        autoLevelLabelUk: data.autoLevelLabelUk || LEVEL_LABELS_UK[data.autoLevel as keyof typeof LEVEL_LABELS_UK] || "",
        memberPublicId: data.memberPublicId,
      });
    } catch {
      setSubmitError("Помилка мережі. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="enrollment-success" role="status">
        <h2 className="h2 is--margin-bottom-16">Дякуємо! Заявку отримано</h2>
        <p className="regular-l is--margin-bottom-12">
          Номер заявки: <strong>{result.applicationPublicId}</strong>
        </p>
        <p className="regular-l is--margin-bottom-12">
          ID учасника: <strong>{result.memberPublicId}</strong>
        </p>
        <p className="regular-l is--margin-bottom-12">
          Попередній рівень: «{result.autoLevelLabelUk}». Остаточний рівень визначить адміністратор
          при розгляді (орієнтовно {REVIEW_BUSINESS_DAYS} робочих днів).
        </p>
        <p className="regular-l">Підтвердження також надішлемо на вашу електронну скриньку (якщо налаштовано доставку).</p>
      </div>
    );
  }

  return (
    <div className="enrollment-form-wrap">
      <div className="enrollment-progress" aria-label="Прогрес форми">
        {Array.from({ length: STEPS }, (_, i) => (
          <div
            key={i}
            className={`enrollment-progress__step${i + 1 === step ? " is-active" : ""}${i + 1 < step ? " is-done" : ""}`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <p className="regular-s enrollment-step-label">Крок {step} з {STEPS}</p>
      <p className="enrollment-required-legend">
        Поля з <span className="enrollment-req">*</span> обов’язкові
      </p>

      {liveClassify && step >= 2 ? (
        <div className="enrollment-level-box" role="status">
          <p className="enrollment-level-box__title">
            Попередній рівень: {liveClassify.labelUk}
          </p>
          <p className="enrollment-level-box__text">
            Остаточний рівень визначить адміністратор при розгляді.
          </p>
        </div>
      ) : null}

      {blockingIssues.length > 0 ? (
        <div className="enrollment-issues" role="alert">
          <p className="enrollment-issues__title">Щоб продовжити, виправте:</p>
          <ul className="enrollment-issues__list">
            {blockingIssues.map((issue) => (
              <li key={`${issue.step}-${issue.fieldId}`}>
                <button type="button" className="enrollment-issues__link" onClick={() => jumpToIssue(issue)}>
                  Крок {issue.step}: {issue.label}
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
            <legend className="h3">Особисті та контактні дані</legend>
            <Field id="lastName" label="Прізвище" required error={errors.lastName}>
              <input className="form-input text-field w-input" value={draft.lastName} onChange={(e) => update("lastName", e.target.value)} required />
            </Field>
            <Field id="firstName" label="Ім’я" required error={errors.firstName}>
              <input className="form-input text-field w-input" value={draft.firstName} onChange={(e) => update("firstName", e.target.value)} required />
            </Field>
            <Field id="middleName" label="По батькові">
              <input className="form-input text-field w-input" value={draft.middleName} onChange={(e) => update("middleName", e.target.value)} />
            </Field>
            <Field id="birthDate" label="Дата народження">
              <input className="form-input text-field w-input" type="date" value={draft.birthDate} onChange={(e) => update("birthDate", e.target.value)} />
            </Field>
            <Field id="country" label="Країна" required error={errors.country}>
              <input className="form-input text-field w-input" value={draft.country} onChange={(e) => update("country", e.target.value)} />
            </Field>
            <Field id="city" label="Місто" required error={errors.city}>
              <input className="form-input text-field w-input" value={draft.city} onChange={(e) => update("city", e.target.value)} />
            </Field>
            <Field id="phone" label="Телефон" required error={errors.phone} hint="Міжнародний формат, наприклад +380…">
              <input className="form-input text-field w-input" value={draft.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>
            <Field id="email" label="Email" required error={errors.email}>
              <input className="form-input text-field w-input" type="email" value={draft.email} onChange={(e) => update("email", e.target.value)} />
            </Field>
            <Field id="secondaryEmail" label="Додатковий email">
              <input className="form-input text-field w-input" type="email" value={draft.secondaryEmail} onChange={(e) => update("secondaryEmail", e.target.value)} />
            </Field>
            <Field id="profileUrl" label="LinkedIn / профіль">
              <input className="form-input text-field w-input" type="url" value={draft.profileUrl} onChange={(e) => update("profileUrl", e.target.value)} />
            </Field>
            <Field id="photo" label="Фото (JPG/PNG, до 5 МБ)">
              <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={(e) => update("photo", e.target.files?.[0] || null)} />
            </Field>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">Професійна діяльність</legend>
            <Field id="jobTitle" label="Посада" required error={errors.jobTitle}>
              <input className="form-input text-field w-input" value={draft.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} />
            </Field>
            <Field id="organization" label="Організація">
              <input className="form-input text-field w-input" value={draft.organization} onChange={(e) => update("organization", e.target.value)} />
            </Field>
            <Field id="industry" label="Галузь" required error={errors.industry}>
              <input className="form-input text-field w-input" value={draft.industry} onChange={(e) => update("industry", e.target.value)} />
            </Field>
            <Field id="companySize" label="Розмір організації (де набуто досвід)" required error={errors.companySize}>
              <select className="form-input text-field w-select" value={draft.companySize} onChange={(e) => update("companySize", e.target.value as CompanySize | "")}>
                <option value="">Оберіть…</option>
                <option value="le20">до 20</option>
                <option value="21_50">21–50</option>
                <option value="gt50">понад 50</option>
              </select>
            </Field>
            <Field id="oshFunctions" label="Чи виконуєте або виконували функції з БЗР?" required error={errors.oshFunctions}>
              <div className="enrollment-radios">
                <label><input type="radio" checked={draft.oshFunctions === true} onChange={() => update("oshFunctions", true)} /> Так</label>
                <label><input type="radio" checked={draft.oshFunctions === false} onChange={() => update("oshFunctions", false)} /> Ні</label>
              </div>
            </Field>
            <Field id="totalYears" label="Загальний стаж (роки)">
              <input className="form-input text-field w-input" type="number" min={0} max={60} step={0.5} value={draft.totalYears} onChange={(e) => update("totalYears", e.target.value)} />
            </Field>
            <Field id="oshYears" label="Стаж у сфері БЗР (роки)" required error={errors.oshYears}>
              <input className="form-input text-field w-input" type="number" min={0} max={60} step={0.5} value={draft.oshYears} onChange={(e) => update("oshYears", e.target.value)} />
            </Field>
            <Field id="responsibilities" label="Основні обов’язки" required error={errors.responsibilities} hint={`${draft.responsibilities.length}/1500`}>
              <textarea className="form-input text-field w-input" rows={5} maxLength={1500} value={draft.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} />
            </Field>
            <Field id="experienceFiles" label="Підтвердження стажу (PDF/JPG/PNG, до 10 МБ)">
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => update("experienceFiles", Array.from(e.target.files || []))} />
            </Field>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">Освіта</legend>
            <Field id="educationLevel" label="Найвищий рівень освіти" required error={errors.educationLevel}>
              <select className="form-input text-field w-select" value={draft.educationLevel} onChange={(e) => update("educationLevel", e.target.value as EducationLevel | "")}>
                <option value="">Оберіть…</option>
                <option value="vocational">профтех</option>
                <option value="junior_bachelor">молодший бакалавр</option>
                <option value="bachelor">бакалавр</option>
                <option value="master">магістр</option>
                <option value="phd">PhD</option>
                <option value="doctor">доктор наук</option>
                <option value="other">інше</option>
              </select>
            </Field>
            <Field id="profileEducation" label="Чи є освіта профільною для БЗР?" required error={errors.profileEducation}>
              <div className="enrollment-radios">
                <label><input type="radio" checked={draft.profileEducation === true} onChange={() => update("profileEducation", true)} /> Так</label>
                <label><input type="radio" checked={draft.profileEducation === false} onChange={() => update("profileEducation", false)} /> Ні</label>
              </div>
            </Field>
            <Field
              id="institution"
              label="Навчальний заклад"
              required={Boolean(draft.educationLevel && draft.educationLevel !== "other")}
              error={errors.institution}
            >
              <input className="form-input text-field w-input" value={draft.institution} onChange={(e) => update("institution", e.target.value)} />
            </Field>
            <Field
              id="speciality"
              label="Спеціальність"
              required={Boolean(draft.educationLevel && draft.educationLevel !== "other")}
              error={errors.speciality}
            >
              <input className="form-input text-field w-input" value={draft.speciality} onChange={(e) => update("speciality", e.target.value)} />
            </Field>
            <Field
              id="graduationYear"
              label="Рік закінчення"
              required={Boolean(draft.educationLevel && draft.educationLevel !== "other")}
              error={errors.graduationYear}
            >
              <input className="form-input text-field w-input" type="number" min={1950} max={new Date().getFullYear()} value={draft.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} />
            </Field>
            <Field id="diplomaFiles" label="Диплом (файли)">
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => update("diplomaFiles", Array.from(e.target.files || []))} />
            </Field>
          </fieldset>
        ) : null}

        {step === 4 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">Курси та кваліфікації</legend>
            {draft.courses.map((course, index) => (
              <div key={index} className="enrollment-course">
                <div className="enrollment-course__head">
                  <strong>Курс {index + 1}</strong>
                  <button type="button" className="btn is--secondary w-button" onClick={() => update("courses", draft.courses.filter((_, i) => i !== index))}>
                    Видалити
                  </button>
                </div>
                <Field id={`courseType_${index}`} label="Тип програми">
                  <select
                    className="form-input text-field w-select"
                    value={course.courseType}
                    onChange={(e) => {
                      const courses = [...draft.courses];
                      courses[index] = { ...course, courseType: e.target.value as CourseType };
                      update("courses", courses);
                    }}
                  >
                    {Object.entries(COURSE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field id={`courseName_${index}`} label="Назва" required error={errors[`courseName_${index}`]}>
                  <input className="form-input text-field w-input" value={course.courseName} onChange={(e) => {
                    const courses = [...draft.courses];
                    courses[index] = { ...course, courseName: e.target.value };
                    update("courses", courses);
                  }} />
                </Field>
                <Field id={`provider_${index}`} label="Організація" required error={errors[`provider_${index}`]}>
                  <input className="form-input text-field w-input" value={course.provider} onChange={(e) => {
                    const courses = [...draft.courses];
                    courses[index] = { ...course, provider: e.target.value };
                    update("courses", courses);
                  }} />
                </Field>
                <Field id={`courseYear_${index}`} label="Рік">
                  <input className="form-input text-field w-input" type="number" value={course.courseYear} onChange={(e) => {
                    const courses = [...draft.courses];
                    courses[index] = { ...course, courseYear: Number(e.target.value) };
                    update("courses", courses);
                  }} />
                </Field>
                <Field id={`hours_${index}`} label="Години">
                  <input className="form-input text-field w-input" type="number" value={course.hours ?? ""} onChange={(e) => {
                    const courses = [...draft.courses];
                    courses[index] = { ...course, hours: e.target.value === "" ? null : Number(e.target.value) };
                    update("courses", courses);
                  }} />
                </Field>
                <Field id={`certificateNo_${index}`} label="Номер сертифіката">
                  <input className="form-input text-field w-input" value={course.certificateNo || ""} onChange={(e) => {
                    const courses = [...draft.courses];
                    courses[index] = { ...course, certificateNo: e.target.value };
                    update("courses", courses);
                  }} />
                </Field>
                <Field id={`certificate_${index}`} label="Сертифікат" required error={errors[`certificate_${index}`]}>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
                    const courses = [...draft.courses];
                    courses[index] = { ...course, certFiles: Array.from(e.target.files || []) };
                    update("courses", courses);
                  }} />
                </Field>
              </div>
            ))}
            <button type="button" className="btn is--secondary w-button" onClick={() => update("courses", [...draft.courses, emptyCourse()])}>
              Додати ще один курс
            </button>
          </fieldset>
        ) : null}

        {step === 5 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">Безперервний професійний розвиток</legend>
            <Field id="cpdStatus" label="Участь у БПР ESOSH" required error={errors.cpdStatus}>
              <select className="form-input text-field w-select" value={draft.cpdStatus} onChange={(e) => update("cpdStatus", e.target.value as CpdStatus | "")}>
                <option value="">Оберіть…</option>
                <option value="participating">беру участь</option>
                <option value="ready">готовий(-а) долучитися</option>
                <option value="want_info">хочу інформацію</option>
                <option value="not_ready">поки не готовий(-а)</option>
              </select>
            </Field>
            <Field id="cpdActivities" label="Активності за останні 2 роки">
              <div className="enrollment-checks">
                {CPD_ACTIVITY_OPTIONS.map((item) => (
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
                    {item}
                  </label>
                ))}
              </div>
            </Field>
            <Field id="cpdDescription" label="Опис / плани" hint={`${draft.cpdDescription.length}/1500`}>
              <textarea className="form-input text-field w-input" rows={4} maxLength={1500} value={draft.cpdDescription} onChange={(e) => update("cpdDescription", e.target.value)} />
            </Field>
          </fieldset>
        ) : null}

        {step === 6 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">Кодекс поведінки</legend>
            <p className="regular-l is--margin-bottom-16">
              Для проходження тесту рекомендуємо ознайомитися з{" "}
              <Link href="/join/codex" target="_blank" className="is--link">
                Кодексом поведінки
              </Link>
              .
            </p>
            <Field id="codeRead" label="" error={errors.codeRead}>
              <label className="enrollment-consent-card">
                <input type="checkbox" checked={draft.codeRead} onChange={(e) => update("codeRead", e.target.checked)} />
                <span>
                  Ознайомився(-лася) та погоджуюся з Кодексом поведінки ESOSH
                  <span className="enrollment-req"> *</span>
                </span>
              </label>
            </Field>
            {CODEX_QUESTIONS_PUBLIC.map((q) => (
              <Field key={q.id} id={`test_${q.id}`} label={q.promptUk} required error={errors[`test_${q.id}`]}>
                <div className="enrollment-radios enrollment-radios--stack">
                  {q.options.map((opt) => (
                    <label key={opt.id}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={draft.testAnswers[q.id] === opt.id}
                        onChange={() => update("testAnswers", { ...draft.testAnswers, [q.id]: opt.id })}
                      />{" "}
                      {opt.labelUk}
                    </label>
                  ))}
                </div>
              </Field>
            ))}
            <p className="regular-s">Для рівня «Фахівець» потрібен результат тесту 100%.</p>
          </fieldset>
        ) : null}

        {step === 7 ? (
          <fieldset className="enrollment-fieldset">
            <legend className="h3">Підтвердження і подання</legend>
            {liveClassify ? (
              <div className="enrollment-summary">
                <p className="bold-l is--margin-bottom-8">Зведення</p>
                <p className="regular-l">{draft.lastName} {draft.firstName}, {draft.email}</p>
                <p className="regular-l">{draft.jobTitle}{draft.organization ? `, ${draft.organization}` : ""}</p>
                <p className="regular-l is--margin-top-12">
                  Попередній рівень: <strong>{liveClassify.labelUk}</strong>
                </p>
                <p className="regular-s is--margin-top-8">
                  Остаточний рівень визначить адміністратор при розгляді.
                </p>
              </div>
            ) : null}
            <div className="enrollment-consents">
              <p className="enrollment-question">Підтвердження</p>
              <label id="enrollment-field-truthConfirm" className="enrollment-consent-card">
                <input type="checkbox" checked={draft.truthConfirm} onChange={(e) => update("truthConfirm", e.target.checked)} />
                <span>Підтверджую достовірність наданої інформації<span className="enrollment-req"> *</span></span>
              </label>
              <label id="enrollment-field-codeAccept" className="enrollment-consent-card">
                <input type="checkbox" checked={draft.codeAccept} onChange={(e) => update("codeAccept", e.target.checked)} />
                <span>Погоджуюся з Кодексом поведінки ESOSH<span className="enrollment-req"> *</span></span>
              </label>
              <label id="enrollment-field-privacyConsent" className="enrollment-consent-card">
                <input type="checkbox" checked={draft.privacyConsent} onChange={(e) => update("privacyConsent", e.target.checked)} />
                <span>Надаю згоду на обробку персональних даних для розгляду заявки та ведення реєстру<span className="enrollment-req"> *</span></span>
              </label>
              <label id="enrollment-field-serviceMessages" className="enrollment-consent-card">
                <input type="checkbox" checked={draft.serviceMessages} onChange={(e) => update("serviceMessages", e.target.checked)} />
                <span>Погоджуюся отримувати повідомлення щодо заявки та участі в ESOSH<span className="enrollment-req"> *</span></span>
              </label>
              <label className="enrollment-consent-card enrollment-consent-card--optional">
                <input type="checkbox" checked={draft.marketingConsent} onChange={(e) => update("marketingConsent", e.target.checked)} />
                <span>Хочу отримувати новини, запрошення та інформацію про навчання <em>(необов’язково)</em></span>
              </label>
              {errors.truthConfirm || errors.codeAccept || errors.privacyConsent || errors.serviceMessages ? (
                <p className="site-form-error" role="alert">Потрібні всі обов’язкові згоди</p>
              ) : null}
            </div>
            {submitError ? <p className="site-form-error" role="alert">{submitError}</p> : null}
          </fieldset>
        ) : null}

        <div className="enrollment-actions">
          {step > 1 ? (
            <button type="button" className="btn is--secondary w-button" onClick={goBack}>
              Назад
            </button>
          ) : (
            <span />
          )}
          {step < STEPS ? (
            <button type="button" className="btn is--primary w-button" onClick={goNext}>
              Далі
            </button>
          ) : (
            <button type="submit" className="btn is--primary w-button" disabled={submitting}>
              {submitting ? "Надсилаємо…" : "Подати заявку"}
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
  required,
  error,
  hint,
  children,
}: {
  id?: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="enrollment-field" id={id ? `enrollment-field-${id}` : undefined}>
      {label ? (
        <label className="enrollment-question">
          {label}
          {required ? <span className="enrollment-req" aria-hidden="true"> *</span> : null}
        </label>
      ) : null}
      {children}
      {hint ? <p className="enrollment-hint">{hint}</p> : null}
      {error ? <p className="site-form-error" role="alert">{error}</p> : null}
    </div>
  );
}
