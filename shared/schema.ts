import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cvRecords = pgTable("cv_records", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  surname: text("surname"),
  idPassport: text("id_passport"),
  gender: text("gender"),
  email: text("email").notNull(),
  phone: text("phone"),
  position: text("position").notNull(),
  roleTitle: text("role_title"),
  department: text("department"),
  experience: integer("experience"),
  experienceInSimilarRole: integer("experience_similar_role"),
  experienceWithITSMTools: integer("experience_itsm_tools"),
  sapKLevel: text("sap_k_level"),
  qualifications: text("qualifications"),
  qualificationType: text("qualification_type"),
  qualificationName: text("qualification_name"),
  languages: text("languages"),
  workExperiences: text("work_experiences"), // JSON string
  status: text("status").notNull().default("pending"),
  cvFile: text("cv_file"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertCVRecordSchema = createInsertSchema(cvRecords).omit({
  id: true,
  submittedAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().optional(),
  idPassport: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().min(2, "Position must be at least 2 characters"),
  roleTitle: z.string().optional(),
  department: z.string().optional(),
  experience: z.number().min(0).optional(),
  experienceInSimilarRole: z.number().min(0).optional(),
  experienceWithITSMTools: z.number().min(0).optional(),
  sapKLevel: z.string().optional(),
  qualifications: z.string().optional(),
  qualificationType: z.string().optional(),
  qualificationName: z.string().optional(),
  languages: z.string().optional(),
  workExperiences: z.string().optional(),
  status: z.enum(["active", "pending", "archived"]).default("pending"),
  cvFile: z.string().optional(),
});

export type InsertCVRecord = z.infer<typeof insertCVRecordSchema>;
export type CVRecord = typeof cvRecords.$inferSelect;
