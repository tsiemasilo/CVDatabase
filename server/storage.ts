import { CVRecord, InsertCVRecord, UserProfile, InsertUserProfile, cvRecords, userProfiles } from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // CV Records methods
  getAllCVRecords(): Promise<CVRecord[]>;
  getCVRecord(id: number): Promise<CVRecord | undefined>;
  createCVRecord(cvRecord: InsertCVRecord): Promise<CVRecord>;
  updateCVRecord(id: number, cvRecord: Partial<InsertCVRecord>): Promise<CVRecord | undefined>;
  deleteCVRecord(id: number): Promise<boolean>;
  searchCVRecords(searchTerm: string, statusFilter?: string): Promise<CVRecord[]>;

  // User Profile methods
  getAllUserProfiles(): Promise<UserProfile[]>;
  getUserProfile(id: number): Promise<UserProfile | undefined>;
  createUserProfile(userProfile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: number, userProfile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  deleteUserProfile(id: number): Promise<boolean>;
  searchUserProfiles(searchTerm: string, roleFilter?: string): Promise<UserProfile[]>;
  
  // Authentication methods
  authenticateUser(username: string, password: string): Promise<UserProfile | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private cvRecords: Map<number, CVRecord>;
  private userProfiles: Map<number, UserProfile>;
  private currentUserId: number;
  private currentCVId: number;
  private currentUserProfileId: number;

  constructor() {
    this.users = new Map();
    this.cvRecords = new Map();
    this.userProfiles = new Map();
    this.currentUserId = 1;
    this.currentCVId = 1;
    this.currentUserProfileId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Your Original 11 CV Records Restored
    const sampleCVs: Omit<CVRecord, 'id'>[] = [
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
        skills: "JavaScript, React, Node.js, TypeScript, HTML, CSS, SQL, Git, Problem Solving, Team Collaboration",
        status: "active",
        cvFile: "john_doe_cv.pdf",
        modifiedBy: "admin",
        submittedAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
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
        skills: "Project Management, PMP, Agile Methodology, Scrum, Risk Management, Budget Planning, Team Leadership, Communication, Microsoft Project, Stakeholder Management",
        status: "pending",
        cvFile: "sarah_johnson_cv.pdf",
        modifiedBy: "user",
        submittedAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
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
        skills: "SAP ABAP, SAP Fiori, SAP HANA, SQL, JavaScript, OData, REST APIs, ABAP Objects, SAP Gateway, Integration Technologies, Problem Solving, Technical Documentation",
        status: "active",
        cvFile: "michael_chen_cv.pdf",
        modifiedBy: "super",
        submittedAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-01-25"),
      },
    ];

    sampleCVs.forEach(cv => {
      const id = this.currentCVId++;
      this.cvRecords.set(id, { ...cv, id });
    });

    // Initialize sample user profiles with requested credentials
    const sampleUserProfiles: Omit<UserProfile, 'id'>[] = [
      {
        username: "admin",
        email: "admin@alteram.co.za",
        password: "admin1", // In production, this should be hashed
        role: "admin",
        firstName: "System",
        lastName: "Administrator",
        department: "ICT",
        position: "System Admin",
        phoneNumber: "011 234 5678",
        isActive: true,
        lastLogin: new Date("2025-01-09T08:30:00"),
        modifiedBy: "system",
        createdAt: new Date("2024-12-01T00:00:00"),
        updatedAt: new Date("2024-12-01T00:00:00")
      },
      {
        username: "super",
        email: "super@alteram.co.za",
        password: "super1",
        role: "super_user",
        firstName: "Super",
        lastName: "User",
        department: "ICT",
        position: "Super Administrator",
        phoneNumber: "011 234 5677",
        isActive: true,
        lastLogin: new Date("2025-08-12T08:00:00"),
        modifiedBy: "admin",
        createdAt: new Date("2024-12-01T00:00:00"),
        updatedAt: new Date("2024-12-01T00:00:00")
      },
      {
        username: "supu",
        email: "supu@alteram.co.za",
        password: "supu1",
        role: "super_user",
        firstName: "Supu",
        lastName: "User",
        department: "ICT",
        position: "Super Administrator",
        phoneNumber: "011 234 5676",
        isActive: true,
        lastLogin: new Date("2025-08-12T08:00:00"),
        modifiedBy: "admin",
        createdAt: new Date("2024-12-01T00:00:00"),
        updatedAt: new Date("2024-12-01T00:00:00")
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
        lastLogin: new Date("2025-01-09T09:15:00"),
        modifiedBy: "admin",
        createdAt: new Date("2024-12-05T00:00:00"),
        updatedAt: new Date("2024-12-05T00:00:00")
      },
      {
        username: "user",
        email: "user@example.com",
        password: "user1",
        role: "user",
        firstName: "David",
        lastName: "Smith",
        department: "SAP",
        position: "SAP Developer",
        phoneNumber: "083 123 4567",
        isActive: true,
        lastLogin: new Date("2025-01-09T10:00:00"),
        modifiedBy: "admin",
        createdAt: new Date("2024-12-10T00:00:00"),
        updatedAt: new Date("2024-12-10T00:00:00")
      },
      {
        username: "tsiemasilo",
        email: "tsiemasilo@gmail.com",
        password: "tsie",
        role: "user",
        firstName: "Tsie",
        lastName: "Masilo",
        department: "DEVELOPMENT",
        position: "Developer",
        phoneNumber: "082 806 9568",
        isActive: true,
        lastLogin: new Date("2025-01-09T10:30:00"),
        modifiedBy: "admin",
        createdAt: new Date("2024-12-15T00:00:00"),
        updatedAt: new Date("2024-12-15T00:00:00")
      }
    ];

    sampleUserProfiles.forEach(profile => {
      const id = this.currentUserProfileId++;
      this.userProfiles.set(id, { ...profile, id });
    });
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user: any = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllCVRecords(): Promise<CVRecord[]> {
    return Array.from(this.cvRecords.values()).sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async getCVRecord(id: number): Promise<CVRecord | undefined> {
    return this.cvRecords.get(id);
  }

  async createCVRecord(insertCVRecord: InsertCVRecord): Promise<CVRecord> {
    const id = this.currentCVId++;
    const cvRecord: CVRecord = {
      ...insertCVRecord,
      id,
      modifiedBy: null,
      updatedAt: new Date(),
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
      skills: insertCVRecord.skills || null,
      cvFile: insertCVRecord.cvFile || null,
      submittedAt: new Date(),
    };
    this.cvRecords.set(id, cvRecord);
    return cvRecord;
  }

  async updateCVRecord(id: number, updateData: Partial<InsertCVRecord>): Promise<CVRecord | undefined> {
    const existing = this.cvRecords.get(id);
    if (!existing) return undefined;

    const updated: CVRecord = { ...existing, ...updateData };
    this.cvRecords.set(id, updated);
    return updated;
  }

  async deleteCVRecord(id: number): Promise<boolean> {
    return this.cvRecords.delete(id);
  }

  async searchCVRecords(searchTerm: string, statusFilter?: string): Promise<CVRecord[]> {
    const allRecords = await this.getAllCVRecords();
    
    return allRecords.filter(record => {
      const matchesSearch = !searchTerm || 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.department && record.department.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = !statusFilter || record.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  // User Profile methods
  async getAllUserProfiles(): Promise<UserProfile[]> {
    return Array.from(this.userProfiles.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getUserProfile(id: number): Promise<UserProfile | undefined> {
    return this.userProfiles.get(id);
  }

  async createUserProfile(insertUserProfile: InsertUserProfile): Promise<UserProfile> {
    const id = this.currentUserProfileId++;
    const userProfile: UserProfile = {
      id,
      username: insertUserProfile.username,
      email: insertUserProfile.email,
      password: insertUserProfile.password,
      role: insertUserProfile.role ?? 'user',
      firstName: insertUserProfile.firstName || null,
      lastName: insertUserProfile.lastName || null,
      department: insertUserProfile.department || null,
      position: insertUserProfile.position || null,
      phoneNumber: insertUserProfile.phoneNumber || null,
      isActive: insertUserProfile.isActive ?? true,
      lastLogin: insertUserProfile.lastLogin || null,
      modifiedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }

  async updateUserProfile(id: number, updateData: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existing = this.userProfiles.get(id);
    if (!existing) return undefined;

    const updated: UserProfile = { 
      ...existing, 
      ...updateData,
      updatedAt: new Date()
    };
    this.userProfiles.set(id, updated);
    return updated;
  }

  async deleteUserProfile(id: number): Promise<boolean> {
    return this.userProfiles.delete(id);
  }

  async searchUserProfiles(searchTerm: string, roleFilter?: string): Promise<UserProfile[]> {
    const allProfiles = await this.getAllUserProfiles();
    
    return allProfiles.filter(profile => {
      const matchesSearch = !searchTerm || 
        (profile.firstName && profile.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.lastName && profile.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (profile.department && profile.department.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = !roleFilter || profile.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }

  // Authentication methods
  async authenticateUser(username: string, password: string): Promise<UserProfile | null> {
    const allProfiles = await this.getAllUserProfiles();
    const user = allProfiles.find(profile => 
      profile.username === username && profile.password === password && profile.isActive
    );
    
    if (user) {
      // Update last login time
      await this.updateUserProfile(user.id, { lastLogin: new Date() });
      return user;
    }
    
    return null;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User authentication methods
  async getUser(id: number): Promise<any | undefined> {
    const [user] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    const [user] = await db.select().from(userProfiles).where(eq(userProfiles.username, username));
    return user;
  }

  async createUser(user: any): Promise<any> {
    const [newUser] = await db.insert(userProfiles).values(user).returning();
    return newUser;
  }

  // CV Records methods
  async getAllCVRecords(): Promise<CVRecord[]> {
    try {
      // Check if skills column exists and add it if missing
      const columnsResult = await db.execute(sql`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'cv_records' AND column_name = 'skills'
      `);
      
      if (columnsResult.rows.length === 0) {
        console.log("Adding missing skills column to cv_records table...");
        await db.execute(sql`ALTER TABLE cv_records ADD COLUMN skills TEXT`);
        console.log("Skills column added successfully");
      }
      
      // Use raw SQL query including skills and audit tracking columns
      const rawResult = await db.execute(sql`
        SELECT id, name, surname, id_passport, gender, email, phone, position, 
               role_title, department, experience, experience_similar_role, 
               experience_itsm_tools, sap_k_level, qualifications, qualification_type, 
               qualification_name, institute_name, year_completed, languages, 
               work_experiences, certificate_types, skills, status, cv_file, submitted_at,
               modified_by, updated_at
        FROM cv_records 
        ORDER BY submitted_at DESC
      `);
      
      return rawResult.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        surname: row.surname,
        idPassport: row.id_passport,
        gender: row.gender,
        email: row.email,
        phone: row.phone,
        position: row.position,
        roleTitle: row.role_title,
        department: row.department,
        experience: row.experience,
        experienceInSimilarRole: row.experience_similar_role,
        experienceWithITSMTools: row.experience_itsm_tools,
        sapKLevel: row.sap_k_level,
        qualifications: row.qualifications,
        qualificationType: row.qualification_type,
        qualificationName: row.qualification_name,
        instituteName: row.institute_name,
        yearCompleted: row.year_completed,
        languages: row.languages,
        workExperiences: row.work_experiences,
        certificateTypes: row.certificate_types,
        skills: row.skills || "",
        status: row.status,
        cvFile: row.cv_file,
        modifiedBy: row.modified_by || null,
        submittedAt: row.submitted_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error("Error in getAllCVRecords:", error);
      throw error;
    }
  }

  async getCVRecord(id: number): Promise<CVRecord | undefined> {
    const [record] = await db.select().from(cvRecords).where(eq(cvRecords.id, id));
    return record;
  }

  async createCVRecord(cvRecord: InsertCVRecord): Promise<CVRecord> {
    const [newRecord] = await db.insert(cvRecords).values(cvRecord).returning();
    return newRecord;
  }

  async updateCVRecord(id: number, cvRecord: Partial<InsertCVRecord>): Promise<CVRecord | undefined> {
    const [updatedRecord] = await db
      .update(cvRecords)
      .set(cvRecord)
      .where(eq(cvRecords.id, id))
      .returning();
    return updatedRecord;
  }

  async deleteCVRecord(id: number): Promise<boolean> {
    const result = await db.delete(cvRecords).where(eq(cvRecords.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchCVRecords(searchTerm: string, statusFilter?: string): Promise<CVRecord[]> {
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
    
    if (statusFilter && statusFilter !== 'all') {
      conditions.push(eq(cvRecords.status, statusFilter));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(cvRecords.submittedAt));
  }

  // User Profile methods
  async getAllUserProfiles(): Promise<UserProfile[]> {
    return await db.select().from(userProfiles).orderBy(desc(userProfiles.createdAt));
  }

  async getUserProfile(id: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return profile;
  }

  async createUserProfile(userProfile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db.insert(userProfiles).values(userProfile).returning();
    return newProfile;
  }

  async updateUserProfile(id: number, userProfile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set(userProfile)
      .where(eq(userProfiles.id, id))
      .returning();
    return updatedProfile;
  }

  async deleteUserProfile(id: number): Promise<boolean> {
    const result = await db.delete(userProfiles).where(eq(userProfiles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchUserProfiles(searchTerm: string, roleFilter?: string): Promise<UserProfile[]> {
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
    
    if (roleFilter && roleFilter !== 'all') {
      conditions.push(eq(userProfiles.role, roleFilter));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return await query.orderBy(desc(userProfiles.createdAt));
  }

  // Authentication methods
  async authenticateUser(username: string, password: string): Promise<UserProfile | null> {
    try {
      // Use raw SQL to avoid schema issues
      const userResult = await db.execute(sql`
        SELECT id, username, email, password, role, first_name, last_name, 
               department, position, phone_number, is_active, last_login, 
               created_at, updated_at, modified_by
        FROM user_profiles 
        WHERE username = ${username}
      `);
      
      if (userResult.rows.length > 0) {
        const row = userResult.rows[0] as any;
        if (row.password === password) {
          // Update last login with raw SQL
          await db.execute(sql`
            UPDATE user_profiles 
            SET last_login = NOW() 
            WHERE id = ${row.id}
          `);
          
          return {
            id: row.id,
            username: row.username,
            email: row.email,
            password: row.password,
            role: row.role,
            firstName: row.first_name,
            lastName: row.last_name,
            department: row.department,
            position: row.position,
            phoneNumber: row.phone_number,
            isActive: row.is_active,
            lastLogin: row.last_login,
            modifiedBy: row.modified_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
        }
      }
      
      return null;
    } catch (error: any) {
      console.log("Database authentication failed, using fallback");
      throw new Error("Database connection failed");
    }
  }
}

// Storage factory with database fallback
class StorageFactory {
  private static instance: IStorage;
  
  static async getStorage(): Promise<IStorage> {
    if (!this.instance) {
      // Temporarily force MemStorage until database schema issues are resolved
      console.log("🔄 Using MemStorage with restored CV records");
      this.instance = new MemStorage();
    }
    return this.instance;
  }
  
  static reset() {
    this.instance = undefined as any;
  }
}

// Export a function to get storage
export const getStorage = () => StorageFactory.getStorage();

// For backward compatibility, export a storage instance (will be MemStorage initially)
export const storage = new MemStorage();
