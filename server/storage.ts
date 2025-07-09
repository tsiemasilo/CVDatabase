import { CVRecord, InsertCVRecord } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private cvRecords: Map<number, CVRecord>;
  private currentUserId: number;
  private currentCVId: number;

  constructor() {
    this.users = new Map();
    this.cvRecords = new Map();
    this.currentUserId = 1;
    this.currentCVId = 1;
    
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
        certificateType: "Technical Certification",
        certificateName: "Microsoft Certified: Azure Developer Associate",
        languages: "English, Afrikaans",
        workExperiences: JSON.stringify([
          { companyName: "Tech Corp", position: "Junior Developer", startDate: "01/2020", endDate: "12/2022", isCurrentRole: false },
          { companyName: "InnovateTech", position: "Software Developer", startDate: "01/2023", endDate: "", isCurrentRole: true }
        ]),
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
        certificateType: "Professional Management",
        certificateName: "PMP (Project Management Professional)",
        languages: "English, Zulu",
        workExperiences: JSON.stringify([
          { companyName: "ConsultCorp", position: "Project Coordinator", startDate: "03/2018", endDate: "06/2021", isCurrentRole: false },
          { companyName: "MegaProjects", position: "Senior Project Manager", startDate: "07/2021", endDate: "", isCurrentRole: true }
        ]),
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
        certificateType: "SAP Technical",
        certificateName: "SAP Certified Development Associate - ABAP with SAP NetWeaver 7.50",
        languages: "English, Mandarin",
        workExperiences: JSON.stringify([
          { companyName: "SAP Solutions", position: "Junior SAP Developer", startDate: "06/2019", endDate: "05/2022", isCurrentRole: false },
          { companyName: "Enterprise SAP", position: "SAP ABAP Developer", startDate: "06/2022", endDate: "", isCurrentRole: true }
        ]),
        status: "active",
        cvFile: "michael_chen_cv.pdf",
        submittedAt: new Date("2024-01-25"),
      },
    ];

    sampleCVs.forEach(cv => {
      const id = this.currentCVId++;
      this.cvRecords.set(id, { ...cv, id });
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
      phone: insertCVRecord.phone || null,
      department: insertCVRecord.department || null,
      experience: insertCVRecord.experience || null,
      qualifications: insertCVRecord.qualifications || null,
      languages: insertCVRecord.languages || null,
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
}

export const storage = new MemStorage();
