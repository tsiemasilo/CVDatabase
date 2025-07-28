// Netlify Functions wrapper for Express app
import express from 'express';
import serverless from 'serverless-http';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple JWT-like authentication for serverless functions
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'netlify-secret-key-change-in-production';

// Authentication middleware for serverless
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('Auth header:', authHeader);
  console.log('Token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

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

          // Generate JWT token
          const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
          );
          
          res.json({ 
            ...user, 
            token 
          });
        } catch (error) {
          console.error("Login error:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      });

      app.post("/api/auth/logout", async (req, res) => {
        try {
          // For JWT, logout is handled client-side by removing the token
          res.json({ message: "Logged out successfully" });
        } catch (error) {
          console.error("Logout error:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      });

      app.get("/api/auth/user", authenticateToken, async (req, res) => {
        try {
          const storage = await getStorage();
          // Try to get user from user profiles first, then fall back to token data
          let user = await storage.getUserProfile(req.user.id);
          
          if (!user) {
            // If no user profile exists, create a basic user object from token data
            user = {
              id: req.user.id,
              username: req.user.username,
              role: req.user.role,
              firstName: req.user.firstName || req.user.username,
              lastName: req.user.lastName || '',
              email: req.user.email || '',
              department: req.user.department || '',
              position: req.user.position || ''
            };
          }
          
          res.json(user);
        } catch (error) {
          console.error("Get user error:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      });
      
      // CV Records routes - protected for authenticated users
      app.get("/api/cv-records", authenticateToken, async (req, res) => {
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

      app.get("/api/cv-records/:id", authenticateToken, async (req, res) => {
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
      app.post("/api/cv-records", authenticateToken, async (req, res) => {
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
      app.put("/api/cv-records/:id", authenticateToken, async (req, res) => {
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
      app.delete("/api/cv-records/:id", authenticateToken, async (req, res) => {
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
      app.get("/api/user-profiles", authenticateToken, async (req, res) => {
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

      routesInitialized = true;
      console.log('Netlify function routes initialized successfully');
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