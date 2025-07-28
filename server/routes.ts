import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { insertCVRecordSchema, insertUserProfileSchema } from "@shared/schema";
import { upload, deleteFile, getFileInfo } from "./uploads";
import { z } from "zod";
import path from "path";

// Extend session type to include user property
declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
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
        req.session.user = null;
      }
      res.json({ message: "Logged out successfully" });
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
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CV records" });
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
      
      // Convert experience to number if it exists
      if (formData.experience) {
        formData.experience = parseInt(formData.experience);
      }
      
      const validatedData = insertCVRecordSchema.parse(formData);
      const newRecord = await storage.createCVRecord(validatedData);
      res.status(201).json(newRecord);
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
      const updatedRecord = await storage.updateCVRecord(id, validatedData);

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

  // Export CV records as CSV
  app.get("/api/cv-records/export/csv", async (req, res) => {
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

      // Create CSV headers
      const headers = [
        "ID", "Name", "Surname", "Email", "Phone", "Position", 
        "Department", "Experience", "Status", "Submitted At"
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
      const storage = await getStorage();
      const validatedData = insertUserProfileSchema.parse(req.body);
      const newProfile = await storage.createUserProfile(validatedData);
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create user profile" });
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