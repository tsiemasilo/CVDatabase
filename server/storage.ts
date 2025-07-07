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
        languages: "English, Mandarin",
        workExperiences: JSON.stringify([
          { companyName: "SAP Solutions", position: "Junior SAP Developer", startDate: "06/2019", endDate: "05/2022", isCurrentRole: false },
          { companyName: "Enterprise SAP", position: "SAP ABAP Developer", startDate: "06/2022", endDate: "", isCurrentRole: true }
        ]),
        status: "active",
        cvFile: "michael_chen_cv.pdf",
        submittedAt: new Date("2024-01-25"),
      },
      {
        name: "Priya",
        surname: "Patel",
        idPassport: "8709125432109",
        gender: "Female",
        email: "priya.patel@example.com",
        phone: "+27 11 234 5678",
        position: "HR Specialist",
        roleTitle: "HR Business Partner",
        department: "HR",
        experience: 5,
        experienceInSimilarRole: 4,
        experienceWithITSMTools: 2,
        sapKLevel: "",
        qualifications: "Bachelor of Human Resources, SHRM Certification",
        qualificationType: "Degree",
        qualificationName: "Bachelor of Human Resources",
        languages: "English, Hindi, Afrikaans",
        workExperiences: JSON.stringify([
          { companyName: "People Corp", position: "HR Assistant", startDate: "02/2019", endDate: "08/2021", isCurrentRole: false },
          { companyName: "Talent Solutions", position: "HR Business Partner", startDate: "09/2021", endDate: "", isCurrentRole: true }
        ]),
        status: "active",
        cvFile: "priya_patel_cv.pdf",
        submittedAt: new Date("2024-02-01"),
      },
      {
        name: "Thabo",
        surname: "Mthembu",
        idPassport: "9405148765432",
        gender: "Male",
        email: "thabo.mthembu@example.com",
        phone: "+27 12 345 6789",
        position: "Help Desk Technician",
        roleTitle: "IT Support Specialist",
        department: "SERVICE DESK",
        experience: 2,
        experienceInSimilarRole: 2,
        experienceWithITSMTools: 2,
        sapKLevel: "",
        qualifications: "IT Support Certificate, CompTIA A+",
        qualificationType: "Certificate",
        qualificationName: "IT Support Certificate",
        languages: "English, Zulu, Sotho",
        workExperiences: JSON.stringify([
          { companyName: "HelpDesk Solutions", position: "Junior IT Support", startDate: "06/2022", endDate: "05/2023", isCurrentRole: false },
          { companyName: "TechSupport Pro", position: "IT Support Specialist", startDate: "06/2023", endDate: "", isCurrentRole: true }
        ]),
        status: "pending",
        cvFile: "thabo_mthembu_cv.pdf",
        submittedAt: new Date("2024-02-05"),
      },
      {
        name: "Lisa",
        surname: "van der Merwe",
        idPassport: "8811127654321",
        gender: "Female",
        email: "lisa.vandermerwe@example.com",
        phone: "+27 21 456 7890",
        position: "SAP Functional Consultant",
        roleTitle: "SAP Functional Consultant - FI",
        department: "SAP",
        experience: 7,
        experienceInSimilarRole: 5,
        experienceWithITSMTools: 4,
        sapKLevel: "K4",
        qualifications: "SAP Certified Application Professional - FI",
        qualificationType: "Professional Certification",
        qualificationName: "SAP Certified Application Professional - Financial Accounting",
        languages: "English, Afrikaans",
        workExperiences: JSON.stringify([
          { companyName: "SAP Consultancy", position: "Junior SAP Consultant", startDate: "03/2017", endDate: "12/2019", isCurrentRole: false },
          { companyName: "Enterprise SAP Solutions", position: "SAP Functional Consultant - FI", startDate: "01/2020", endDate: "", isCurrentRole: true }
        ]),
        status: "active",
        cvFile: "lisa_vandermerwe_cv.pdf",
        submittedAt: new Date("2024-02-10"),
      }
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
