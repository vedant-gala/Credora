# Controllers, Middleware, Routes, Services, and Models: Understanding the Five-Tier Architecture

## Overview

In Express.js applications, Controllers, Middleware, Routes, Services, and Models work together to create a clean, maintainable, and scalable architecture. Understanding how these five components interact is crucial for building well-structured applications. This document explains the key differences, use cases, and how they work together.

## **Models**

### What are Models?
Models represent the data structure of your application and handle database operations. They define the schema, validation rules, and provide methods for data manipulation. Models act as the data layer abstraction, handling all database interactions and data validation.

### Key Characteristics
- **Purpose**: Define data structure and handle database operations
- **Execution**: Only runs when called by services
- **Function**: Data validation, database queries, schema definition
- **Flow**: Returns data or throws errors, no HTTP handling
- **Registration**: Imported and used in services
- **Separation of Concerns**: Keeps data layer separate from business logic
- **Reusability**: Can be used by multiple services

### Examples

#### Basic Model with Mongoose
```javascript
// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: 500
    },
    location: String
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields (computed properties)
userSchema.virtual('fullName').get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Instance methods
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

// Middleware (pre/post hooks)
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });

export const UserModel = mongoose.model('User', userSchema);
```

#### Model with Relationships
```javascript
// models/postModel.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Instance methods
postSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return this;
};

postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(id => !id.equals(userId));
  return this.save();
};

// Static methods
postSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
    .populate('author', 'name email')
    .sort({ publishedAt: -1 });
};

postSchema.statics.findByAuthor = function(authorId) {
  return this.find({ author: authorId })
    .populate('author', 'name email')
    .sort({ createdAt: -1 });
};

// Indexes
postSchema.index({ author: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ publishedAt: -1 });

export const PostModel = mongoose.model('Post', postSchema);
```

## **Services**

### What are Services?
Services are classes or modules that contain business logic, data access operations, and external API integrations. They act as an abstraction layer between controllers and models, handling complex business operations and data manipulation.

### Key Characteristics
- **Purpose**: Contain business logic, data access, and external integrations
- **Execution**: Only runs when called by controllers
- **Function**: Handles data operations, business rules, external API calls
- **Flow**: Returns data or throws errors, doesn't handle HTTP responses
- **Registration**: Imported and used in controllers
- **Separation of Concerns**: Keeps business logic separate from HTTP handling
- **Reusability**: Can be used by multiple controllers

### Examples

#### Basic Service with Models
```javascript
// services/userService.js
import { UserModel } from '../models/userModel.js';
import { hashPassword, comparePassword } from '../utils/auth.js';

export class UserService {
  // Get all users
  static async findAll() {
    try {
      return await UserModel.find({}).select('-password');
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  // Get user by ID
  static async findById(id) {
    try {
      const user = await UserModel.findById(id).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  // Create new user
  static async create(userData) {
    try {
      // Hash password before saving
      const hashedPassword = await hashPassword(userData.password);
      const user = new UserModel({
        ...userData,
        password: hashedPassword
      });
      
      const savedUser = await user.save();
      return savedUser.toPublicJSON();
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  // Update user
  static async update(id, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }
      
      const user = await UserModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        throw new Error('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
}
```

