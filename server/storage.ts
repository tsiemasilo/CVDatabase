import { CVRecord, InsertCVRecord, UserProfile, InsertUserProfile } from "@shared/schema";

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
        languages: "English, Afrikaans",
        workExperiences: JSON.stringify([
          { companyName: "Tech Corp", position: "Junior Developer", startDate: "01/2020", endDate: "12/2022", isCurrentRole: false },
          { companyName: "InnovateTech", position: "Software Developer", startDate: "01/2023", endDate: "", isCurrentRole: true }
        ]),
        certificateTypes: JSON.stringify({}),
        status: "active",
        cvFile: "john_doe_cv.pdf",
        submittedAt: new Date("2024-01-15"),
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
        languages: "English, Zulu",
        workExperiences: JSON.stringify([
          { companyName: "ConsultCorp", position: "Project Coordinator", startDate: "03/2018", endDate: "06/2021", isCurrentRole: false },
          { companyName: "MegaProjects", position: "Senior Project Manager", startDate: "07/2021", endDate: "", isCurrentRole: true }
        ]),
        certificateTypes: JSON.stringify({}),
        status: "pending",
        cvFile: "sarah_johnson_cv.pdf",
        submittedAt: new Date("2024-01-20"),
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
        languages: "English, Mandarin",
        workExperiences: JSON.stringify([
          { companyName: "SAP Solutions", position: "Junior SAP Developer", startDate: "06/2019", endDate: "05/2022", isCurrentRole: false },
          { companyName: "Enterprise SAP", position: "SAP ABAP Developer", startDate: "06/2022", endDate: "", isCurrentRole: true }
        ]),
        certificateTypes: JSON.stringify({}),
        status: "active",
        cvFile: "michael_chen_cv.pdf",
        submittedAt: new Date("2024-01-25"),
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
        createdAt: new Date("2024-12-05T00:00:00"),
        updatedAt: new Date("2024-12-05T00:00:00")
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
        lastLogin: new Date("2025-01-09T10:00:00"),
        createdAt: new Date("2024-12-10T00:00:00"),
        updatedAt: new Date("2024-12-10T00:00:00")
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
      languages: insertCVRecord.languages || null,
      workExperiences: insertCVRecord.workExperiences || null,
      certificateTypes: insertCVRecord.certificateTypes || null,
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

export const storage = new MemStorage();
