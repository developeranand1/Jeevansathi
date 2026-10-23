const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorResponse } = require('./utils/response');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Mount API routes
app.use('/api/v1', routes);
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 'NOT_FOUND', 404);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  return errorResponse(res, err.message || 'Internal Server Error', 'SERVER_ERROR', 500);
});

module.exports = app;
