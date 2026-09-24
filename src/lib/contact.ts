import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(256),
  email: z.string().trim().email().max(256),
  message: z.string().trim().min(1).max(256),
  locale: z.enum(["uk", "en"]).optional(),
  company: z.string().optional(),
  /** Explicit privacy consent required for real submissions. */
  privacyConsent: z.literal(true),
});

export type ContactPayload = z.infer<typeof contactSchema>;
