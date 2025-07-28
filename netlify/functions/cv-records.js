import jwt from 'jsonwebtoken';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon for serverless environment
neonConfig.webSocketConstructor = ws;

// Database connection - use specific database
const pool = new Pool({ 
  connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JRUe57kuOgLz@ep-lucky-recipe-aes0pb5o-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

const JWT_SECRET = process.env.JWT_SECRET || 'alteram-cv-secret-key-2025';

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    };
  }

  // Check authentication
  const token = event.headers.authorization?.replace('Bearer ', '');
  const user = verifyToken(token);
  
  if (!user) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: "Authentication required" })
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Get all CV records from database using exact column names from schema
      const result = await pool.query(`
        SELECT id, name, surname, email, phone, department, position, 
               role_title as "roleTitle", sap_k_level as "sapKLevel", experience, 
               status, cv_file, submitted_at, id_passport as "idPassport", 
               languages, qualifications, work_experiences as "workExperiences", 
               certificate_types as certificates, experience_similar_role as "experienceInSimilarRole", 
               experience_itsm_tools as "experienceWithITSMTools", institute_name as "instituteName",
               year_completed as "yearCompleted"
        FROM cv_records 
        ORDER BY submitted_at DESC
      `);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result.rows)
      };
    }

    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('CV records error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: "Failed to fetch CV records", error: error.message })
    };
  }
};