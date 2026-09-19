import { z } from "zod";
import {
  COMPANY_SIZES,
  COURSE_TYPES,
  CPD_STATUSES,
  EDUCATION_LEVELS,
} from "./classify";

const phoneRegex = /^\+?[0-9()\-\s]{8,32}$/;

export const enrollmentCourseSchema = z.object({
  courseType: z.enum(COURSE_TYPES),
  courseName: z.string().trim().min(1).max(200),
  provider: z.string().trim().min(1).max(200),
  courseYear: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  hours: z.number().min(0).max(10000).nullable().optional(),
  certificateNo: z.string().trim().max(120).nullable().optional(),
});

export const enrollmentPayloadSchema = z.object({
  lastName: z.string().trim().min(2).max(80),
  firstName: z.string().trim().min(2).max(80),
  middleName: z.string().trim().max(80).optional().or(z.literal("")),
  birthDate: z.string().trim().max(32).optional().or(z.literal("")),
  country: z.string().trim().min(1).max(120),
  city: z.string().trim().min(1).max(120),
  phone: z.string().trim().regex(phoneRegex),
  email: z.string().trim().email().max(256),
  secondaryEmail: z.string().trim().email().max(256).optional().or(z.literal("")),
  profileUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  jobTitle: z.string().trim().min(1).max(200),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  industry: z.string().trim().min(1).max(200),
  companySize: z.enum(COMPANY_SIZES),
  oshFunctions: z.boolean(),
  totalYears: z.number().min(0).max(60).nullable().optional(),
  oshYears: z.number().min(0).max(60),
  responsibilities: z.string().trim().min(1).max(1500),
  educationLevel: z.enum(EDUCATION_LEVELS),
  profileEducation: z.boolean(),
  institution: z.string().trim().max(200).optional().or(z.literal("")),
  speciality: z.string().trim().max(200).optional().or(z.literal("")),
  graduationYear: z.number().int().min(1950).max(new Date().getFullYear()).nullable().optional(),
  courses: z.array(enrollmentCourseSchema).default([]),
  cpdStatus: z.enum(CPD_STATUSES),
  cpdActivities: z.array(z.string().trim().max(64)).default([]),
  cpdDescription: z.string().trim().max(1500).optional().or(z.literal("")),
  codeRead: z.literal(true),
  testAnswers: z.record(z.string(), z.string()),
  truthConfirm: z.literal(true),
  codeAccept: z.literal(true),
  privacyConsent: z.literal(true),
  serviceMessages: z.literal(true),
  marketingConsent: z.boolean().default(false),
  locale: z.enum(["uk", "en"]).default("uk"),
  idempotencyKey: z.string().trim().min(8).max(64),
  company: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.educationLevel !== "other") {
    if (!data.institution?.trim()) {
      ctx.addIssue({ code: "custom", path: ["institution"], message: "required" });
    }
    if (!data.speciality?.trim()) {
      ctx.addIssue({ code: "custom", path: ["speciality"], message: "required" });
    }
    if (!data.graduationYear) {
      ctx.addIssue({ code: "custom", path: ["graduationYear"], message: "required" });
    }
  }
  if (data.secondaryEmail && data.secondaryEmail.toLowerCase() === data.email.toLowerCase()) {
    ctx.addIssue({ code: "custom", path: ["secondaryEmail"], message: "duplicate" });
  }
  if (data.birthDate) {
    const d = new Date(data.birthDate);
    if (Number.isNaN(d.getTime()) || d > new Date()) {
      ctx.addIssue({ code: "custom", path: ["birthDate"], message: "invalid" });
    }
  }
});

export type EnrollmentPayload = z.infer<typeof enrollmentPayloadSchema>;

export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const DOC_MAX_BYTES = 10 * 1024 * 1024;
export const ALLOWED_DOC_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/jpg"]);
export const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/jpg"]);
