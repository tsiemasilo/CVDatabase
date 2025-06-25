import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cvRecords = pgTable("cv_records", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  position: text("position").notNull(),
  department: text("department"),
  experience: integer("experience"),
  qualifications: text("qualifications"),
  languages: text("languages"),
  status: text("status").notNull().default("pending"),
  cvFile: text("cv_file"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertCVRecordSchema = createInsertSchema(cvRecords).omit({
  id: true,
  submittedAt: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().min(2, "Position must be at least 2 characters"),
  department: z.string().optional(),
  experience: z.number().min(0).optional(),
  qualifications: z.string().optional(),
  languages: z.string().optional(),
  status: z.enum(["active", "pending", "archived"]).default("pending"),
  cvFile: z.string().optional(),
});

export type InsertCVRecord = z.infer<typeof insertCVRecordSchema>;
export type CVRecord = typeof cvRecords.$inferSelect;
