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
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "0000000",
        position: "Senior Developer",
        department: "Engineering",
        experience: 5,
        qualifications: "Bachelor's degree, Advanced Diploma, Post Graduate Certificates (NQF 7) - Computer Science 2023-04-24",
        status: "active",
        cvFile: "john_doe_cv.pdf",
        submittedAt: new Date("2024-01-15"),
      },
      {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        phone: "0728146319",
        position: "UX Designer",
        department: "Design",
        experience: 6,
        qualifications: "Higher Certificates and Advanced National Vocational Certificate (NQF 5) - certificate in something - 2025-04-23",
        status: "pending",
        cvFile: "alice_smith_cv.pdf",
        submittedAt: new Date("2024-01-12"),
      },
      {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "0000000000",
        position: "Project Manager",
        department: "Operations",
        experience: 8,
        qualifications: "Higher Certificates and Advanced National Vocational Certificate (NQF 5) - certificate in programming - 2025-04-21",
        status: "archived",
        cvFile: "robert_johnson_cv.pdf",
        submittedAt: new Date("2024-01-08"),
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
