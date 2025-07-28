import express from 'express';
import serverless from 'serverless-http';
import jwt from 'jsonwebtoken';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Create Express app
const app = express();

// Configure Neon for serverless environment
neonConfig.webSocketConstructor = ws;

// Database connection - force database usage
const pool = new Pool({ 
  connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JRUe57kuOgLz@ep-lucky-recipe-aes0pb5o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// JWT functions
const JWT_SECRET = process.env.JWT_SECRET || 'alteram-cv-secret-key-2025';

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role.toLowerCase(),
      email: user.email 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = verifyToken(token);
  
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  req.user = user;
  next();
};

// Root path for health check
app.get('/', (req, res) => {
  res.json({ status: "OK", message: "CV Database API", timestamp: new Date().toISOString() });
});

// Authentication login
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Use real database only
    const result = await pool.query('SELECT * FROM user_profiles WHERE username = $1 AND password = $2', [username, password]);
    let user = null;
    if (result.rows.length > 0) {
      user = result.rows[0];
    }
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);
    
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.toLowerCase(),
      firstName: user.firstName || user.firstname,
      lastName: user.lastName || user.lastname,
      department: user.department
    };

    res.json({
      user: userData,
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Authentication logout
app.post('/auth/logout', (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// Get current user
app.get('/auth/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = verifyToken(token);
    
    if (user) {
      // Get user from database
      const result = await pool.query('SELECT * FROM user_profiles WHERE username = $1', [user.username]);
      if (result.rows.length > 0) {
        const dbUser = result.rows[0];
        return res.json({
          id: dbUser.id,
          username: dbUser.username,
          email: dbUser.email,
          role: dbUser.role.toLowerCase(),
          firstName: dbUser.firstName || dbUser.firstname,
          lastName: dbUser.lastName || dbUser.lastname,
          department: dbUser.department
        });
      }
      
      // If user not found in database, return error
      res.status(401).json({ message: "User not found in database" });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    console.error("Auth user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all CV records
app.get('/cv-records', async (req, res) => {
  try {
    const { search, status, department, position } = req.query;
    
    // Use real database only
    let query = 'SELECT * FROM cv_records';
    let params = [];
    let conditions = [];
    
    if (search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR surname ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (status && status !== 'all') {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (department && department !== 'all') {
      conditions.push(`department = $${params.length + 1}`);
      params.push(department);
    }
    
    if (position && position !== 'all') {
      conditions.push(`position = $${params.length + 1}`);
      params.push(position);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY id DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching CV records:", error);
    res.status(500).json({ message: "Failed to fetch CV records" });
  }
});

// Get specific CV record
app.get('/cv-records/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Use real database only
    const result = await pool.query('SELECT * FROM cv_records WHERE id = $1', [id]);
    const record = result.rows[0];
    
    if (!record) {
      return res.status(404).json({ message: "CV record not found" });
    }
    
    res.json(record);
  } catch (error) {
    console.error("Error fetching CV record:", error);
    res.status(500).json({ message: "Failed to fetch CV record" });
  }
});

// Create new CV record
app.post('/cv-records', async (req, res) => {
  try {
    // Use real database only
    const {
      name, surname, idPassport, gender, email, phone, position, roleTitle, 
      department, experience, experienceInSimilarRole, experienceWithITSMTools,
      sapKLevel, qualifications, qualificationType, qualificationName, 
      instituteName, yearCompleted, languages, workExperiences, 
      certificateTypes, status, cvFile
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO cv_records (
        name, surname, id_passport, gender, email, phone, position, role_title,
        department, experience, experience_in_similar_role, experience_with_itsm_tools,
        sap_k_level, qualifications, qualification_type, qualification_name,
        institute_name, year_completed, languages, work_experiences,
        certificate_types, status, cv_file, submitted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24
      ) RETURNING *
    `, [
      name, surname, idPassport, gender, email, phone, position, roleTitle,
      department, experience, experienceInSimilarRole, experienceWithITSMTools,
      sapKLevel, qualifications, qualificationType, qualificationName,
      instituteName, yearCompleted, languages, workExperiences,
      certificateTypes, status || 'pending', cvFile || '', new Date()
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating CV record:", error);
    res.status(500).json({ message: "Failed to create CV record" });
  }
});

// Update CV record
app.put('/cv-records/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const result = await pool.query(`
      UPDATE cv_records SET 
        name = $1, surname = $2, email = $3, phone = $4, position = $5,
        department = $6, experience = $7, status = $8
      WHERE id = $9 RETURNING *
    `, [
      req.body.name, req.body.surname, req.body.email, req.body.phone,
      req.body.position, req.body.department, req.body.experience,
      req.body.status, id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "CV record not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating CV record:", error);
    res.status(500).json({ message: "Failed to update CV record" });
  }
});

// Delete CV record
app.delete('/cv-records/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const result = await pool.query('DELETE FROM cv_records WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "CV record not found" });
    }
    
    res.json({ message: "CV record deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV record:", error);
    res.status(500).json({ message: "Failed to delete CV record" });
  }
});

// CSV Export
app.get('/cv-records/export/csv', requireAuth, async (req, res) => {
  try {
    const { search, status, department, position } = req.query;
    
    // Use same database query logic as main GET route
    let query = 'SELECT * FROM cv_records';
    let params = [];
    let conditions = [];
    
    if (search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR surname ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (status && status !== 'all') {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (department && department !== 'all') {
      conditions.push(`department = $${params.length + 1}`);
      params.push(department);
    }
    
    if (position && position !== 'all') {
      conditions.push(`position = $${params.length + 1}`);
      params.push(position);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY id DESC';
    
    const result = await pool.query(query, params);
    const records = result.rows;
    
    // Generate CSV
    const headers = [
      'ID', 'Name', 'Surname', 'Email', 'Phone', 'Position', 'Department', 
      'Experience', 'Status', 'Qualifications', 'Languages', 'Submitted At'
    ];
    
    const csvRows = [headers.join(',')];
    
    records.forEach(record => {
      const row = [
        record.id,
        `"${record.name}"`,
        `"${record.surname || ''}"`,
        `"${record.email}"`,
        `"${record.phone || ''}"`,
        `"${record.position}"`,
        `"${record.department || ''}"`,
        record.experience || 0,
        `"${record.status}"`,
        `"${record.qualifications || ''}"`,
        `"${record.languages || ''}"`,
        `"${new Date(record.submitted_at).toISOString()}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="cv-records.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ message: "Failed to export CSV" });
  }
});

// User Profiles routes (Admin only)
app.get('/user-profiles', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    // Use real database only
    const result = await pool.query('SELECT * FROM user_profiles ORDER BY id');
    const profiles = result.rows.map(u => ({ ...u, password: undefined }));
    
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    res.status(500).json({ message: "Failed to fetch user profiles" });
  }
});

// Create user profile
app.post('/user-profiles', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const { username, email, password, role, firstName, lastName, department } = req.body;
    
    const result = await pool.query(`
      INSERT INTO user_profiles (username, email, password, role, firstName, lastName, department)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [username, email, password, role, firstName, lastName, department]);
    
    const newUser = result.rows[0];
    res.status(201).json({ ...newUser, password: undefined });
  } catch (error) {
    console.error("Error creating user profile:", error);
    res.status(500).json({ message: "Failed to create user profile" });
  }
});

// Update user profile
app.put('/user-profiles/:id', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    const { username, email, password, role, firstName, lastName, department } = req.body;
    
    const result = await pool.query(`
      UPDATE user_profiles SET 
        username = $1, email = $2, password = $3, role = $4, 
        firstName = $5, lastName = $6, department = $7
      WHERE id = $8 RETURNING *
    `, [username, email, password, role, firstName, lastName, department, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ ...result.rows[0], password: undefined });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
});

// Delete user profile
app.delete('/user-profiles/:id', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    
    const result = await pool.query('DELETE FROM user_profiles WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Handle 404 for unmatched routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Netlify handler
export const handler = serverless(app);