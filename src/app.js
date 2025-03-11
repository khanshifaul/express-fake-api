import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import securityHeaders from "./middleware/security.js";
import routes from "./routes/index.js";

const app = express();

// Basic middleware stack
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(securityHeaders);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the E-Commerce API",
    documentation: `${req.protocol}://${req.get("host")}/docs`,
    status: "operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API documentation
app.get("/docs", (req, res) => {
  res.json({
    documentation: {
      introduction: "Welcome to the E-Commerce API Documentation",
      authentication: {
        note: "All endpoints require authentication unless marked as public",
        method: "Bearer Token",
        header: "Authorization: Bearer <token>",
        status: "TODO: Implement authentication", // Update when auth is added
      },
      baseUrl: `${req.protocol}://${req.get("host")}/api`,
      version: "1.0.0",
      resources: {
        users: {
          endpoints: [
            {
              method: "GET",
              path: "/users",
              description: "Get all users",
              parameters: [],
              exampleResponse: {
                success: true,
                count: 2,
                data: [
                  { id: 1, name: "John Doe" },
                  { id: 2, name: "Jane Smith" },
                ],
              },
            },
            {
              method: "POST",
              path: "/users",
              description: "Create new user",
              parameters: [
                { name: "name", type: "string", required: true },
                { name: "email", type: "string", required: true },
                { name: "password", type: "string", required: true },
              ],
              exampleRequest: {
                name: "Alice Johnson",
                email: "alice@example.com",
                password: "securePassword123",
              },
            },
          ],
        },
        products: {
          endpoints: [
            {
              method: "GET",
              path: "/products",
              description: "Get all products",
              parameters: [
                { name: "page", type: "number", required: false },
                { name: "limit", type: "number", required: false },
              ],
            },
            {
              method: "POST",
              path: "/products",
              description: "Create new product",
              requiresAuth: true,
              parameters: [
                { name: "name", type: "string", required: true },
                { name: "price", type: "number", required: true },
                { name: "category", type: "string", required: true },
              ],
            },
          ],
        },
        categories: {
          endpoints: [
            {
              method: "GET",
              path: "/categories",
              description: "Get all categories with subcategories",
            },
            {
              method: "POST",
              path: "/categories",
              description: "Create new category",
              adminOnly: true,
            },
          ],
        },
      },
      errorResponses: [
        {
          status: 400,
          description: "Bad Request - Invalid input data",
          example: {
            success: false,
            error: "Invalid email format",
          },
        },
        {
          status: 404,
          description: "Not Found - Resource not found",
          example: {
            success: false,
            error: "Product with id 5 not found",
          },
        },
        {
          status: 500,
          description: "Server Error - Internal server error",
          example: {
            success: false,
            error: "Database connection failed",
          },
        },
      ],
      gettingStarted: {
        exampleRequest: "curl -X GET http://localhost:3000/api/products",
        rateLimiting: {
          note: "100 requests per minute per IP address",
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "99",
            "X-RateLimit-Reset": "1626547890",
          },
        },
      },
      support: {
        contact: "khanshifaul@gmail.com",
        repository: "https://github.com/khanshifaul",
      },
      lastUpdated: "2024-06-20T14:30:00Z",
    },
  });
});

// API routes
app.use("/api", routes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Error handling (should be last middleware)
app.use(errorHandler);

export default app;
