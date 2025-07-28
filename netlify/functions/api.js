const express = require('express');
const serverless = require('serverless-http');
const crypto = require('crypto');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple JWT-like token generation for Netlify
const SECRET_KEY = process.env.SESSION_SECRET || 'netlify-secret-key-change-in-production';

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(token).digest('hex');
  return `${token}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  
  try {
    const [payload, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    
    if (signature !== expectedSignature) return null;
    
    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    if (Date.now() > data.exp) return null;
    
    return data;
  } catch (error) {
    return null;
  }
}

// In-memory storage for Netlify (since we can't use database connections reliably)
const mockData = {
  users: [
    { id: 1, username: 'admin', password: 'admin1', email: 'admin@alteram.co.za', role: 'Admin' },
    { id: 2, username: 'mng', password: 'mng1', email: 'manager@alteram.co.za', role: 'Manager' },
    { id: 3, username: 'user', password: 'user1', email: 'user@alteram.co.za', role: 'User' },
    { id: 4, username: 'tsiemasilo', password: 'tsie', email: 'tsiemasilo@alteram.co.za', role: 'User' }
  ],
  cvRecords: [
    {
      id: 1,
      name: "John",
      surname: "Doe",
      idPassport: "8901234567890",
      gender: "Male",
      email: "john.doe@example.com",
      phone: "+27123456789",
      position: "SAP ABAP Developer",
      roleTitle: "Senior ABAP Developer",
      department: "SAP",
      experience: 5,
      experienceInSimilarRole: 3,
      experienceWithITSMTools: 2,
      sapKLevel: "K3",
      qualifications: "Bachelor's degree in Computer Science",
      qualificationType: "Bachelor's degree",
      qualificationName: "Computer Science",
      instituteName: "University of Witwatersrand",
      yearCompleted: "2018",
      languages: "English, Afrikaans",
      workExperiences: JSON.stringify([
        {
          companyName: "Tech Solutions Ltd",
          position: "ABAP Developer",
          roleTitle: "Senior ABAP Developer",
          startDate: "01/2020",
          endDate: "12/2024",
          isCurrentRole: true
        }
      ]),
      certificateTypes: JSON.stringify([
        {
          department: "SAP",
          role: "SAP ABAP Developer",
          certificateName: "SAP ABAP Programming Certificate"
        }
      ]),
      status: "active",
      cvFile: "",
      submittedAt: new Date("2024-01-15T10:00:00Z")
    },
    {
      id: 2,
      name: "Jane",
      surname: "Smith",
      idPassport: "9012345678901",
      gender: "Female",
      email: "jane.smith@example.com",
      phone: "+27234567890",
      position: "Junior Developer",
      roleTitle: "Frontend Developer",
      department: "DEVELOPMENT",
      experience: 2,
      experienceInSimilarRole: 1,
      experienceWithITSMTools: 1,
      sapKLevel: "",
      qualifications: "Diploma in Information Technology",
      qualificationType: "Diploma",
      qualificationName: "Information Technology",
      instituteName: "Cape Peninsula University",
      yearCompleted: "2022",
      languages: "English, Xhosa",
      workExperiences: JSON.stringify([
        {
          companyName: "Web Design Co",
          position: "Junior Developer",
          roleTitle: "Frontend Developer",
          startDate: "03/2022",
          endDate: "12/2024",
          isCurrentRole: true
        }
      ]),
      certificateTypes: JSON.stringify([
        {
          department: "DEVELOPMENT",
          role: "Junior Developer",
          certificateName: "React Basics Certificate"
        }
      ]),
      status: "pending",
      cvFile: "",
      submittedAt: new Date("2024-02-20T14:30:00Z")
    },
    {
      id: 3,
      name: "David",
      surname: "Brown",
      idPassport: "7803154567890",
      gender: "Male",
      email: "david.brown@example.com",
      phone: "+27345678901",
      position: "SAP Consultant",
      roleTitle: "Senior SAP Consultant",
      department: "SAP",
      experience: 7,
      experienceInSimilarRole: 5,
      experienceWithITSMTools: 3,
      sapKLevel: "K4",
      qualifications: "Master's in Information Systems",
      qualificationType: "Master's degree",
      qualificationName: "Information Systems",
      instituteName: "University of Stellenbosch",
      yearCompleted: "2015",
      languages: "English, Afrikaans, German",
      workExperiences: JSON.stringify([
        {
          companyName: "SAP Solutions Inc",
          position: "SAP Consultant",
          roleTitle: "Senior SAP Consultant",
          startDate: "06/2018",
          endDate: "12/2024",
          isCurrentRole: true
        }
      ]),
      certificateTypes: JSON.stringify([
        {
          department: "SAP",
          role: "SAP Consultant",
          certificateName: "SAP Certified Application Associate"
        }
      ]),
      status: "active",
      cvFile: "",
      submittedAt: new Date("2024-03-10T09:15:00Z")
    },
    {
      id: 4,
      name: "Lisa",
      surname: "Wilson",
      idPassport: "8912075432109",
      gender: "Female",
      email: "lisa.wilson@example.com",
      phone: "+27456789012",
      position: "HR Specialist",
      roleTitle: "Senior HR Specialist",
      department: "HR",
      experience: 4,
      experienceInSimilarRole: 3,
      experienceWithITSMTools: 2,
      sapKLevel: "",
      qualifications: "Bachelor's in Human Resources",
      qualificationType: "Bachelor's degree",
      qualificationName: "Human Resources",
      instituteName: "University of Johannesburg",
      yearCompleted: "2020",
      languages: "English, Zulu, Sotho",
      workExperiences: JSON.stringify([
        {
          companyName: "People Solutions",
          position: "HR Specialist",
          roleTitle: "Senior HR Specialist",
          startDate: "02/2021",
          endDate: "12/2024",
          isCurrentRole: true
        }
      ]),
      certificateTypes: JSON.stringify([
        {
          department: "HR",
          role: "HR Specialist",
          certificateName: "SHRM-CP Certification"
        }
      ]),
      status: "archived",
      cvFile: "",
      submittedAt: new Date("2024-04-05T11:45:00Z")
    },
    {
      id: 5,
      name: "Michael",
      surname: "Taylor",
      idPassport: "9306142345678",
      gender: "Male", 
      email: "michael.taylor@example.com",
      phone: "+27567890123",
      position: "Service Desk Analyst",
      roleTitle: "Senior Service Desk Analyst",
      department: "SERVICE DESK",
      experience: 3,
      experienceInSimilarRole: 2,
      experienceWithITSMTools: 3,
      sapKLevel: "",
      qualifications: "Certificate in IT Support",
      qualificationType: "Certificate",
      qualificationName: "IT Support",
      instituteName: "CTI Education Group",
      yearCompleted: "2021",
      languages: "English, Afrikaans",
      workExperiences: JSON.stringify([
        {
          companyName: "TechSupport Co",
          position: "Service Desk Analyst",
          roleTitle: "Senior Service Desk Analyst",
          startDate: "01/2022",
          endDate: "12/2024",
          isCurrentRole: true
        }
      ]),
      certificateTypes: JSON.stringify([
        {
          department: "SERVICE DESK",
          role: "Service Desk Analyst",
          certificateName: "ITIL Foundation Certificate"
        }
      ]),
      status: "pending",
      cvFile: "",
      submittedAt: new Date("2024-05-12T16:20:00Z")
    }
  ]
};

// Authentication routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = mockData.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);
    
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.toLowerCase() // Ensure lowercase role for frontend compatibility
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

app.post("/api/auth/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

app.get("/api/auth/user", (req, res) => {
  // For compatibility, try session first, then token
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = verifyToken(token);
  
  if (user) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.toLowerCase() // Ensure lowercase role
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

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

// CV Records routes (no auth required for compatibility)
app.get("/api/cv-records", async (req, res) => {
  try {
    const { search, status, department, position } = req.query;
    
    let records = [...mockData.cvRecords];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      records = records.filter(record => 
        record.name.toLowerCase().includes(searchLower) ||
        (record.surname && record.surname.toLowerCase().includes(searchLower)) ||
        record.email.toLowerCase().includes(searchLower) ||
        (record.phone && record.phone.includes(search))
      );
    }
    
    if (status && status !== 'all') {
      records = records.filter(record => record.status === status);
    }
    
    if (department && department !== 'all') {
      records = records.filter(record => record.department === department);
    }
    
    if (position && position !== 'all') {
      records = records.filter(record => record.position === position);
    }
    
    res.json(records);
  } catch (error) {
    console.error("Error fetching CV records:", error);
    res.status(500).json({ message: "Failed to fetch CV records" });
  }
});

app.get("/api/cv-records/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const record = mockData.cvRecords.find(r => r.id === id);
    
    if (!record) {
      return res.status(404).json({ message: "CV record not found" });
    }
    
    res.json(record);
  } catch (error) {
    console.error("Error fetching CV record:", error);
    res.status(500).json({ message: "Failed to fetch CV record" });
  }
});

app.post("/api/cv-records", async (req, res) => {
  try {
    const newRecord = {
      id: Math.max(...mockData.cvRecords.map(r => r.id)) + 1,
      ...req.body,
      submittedAt: new Date()
    };
    
    mockData.cvRecords.push(newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating CV record:", error);
    res.status(500).json({ message: "Failed to create CV record" });
  }
});

app.put("/api/cv-records/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const recordIndex = mockData.cvRecords.findIndex(r => r.id === id);
    
    if (recordIndex === -1) {
      return res.status(404).json({ message: "CV record not found" });
    }
    
    mockData.cvRecords[recordIndex] = {
      ...mockData.cvRecords[recordIndex],
      ...req.body
    };
    
    res.json(mockData.cvRecords[recordIndex]);
  } catch (error) {
    console.error("Error updating CV record:", error);
    res.status(500).json({ message: "Failed to update CV record" });
  }
});

app.delete("/api/cv-records/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const recordIndex = mockData.cvRecords.findIndex(r => r.id === id);
    
    if (recordIndex === -1) {
      return res.status(404).json({ message: "CV record not found" });
    }
    
    mockData.cvRecords.splice(recordIndex, 1);
    res.json({ message: "CV record deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV record:", error);
    res.status(500).json({ message: "Failed to delete CV record" });
  }
});

// CSV Export route
app.get("/api/cv-records/export/csv", requireAuth, async (req, res) => {
  try {
    const { search, status, department, position } = req.query;
    
    let records = [...mockData.cvRecords];
    
    // Apply same filters as main query
    if (search) {
      const searchLower = search.toLowerCase();
      records = records.filter(record => 
        record.name.toLowerCase().includes(searchLower) ||
        (record.surname && record.surname.toLowerCase().includes(searchLower)) ||
        record.email.toLowerCase().includes(searchLower) ||
        (record.phone && record.phone.includes(search))
      );
    }
    
    if (status && status !== 'all') {
      records = records.filter(record => record.status === status);
    }
    
    if (department && department !== 'all') {
      records = records.filter(record => record.department === department);
    }
    
    if (position && position !== 'all') {
      records = records.filter(record => record.position === position);
    }
    
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
        `"${record.submittedAt.toISOString()}"`
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
app.get("/api/user-profiles", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    res.json(mockData.users.map(u => ({ ...u, password: undefined })));
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    res.status(500).json({ message: "Failed to fetch user profiles" });
  }
});

app.post("/api/user-profiles", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const newUser = {
      id: Math.max(...mockData.users.map(u => u.id)) + 1,
      ...req.body
    };
    
    mockData.users.push(newUser);
    res.status(201).json({ ...newUser, password: undefined });
  } catch (error) {
    console.error("Error creating user profile:", error);
    res.status(500).json({ message: "Failed to create user profile" });
  }
});

app.put("/api/user-profiles/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    const userIndex = mockData.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    
    mockData.users[userIndex] = {
      ...mockData.users[userIndex],
      ...req.body
    };
    
    res.json({ ...mockData.users[userIndex], password: undefined });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
});

app.delete("/api/user-profiles/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const id = parseInt(req.params.id);
    const userIndex = mockData.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    
    mockData.users.splice(userIndex, 1);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Netlify handler
exports.handler = serverless(app);