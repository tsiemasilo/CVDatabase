import { db } from "./db";
import { cvRecords, userProfiles } from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize database with sample data
export async function initializeDatabase() {
  try {
    console.log("Initializing database with sample data...");

    // Check if users already exist
    const existingUsers = await db.select().from(userProfiles).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already initialized, skipping seed data.");
      return;
    }

    // Create sample user profiles
    const sampleUsers = [
      {
        username: "admin",
        email: "admin@alteram.co.za",
        password: "admin1",
        role: "admin" as const,
        firstName: "System",
        lastName: "Administrator",
        department: "ICT",
        position: "System Admin",
        phoneNumber: "011 234 5678",
        isActive: true,
        lastLogin: new Date("2025-01-09T08:30:00.000Z"),
        createdAt: new Date("2024-12-01T00:00:00.000Z"),
        updatedAt: new Date("2024-12-01T00:00:00.000Z")
      },
      {
        username: "mng",
        email: "manager@alteram.co.za",
        password: "mng1",
        role: "manager" as const,
        firstName: "Sarah",
        lastName: "Johnson",
        department: "HR",
        position: "HR Manager",
        phoneNumber: "011 234 5679",
        isActive: true,
        lastLogin: new Date("2025-07-21T13:45:00.031Z"),
        createdAt: new Date("2024-12-05T00:00:00.000Z"),
        updatedAt: new Date("2025-07-21T13:45:00.031Z")
      },
      {
        username: "user",
        email: "user@example.com",
        password: "user1",
        role: "user" as const,
        firstName: "John",
        lastName: "Doe",
        department: "SAP",
        position: "SAP Developer",
        phoneNumber: "083 123 4567",
        isActive: true,
        lastLogin: new Date("2025-01-09T10:00:00.000Z"),
        createdAt: new Date("2024-12-10T00:00:00.000Z"),
        updatedAt: new Date("2024-12-10T00:00:00.000Z")
      }
    ];

    await db.insert(userProfiles).values(sampleUsers);

    // Create sample CV records
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
        status: "active" as const,
        cvFile: "michael_chen_cv.pdf",
        submittedAt: new Date("2024-12-15T10:30:00.000Z")
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
        status: "pending" as const,
        cvFile: "sarah_williams_cv.pdf",
        submittedAt: new Date("2025-01-10T14:20:00.000Z")
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
        status: "archived" as const,
        cvFile: "david_brown_cv.pdf",
        submittedAt: new Date("2024-11-22T09:15:00.000Z")
      }
    ];

    await db.insert(cvRecords).values(sampleCVs);

    console.log("Database initialized successfully with sample data!");

  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}