#### Service with External API Integration
```javascript
// services/paymentService.js
import axios from 'axios';
import { PaymentModel } from '../models/paymentModel.js';

export class PaymentService {
  static async processPayment(paymentData) {
    try {
      // Validate payment data
      if (!paymentData.amount || !paymentData.currency) {
        throw new Error('Invalid payment data');
      }

      // Call external payment gateway
      const paymentResponse = await axios.post(
        process.env.PAYMENT_GATEWAY_URL,
        {
          amount: paymentData.amount,
          currency: paymentData.currency,
          cardToken: paymentData.cardToken
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PAYMENT_GATEWAY_KEY}`
          }
        }
      );

      // Save payment record
      const payment = new PaymentModel({
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentResponse.data.status,
        transactionId: paymentResponse.data.transactionId,
        userId: paymentData.userId
      });

      await payment.save();

      return {
        success: true,
        transactionId: paymentResponse.data.transactionId,
        status: paymentResponse.data.status
      };
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  static async getPaymentHistory(userId) {
    try {
      return await PaymentModel.find({ userId })
        .sort({ createdAt: -1 })
        .select('-__v');
    } catch (error) {
      throw new Error('Failed to fetch payment history');
    }
  }
}
```

## **Controllers**

### What are Controllers?
Controllers are functions that handle HTTP requests and responses. They act as the bridge between routes and services, handling request validation, calling appropriate services, and formatting responses.

### Key Characteristics
- **Purpose**: Handle HTTP requests/responses and coordinate with services
- **Execution**: Only runs when called by route handlers
- **Function**: Validates requests, calls services, formats responses
- **Flow**: Calls services and sends HTTP responses, doesn't call `next()`
- **Registration**: Imported and used in route handlers
- **Separation of Concerns**: Keeps HTTP handling separate from business logic

### Examples

#### Basic Controller with Services
```javascript
// controllers/userController.js
import { UserService } from '../services/userService.js';

