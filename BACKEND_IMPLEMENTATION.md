# Backend Implementation - User Progress API

## 📁 File Structure (unlupa-api)

```
unlupa-api/
├── handlers/
│   └── userProgress.go
├── routes/
│   └── userProgress.go
├── models/
│   └── userProgress.go
├── services/
│   └── userProgress.go
└── main.go (updated)
```

---

## 1. Model (`models/userProgress.go`)

```go
package models

import (
	"time"

	"github.com/google/uuid"
)

type UserProgress struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	UserID       uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"user_id"`
	CompletedJuz []int     `gorm:"type:integer[]" json:"completed_juz"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func NewUserProgress(userID uuid.UUID) *UserProgress {
	return &UserProgress{
		ID:           uuid.New(),
		UserID:       userID,
		CompletedJuz: []int{},
	}
}

// UserProgressRequest represents the request body
type UserProgressRequest struct {
	CompletedJuz []int `json:"completed_juz" validate:"required,dive,min=1,max=30"`
}

// UserProgressResponse represents the API response
type UserProgressResponse struct {
	Status    int                    `json:"status"`
	Message   string                 `json:"message"`
	Data      UserProgressData       `json:"data"`
	Timestamp string                 `json:"timestamp"`
	Path      string                 `json:"path"`
}

type UserProgressData struct {
	CompletedJuz []int `json:"completed_juz"`
}

func NewUserProgressResponse(progress *UserProgress, path string) UserProgressResponse {
	if progress == nil {
		return UserProgressResponse{
			Status:  200,
			Message: "Success",
			Data: UserProgressData{
				CompletedJuz: []int{},
			},
			Timestamp: time.Now().Format(time.RFC3339),
			Path:      path,
		}
	}

	return UserProgressResponse{
		Status:  200,
		Message: "Success",
		Data: UserProgressData{
			CompletedJuz: progress.CompletedJuz,
		},
		Timestamp: time.Now().Format(time.RFC3339),
		Path:      path,
	}
}
```

---

## 2. Service (`services/userProgress.go`)

```go
package services

import (
	"errors"
	"sort"

	"unlupa-api/models"
	"unlupa-api/database"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserProgressService struct {
	db *gorm.DB
}

func NewUserProgressService(db *gorm.DB) *UserProgressService {
	return &UserProgressService{db: db}
}

// GetUserProgress retrieves user progress by user ID
func (s *UserProgressService) GetUserProgress(userID uuid.UUID) (*models.UserProgress, error) {
	var progress models.UserProgress

	err := s.db.Where("user_id = ?", userID).First(&progress).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new progress if not exists
			progress = *models.NewUserProgress(userID)
			if err := s.db.Create(&progress).Error; err != nil {
				return nil, err
			}
			return &progress, nil
		}
		return nil, err
	}

	return &progress, nil
}

// SaveUserProgress saves or updates user progress
func (s *UserProgressService) SaveUserProgress(userID uuid.UUID, completedJuz []int) (*models.UserProgress, error) {
	// Validate completed Juz (must be 1-30)
	if err := validateCompletedJuz(completedJuz); err != nil {
		return nil, err
	}

	// Sort and remove duplicates
	completedJuz = sortAndUnique(completedJuz)

	var progress models.UserProgress

	// Try to find existing progress
	err := s.db.Where("user_id = ?", userID).First(&progress).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new progress
			progress = *models.NewUserProgress(userID)
			progress.CompletedJuz = completedJuz
			if err := s.db.Create(&progress).Error; err != nil {
				return nil, err
			}
			return &progress, nil
		}
		return nil, err
	}

	// Update existing progress
	if err := s.db.Model(&progress).Update("completed_juz", completedJuz).Error; err != nil {
		return nil, err
	}

	// Reload to get updated data
	if err := s.db.Where("user_id = ?", userID).First(&progress).Error; err != nil {
		return nil, err
	}

	return &progress, nil
}

// validateCompletedJuz validates that all Juz numbers are between 1 and 30
func validateCompletedJuz(completedJuz []int) error {
	for _, juz := range completedJuz {
		if juz < 1 || juz > 30 {
			return errors.New("completed_juz must contain integers between 1 and 30")
		}
	}
	return nil
}

// sortAndUnique sorts and removes duplicates from slice
func sortAndUnique(slice []int) []int {
	if len(slice) == 0 {
		return slice
	}

	sort.Ints(slice)
	
	unique := make([]int, 0, len(slice))
	prev := -1
	for _, v := range slice {
		if v != prev {
			unique = append(unique, v)
			prev = v
		}
	}
	
	return unique
}
```

---

## 3. Handler (`handlers/userProgress.go`)

