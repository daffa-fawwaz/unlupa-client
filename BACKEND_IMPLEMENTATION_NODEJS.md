# Backend Implementation - User Progress API (Node.js/Express Version)

## 📁 File Structure (unlupa-api)

```
unlupa-api/
├── src/
│   ├── controllers/
│   │   └── userProgress.controller.ts
│   ├── routes/
│   │   └── userProgress.routes.ts
│   ├── models/
│   │   └── UserProgress.ts
│   ├── services/
│   │   └── userProgress.service.ts
│   └── app.ts (updated)
```

---

## 1. Model (`src/models/UserProgress.ts`)

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { v4 as uuidv4 } from 'uuid';

interface UserProgressAttributes {
  id: string;
  user_id: string;
  completed_juz: number[];
  created_at?: Date;
  updated_at?: Date;
}

interface UserProgressCreationAttributes extends Optional<UserProgressAttributes, 'id' | 'created_at' | 'updated_at' | 'completed_juz'> {}

class UserProgress extends Model<UserProgressAttributes, UserProgressCreationAttributes> implements UserProgressAttributes {
  public id!: string;
  public user_id!: string;
  public completed_juz!: number[];
  public created_at!: Date;
  public updated_at!: Date;
}

UserProgress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
    completed_juz: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
      field: 'completed_juz',
      validate: {
        isValidJuz(value: number[]) {
          if (value && value.some(juz => juz < 1 || juz > 30)) {
            throw new Error('completed_juz must contain integers between 1 and 30');
          }
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'user_progress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default UserProgress;
```

---

## 2. Service (`src/services/userProgress.service.ts`)

```typescript
import UserProgress from '../models/UserProgress';
import { Sequelize } from 'sequelize';

export class UserProgressService {
  /**
   * Get user progress by user ID
   */
  async getUserProgress(userId: string): Promise<UserProgress> {
    const [progress, created] = await UserProgress.findOrCreate({
      where: { user_id: userId },
      defaults: {
        user_id: userId,
        completed_juz: [],
      },
    });

    return progress;
  }

  /**
   * Save or update user progress
   */
  async saveUserProgress(userId: string, completedJuz: number[]): Promise<UserProgress> {
    // Validate and clean data
    const cleanJuz = this.validateAndCleanJuz(completedJuz);

    const [progress] = await UserProgress.upsert(
      {
        user_id: userId,
        completed_juz: cleanJuz,
      },
      {
        returning: true,
      }
    );

    return progress;
  }

  /**
   * Validate and clean Juz array
   */
  private validateAndCleanJuz(completedJuz: number[]): number[] {
    if (!Array.isArray(completedJuz)) {
      return [];
    }

    // Filter valid Juz (1-30), sort, and remove duplicates
    const validJuz = completedJuz
      .filter(juz => typeof juz === 'number' && juz >= 1 && juz <= 30)
      .sort((a, b) => a - b);

    // Remove duplicates
    return [...new Set(validJuz)];
  }
}

export default new UserProgressService();
```

---

## 3. Controller (`src/controllers/userProgress.controller.ts`)

```typescript
import { Request, Response } from 'express';
import userProgressService from '../services/userProgress.service';

export class UserProgressController {
  /**
   * Get user progress
   * GET /api/v1/user/progress
   */
  async getUserProgress(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from JWT token (set by auth middleware)
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          status: 401,
          message: 'Unauthorized: user ID not found',
        });
        return;
      }

      const progress = await userProgressService.getUserProgress(userId);

      res.status(200).json({
        status: 200,
        message: 'Success',
        data: {
          completed_juz: progress.completed_juz,
        },
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    } catch (error: any) {
      console.error('Error getting user progress:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to get user progress',
        error: error.message,
      });
    }
  }

  /**
   * Save user progress
   * POST /api/v1/user/progress
   */
  async saveUserProgress(req: Request, res: Response): Promise<void> {
    try {
      // Get user ID from JWT token
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          status: 401,
          message: 'Unauthorized: user ID not found',
        });
        return;
      }

      const { completed_juz } = req.body;

      if (!completed_juz || !Array.isArray(completed_juz)) {
        res.status(400).json({
          status: 400,
          message: 'completed_juz is required and must be an array',
        });
        return;
      }

      const progress = await userProgressService.saveUserProgress(userId, completed_juz);

      res.status(200).json({
        status: 200,
        message: 'Success',
        data: {
          completed_juz: progress.completed_juz,
        },
        timestamp: new Date().toISOString(),
        path: req.path,
      });
    } catch (error: any) {
      console.error('Error saving user progress:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to save user progress',
        error: error.message,
      });
    }
  }
}

export default new UserProgressController();
```

---

## 4. Routes (`src/routes/userProgress.routes.ts`)

```typescript
import { Router } from 'express';
import userProgressController from '../controllers/userProgress.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/v1/user/progress
 * @desc    Get user's completed Juz list
 * @access  Private (requires JWT token)
 */
router.get('/progress', authenticateJWT, userProgressController.getUserProgress.bind(userProgressController));

/**
 * @route   POST /api/v1/user/progress
 * @desc    Save user's completed Juz list
 * @access  Private (requires JWT token)
 */
router.post('/progress', authenticateJWT, userProgressController.saveUserProgress.bind(userProgressController));

export default router;
```

---

## 5. Update Main App (`src/app.ts`)

```typescript
import express from 'express';
import cors from 'cors';
import userProgressRoutes from './routes/userProgress.routes';
// ... other imports

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', userProgressRoutes);
// ... other routes

export default app;
```

---

## 6. Database Migration

```sql
-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  completed_juz INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- Enable pgcrypto extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## 7. Testing

### Get User Progress
```bash
curl -X GET http://localhost:3000/api/v1/user/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Save User Progress
```bash
curl -X POST http://localhost:3000/api/v1/user/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completed_juz": [1, 30]
  }'
```

### Expected Response
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "completed_juz": [1, 30]
  },
  "timestamp": "2026-03-07T10:00:00.000Z",
  "path": "/api/v1/user/progress"
}
```

---

## 8. Auth Middleware Example

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized: no token provided',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized: invalid token',
    });
    return;
  }
};
```

---

## ✅ Quick Start (Node.js)

```bash
# Install dependencies
npm install sequelize pg pg-hstore jsonwebtoken @types/jsonwebtoken

# Create migration
npx sequelize-cli migration:generate --name create-user-progress

# Run migration
npx sequelize-cli db:migrate

# Start server
npm run dev

# Test
curl http://localhost:3000/api/v1/user/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Frontend Integration

Frontend di `unlupa-client` sudah siap dan akan otomatis connect ke API ini!

```typescript
// src/features/alquran/hooks/useUserProgress.tsx
const response = await alquranService.getUserProgress();
// Returns: { completed_juz: [1, 30] }
```

**That's it!** Backend siap, frontend sudah ada, tinggal test! 🚀
