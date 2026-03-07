# Backend TODO: User Progress API

## Endpoint yang Diperlukan untuk Fitur "Completed Juz per User"

### 1. GET `/api/v1/user/progress`

Mengambil progress user yang sedang login (juz mana saja yang sudah ditandai selesai).

**Response:**
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

**Keterangan:**
- `completed_juz`: Array of juz index (1-30) yang sudah ditandai selesai oleh user
- Data harus spesifik per user yang sedang login (dari token/session)

---

### 2. POST `/api/v1/user/progress`

Menyimpan/mengupdate progress user (juz mana saja yang sudah ditandai selesai).

**Request Body:**
```json
{
  "completed_juz": [1, 30]
}
```

**Response:**
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

**Keterangan:**
- `completed_juz`: Array lengkap dari juz yang sudah selesai
- Endpoint ini harus **replace** seluruh list, bukan append
- Data harus spesifik per user yang sedang login (dari token/session)

---

## Database Schema (Saran)

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_juz INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index untuk query yang lebih cepat
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

---

## Implementasi Logic

### GET /api/v1/user/progress
1. Ambil `user_id` dari token/session yang sedang login
2. Query tabel `user_progress` untuk user tersebut
3. Jika belum ada record, return empty array `[]`
4. Return `completed_juz` array

### POST /api/v1/user/progress
1. Ambil `user_id` dari token/session yang sedang login
2. Validasi `completed_juz` array (harus angka 1-30)
3. Upsert (INSERT or UPDATE) ke tabel `user_progress`:
   - Jika user sudah ada record → UPDATE
   - Jika belum → INSERT
4. Return updated `completed_juz` array

---

## Contoh Implementasi (Pseudo-code)

```typescript
// GET /api/v1/user/progress
async function getUserProgress(req: Request, res: Response) {
  const userId = req.user.id; // dari auth middleware
  
  const progress = await db.query(
    'SELECT completed_juz FROM user_progress WHERE user_id = $1',
    [userId]
  );
  
  const completedJuz = progress.rows[0]?.completed_juz || [];
  
  res.json({
    status: 200,
    message: "Success",
    data: { completed_juz: completedJuz },
    timestamp: new Date().toISOString(),
    path: req.path
  });
}

// POST /api/v1/user/progress
async function saveUserProgress(req: Request, res: Response) {
  const userId = req.user.id; // dari auth middleware
  const { completed_juz } = req.body;
  
  // Validasi
  if (!Array.isArray(completed_juz)) {
    return res.status(400).json({ error: "completed_juz must be an array" });
  }
  
  const isValid = completed_juz.every(
    juz => Number.isInteger(juz) && juz >= 1 && juz <= 30
  );
  
  if (!isValid) {
    return res.status(400).json({ error: "completed_juz must contain integers 1-30" });
  }
  
  // Upsert
  await db.query(`
    INSERT INTO user_progress (user_id, completed_juz)
    VALUES ($1, $2)
    ON CONFLICT (user_id) 
    DO UPDATE SET completed_juz = $2, updated_at = NOW()
  `, [userId, completed_juz]);
  
  res.json({
    status: 200,
    message: "Success",
    data: { completed_juz },
    timestamp: new Date().toISOString(),
    path: req.path
  });
}
```

---

## Frontend Implementation

Frontend sudah siap dengan:
- ✅ Service functions: `getUserProgress()`, `saveUserProgress()`
- ✅ Hook: `useUserProgress()` dengan state management
- ✅ UI: Tombol "Tandai Sudah Selesai" di JuzDetailView
- ✅ Auto-refresh dashboard saat user toggle status

**Files yang sudah diupdate:**
- `src/features/alquran/services/alquran.services.ts`
- `src/features/alquran/hooks/useUserProgress.tsx`
- `src/features/alquran/components/JuzDetailView.tsx`
- `src/features/alquran/components/AlquranDashboard.tsx`

---

## Testing

Setelah backend endpoint dibuat, test dengan:

1. Login sebagai user A (misal: hamka1)
2. Buka Juz 30, klik "Tandai Sudah Selesai"
3. Dashboard harus show "✓ Ditandai: 1"
4. Logout, login sebagai user B
5. Dashboard user B harus show "✓ Ditandai: 0" (karena data per user)
6. Login kembali sebagai user A, progress harus tetap ada (persistent)

---

## Notes

- Data progress ini **SPESIFIK PER USER**, bukan global
- User A dan User B bisa memiliki progress yang berbeda
- Data disimpan di backend database, bukan localStorage
- Frontend menggunakan localStorage hanya untuk "isJuzActive" state (UI preference per device)
