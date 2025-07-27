// Netlify Functions wrapper for Express app
import express from 'express';
import serverless from 'serverless-http';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes immediately without complex imports
const initializeApp = async () => {
  try {
    // Simple test route first
    app.get('/api/test', (req, res) => {
      res.json({ 
        message: 'API is working', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Import storage and setup CV routes
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-serverless');
    const ws = await import('ws');
    const schema = await import('../../shared/schema.js');
    const { eq } = await import('drizzle-orm');
    
    neonConfig.webSocketConstructor = ws.default;
    
    const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL must be set');
    }
    
    const pool = new Pool({ connectionString: DATABASE_URL });
    const db = drizzle({ client: pool, schema: schema });

    // Simple database storage class
    class SimpleStorage {
      async getCVRecord(id) {
        const [record] = await db.select().from(schema.cvRecords).where(eq(schema.cvRecords.id, id));
        return record;
      }
      
      async getAllCVRecords() {
        return await db.select().from(schema.cvRecords);
      }
      
      async createCVRecord(data) {
        const [record] = await db.insert(schema.cvRecords).values(data).returning();
        return record;
      }
    }
    
    const storage = new SimpleStorage();
      
    // Authentication routes (simplified for now)
    app.post("/api/auth/login", async (req, res) => {
      res.status(501).json({ message: "Auth not implemented in serverless yet" });
    });

    app.get("/api/auth/user", async (req, res) => {
      res.status(401).json({ message: "Not authenticated" });
    });
    
    // CV Records routes
    app.get("/api/cv-records", async (req, res) => {
      try {
        const records = await storage.getAllCVRecords();
        res.json(records);
      } catch (error) {
        console.error("CV records error:", error);
        res.status(500).json({ message: "Failed to fetch CV records", error: error.message });
      }
    });

    app.get("/api/cv-records/:id", async (req, res) => {
      try {
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
        console.error("CV record fetch error:", error);
        res.status(500).json({ message: "Failed to fetch CV record", error: error.message });
      }
    });

    // Create a new CV record
    app.post("/api/cv-records", async (req, res) => {
      try {
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

    
    console.log('Simplified Netlify function routes initialized successfully');
  } catch (error) {
    console.error('Failed to initialize routes:', error);
    // Add a fallback error route
    app.get('/api/*', (req, res) => {
      res.status(500).json({ 
        message: 'API initialization failed', 
        error: error.message,
        path: req.path
      });
    });
  }
};

// Initialize the app immediately
initializeApp();

// Create the serverless handler
export const handler = serverless(app);