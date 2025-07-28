const { Pool } = require('@neondatabase/serverless');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'alteram-cv-secret-key-2025';

// Use hardcoded database URL for consistency with deployed functions
const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || 'postgresql://neondb_owner:npg_JRUe57kuOgLz@ep-lucky-recipe-aes0pb5o-pooler.c-2.us-east-2.aws.neon.tech/neondb';

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Extract token from Authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    // Connect to database and get user details
    const pool = new Pool({ connectionString: DATABASE_URL });
    
    const userResult = await pool.query(
      'SELECT id, username, email, role, first_name, last_name, department, position, phone_number, is_active FROM user_profiles WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    const user = userResult.rows[0];
    
    // Return user data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        position: user.position,
        phoneNumber: user.phone_number,
        isActive: user.is_active
      }),
    };

  } catch (error) {
    console.error('Error in user function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Failed to get user data',
        error: error.message 
      }),
    };
  }
};