```go
package handlers

import (
	"net/http"

	"unlupa-api/models"
	"unlupa-api/services"
	"unlupa-api/middleware"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserProgressHandler struct {
	service *services.UserProgressService
}

func NewUserProgressHandler(service *services.UserProgressService) *UserProgressHandler {
	return &UserProgressHandler{service: service}
}

// GetUserProgress godoc
// @Summary Get user progress
// @Description Get completed Juz list for authenticated user
// @Tags user-progress
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} models.UserProgressResponse
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/user/progress [get]
func (h *UserProgressHandler) GetUserProgress(c *gin.Context) {
	// Get user ID from JWT token (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  401,
			"message": "Unauthorized: user ID not found",
		})
		return
	}

	// Parse user ID
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  401,
			"message": "Invalid user ID",
		})
		return
	}

	// Get user progress
	progress, err := h.service.GetUserProgress(userUUID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  500,
			"message": "Failed to get user progress",
			"error":   err.Error(),
		})
		return
	}

	response := models.NewUserProgressResponse(progress, c.Request.URL.Path)
	c.JSON(http.StatusOK, response)
}

// SaveUserProgress godoc
// @Summary Save user progress
// @Description Save completed Juz list for authenticated user
// @Tags user-progress
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body models.UserProgressRequest true "Completed Juz list"
// @Success 200 {object} models.UserProgressResponse
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/user/progress [post]
func (h *UserProgressHandler) SaveUserProgress(c *gin.Context) {
	// Get user ID from JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  401,
			"message": "Unauthorized: user ID not found",
		})
		return
	}

	// Parse user ID
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"status":  401,
			"message": "Invalid user ID",
		})
		return
	}

	// Bind request body
	var req models.UserProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  400,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	// Validate request
	if req.CompletedJuz == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  400,
			"message": "completed_juz is required",
		})
		return
	}

	// Save user progress
	progress, err := h.service.SaveUserProgress(userUUID, req.CompletedJuz)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  500,
			"message": "Failed to save user progress",
			"error":   err.Error(),
		})
		return
	}

	response := models.NewUserProgressResponse(progress, c.Request.URL.Path)
	c.JSON(http.StatusOK, response)
}

// SetupRoutes configures the routes for user progress
func SetupRoutes(r *gin.RouterGroup, service *services.UserProgressService) {
	handler := NewUserProgressHandler(service)

	// Routes with JWT authentication
	auth := r.Group("")
	auth.Use(middleware.JWTAuthMiddleware()) // Adjust middleware name as needed
	{
		auth.GET("/user/progress", handler.GetUserProgress)
		auth.POST("/user/progress", handler.SaveUserProgress)
	}
}
```

---

## 4. Update Main (`main.go`)

```go
package main

import (
	"unlupa-api/database"
	"unlupa-api/handlers"
	"unlupa-api/services"
	"unlupa-api/models"
	
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db := database.InitDB()
	
	// Auto migrate models
	db.AutoMigrate(&models.UserProgress{})
	
	// Initialize services
	userProgressService := services.NewUserProgressService(db)
	
	// Setup Gin
	r := gin.Default()
	
	// API routes
	api := r.Group("/api/v1")
	{
		// Existing routes...
		// handlers.SetupJuzRoutes(api, juzService)
		// handlers.SetupItemRoutes(api, itemService)
		
		// User progress routes
		handlers.SetupRoutes(api, userProgressService)
	}
	
	// Start server
	r.Run(":8080")
}
```

---

## 5. Database Migration (SQL)

```sql
-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_juz INTEGER[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_created_at ON user_progress(created_at);

-- Comment
COMMENT ON TABLE user_progress IS 'Stores user progress for completed Juz';
COMMENT ON COLUMN user_progress.user_id IS 'Reference to users table';
COMMENT ON COLUMN user_progress.completed_juz IS 'Array of completed Juz numbers (1-30)';
```

---

## 6. Environment Variables (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/unlupa?sslmode=disable

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
```

---

## 7. Testing with cURL

### Get User Progress
```bash
curl -X GET http://localhost:8080/api/v1/user/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Save User Progress
```bash
curl -X POST http://localhost:8080/api/v1/user/progress \
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
  "timestamp": "2026-03-07T10:00:00Z",
  "path": "/api/v1/user/progress"
}
```

---

## 8. Integration Notes

### JWT Middleware
Make sure your JWT middleware sets `user_id` in context:

```go
func JWTAuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // ... token validation ...
        
        // Set user_id in context
        c.Set("user_id", claims.UserID.String())
        
        c.Next()
    }
}
```

### GORM Setup
Ensure your database connection supports PostgreSQL arrays:

```go
import (
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    _ "github.com/lib/pq" // PostgreSQL driver
)

func InitDB() *gorm.DB {
    dsn := os.Getenv("DATABASE_URL")
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    return db
}
```

---

## ✅ Checklist Implementation

1. [ ] Create `models/userProgress.go`
2. [ ] Create `services/userProgress.go`
3. [ ] Create `handlers/userProgress.go`
4. [ ] Update `main.go` to register routes
5. [ ] Run database migration
6. [ ] Ensure JWT middleware sets `user_id` in context
7. [ ] Test with cURL or Postman
8. [ ] Test with frontend (already implemented in unlupa-client)

---

## 🔥 Quick Start

```bash
# Navigate to unlupa-api
cd unlupa-api

# Create directories
mkdir -p handlers routes models services

# Create files (copy-paste code above)

# Run migration
psql -d unlupa -f migrations/001_user_progress.sql

# Run server
go run main.go

# Test
curl http://localhost:8080/api/v1/user/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Frontend Integration

Frontend sudah siap! Code di `unlupa-client` akan otomatis call API ini:

```typescript
// useUserProgress.tsx
const response = await alquranService.getUserProgress();
// Returns: { completed_juz: [1, 30] }
```

Once backend is running, frontend will work seamlessly! 🚀
