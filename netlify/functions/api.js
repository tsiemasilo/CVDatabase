// Netlify Functions wrapper for Express app
import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes.js';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware for Netlify
app.use(session({
  secret: process.env.SESSION_SECRET || 'netlify-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize database and routes
(async () => {
  try {
    const { initializeDatabase } = await import('../../server/init-database.js');
    await initializeDatabase();
  } catch (error) {
    console.log('Database initialization skipped for Netlify functions');
  }
  
  await registerRoutes(app);
})();

export const handler = serverless(app);