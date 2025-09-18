// tests/middleware/errorHandler.test.js
const request = require('supertest');
const express = require('express');
const { errorHandler, notFound, asyncHandler } = require('../../middleware/errorHandler');

// App de test
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Route de test qui lance une erreur
  app.get('/test-error', (req, res, next) => {
    const error = new Error('Test error');
    error.statusCode = 400;
    next(error);
  });

  // Route de test avec asyncHandler
  app.get('/test-async', asyncHandler(async (req, res) => {
    throw new Error('Async error');
  }));

  // Route de test pour erreur JWT
  app.get('/test-jwt', (req, res, next) => {
    const error = new Error('jwt malformed');
    error.name = 'JsonWebTokenError';
    next(error);
  });

  // Route de test pour erreur MongoDB
  app.get('/test-cast', (req, res, next) => {
    const error = new Error('Cast to ObjectId failed');
    error.name = 'CastError';
    next(error);
  });

  // Middlewares d'erreur
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

describe('ErrorHandler Middleware', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('errorHandler', () => {
    it('should handle custom errors with status code', async () => {
      const response = await request(app)
        .get('/test-error')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Test error');
    });

    it('should handle async errors', async () => {
      const response = await request(app)
        .get('/test-async')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should handle JWT errors', async () => {
      const response = await request(app)
        .get('/test-jwt')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Token invalide');
    });

    it('should handle MongoDB CastError', async () => {
      const response = await request(app)
        .get('/test-cast')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('ID invalide');
    });
  });

  describe('notFound', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Route /unknown-route non trouvée');
    });
  });

  describe('asyncHandler', () => {
    it('should catch async errors and pass to error handler', async () => {
      const testFunction = asyncHandler(async (req, res, next) => {
        throw new Error('Async test error');
      });

      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      await testFunction(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockNext.mock.calls[0][0].message).toBe('Async test error');
    });

    it('should call next on successful async function', async () => {
      const testFunction = asyncHandler(async (req, res, next) => {
        res.json({ success: true });
      });

      const mockReq = {};
      const mockRes = {
        json: jest.fn()
      };
      const mockNext = jest.fn();

      await testFunction(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });
  });
});