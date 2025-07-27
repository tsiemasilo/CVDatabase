// Simple CV Records API function for Netlify
export const handler = async (event, context) => {
  const { httpMethod, path, queryStringParameters, body } = event;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Import database modules
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-serverless');
    const { eq } = await import('drizzle-orm');
    const ws = await import('ws');
    
    // Import schema
    const schema = await import('../../shared/schema.js');
    
    neonConfig.webSocketConstructor = ws.default;
    
    const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment');
    }
    
    const pool = new Pool({ connectionString: DATABASE_URL });
    const db = drizzle({ client: pool, schema: schema });
    
    // Parse the path to get ID if present
    const pathParts = path.split('/');
    const id = pathParts[pathParts.length - 1];
    const isGetById = !isNaN(parseInt(id));
    
    switch (httpMethod) {
      case 'GET':
        if (isGetById) {
          // Get specific CV record
          const recordId = parseInt(id);
          const [record] = await db.select().from(schema.cvRecords).where(eq(schema.cvRecords.id, recordId));
          
          if (!record) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'CV record not found' })
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(record)
          };
        } else {
          // Get all CV records
          const records = await db.select().from(schema.cvRecords);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(records)
          };
        }
        
      case 'POST':
        // Create new CV record
        const formData = JSON.parse(body);
        
        // Convert experience fields to numbers
        if (formData.experience) formData.experience = parseInt(formData.experience);
        if (formData.experienceInSimilarRole) formData.experienceInSimilarRole = parseInt(formData.experienceInSimilarRole);
        if (formData.experienceWithITSMTools) formData.experienceWithITSMTools = parseInt(formData.experienceWithITSMTools);
        
        const [newRecord] = await db.insert(schema.cvRecords).values(formData).returning();
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newRecord)
        };
        
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
    
  } catch (error) {
    console.error('CV Records API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message,
        path: path,
        method: httpMethod
      })
    };
  }
};