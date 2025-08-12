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

// Version History / Audit Log table
export const versionHistory = pgTable("version_history", {
  id: serial("id").primaryKey(),
  tableName: varchar("table_name", { length: 100 }).notNull(), // 'cv_records', 'user_profiles', 'qualifications', 'positions_roles', 'tenders'
  recordId: integer("record_id").notNull(), // ID of the affected record
  action: varchar("action", { length: 20 }).notNull(), // 'CREATE', 'UPDATE', 'DELETE'
  oldValues: text("old_values"), // JSON string of old values (for UPDATE/DELETE)
  newValues: text("new_values"), // JSON string of new values (for CREATE/UPDATE)
  changedFields: text("changed_fields"), // JSON array of field names that changed
  userId: integer("user_id").notNull(), // Who made the change
  username: varchar("username", { length: 50 }).notNull(), // Username for easy reference
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  description: text("description"), // Human-readable description of the change
});

export const insertVersionHistorySchema = createInsertSchema(versionHistory).omit({
  id: true,
  timestamp: true,
});

export type InsertVersionHistory = z.infer<typeof insertVersionHistorySchema>;
export type VersionHistoryRecord = typeof versionHistory.$inferSelect;

// Qualifications table for system configuration
export const qualifications = pgTable("qualifications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // 'degree', 'diploma', 'certificate', etc.
  category: varchar("category", { length: 100 }), // 'undergraduate', 'postgraduate', 'professional'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertQualificationSchema = createInsertSchema(qualifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertQualification = z.infer<typeof insertQualificationSchema>;
export type Qualification = typeof qualifications.$inferSelect;

// Positions/Roles table for system configuration
export const positionsRoles = pgTable("positions_roles", {
  id: serial("id").primaryKey(),
  department: varchar("department", { length: 100 }).notNull(),
  discipline: varchar("discipline", { length: 100 }),
  domain: varchar("domain", { length: 100 }),
  category: varchar("category", { length: 100 }),
  roleName: varchar("role_name", { length: 255 }).notNull(),
  level: varchar("level", { length: 50 }), // 'junior', 'senior', 'lead', etc.
  sapKLevel: varchar("sap_k_level", { length: 10 }), // SAP specific levels
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPositionRoleSchema = createInsertSchema(positionsRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPositionRole = z.infer<typeof insertPositionRoleSchema>;
export type PositionRole = typeof positionsRoles.$inferSelect;

// Tenders table for tender management
export const tenders = pgTable("tenders", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  client: varchar("client", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // 'draft', 'active', 'submitted', 'awarded', 'cancelled'
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  submissionDeadline: timestamp("submission_deadline"),
  estimatedValue: text("estimated_value"),
  requirements: text("requirements"), // JSON string
  attachments: text("attachments"), // JSON string
  assignedTo: integer("assigned_to"), // User ID
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTenderSchema = createInsertSchema(tenders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTender = z.infer<typeof insertTenderSchema>;
export type Tender = typeof tenders.$inferSelect;