export const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await UserService.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);
      res.json({ success: true, data: user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Create new user
  createUser: async (req, res) => {
    try {
      const userData = req.body;
      const newUser = await UserService.create(userData);
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};
```

#### Controller with Multiple Services
```javascript
// controllers/orderController.js
import { OrderService } from '../services/orderService.js';
import { PaymentService } from '../services/paymentService.js';
import { InventoryService } from '../services/inventoryService.js';

export const orderController = {
  createOrder: async (req, res) => {
    try {
      const { items, paymentData, userId } = req.body;

      // Check inventory
      const inventoryCheck = await InventoryService.checkAvailability(items);
      if (!inventoryCheck.available) {
        return res.status(400).json({ 
          success: false, 
          error: 'Some items are out of stock' 
        });
      }

      // Process payment
      const payment = await PaymentService.processPayment(paymentData);

      // Create order
      const order = await OrderService.create({
        items,
        userId,
        paymentId: payment.transactionId,
        total: inventoryCheck.total
      });

      // Update inventory
      await InventoryService.updateStock(items);

      res.status(201).json({ 
        success: true, 
        data: { order, payment } 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
```

## **Middleware**

### What is Middleware?
Middleware functions are functions that process requests before they reach their final destination. They act as a pipeline that every request flows through.

### Key Characteristics
- **Purpose**: Process and modify requests/responses before they reach route handlers
- **Execution**: Runs on **every request** (or requests matching a specific path pattern)
- **Function**: Can modify the request/response objects, perform validation, logging, authentication, etc.
- **Flow**: Always calls `next()` to pass control to the next middleware/route handler
- **Registration**: Uses `app.use()` method

### Examples

#### Global Middleware
```javascript
// Runs on every single request
app.use(express.json()); // Parses JSON bodies
app.use(cors()); // Handles CORS
app.use(express.static('public')); // Serves static files
```

#### Path-Specific Middleware
```javascript
// Only runs for requests starting with /api
app.use('/api', (req, res, next) => {
  console.log('API request logged');
  next(); // Must call next() to continue
});

// Authentication middleware for admin routes
app.use('/admin', authMiddleware);
```

#### Multiple Middleware Functions
```javascript
app.use('/api', 
  cors(),
  express.json(),
  (req, res, next) => {
    req.timestamp = new Date();
    next();
  }
);
```

## **Routes**

### What are Routes?
Routes are specific handlers for HTTP requests that match particular HTTP methods and URL paths. They act as the bridge between HTTP requests and controllers, handling the routing logic and calling appropriate controller methods.

### Key Characteristics
- **Purpose**: Handle specific HTTP requests to specific endpoints and delegate to controllers
- **Execution**: Only runs when a request matches the **exact HTTP method and path**
- **Function**: Routes requests to appropriate controller methods
- **Flow**: Calls controller methods and handles basic routing logic
- **Registration**: Uses `app.get()`, `app.post()`, `app.put()`, `app.delete()`, etc.

### Examples

#### Basic Route Handlers with Controllers
```javascript
// routes/userRoutes.js
import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET route - only runs for GET requests to /users
router.get('/', userController.getAllUsers);

// GET route with parameters
router.get('/:id', userController.getUserById);

// POST route - only runs for POST requests to /users
router.post('/', userController.createUser);

// Protected routes using middleware
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;
```

#### Route with Multiple Middleware
```javascript
// routes/adminRoutes.js
import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware, rateLimitMiddleware } from '../middleware/index.js';

const router = express.Router();

// Multiple middleware: auth, admin check, rate limiting
router.get('/dashboard', 
  authMiddleware, 
  adminMiddleware, 
  rateLimitMiddleware,
  adminController.getDashboard
);

export default router;
```

## **Five-Tier Architecture Flow**

### Request Flow
```
Request → Middleware → Route → Controller → Service → Model → Response
```

### Practical Example
```javascript
// app.js - Main application setup
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

// 1. Global middleware
app.use(express.json());
app.use(cors());

// 2. Route registration
app.use('/api/users', userRoutes);

// 3. Error handling middleware (last)
app.use(errorHandler);

// routes/userRoutes.js
import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route with middleware and controller
router.get('/:id', authMiddleware, userController.getUserById);

export default router;

// controllers/userController.js
import { UserService } from '../services/userService.js';

export const userController = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// services/userService.js
import { UserModel } from '../models/userModel.js';

export class UserService {
  static async findById(id) {
    try {
      const user = await UserModel.findById(id).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }
}

// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }
});

export const UserModel = mongoose.model('User', userSchema);
```

## **Key Differences Summary**

| Aspect | Models | Services | Controllers | Middleware | Routes |
|--------|--------|----------|-------------|------------|---------|
| **When it runs** | When called by services | When called by controllers | When called by routes | Every request (or pattern match) | Specific HTTP method + path match |
| **Purpose** | Data structure and database operations | Business logic and data access | HTTP handling and service coordination | Process/modify request | Route requests to controllers |
| **Response** | Returns data or throws errors | Returns data or throws errors | Sends HTTP response | Usually calls `next()` | Delegates to controllers |
| **Registration** | Imported in services | Imported in controllers | Imported in routes | `app.use()` | `app.get()`, `app.post()`, etc. |
| **Order** | Last in chain | Second to last | Third to last | First in chain | Middle of chain |
| **Reusability** | Can be used by multiple services | Can be called by multiple controllers | Can be called by multiple routes | Can be applied to multiple routes | Specific to one endpoint pattern |
| **Modification** | No access to req/res | No access to req/res | Reads from req, writes to res | Can modify req and res objects | Typically just passes through |
| **Business Logic** | No business logic | Contains core business logic | Minimal business logic | No business logic | No business logic |
| **Data Access** | Direct database operations | Orchestrates data access | No direct data access | No data access | No data access |
| **Validation** | Schema validation | Business rule validation | Request validation | Input validation | No validation |

## **How They Work Together**

### Complete Example
```javascript
// app.js - Main application setup
import express from 'express';
import userRoutes from './routes/userRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

// 1. Global middleware
app.use(express.json());
app.use(cors());

// 2. Route registration
app.use('/api/users', userRoutes);

// 3. Error handling middleware (last)
app.use(errorHandler);

// routes/userRoutes.js
import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route with middleware and controller
router.get('/:id', authMiddleware, userController.getUserById);

export default router;

// controllers/userController.js
import { UserService } from '../services/userService.js';

export const userController = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// services/userService.js
import { UserModel } from '../models/userModel.js';

export class UserService {
  static async findById(id) {
    try {
      const user = await UserModel.findById(id).select('-password');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }
}

// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }
});

export const UserModel = mongoose.model('User', userSchema);
```

## **Common Use Cases**

### Models Use Cases
- **Data Structure**: Define database schemas and relationships
- **Data Validation**: Enforce data integrity and business rules
- **Database Operations**: CRUD operations and complex queries
- **Data Transformation**: Format data for different use cases
- **Indexing**: Optimize database performance
- **Middleware**: Pre/post save hooks and data processing
- **Virtual Fields**: Computed properties and derived data

### Services Use Cases
- **Business Logic**: Core application business rules and operations
- **Data Access**: Orchestrate model operations and external APIs
- **External APIs**: Third-party service integrations
- **Data Processing**: Complex data transformations and calculations
- **Caching**: Data caching and optimization
- **Validation**: Business rule validation
- **File Operations**: File processing and management

### Controllers Use Cases
- **HTTP Handling**: Request/response management
- **Service Coordination**: Orchestrating multiple service calls
- **Input Validation**: Request data validation
- **Response Formatting**: Consistent API response structure
- **Error Handling**: HTTP error responses
- **Authentication**: User session management

### Middleware Use Cases
- **Body parsing**: `express.json()`, `express.urlencoded()`
- **Authentication**: Checking JWT tokens, session validation
- **Logging**: Request logging, performance monitoring
- **CORS**: Cross-origin resource sharing
- **Static files**: Serving CSS, images, client-side files
- **Error handling**: Global error processing
- **Rate limiting**: API throttling
- **Compression**: Gzip compression

### Route Use Cases
- **HTTP Method Handling**: GET, POST, PUT, DELETE operations
- **Path Matching**: URL pattern matching and parameter extraction
- **Middleware Application**: Applying specific middleware to routes
- **Controller Delegation**: Routing requests to appropriate controllers
- **API Versioning**: Managing different API versions

## **Best Practices**

### Models
1. **Schema Design**: Design clear, normalized schemas
2. **Validation**: Use built-in and custom validators
3. **Indexing**: Create appropriate indexes for performance
4. **Middleware**: Use pre/post hooks for data processing
5. **Methods**: Add instance and static methods for common operations
6. **Relationships**: Define clear relationships between models

### Services
1. **Single Responsibility**: Each service should handle one domain
2. **Error Handling**: Use proper error handling and custom error types
3. **Data Validation**: Validate data before processing
4. **Transaction Management**: Handle database transactions properly
5. **Caching**: Implement appropriate caching strategies
6. **Testing**: Make services easily testable

### Controllers
1. **Thin Controllers**: Keep controllers thin, delegate to services
2. **Error Handling**: Use try-catch blocks and proper error responses
3. **Response Consistency**: Use consistent response formats
4. **Input Validation**: Validate request data before processing
5. **Service Coordination**: Coordinate multiple service calls when needed

### Middleware
1. **Order matters**: Register middleware before routes
2. **Always call `next()`**: Unless you want to end the request
3. **Error handling**: Use 4-parameter middleware for errors
4. **Reusability**: Create modular middleware functions
5. **Performance**: Keep middleware lightweight

### Routes
1. **Specific paths**: Use exact path matching
2. **HTTP methods**: Choose appropriate methods (GET, POST, PUT, DELETE)
3. **Controller delegation**: Keep routes thin, delegate to controllers
4. **Middleware application**: Apply appropriate middleware per route
5. **Organization**: Group related routes together

## **Common Mistakes to Avoid**

### Model Mistakes
- Putting business logic in models
- Not defining proper indexes
- Over-complicating schemas
- Not using validation
- Mixing concerns with other layers

### Service Mistakes
- Putting HTTP logic in services
- Not handling errors properly
- Mixing business logic with data access
- Not implementing proper validation
- Making services too large and complex

### Controller Mistakes
- Putting business logic in controllers
- Not handling errors properly
- Mixing data access with HTTP handling
- Inconsistent response formats
- Not validating input data

### Middleware Mistakes
- Forgetting to call `next()`
- Registering middleware after routes
- Not handling errors properly
- Making middleware too heavy

### Route Mistakes
- Putting business logic in routes
- Not delegating to controllers
- Ignoring HTTP status codes
- Not applying appropriate middleware

---

*Understanding the five-tier architecture of Models, Services, Controllers, Middleware, and Routes is fundamental to building scalable, maintainable, and well-structured Express.js applications.*
