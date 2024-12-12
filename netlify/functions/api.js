import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import userRoutes from '../../server/routes/users.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // This will be automatically handled by Netlify
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/.netlify/functions/api/users', userRoutes);

// Health check endpoint
app.get('/.netlify/functions/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV, 
    projectId: process.env.FIREBASE_PROJECT_ID 
  });
});

// Export the handler
export const handler = serverless(app);
