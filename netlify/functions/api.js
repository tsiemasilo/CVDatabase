var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  cvRecords: () => cvRecords,
  insertCVRecordSchema: () => insertCVRecordSchema,
  insertUserProfileSchema: () => insertUserProfileSchema,
  userProfiles: () => userProfiles
});
import { pgTable, text, serial, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var cvRecords = pgTable("cv_records", {
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
  workExperiences: text("work_experiences"),
  // JSON string
  certificateTypes: text("certificate_types"),
  // JSON string for hierarchical certificate data
  status: text("status").notNull().default("pending"),
  cvFile: text("cv_file"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull()
});
var insertCVRecordSchema = createInsertSchema(cvRecords).omit({
  id: true,
  submittedAt: true
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
  instituteName: z.string().optional(),
  yearCompleted: z.string().optional(),
  languages: z.string().optional(),
  workExperiences: z.string().optional(),
  certificateTypes: z.string().optional(),
  status: z.enum(["active", "pending", "archived"]).default("pending"),
  cvFile: z.string().optional()
});
var userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  // hashed
  role: varchar("role", { length: 20 }).notNull().default("user"),
  // 'admin', 'manager', 'user'
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, like, or, and } from "drizzle-orm";
var MemStorage = class {
  users;
  cvRecords;
  userProfiles;
  currentUserId;
  currentCVId;
  currentUserProfileId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.cvRecords = /* @__PURE__ */ new Map();
    this.userProfiles = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentCVId = 1;
    this.currentUserProfileId = 1;
    this.initializeSampleData();
  }
  initializeSampleData() {
    const sampleCVs = [
      {
        name: "John",
        surname: "Doe",
        idPassport: "9001015009088",
        gender: "Male",
        email: "john.doe@example.com",
        phone: "+27 11 123 4567",
        position: "Developer",
        roleTitle: "Software Developer",
        department: "ICT",
        experience: 5,
        experienceInSimilarRole: 3,
        experienceWithITSMTools: 2,
        sapKLevel: "",
        qualifications: "Bachelor of Computer Science",
        qualificationType: "Degree",
        qualificationName: "Bachelor of Computer Science",
        instituteName: "University of Cape Town",
        yearCompleted: "2019",
        languages: "English, Afrikaans",
        workExperiences: JSON.stringify([
          { companyName: "Tech Corp", position: "Junior Developer", startDate: "01/2020", endDate: "12/2022", isCurrentRole: false },
          { companyName: "InnovateTech", position: "Software Developer", startDate: "01/2023", endDate: "", isCurrentRole: true }
        ]),
        certificateTypes: JSON.stringify({}),
        status: "active",
        cvFile: "john_doe_cv.pdf",
        submittedAt: /* @__PURE__ */ new Date("2024-01-15")
      },
      {
        name: "Sarah",
        surname: "Johnson",
        idPassport: "8505120234567",
        gender: "Female",
        email: "sarah.johnson@example.com",
        phone: "+27 21 987 6543",
        position: "Project Manager",
        roleTitle: "Senior Project Manager",
        department: "PROJECT MANAGEMENT",
        experience: 8,
        experienceInSimilarRole: 6,
        experienceWithITSMTools: 4,
        sapKLevel: "",
        qualifications: "MBA, PMP Certification",
        qualificationType: "Postgraduate Degree",
        qualificationName: "Master of Business Administration",
        instituteName: "GIBS Business School",
        yearCompleted: "2016",
        languages: "English, Zulu",
        workExperiences: JSON.stringify([
          { companyName: "ConsultCorp", position: "Project Coordinator", startDate: "03/2018", endDate: "06/2021", isCurrentRole: false },
          { companyName: "MegaProjects", position: "Senior Project Manager", startDate: "07/2021", endDate: "", isCurrentRole: true }
        ]),
        certificateTypes: JSON.stringify({}),
        status: "pending",
        cvFile: "sarah_johnson_cv.pdf",
        submittedAt: /* @__PURE__ */ new Date("2024-01-20")
      },
      {
        name: "Michael",
        surname: "Chen",
        idPassport: "9203158765432",
        gender: "Male",
        email: "michael.chen@example.com",
        phone: "+27 31 555 7890",
        position: "SAP Technical Consultant",
        roleTitle: "SAP ABAP Developer",
        department: "SAP",
        experience: 6,
        experienceInSimilarRole: 4,
        experienceWithITSMTools: 5,
        sapKLevel: "K3",
        qualifications: "SAP Certified Application Associate",
        qualificationType: "Professional Certification",
        qualificationName: "SAP Certified Application Associate - ABAP",
        instituteName: "SAP Training Center",
        yearCompleted: "2020",
        languages: "English, Mandarin",
        workExperiences: JSON.stringify([
          { companyName: "SAP Solutions", position: "Junior SAP Developer", startDate: "06/2019", endDate: "05/2022", isCurrentRole: false },
          { companyName: "Enterprise SAP", position: "SAP ABAP Developer", startDate: "06/2022", endDate: "", isCurrentRole: true }
        ]),
        certificateTypes: JSON.stringify({}),
        status: "active",
        cvFile: "michael_chen_cv.pdf",
        submittedAt: /* @__PURE__ */ new Date("2024-01-25")
      }
    ];
    sampleCVs.forEach((cv) => {
      const id = this.currentCVId++;
      this.cvRecords.set(id, { ...cv, id });
    });
    const sampleUserProfiles = [
      {
        username: "admin",
        email: "admin@alteram.co.za",
        password: "admin1",
        // In production, this should be hashed
        role: "admin",
        firstName: "System",
        lastName: "Administrator",
        department: "ICT",
        position: "System Admin",
        phoneNumber: "011 234 5678",
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date("2025-01-09T08:30:00"),
        createdAt: /* @__PURE__ */ new Date("2024-12-01T00:00:00"),
        updatedAt: /* @__PURE__ */ new Date("2024-12-01T00:00:00")
      },
      {
        username: "mng",
        email: "manager@alteram.co.za",
        password: "mng1",
        role: "manager",
        firstName: "Sarah",
        lastName: "Johnson",
        department: "HR",
        position: "HR Manager",
        phoneNumber: "011 234 5679",
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date("2025-01-09T09:15:00"),
        createdAt: /* @__PURE__ */ new Date("2024-12-05T00:00:00"),
        updatedAt: /* @__PURE__ */ new Date("2024-12-05T00:00:00")
      },
      {
        username: "user",
        email: "user@example.com",
        password: "user1",
        role: "user",
        firstName: "John",
        lastName: "Doe",
        department: "SAP",
        position: "SAP Developer",
        phoneNumber: "083 123 4567",
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date("2025-01-09T10:00:00"),
        createdAt: /* @__PURE__ */ new Date("2024-12-10T00:00:00"),
        updatedAt: /* @__PURE__ */ new Date("2024-12-10T00:00:00")
      }
    ];
    sampleUserProfiles.forEach((profile) => {
      const id = this.currentUserProfileId++;
      this.userProfiles.set(id, { ...profile, id });
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getAllCVRecords() {
    return Array.from(this.cvRecords.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }
  async getCVRecord(id) {
    return this.cvRecords.get(id);
  }
  async createCVRecord(insertCVRecord) {
    const id = this.currentCVId++;
    const cvRecord = {
      ...insertCVRecord,
      id,
      surname: insertCVRecord.surname || null,
      idPassport: insertCVRecord.idPassport || null,
      gender: insertCVRecord.gender || null,
      phone: insertCVRecord.phone || null,
      roleTitle: insertCVRecord.roleTitle || null,
      department: insertCVRecord.department || null,
      experience: insertCVRecord.experience || null,
      experienceInSimilarRole: insertCVRecord.experienceInSimilarRole || null,
      experienceWithITSMTools: insertCVRecord.experienceWithITSMTools || null,
      sapKLevel: insertCVRecord.sapKLevel || null,
      qualifications: insertCVRecord.qualifications || null,
      qualificationType: insertCVRecord.qualificationType || null,
      qualificationName: insertCVRecord.qualificationName || null,
      instituteName: insertCVRecord.instituteName || null,
      yearCompleted: insertCVRecord.yearCompleted || null,
      languages: insertCVRecord.languages || null,
      workExperiences: insertCVRecord.workExperiences || null,
      certificateTypes: insertCVRecord.certificateTypes || null,
      cvFile: insertCVRecord.cvFile || null,
      submittedAt: /* @__PURE__ */ new Date()
    };
    this.cvRecords.set(id, cvRecord);
    return cvRecord;
  }
  async updateCVRecord(id, updateData) {
    const existing = this.cvRecords.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updateData };
    this.cvRecords.set(id, updated);
    return updated;
  }
  async deleteCVRecord(id) {
    return this.cvRecords.delete(id);
  }
  async searchCVRecords(searchTerm, statusFilter) {
    const allRecords = await this.getAllCVRecords();
    return allRecords.filter((record) => {
      const matchesSearch = !searchTerm || record.name.toLowerCase().includes(searchTerm.toLowerCase()) || record.email.toLowerCase().includes(searchTerm.toLowerCase()) || record.position.toLowerCase().includes(searchTerm.toLowerCase()) || record.department && record.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }
  // User Profile methods
  async getAllUserProfiles() {
    return Array.from(this.userProfiles.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  async getUserProfile(id) {
    return this.userProfiles.get(id);
  }
  async createUserProfile(insertUserProfile) {
    const id = this.currentUserProfileId++;
    const userProfile = {
      id,
      username: insertUserProfile.username,
      email: insertUserProfile.email,
      password: insertUserProfile.password,
      role: insertUserProfile.role ?? "user",
      firstName: insertUserProfile.firstName || null,
      lastName: insertUserProfile.lastName || null,
      department: insertUserProfile.department || null,
      position: insertUserProfile.position || null,
      phoneNumber: insertUserProfile.phoneNumber || null,
      isActive: insertUserProfile.isActive ?? true,
      lastLogin: insertUserProfile.lastLogin || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }
  async updateUserProfile(id, updateData) {
    const existing = this.userProfiles.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.userProfiles.set(id, updated);
    return updated;
  }
  async deleteUserProfile(id) {
    return this.userProfiles.delete(id);
  }
  async searchUserProfiles(searchTerm, roleFilter) {
    const allProfiles = await this.getAllUserProfiles();
    return allProfiles.filter((profile) => {
      const matchesSearch = !searchTerm || profile.firstName && profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || profile.lastName && profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || profile.username.toLowerCase().includes(searchTerm.toLowerCase()) || profile.email.toLowerCase().includes(searchTerm.toLowerCase()) || profile.department && profile.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || profile.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }
  // Authentication methods
  async authenticateUser(username, password) {
    const allProfiles = await this.getAllUserProfiles();
    const user = allProfiles.find(
      (profile) => profile.username === username && profile.password === password && profile.isActive
    );
    if (user) {
      await this.updateUserProfile(user.id, { lastLogin: /* @__PURE__ */ new Date() });
      return user;
    }
    return null;
  }
};
var DatabaseStorage = class {
  // User authentication methods
  async getUser(id) {
    const [user] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(userProfiles).where(eq(userProfiles.username, username));
    return user;
  }
  async createUser(user) {
    const [newUser] = await db.insert(userProfiles).values(user).returning();
    return newUser;
  }
  // CV Records methods
  async getAllCVRecords() {
    return await db.select().from(cvRecords).orderBy(cvRecords.submittedAt);
  }
  async getCVRecord(id) {
    const [record] = await db.select().from(cvRecords).where(eq(cvRecords.id, id));
    return record;
  }
  async createCVRecord(cvRecord) {
    const [newRecord] = await db.insert(cvRecords).values(cvRecord).returning();
    return newRecord;
  }
  async updateCVRecord(id, cvRecord) {
    const [updatedRecord] = await db.update(cvRecords).set(cvRecord).where(eq(cvRecords.id, id)).returning();
    return updatedRecord;
  }
  async deleteCVRecord(id) {
    const result = await db.delete(cvRecords).where(eq(cvRecords.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async searchCVRecords(searchTerm, statusFilter) {
    let query = db.select().from(cvRecords);
    const conditions = [];
    if (searchTerm) {
      conditions.push(
        or(
          like(cvRecords.name, `%${searchTerm}%`),
          like(cvRecords.surname, `%${searchTerm}%`),
          like(cvRecords.email, `%${searchTerm}%`),
          like(cvRecords.position, `%${searchTerm}%`),
          like(cvRecords.department, `%${searchTerm}%`)
        )
      );
    }
    if (statusFilter && statusFilter !== "all") {
      conditions.push(eq(cvRecords.status, statusFilter));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(cvRecords.submittedAt);
  }
  // User Profile methods
  async getAllUserProfiles() {
    return await db.select().from(userProfiles).orderBy(userProfiles.createdAt);
  }
  async getUserProfile(id) {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return profile;
  }
  async createUserProfile(userProfile) {
    const [newProfile] = await db.insert(userProfiles).values(userProfile).returning();
    return newProfile;
  }
  async updateUserProfile(id, userProfile) {
    const [updatedProfile] = await db.update(userProfiles).set(userProfile).where(eq(userProfiles.id, id)).returning();
    return updatedProfile;
  }
  async deleteUserProfile(id) {
    const result = await db.delete(userProfiles).where(eq(userProfiles.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  async searchUserProfiles(searchTerm, roleFilter) {
    let query = db.select().from(userProfiles);
    const conditions = [];
    if (searchTerm) {
      conditions.push(
        or(
          like(userProfiles.username, `%${searchTerm}%`),
          like(userProfiles.email, `%${searchTerm}%`),
          like(userProfiles.firstName, `%${searchTerm}%`),
          like(userProfiles.lastName, `%${searchTerm}%`),
          like(userProfiles.department, `%${searchTerm}%`)
        )
      );
    }
    if (roleFilter && roleFilter !== "all") {
      conditions.push(eq(userProfiles.role, roleFilter));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    return await query.orderBy(userProfiles.createdAt);
  }
  // Authentication methods
  async authenticateUser(username, password) {
    try {
      const [user] = await db.select().from(userProfiles).where(eq(userProfiles.username, username));
      if (user && user.password === password) {
        await db.update(userProfiles).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(userProfiles.id, user.id));
        return user;
      }
      return null;
    } catch (error) {
      console.log("Database authentication failed, using fallback");
      throw new Error("Database connection failed");
    }
  }
};
var StorageFactory = class {
  static instance;
  static async getStorage() {
    if (!this.instance) {
      try {
        const testDb = new DatabaseStorage();
        await testDb.getAllUserProfiles();
        console.log("\u2705 Database connection successful, using DatabaseStorage");
        this.instance = testDb;
      } catch (error) {
        console.log("\u274C Database connection failed, using MemStorage fallback", error);
        this.instance = new MemStorage();
      }
    }
    return this.instance;
  }
  static reset() {
    this.instance = void 0;
  }
};
var getStorage = () => StorageFactory.getStorage();
var storage = new MemStorage();

// server/uploads.ts
import multer from "multer";
import path from "path";
import fs from "fs";
var uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
var fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
  }
};
var upload = multer({
  storage: storage2,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  }
});
var deleteFile = (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};
var getFileInfo = (filename) => {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        uploadDate: stats.birthtime,
        exists: true
      };
    }
    return { filename, exists: false };
  } catch (error) {
    console.error("Error getting file info:", error);
    return { filename, exists: false };
  }
};

// server/routes.ts
import { z as z2 } from "zod";
import path2 from "path";
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const storage3 = await getStorage();
      const user = await storage3.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      if (req.session) {
        req.session.user = user;
      }
      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      if (req.session) {
        req.session.user = null;
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/auth/user", async (req, res) => {
    try {
      if (req.session?.user) {
        res.json(req.session.user);
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/cv-records", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const { search, status } = req.query;
      let records;
      if (search || status) {
        records = await storage3.searchCVRecords(
          search || "",
          status
        );
      } else {
        records = await storage3.getAllCVRecords();
      }
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV records" });
    }
  });
  app2.get("/api/cv-records/:id", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }
      const record = await storage3.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV record" });
    }
  });
  app2.post("/api/cv-records", upload.single("cvFile"), async (req, res) => {
    try {
      const storage3 = await getStorage();
      const formData = { ...req.body };
      if (req.file) {
        formData.cvFile = req.file.filename;
      }
      if (formData.experience) {
        formData.experience = parseInt(formData.experience);
      }
      const validatedData = insertCVRecordSchema.parse(formData);
      const newRecord = await storage3.createCVRecord(validatedData);
      res.status(201).json(newRecord);
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.filename);
      }
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create CV record" });
    }
  });
  app2.put("/api/cv-records/:id", upload.single("cvFile"), async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }
      const formData = { ...req.body };
      const existingRecord = await storage3.getCVRecord(id);
      if (!existingRecord) {
        if (req.file) deleteFile(req.file.filename);
        return res.status(404).json({ message: "CV record not found" });
      }
      if (req.file) {
        formData.cvFile = req.file.filename;
        if (existingRecord.cvFile) {
          deleteFile(existingRecord.cvFile);
        }
      }
      if (formData.experience) {
        formData.experience = parseInt(formData.experience);
      }
      const validatedData = insertCVRecordSchema.partial().parse(formData);
      const updatedRecord = await storage3.updateCVRecord(id, validatedData);
      res.json(updatedRecord);
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.filename);
      }
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update CV record" });
    }
  });
  app2.delete("/api/cv-records/:id", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }
      const record = await storage3.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }
      if (record.cvFile) {
        deleteFile(record.cvFile);
      }
      const deleted = await storage3.deleteCVRecord(id);
      if (!deleted) {
        return res.status(404).json({ message: "CV record not found" });
      }
      res.json({ message: "CV record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete CV record" });
    }
  });
  app2.get("/api/cv-records/export/csv", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const { search, status } = req.query;
      let records;
      if (search || status) {
        records = await storage3.searchCVRecords(
          search || "",
          status
        );
      } else {
        records = await storage3.getAllCVRecords();
      }
      const headers = [
        "ID",
        "Name",
        "Surname",
        "Email",
        "Phone",
        "Position",
        "Department",
        "Experience",
        "Status",
        "Submitted At"
      ];
      const csvRows = [
        headers.join(","),
        ...records.map((record) => [
          record.id,
          `"${record.name}"`,
          `"${record.surname || ""}"`,
          `"${record.email}"`,
          `"${record.phone || ""}"`,
          `"${record.position}"`,
          `"${record.department || ""}"`,
          record.experience || 0,
          `"${record.status}"`,
          `"${record.submittedAt}"`
        ].join(","))
      ].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="cv-records.csv"');
      res.send(csvRows);
    } catch (error) {
      res.status(500).json({ message: "Failed to export CV records" });
    }
  });
  app2.get("/api/cv-records/:id/file", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }
      const record = await storage3.getCVRecord(id);
      if (!record || !record.cvFile) {
        return res.status(404).json({ message: "CV file not found" });
      }
      const filePath = path2.join(process.cwd(), "uploads", record.cvFile);
      const fileInfo = getFileInfo(record.cvFile);
      if (!fileInfo) {
        return res.status(404).json({ message: "File not found on disk" });
      }
      res.setHeader("Content-Disposition", `attachment; filename="${record.cvFile}"`);
      res.setHeader("Content-Type", fileInfo.mimetype);
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json({ message: "Failed to download CV file" });
    }
  });
  app2.get("/api/cv-records/:id/creative-view", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }
      const record = await storage3.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV record" });
    }
  });
  app2.get("/api/user-profiles", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const { search, role } = req.query;
      let profiles;
      if (search || role) {
        profiles = await storage3.searchUserProfiles(
          search || "",
          role
        );
      } else {
        profiles = await storage3.getAllUserProfiles();
      }
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profiles" });
    }
  });
  app2.get("/api/user-profiles/:id", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user profile ID" });
      }
      const profile = await storage3.getUserProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  app2.post("/api/user-profiles", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const validatedData = insertUserProfileSchema.parse(req.body);
      const newProfile = await storage3.createUserProfile(validatedData);
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create user profile" });
    }
  });
  app2.put("/api/user-profiles/:id", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user profile ID" });
      }
      const validatedData = insertUserProfileSchema.partial().parse(req.body);
      const updatedProfile = await storage3.updateUserProfile(id, validatedData);
      if (!updatedProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });
  app2.delete("/api/user-profiles/:id", async (req, res) => {
    try {
      const storage3 = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user profile ID" });
      }
      const deleted = await storage3.deleteUserProfile(id);
      if (!deleted) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json({ message: "User profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user profile" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/init-database.ts
async function initializeDatabase() {
  try {
    console.log("Initializing database with sample data...");
    const existingUsers = await db.select().from(userProfiles).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already initialized, skipping seed data.");
      return;
    }
    const sampleUsers = [
      {
        username: "admin",
        email: "admin@alteram.co.za",
        password: "admin1",
        role: "admin",
        firstName: "System",
        lastName: "Administrator",
        department: "ICT",
        position: "System Admin",
        phoneNumber: "011 234 5678",
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date("2025-01-09T08:30:00.000Z"),
        createdAt: /* @__PURE__ */ new Date("2024-12-01T00:00:00.000Z"),
        updatedAt: /* @__PURE__ */ new Date("2024-12-01T00:00:00.000Z")
      },
      {
        username: "mng",
        email: "manager@alteram.co.za",
        password: "mng1",
        role: "manager",
        firstName: "Sarah",
        lastName: "Johnson",
        department: "HR",
        position: "HR Manager",
        phoneNumber: "011 234 5679",
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date("2025-07-21T13:45:00.031Z"),
        createdAt: /* @__PURE__ */ new Date("2024-12-05T00:00:00.000Z"),
        updatedAt: /* @__PURE__ */ new Date("2025-07-21T13:45:00.031Z")
      },
      {
        username: "user",
        email: "user@example.com",
        password: "user1",
        role: "user",
        firstName: "John",
        lastName: "Doe",
        department: "SAP",
        position: "SAP Developer",
        phoneNumber: "083 123 4567",
        isActive: true,
        lastLogin: /* @__PURE__ */ new Date("2025-01-09T10:00:00.000Z"),
        createdAt: /* @__PURE__ */ new Date("2024-12-10T00:00:00.000Z"),
        updatedAt: /* @__PURE__ */ new Date("2024-12-10T00:00:00.000Z")
      }
    ];
    await db.insert(userProfiles).values(sampleUsers);
    const sampleCVs = [
      {
        name: "Michael",
        surname: "Chen",
        idPassport: "8901015009088",
        gender: "Male",
        email: "michael.chen@example.com",
        phone: "082 555 1234",
        position: "SAP Technical Consultant",
        roleTitle: "SAP ABAP Developer",
        department: "SAP",
        experience: 7,
        experienceInSimilarRole: 5,
        experienceWithITSMTools: 3,
        sapKLevel: "K4",
        qualifications: "BTech Computer Science, SAP ABAP Certification",
        qualificationType: "Degree",
        qualificationName: "BTech Computer Science",
        languages: "English (Fluent), Afrikaans (Conversational), Mandarin (Native)",
        workExperiences: JSON.stringify([
          {
            company: "Tech Solutions SA",
            position: "Senior SAP Developer",
            startDate: "2020-01",
            endDate: "2025-01",
            duration: "5 years",
            description: "Led SAP implementation projects and custom development"
          },
          {
            company: "Digital Innovations",
            position: "SAP ABAP Developer",
            startDate: "2018-06",
            endDate: "2020-01",
            duration: "1.5 years",
            description: "Developed custom SAP modules and reports"
          }
        ]),
        certificateTypes: JSON.stringify([
          { department: "SAP", role: "ABAP Developer", certificate: "SAP Certified Development Associate" }
        ]),
        status: "active",
        cvFile: "michael_chen_cv.pdf",
        submittedAt: /* @__PURE__ */ new Date("2024-12-15T10:30:00.000Z")
      },
      {
        name: "Sarah",
        surname: "Williams",
        idPassport: "9205120045088",
        gender: "Female",
        email: "sarah.williams@example.com",
        phone: "083 444 5678",
        position: "Project Manager",
        roleTitle: "Senior Project Manager",
        department: "PROJECT MANAGEMENT",
        experience: 8,
        experienceInSimilarRole: 6,
        experienceWithITSMTools: 4,
        sapKLevel: "",
        qualifications: "MBA, PMP Certification",
        qualificationType: "Master's Degree",
        qualificationName: "MBA",
        languages: "English (Native), Spanish (Intermediate)",
        workExperiences: JSON.stringify([
          {
            company: "Corporate Solutions Ltd",
            position: "Senior Project Manager",
            startDate: "2019-03",
            endDate: "2025-01",
            duration: "5.8 years",
            description: "Managed large-scale IT transformation projects"
          }
        ]),
        certificateTypes: JSON.stringify([
          { department: "PROJECT MANAGEMENT", role: "Project Manager", certificate: "PMP Certification" }
        ]),
        status: "pending",
        cvFile: "sarah_williams_cv.pdf",
        submittedAt: /* @__PURE__ */ new Date("2025-01-10T14:20:00.000Z")
      },
      {
        name: "David",
        surname: "Brown",
        idPassport: "8707085012088",
        gender: "Male",
        email: "david.brown@example.com",
        phone: "084 333 9876",
        position: "Network Administrator",
        roleTitle: "Senior Network Admin",
        department: "ICT",
        experience: 12,
        experienceInSimilarRole: 10,
        experienceWithITSMTools: 8,
        sapKLevel: "",
        qualifications: "BSc Information Technology, CCNA, MCSE",
        qualificationType: "Degree",
        qualificationName: "BSc Information Technology",
        languages: "English (Native), Afrikaans (Fluent)",
        workExperiences: JSON.stringify([
          {
            company: "Network Systems Pro",
            position: "Senior Network Administrator",
            startDate: "2015-08",
            endDate: "2025-01",
            duration: "9.4 years",
            description: "Managed enterprise network infrastructure"
          }
        ]),
        certificateTypes: JSON.stringify([
          { department: "ICT", role: "Network Administrator", certificate: "CCNA Certification" }
        ]),
        status: "archived",
        cvFile: "david_brown_cv.pdf",
        submittedAt: /* @__PURE__ */ new Date("2024-11-22T09:15:00.000Z")
      }
    ];
    await db.insert(cvRecords).values(sampleCVs);
    console.log("Database initialized successfully with sample data!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    log("Database initialization skipped - database may not be available yet");
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
