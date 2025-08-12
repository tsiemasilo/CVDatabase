import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { insertCVRecordSchema, insertUserProfileSchema, CVRecord } from "@shared/schema";
import { upload, deleteFile, getFileInfo } from "./uploads";
import { z } from "zod";
import path from "path";

// Extend session type to include user property
declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
}

// Function to generate HTML content for CV download
function generateCVHTML(record: CVRecord): string {
  let workExperiences = '';
  if (record.workExperiences) {
    try {
      const workExp = JSON.parse(record.workExperiences);
      workExperiences = workExp.map((exp: any) => `
        <div style="margin-bottom: 10px; padding: 10px; border-left: 3px solid rgb(0, 0, 83);">
          <strong>${exp.position || 'Position'}</strong> at ${exp.companyName || 'Company'}<br>
          <small style="color: #666;">${exp.startDate} - ${exp.isCurrentRole ? 'Present' : exp.endDate}</small>
          ${exp.roleTitle ? `<br><em>${exp.roleTitle}</em>` : ''}
        </div>
      `).join('');
    } catch (e) {
      workExperiences = '<p>Work experience data not available</p>';
    }
  }

  let certificates = '';
  if (record.certificateTypes) {
    try {
      const certs = JSON.parse(record.certificateTypes);
      certificates = certs.map((cert: any) => `
        <div style="margin-bottom: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 4px;">
          <strong>${cert.certificateName}</strong><br>
          <small style="color: #666;">${cert.department} - ${cert.role}</small>
        </div>
      `).join('');
    } catch (e) {
      certificates = '<p>Certificate data not available</p>';
    }
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CV - ${record.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid rgb(0, 0, 83); padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { color: rgb(0, 0, 83); font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .name { font-size: 28px; font-weight: bold; color: rgb(0, 0, 83); margin-bottom: 5px; }
        .contact-info { font-size: 14px; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; color: rgb(0, 0, 83); border-bottom: 1px solid rgb(0, 0, 83); padding-bottom: 5px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .info-item { margin-bottom: 8px; }
        .label { font-weight: bold; color: rgb(0, 0, 83); }
        .badge { background-color: rgb(0, 0, 83); color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">ALTERAM SOLUTIONS</div>
        <div class="name">${record.name}${record.surname ? ' ' + record.surname : ''}</div>
        <div class="contact-info">
          ${record.email} | ${record.phone || 'Phone not provided'} | Applied: ${new Date(record.submittedAt).toLocaleDateString()}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Professional Information</div>
        <div class="info-grid">
          <div>
            <div class="info-item"><span class="label">Position:</span> ${record.position}</div>
            <div class="info-item"><span class="label">Role Title:</span> ${record.roleTitle || 'Not specified'}</div>
            <div class="info-item"><span class="label">Department:</span> ${record.department || 'Not specified'}</div>
            <div class="info-item"><span class="label">Gender:</span> ${record.gender || 'Not specified'}</div>
          </div>
          <div>
            <div class="info-item"><span class="label">Experience:</span> ${record.experience || 0} years</div>
            <div class="info-item"><span class="label">Similar Role Experience:</span> ${record.experienceInSimilarRole || 0} years</div>
            <div class="info-item"><span class="label">ITSM Tools Experience:</span> ${record.experienceWithITSMTools || 0} years</div>
            <div class="info-item"><span class="label">SAP K-Level:</span> ${record.sapKLevel ? `<span class="badge">${record.sapKLevel}</span>` : 'Not specified'}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Qualifications</div>
        <div class="info-item"><span class="label">Qualification Type:</span> ${record.qualificationType || 'Not specified'}</div>
        <div class="info-item"><span class="label">Qualification Name:</span> ${record.qualificationName || 'Not specified'}</div>
        <div class="info-item"><span class="label">Institution:</span> ${record.instituteName || 'Not specified'}</div>
        <div class="info-item"><span class="label">Year Completed:</span> ${record.yearCompleted || 'Not specified'}</div>
        <div class="info-item"><span class="label">Languages:</span> ${record.languages || 'Not specified'}</div>
      </div>

      ${workExperiences ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${workExperiences}
        </div>
      ` : ''}

      ${certificates ? `
        <div class="section">
          <div class="section-title">Certificates</div>
          ${certificates}
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Application Status</div>
        <div class="info-item"><span class="label">Status:</span> <span class="badge">${record.status}</span></div>
        <div class="info-item"><span class="label">ID/Passport:</span> ${record.idPassport || 'Not provided'}</div>
      </div>
    </body>
    </html>
  `;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const storage = await getStorage();
      const user = await storage.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Store user session
      if (req.session) {
        req.session.user = user;
      }
      
      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({ message: "Failed to logout" });
          }
          res.clearCookie('connect.sid'); // Clear the session cookie
          res.json({ message: "Logged out successfully" });
        });
      } else {
        res.json({ message: "Logged out successfully" });
      }
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/user", async (req, res) => {
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
  
  // Get all CV records
  app.get("/api/cv-records", async (req, res) => {
    try {
      const storage = await getStorage();
      const { search, status } = req.query;
      
      let records;
      if (search || status) {
        records = await storage.searchCVRecords(
          search as string || "", 
          status as string
        );
      } else {
        records = await storage.getAllCVRecords();
      }
      
      res.json(records);
    } catch (error: any) {
      console.error("Error fetching CV records:", error);
      res.status(500).json({ message: "Failed to fetch CV records", error: error.message });
    }
  });

  // Get a specific CV record
  app.get("/api/cv-records/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const record = await storage.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }

      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV record" });
    }
  });

  // Create a new CV record with file upload
  app.post("/api/cv-records", upload.single('cvFile'), async (req, res) => {
    try {
      const storage = await getStorage();
      const formData = { ...req.body };
      
      // If a file was uploaded, use the filename
      if (req.file) {
        formData.cvFile = req.file.filename;
      }
      
      // Convert numeric fields from strings to numbers
      if (formData.experience) {
        formData.experience = parseInt(formData.experience);
      }
      if (formData.experienceInSimilarRole) {
        formData.experienceInSimilarRole = parseInt(formData.experienceInSimilarRole);
      }
      if (formData.experienceWithITSMTools) {
        formData.experienceWithITSMTools = parseInt(formData.experienceWithITSMTools);
      }
      
      console.log('Form data after conversion:', formData);
      const validatedData = insertCVRecordSchema.parse(formData);
      const newRecord = await storage.createCVRecord(validatedData);
      res.status(201).json(newRecord);
    } catch (error) {
      // If validation fails and a file was uploaded, clean it up
      if (req.file) {
        deleteFile(req.file.filename);
      }
      
      if (error instanceof z.ZodError) {
        console.error('Validation error details:', error.errors);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('CV creation error:', error);
      res.status(500).json({ message: "Failed to create CV record" });
    }
  });

  // Update a CV record with optional file upload
  app.put("/api/cv-records/:id", upload.single('cvFile'), async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const formData = { ...req.body };
      
      // Get existing record to handle old file deletion
      const existingRecord = await storage.getCVRecord(id);
      if (!existingRecord) {
        if (req.file) deleteFile(req.file.filename);
        return res.status(404).json({ message: "CV record not found" });
      }

      // If a new file was uploaded, use the filename and delete old file
      if (req.file) {
        formData.cvFile = req.file.filename;
        // Delete old file if it exists
        if (existingRecord.cvFile) {
          deleteFile(existingRecord.cvFile);
        }
      }
      
      // Convert experience to number if it exists
      if (formData.experience) {
        formData.experience = parseInt(formData.experience);
      }

      const validatedData = insertCVRecordSchema.partial().parse(formData);
      // Add audit tracking
      const updateData = {
        ...validatedData,
        modifiedBy: req.session?.user?.username || 'system',
        updatedAt: new Date()
      };
      const updatedRecord = await storage.updateCVRecord(id, updateData);

      res.json(updatedRecord);
    } catch (error) {
      // If validation fails and a file was uploaded, clean it up
      if (req.file) {
        deleteFile(req.file.filename);
      }
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update CV record" });
    }
  });

  // Delete a CV record and its file
  app.delete("/api/cv-records/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      // Get the record to delete associated file
      const record = await storage.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }

      // Delete the file if it exists
      if (record.cvFile) {
        deleteFile(record.cvFile);
      }

      const deleted = await storage.deleteCVRecord(id);
      if (!deleted) {
        return res.status(404).json({ message: "CV record not found" });
      }

      res.json({ message: "CV record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete CV record" });
    }
  });

  // Download individual CV record as PDF
  app.get("/api/cv-records/:id/download", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const record = await storage.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }

      // Generate HTML for PDF conversion
      const htmlContent = generateCVHTML(record);
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="CV_${record.name.replace(/\s+/g, '_')}_${record.id}.pdf"`);
      
      // For now, return the HTML content as a simple PDF alternative
      // In production, you would use a PDF generation library like puppeteer
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      console.error('CV download error:', error);
      res.status(500).json({ message: "Failed to generate CV download" });
    }
  });

  // Export CV records as CSV
  app.get("/api/cv-records/export/csv", async (req, res) => {
    try {
      const storage = await getStorage();
      const {
        searchTerm, status, department, name, surname, idPassport,
        language, role, roleTitle, sapLevel, qualificationType1,
        qualificationType2, qualification1, qualification2, experience
      } = req.query;
      
      // Get all records first
      let records = await storage.getAllCVRecords();
      
      // Apply client-side filtering to match frontend behavior
      records = records.filter(record => {
        // Search term filter
        if (searchTerm) {
          const searchLower = (searchTerm as string).toLowerCase();
          const matchesSearch = 
            record.name.toLowerCase().includes(searchLower) ||
            (record.surname && record.surname.toLowerCase().includes(searchLower)) ||
            record.email.toLowerCase().includes(searchLower) ||
            (record.phone && record.phone.toLowerCase().includes(searchLower)) ||
            (record.position && record.position.toLowerCase().includes(searchLower)) ||
            (record.department && record.department.toLowerCase().includes(searchLower)) ||
            (record.qualifications && record.qualifications.toLowerCase().includes(searchLower));
          if (!matchesSearch) return false;
        }

        // All other filters
        if (status && record.status !== status) return false;
        if (department && record.department !== department) return false;
        if (name && !record.name.toLowerCase().includes((name as string).toLowerCase())) return false;
        if (surname && (!record.surname || !record.surname.toLowerCase().includes((surname as string).toLowerCase()))) return false;
        if (idPassport && (!record.idPassport || !record.idPassport.toLowerCase().includes((idPassport as string).toLowerCase()))) return false;
        if (language && (!record.languages || !record.languages.toLowerCase().includes((language as string).toLowerCase()))) return false;
        if (role && record.position !== role) return false;
        if (roleTitle && record.roleTitle !== roleTitle) return false;
        if (sapLevel && record.sapKLevel !== sapLevel) return false;
        if (qualificationType1 && (!record.qualifications || !record.qualifications.toLowerCase().includes((qualificationType1 as string).toLowerCase()))) return false;
        if (qualificationType2 && (!record.qualifications || !record.qualifications.toLowerCase().includes((qualificationType2 as string).toLowerCase()))) return false;
        if (qualification1 && (!record.qualifications || !record.qualifications.toLowerCase().includes((qualification1 as string).toLowerCase()))) return false;
        if (qualification2 && (!record.qualifications || !record.qualifications.toLowerCase().includes((qualification2 as string).toLowerCase()))) return false;
        if (experience && record.experience !== parseInt(experience as string)) return false;

        return true;
      });

      // Create CSV headers
      const headers = [
        "ID", "Name", "Surname", "Email", "Phone", "Position", 
        "Department", "Experience", "SAP K-Level", "Status", "Submitted At"
      ];

      // Convert records to CSV rows
      const csvRows = [
        headers.join(","),
        ...records.map(record => [
          record.id,
          `"${record.name}"`,
          `"${record.surname || ''}"`,
          `"${record.email}"`,
          `"${record.phone || ''}"`,
          `"${record.position}"`,
          `"${record.department || ''}"`,
          record.experience || 0,
          `"${record.sapKLevel || ''}"`,
          `"${record.status}"`,
          `"${record.submittedAt}"`
        ].join(","))
      ].join("\n");

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="cv-records.csv"');
      res.send(csvRows);
    } catch (error) {
      res.status(500).json({ message: "Failed to export CV records" });
    }
  });

  // Get CV file download
  app.get("/api/cv-records/:id/file", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const record = await storage.getCVRecord(id);
      if (!record || !record.cvFile) {
        return res.status(404).json({ message: "CV file not found" });
      }

      const filePath = path.join(process.cwd(), 'uploads', record.cvFile);
      const fileInfo = getFileInfo(record.cvFile);
      
      if (!fileInfo) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${record.cvFile}"`);
      // Determine mimetype based on file extension
      const ext = path.extname(record.cvFile).toLowerCase();
      let mimetype = 'application/octet-stream';
      if (ext === '.pdf') mimetype = 'application/pdf';
      else if (ext === '.doc') mimetype = 'application/msword';
      else if (ext === '.docx') mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      res.setHeader('Content-Type', mimetype);
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json({ message: "Failed to download CV file" });
    }
  });

  // Get creative CV view data
  app.get("/api/cv-records/:id/creative-view", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid CV record ID" });
      }

      const record = await storage.getCVRecord(id);
      if (!record) {
        return res.status(404).json({ message: "CV record not found" });
      }

      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV record" });
    }
  });

  // User Profile routes
  app.get("/api/user-profiles", async (req, res) => {
    try {
      const storage = await getStorage();
      const { search, role } = req.query;
      
      let profiles;
      if (search || role) {
        profiles = await storage.searchUserProfiles(
          search as string || "", 
          role as string
        );
      } else {
        profiles = await storage.getAllUserProfiles();
      }
      
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profiles" });
    }
  });

  // Get a specific user profile
  app.get("/api/user-profiles/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user profile ID" });
      }

      const profile = await storage.getUserProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Create a new user profile
  app.post("/api/user-profiles", async (req, res) => {
    try {
      console.log("Creating user profile with data:", req.body);
      const storage = await getStorage();
      const validatedData = insertUserProfileSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      const newProfile = await storage.createUserProfile(validatedData);
      console.log("Created user profile:", newProfile);
      res.status(201).json(newProfile);
    } catch (error) {
      console.error("User profile creation error:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation error details:", error.errors);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      // Check for unique constraint violations
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique') || errorMessage.includes('already exists')) {
        return res.status(409).json({ 
          message: "User with this username or email already exists" 
        });
      }
      
      res.status(500).json({ message: "Failed to create user profile", error: errorMessage });
    }
  });

  // Update a user profile
  app.put("/api/user-profiles/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user profile ID" });
      }

      const validatedData = insertUserProfileSchema.partial().parse(req.body);
      const updatedProfile = await storage.updateUserProfile(id, validatedData);

      if (!updatedProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Delete a user profile
  app.delete("/api/user-profiles/:id", async (req, res) => {
    try {
      const storage = await getStorage();
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user profile ID" });
      }

      const deleted = await storage.deleteUserProfile(id);
      if (!deleted) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.json({ message: "User profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}