// Netlify Functions wrapper for Express app
import express from 'express';
import serverless from 'serverless-http';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware for Netlify
import MemoryStore from 'memorystore';
import session from 'express-session';

const MemStoreSession = MemoryStore(session);

app.use(session({
  secret: process.env.SESSION_SECRET || 'netlify-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: new MemStoreSession({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize routes
let routesInitialized = false;

const initializeApp = async () => {
  if (!routesInitialized) {
    try {
      // Import storage and routes
      const { getStorage } = await import('../../server/storage.js');
      const { insertCVRecordSchema, insertUserProfileSchema } = await import('../../shared/schema.js');
      const { upload, deleteFile, getFileInfo } = await import('../../server/uploads.js');
      const { z } = await import('zod');
      const path = await import('path');
      
      console.log('Netlify function imports successful - version history routes included');
      
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
      
      // CV Records routes
      app.get("/api/cv-records", async (req, res) => {
        try {
          const storage = await getStorage();
          const { search, status } = req.query;
          
          let records;
          if (search || status) {
            records = await storage.searchCVRecords(
              search || "", 
              status || ""
            );
          } else {
            records = await storage.getAllCVRecords();
          }
          
          res.json(records);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch CV records" });
        }
      });

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

      // Create a new CV record
      app.post("/api/cv-records", async (req, res) => {
        try {
          const storage = await getStorage();
          const formData = { ...req.body };
          
          // Convert experience to number if it exists
          if (formData.experience) {
            formData.experience = parseInt(formData.experience);
          }
          if (formData.experienceInSimilarRole) {
            formData.experienceInSimilarRole = parseInt(formData.experienceInSimilarRole);
          }
          if (formData.experienceWithITSMTools) {
            formData.experienceWithITSMTools = parseInt(formData.experienceWithITSMTools);
          }
          
          // Handle certificate types if present
          if (formData.certificateTypes && typeof formData.certificateTypes === 'string') {
            try {
              formData.certificateTypes = JSON.parse(formData.certificateTypes);
            } catch (e) {
              formData.certificateTypes = [];
            }
          }
          
          // Handle work experiences if present
          if (formData.workExperiences && typeof formData.workExperiences === 'string') {
            try {
              formData.workExperiences = JSON.parse(formData.workExperiences);
            } catch (e) {
              formData.workExperiences = [];
            }
          }

          const newRecord = await storage.createCVRecord(formData);
          res.status(201).json(newRecord);
        } catch (error) {
          console.error("CV creation error:", error);
          res.status(500).json({ message: "Failed to create CV record", error: error.message });
        }
      });

      // Update a CV record
      app.put("/api/cv-records/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid CV record ID" });
          }

          const formData = { ...req.body };
          
          // Convert experience to number if it exists
          if (formData.experience) {
            formData.experience = parseInt(formData.experience);
          }
          if (formData.experienceInSimilarRole) {
            formData.experienceInSimilarRole = parseInt(formData.experienceInSimilarRole);
          }
          if (formData.experienceWithITSMTools) {
            formData.experienceWithITSMTools = parseInt(formData.experienceWithITSMTools);
          }

          const updatedRecord = await storage.updateCVRecord(id, formData);
          if (!updatedRecord) {
            return res.status(404).json({ message: "CV record not found" });
          }

          res.json(updatedRecord);
        } catch (error) {
          console.error("CV update error:", error);
          res.status(500).json({ message: "Failed to update CV record" });
        }
      });

      // Delete a CV record
      app.delete("/api/cv-records/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid CV record ID" });
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
      
      // User profiles routes  
      app.get("/api/user-profiles", async (req, res) => {
        try {
          const storage = await getStorage();
          const { search, role } = req.query;
          
          let profiles;
          if (search || role) {
            profiles = await storage.searchUserProfiles(
              search || "", 
              role || ""
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
          const newProfile = await storage.createUserProfile(req.body);
          res.status(201).json(newProfile);
        } catch (error) {
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

          const updatedProfile = await storage.updateUserProfile(id, req.body);
          if (!updatedProfile) {
            return res.status(404).json({ message: "User profile not found" });
          }

          res.json(updatedProfile);
        } catch (error) {
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

      // Version History routes
      app.get("/api/version-history/:tableName/:recordId", async (req, res) => {
        try {
          console.log('Version history route hit:', req.params);
          const storage = await getStorage();
          console.log('Storage obtained:', typeof storage);
          const { tableName, recordId } = req.params;
          const recordIdNum = parseInt(recordId);
          
          if (isNaN(recordIdNum)) {
            return res.status(400).json({ message: "Invalid record ID" });
          }
          
          console.log('Calling getRecordVersionHistory:', tableName, recordIdNum);
          const history = await storage.getRecordVersionHistory(tableName, recordIdNum);
          console.log('Version history result:', history?.length || 0, 'records');
          res.json(history);
        } catch (error) {
          console.error("Version history API error:", error);
          res.status(500).json({ message: "Failed to get version history", error: error?.message || "Unknown error" });
        }
      });

      app.get("/api/version-history", async (req, res) => {
        try {
          console.log('All version history route hit:', req.query);
          const storage = await getStorage();
          console.log('Storage obtained for all history:', typeof storage);
          const { tableName, recordId, limit } = req.query;
          
          const recordIdNum = recordId ? parseInt(recordId) : undefined;
          const limitNum = limit ? parseInt(limit) : 50;
          
          console.log('Calling getVersionHistory with params:', { tableName, recordIdNum, limitNum });
          const history = await storage.getVersionHistory(
            tableName || undefined,
            recordIdNum,
            limitNum
          );
          console.log('All version history result:', history?.length || 0, 'records');
          res.json(history);
        } catch (error) {
          console.error("Version history API error:", error);
          res.status(500).json({ message: "Failed to get version history", error: error?.message || "Unknown error" });
        }
      });

      // Qualifications routes
      app.get("/api/qualifications", async (req, res) => {
        try {
          const storage = await getStorage();
          const qualifications = await storage.getAllQualifications();
          res.json(qualifications);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch qualifications" });
        }
      });

      app.get("/api/qualifications/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid qualification ID" });
          }

          const qualification = await storage.getQualification(id);
          if (!qualification) {
            return res.status(404).json({ message: "Qualification not found" });
          }

          res.json(qualification);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch qualification" });
        }
      });

      app.post("/api/qualifications", async (req, res) => {
        try {
          const storage = await getStorage();
          const newQualification = await storage.createQualification(req.body);
          res.status(201).json(newQualification);
        } catch (error) {
          res.status(500).json({ message: "Failed to create qualification" });
        }
      });

      app.put("/api/qualifications/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid qualification ID" });
          }

          const updatedQualification = await storage.updateQualification(id, req.body);
          if (!updatedQualification) {
            return res.status(404).json({ message: "Qualification not found" });
          }

          res.json(updatedQualification);
        } catch (error) {
          res.status(500).json({ message: "Failed to update qualification" });
        }
      });

      app.delete("/api/qualifications/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid qualification ID" });
          }

          const deleted = await storage.deleteQualification(id);
          if (!deleted) {
            return res.status(404).json({ message: "Qualification not found" });
          }

          res.json({ message: "Qualification deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to delete qualification" });
        }
      });

      // Positions/Roles routes
      app.get("/api/positions-roles", async (req, res) => {
        try {
          const storage = await getStorage();
          const positionsRoles = await storage.getAllPositionsRoles();
          res.json(positionsRoles);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch positions/roles" });
        }
      });

      app.get("/api/positions-roles/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid position/role ID" });
          }

          const positionRole = await storage.getPositionRole(id);
          if (!positionRole) {
            return res.status(404).json({ message: "Position/role not found" });
          }

          res.json(positionRole);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch position/role" });
        }
      });

      app.post("/api/positions-roles", async (req, res) => {
        try {
          const storage = await getStorage();
          const newPositionRole = await storage.createPositionRole(req.body);
          res.status(201).json(newPositionRole);
        } catch (error) {
          res.status(500).json({ message: "Failed to create position/role" });
        }
      });

      app.put("/api/positions-roles/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid position/role ID" });
          }

          const updatedPositionRole = await storage.updatePositionRole(id, req.body);
          if (!updatedPositionRole) {
            return res.status(404).json({ message: "Position/role not found" });
          }

          res.json(updatedPositionRole);
        } catch (error) {
          res.status(500).json({ message: "Failed to update position/role" });
        }
      });

      app.delete("/api/positions-roles/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid position/role ID" });
          }

          const deleted = await storage.deletePositionRole(id);
          if (!deleted) {
            return res.status(404).json({ message: "Position/role not found" });
          }

          res.json({ message: "Position/role deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to delete position/role" });
        }
      });

      // Tenders routes
      app.get("/api/tenders", async (req, res) => {
        try {
          const storage = await getStorage();
          const tenders = await storage.getAllTenders();
          res.json(tenders);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch tenders" });
        }
      });

      app.get("/api/tenders/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid tender ID" });
          }

          const tender = await storage.getTender(id);
          if (!tender) {
            return res.status(404).json({ message: "Tender not found" });
          }

          res.json(tender);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch tender" });
        }
      });

      app.post("/api/tenders", async (req, res) => {
        try {
          const storage = await getStorage();
          const newTender = await storage.createTender(req.body);
          res.status(201).json(newTender);
        } catch (error) {
          res.status(500).json({ message: "Failed to create tender" });
        }
      });

      app.put("/api/tenders/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid tender ID" });
          }

          const updatedTender = await storage.updateTender(id, req.body);
          if (!updatedTender) {
            return res.status(404).json({ message: "Tender not found" });
          }

          res.json(updatedTender);
        } catch (error) {
          res.status(500).json({ message: "Failed to update tender" });
        }
      });

      app.delete("/api/tenders/:id", async (req, res) => {
        try {
          const storage = await getStorage();
          const id = parseInt(req.params.id);
          if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid tender ID" });
          }

          const deleted = await storage.deleteTender(id);
          if (!deleted) {
            return res.status(404).json({ message: "Tender not found" });
          }

          res.json({ message: "Tender deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to delete tender" });
        }
      });

      // Test endpoint to verify function is working
      app.get("/api/test-version-history", async (req, res) => {
        res.json({ 
          message: "Version history routes are loaded", 
          timestamp: new Date().toISOString(),
          routesCount: 30
        });
      });

      routesInitialized = true;
      console.log('Netlify function routes initialized successfully - 31 total routes including version history');
    } catch (error) {
      console.error('Failed to initialize routes:', error);
    }
  }
};

// Create the serverless handler
const createHandler = () => {
  return async (event, context) => {
    await initializeApp();
    const handler = serverless(app);
    return handler(event, context);
  };
};

export const handler = createHandler();