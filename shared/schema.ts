import { pgTable, text, serial, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
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
  instituteName: text("institute_name"),
  yearCompleted: text("year_completed"),
  languages: text("languages"),
  workExperiences: text("work_experiences"), // JSON string
  certificateTypes: text("certificate_types"), // JSON string for hierarchical certificate data
  skills: text("skills"), // JSON string for skills data
  status: text("status").notNull().default("pending"),
  cvFile: text("cv_file"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertCVRecordSchema = createInsertSchema(cvRecords).omit({
  id: true,
  submittedAt: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  surname: z.string().optional(),
  idPassport: z.string().optional(),
  gender: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  roleTitle: z.string().optional(),
  department: z.string().optional(),
  experience: z.number().min(0).optional(),
  experienceInSimilarRole: z.number().min(0).optional(),
  experienceWithITSMTools: z.number().min(0).optional(),
  sapKLevel: z.string().optional(),
  qualifications: z.string().optional(),
  qualificationType: z.string().optional(),
  qualificationName: z.string().optional(),
  instituteName: z.string().optional(),
  yearCompleted: z.string().optional(),
  languages: z.string().optional(),
  workExperiences: z.string().optional(),
  certificateTypes: z.string().optional(),
  skills: z.string().optional(),
  status: z.enum(["active", "pending", "archived"]).default("pending"),
  cvFile: z.string().optional(),
});

export type InsertCVRecord = z.infer<typeof insertCVRecordSchema>;
export type CVRecord = typeof cvRecords.$inferSelect;

// User profiles table for authentication and role management
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(), // hashed
  role: varchar("role", { length: 20 }).notNull().default("user"), // 'admin', 'super_user', 'manager', 'user'
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  modifiedBy: varchar("modified_by", { length: 100 }), // Username of who made the last change
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
