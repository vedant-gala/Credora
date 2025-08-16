# Credora Backend Development Plan

## Overview

This document outlines the tentative plan for building the Credora backend application, focusing on credit card reward optimization and transaction management.

## **Step 1: Core Models (Data Entities)**

### Essential Models

We'll definitely need these core models:

#### **User Model**
- `id` - Unique identifier
- `name` - User's full name
- `email` - User's email address
- `password` - Hashed password for authentication
- `settings` - User preferences and settings
- Additional user-related fields

#### **Card Model**
- `id` - Unique identifier
- `userId` - Foreign key to User model
- `cardName` - Name given to the card
- `bank` - Bank that issued the card
- `last4Digits` - Last 4 digits of the card
- `expiryMonth/year` - Card expiration date
- `type` - Credit or debit card
- `status` - Active or inactive status

#### **RewardRule Model**
- `id` - Unique identifier
- `cardId` - Foreign key to Card model
- `rewardType` - Type of reward (cashback, points, lounge access, discount)
- `categoryId` - Foreign key to RewardCategory model
- `conditions` - JSON field for conditions (min spend, merchant, time period)
- `rewardRate` - Rate at which rewards are earned

#### **RewardCategory Model**
- `id` - Unique identifier
- `name` - Category name (fuel, travel, dining, ecommerce, etc.)

#### **Merchant Model**
- `id` - Unique identifier
- `name` - Merchant name
- `categoryId` - Foreign key to RewardCategory model

#### **Transaction Model**
- `id` - Unique identifier
- `userId` - Foreign key to User model
- `cardId` - Foreign key to Card model
- `merchantId` - Foreign key to Merchant model
- `amount` - Transaction amount
- `timestamp` - When the transaction occurred
- `rawSmsRef` - Reference to parsed SMS (if applicable)
- `status` - Transaction status

#### **RewardCalculation/GoalProgress Model**
- `transactionId` - Foreign key to Transaction model
- `rewardEarned` - Actual reward earned
- `rewardGoal` - Target reward goal
- `progressSoFar` - Progress towards the goal
- `thresholdMet` - Boolean indicating if threshold was met

> **Note:** We may later add Budget, ExpenseCategory, Offer, etc. when we move into full expense tracking.

## **Step 2: Services vs Controllers**

### **Controllers**
- Handle HTTP request/response
- Perform input validation
- Call appropriate services
- Format responses

**Example:**
```javascript
// cardController.addCard(req, res) extracts data, validates, 
// and calls cardService.addCard(userId, cardData)
```

### **Services**
Contain core business logic:

- **Reward Optimization**: Determine best card for purchase
- **SMS Parsing**: Parse SMS into transactions
- **Reward Calculation**: Calculate cumulative rewards
- **Condition Handling**: Handle reward conditions (e.g., "spend ₹5000 in a month to unlock bonus")

## **Step 3: Suggested Routes, Controllers, Services**

### **Authentication**
**Routes:**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

**Components:**
- **Controller**: `authController`
- **Service**: `authService` (JWT tokens, password hashing)

### **Users**
**Routes:**
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile

**Components:**
- **Controller**: `userController`
- **Service**: `userService`

### **Cards**
**Routes:**
- `POST /cards` - Add new card
- `DELETE /cards/:id` - Delete card
- `GET /cards` - List all cards
- `GET /cards/:id` - Get card details

**Components:**
- **Controller**: `cardController`
- **Service**: `cardService`

### **Reward Rules**
**Routes:**
- `POST /cards/:cardId/rewards` - Add reward rule to card
- `GET /cards/:cardId/rewards` - Get reward rules for card
- `PUT /rewards/:id` - Update reward rule
- `DELETE /rewards/:id` - Delete reward rule

**Components:**
- **Controller**: `rewardController`
- **Service**: `rewardService`

### **Transactions**
**Routes:**
- `POST /transactions` - Manual transaction entry
- `GET /transactions` - Filter transactions (month/category/card)
- `GET /transactions/:id` - Get transaction details

**Components:**
- **Controller**: `transactionController`
- **Service**: `transactionService` (handles storing, linking merchants, calculating rewards)

### **Merchants**
**Routes:**
- `GET /merchants` - List merchants
- `POST /merchants` - Add new merchant

**Components:**
- **Controller**: `merchantController`
- **Service**: `merchantService`

### **Reward Optimization**
**Routes:**
- `POST /optimize` - Input purchase details (amount, category, merchant) → returns best card

**Components:**
- **Controller**: `optimizeController`
- **Service**: `optimizeService` (business logic to compute best card using reward rules)

### **SMS Parsing (Future Feature)**
**Routes:**
- `POST /sms/parse` - Send SMS text to be parsed into transactions

**Components:**
- **Controller**: `smsController`
- **Service**: `smsService` (parsing logic, regex, NLP)

### **Analytics / Goals**
**Routes:**
- `GET /analytics/rewards-summary` - Total cashback/points earned
- `GET /analytics/goals-progress` - How close to reward thresholds

**Components:**
- **Controller**: `analyticsController`
- **Service**: `analyticsService`

## **Step 4: Folder Structure**

```
src/
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── cardRoutes.js
│   ├── rewardRoutes.js
│   ├── transactionRoutes.js
│   ├── merchantRoutes.js
│   ├── optimizeRoutes.js
│   ├── analyticsRoutes.js
│   └── smsRoutes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── cardController.js
│   ├── rewardController.js
│   ├── transactionController.js
│   ├── merchantController.js
│   ├── optimizeController.js
│   ├── analyticsController.js
│   └── smsController.js
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── cardService.js
│   ├── rewardService.js
│   ├── transactionService.js
│   ├── merchantService.js
│   ├── optimizeService.js
│   ├── analyticsService.js
│   └── smsService.js
├── models/
│   ├── user.js
│   ├── card.js
│   ├── rewardRule.js
│   ├── rewardCategory.js
│   ├── merchant.js
│   ├── transaction.js
│   └── rewardCalculation.js
├── utils/
│   ├── jwt.js
│   ├── smsParser.js
│   └── rewardCalculator.js
├── config/
│   ├── db.js
│   └── env.js
├── app.js
└── server.js
```

## **Benefits of This Structure**

⚡ **This structure provides:**

- **Clear Separation of Concerns**: Each layer has a specific responsibility
- **Extensibility**: Easy to add future features (budgeting, LLM parsing, APIs)
- **Testability**: Services are independent of HTTP layer, making them easy to test
- **Maintainability**: Code is organized logically and easy to navigate
- **Scalability**: Structure supports growth and additional features

---

*This plan provides a solid foundation for building the Credora backend with proper architecture and separation of concerns.*