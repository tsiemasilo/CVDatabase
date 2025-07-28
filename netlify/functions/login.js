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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    
    if (!username || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Username and password are required" })
      };
    }

    // Use real database only
    const result = await pool.query('SELECT * FROM user_profiles WHERE username = $1 AND password = $2', [username, password]);
    let user = null;
    if (result.rows.length > 0) {
      user = result.rows[0];
    }
    
    if (!user) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Invalid credentials" })
      };
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
      department: user.department,
      token: token
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(userData)
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: "Login failed", error: error.message })
    };
  }
};