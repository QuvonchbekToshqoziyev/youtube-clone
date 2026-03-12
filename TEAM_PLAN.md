# YouTube Clone Backend — Team Development Plan

## 👥 Team Roles

| Member | Role | Primary Domain |
|--------|------|----------------|
| **Member 1** | Infrastructure & DevOps Lead | Docker, DB schema, Redis, S3, CI/CD |
| **Member 2** | Auth & User Lead | Authentication, Users, Admin panel |
| **Member 3** | Video Lead | Upload, Processing, Streaming, Analytics |
| **Member 4** | Social Features Lead | Comments, Likes, Subscriptions, Playlists, Search, Notifications |

---

## 📋 PHASE 1: MVP — Weeks 1–2

### Week 1: Project Bootstrapping

**All Members (Day 1 — together)**
- [✅] Create shared GitHub repository, set up branch strategy (`main`, `dev`, `feature/*`)
- [✅] Agree on commit conventions and PR review flow
- [✅] Run `nest new youtube-clone` and push base project
- [ ] Install shared packages:
  ```bash
  npm install @prisma/client prisma
  npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
  npm install bcryptjs class-validator class-transformer
  npm install @nestjs/config @nestjs/mapped-types
  npm install @nestjs/swagger swagger-ui-express
  ```

---

**Member 1 — Infrastructure Setup**
- [ ] Write `docker-compose.yml` with PostgreSQL and Redis services
- [ ] Write `Dockerfile` for the NestJS app
- [ ] Configure `.env` and `.env.example` files
- [ ] Initialize Prisma (`npx prisma init`) and set up `DATABASE_URL`
- [ ] Design and write the full Prisma schema (`prisma/schema.prisma`):
  - `User`, `Video`, `Comment`, `Like`, `Subscription`, `Playlist`, `PlaylistVideo`
  - All enums: `Role`, `VideoStatus`, `Visibility`, `LikeType`
- [ ] Run first migration: `npx prisma migrate dev --name init`
- [ ] Share schema with the team via PR

**Member 2 — Auth Module**
- [ ] Generate `auth` module: `nest g module auth && nest g service auth && nest g controller auth`
- [ ] Generate `users` module
- [ ] Implement `POST /auth/register` (hash password with bcrypt, create user)
- [ ] Implement `POST /auth/login` (validate credentials, return JWT access token)
- [ ] Implement JWT strategy (`JwtStrategy`) and `JwtAuthGuard`
- [ ] Implement `GET /users/me` (protected route)

**Member 3 — Video Module Scaffold**
- [ ] Generate `videos` module
- [ ] Implement `Video` CRUD skeleton (create, findAll, findOne, update, delete)
- [ ] Implement `POST /videos/upload` — accept `multipart/form-data`, save file to `./uploads/` temporarily
- [ ] Return video record with `status: PROCESSING`

**Member 4 — Comments & Likes Scaffold**
- [ ] Generate `comments` and `likes` modules
- [ ] Implement `POST /videos/:videoId/comments` — add comment
- [ ] Implement `GET /videos/:videoId/comments` — list comments (pagination: `limit`, `page`)
- [ ] Implement `POST /videos/:videoId/like` and `POST /videos/:videoId/dislike`
- [ ] Implement `DELETE /videos/:videoId/like` (toggle off)

---

### Week 2: MVP Integration & Polish

**Member 1**
- [ ] Set up local file storage service (`StorageService`) — save uploads to disk
- [ ] Add `@nestjs/serve-static` or file streaming via `res.sendFile` for local video serving
- [ ] Add Prisma service (`PrismaService`) as a shared global module
- [ ] Write `docker-compose up` instructions in README

**Member 2**
- [ ] Implement `PUT /users/me` — update profile (firstName, lastName, avatar)
- [ ] Add roles guard (`RolesGuard`) with `@Roles(Role.ADMIN)` decorator
- [ ] Implement `POST /auth/logout` (token blacklist hint or stateless note)
- [ ] Add global `ValidationPipe` and `class-validator` DTOs for all auth endpoints

**Member 3**
- [ ] Implement `GET /videos` — list videos with pagination
- [ ] Implement `GET /videos/:id` — get video details with author info
- [ ] Implement `GET /videos/:id/stream` — basic byte-range streaming (`206 Partial Content`)
- [ ] Increment `viewsCount` on each `GET /videos/:id`
- [ ] Implement `PUT /videos/:id` and `DELETE /videos/:id` (author only)

**Member 4**
- [ ] Implement `DELETE /comments/:id` (author only)
- [ ] Update `likesCount` / `dislikesCount` on `Video` and `Comment` after like/dislike
- [ ] Add pagination and basic sorting (`sort=top`, `sort=newest`) to comments
- [ ] Write Postman collection for Phase 1 endpoints

---

## 📋 PHASE 2: Core Features — Weeks 3–6

### Week 3–4: Infrastructure Upgrade & Feature Expansion

**Member 1**
- [ ] Add Redis service to Docker Compose and connect via `ioredis`
- [ ] Install and configure Bull Queue:
  ```bash
  npm install @nestjs/bull bull
  ```
- [ ] Create `VideoProcessingQueue` — define the job interface
- [ ] Set up AWS LocalStack in Docker Compose (S3-compatible)
- [ ] Integrate `@aws-sdk/client-s3` for file upload/download to LocalStack
- [ ] Write `S3Service` (upload, getSignedUrl, delete)
- [ ] Replace local file storage with S3 storage in `StorageService`

**Member 2**
- [ ] Generate `channels` and `subscriptions` modules
- [ ] Implement `GET /channels/:username` — channel info with `isSubscribed` flag
- [ ] Implement `GET /channels/:username/videos` — paginated video list
- [ ] Implement `PUT /channels/me` — update channel name, description, banner
- [ ] Implement `POST /channels/:userId/subscribe` and `DELETE /channels/:userId/subscribe`
- [ ] Implement `GET /subscriptions` — list current user's subscriptions

**Member 3**
- [ ] Install FFmpeg bindings:
  ```bash
  npm install fluent-ffmpeg @types/fluent-ffmpeg
  ```
- [ ] Write `FfmpegService`:
  - Extract video duration and metadata
  - Transcode to `360p`, `480p`, `720p`, `1080p`
  - Generate thumbnail from video
- [ ] Wire `VideoProcessingQueue` consumer to `FfmpegService`
- [ ] Update video record with transcoded S3 URLs and `status: PUBLISHED`
- [ ] Implement `GET /videos/:id/status` — return `processingProgress`

**Member 4**
- [ ] Generate `playlists` module
- [ ] Implement `POST /playlists` — create playlist
- [ ] Implement `POST /playlists/:id/videos` — add video with position
- [ ] Implement `GET /playlists/:id` — get playlist + videos
- [ ] Implement `GET /users/:userId/playlists` — list user playlists
- [ ] Implement `PUT /playlists/:id` and `DELETE /playlists/:id/videos/:videoId`

---

### Week 5–6: Search, Admin & Queue Polish

**Member 1**
- [ ] Add Redis-based caching (`CacheModule`) for hot endpoints (`GET /videos`, `GET /channels/:username`)
- [ ] Set cache TTLs and cache invalidation on writes
- [ ] Add Bull queue dashboard (optional: `bull-board`)
- [ ] Add global exception filter and logging interceptor

**Member 2**
- [ ] Generate `admin` module
- [ ] Implement `GET /admin/dashboard` — aggregated stats from DB
- [ ] Implement `GET /admin/users`, `PATCH /admin/users/:id/block`, `PATCH /admin/users/:id/verify`
- [ ] Implement `GET /admin/videos/pending`, `PATCH /admin/videos/:id/approve`, `PATCH /admin/videos/:id/reject`
- [ ] Secure all `/admin/*` routes with `@Roles(Role.ADMIN, Role.SUPERADMIN)`

**Member 3**
- [ ] Implement `GET /videos/feed?sort=popular|newest&category=&duration=short|medium|long`
- [ ] Implement `POST /videos/:id/view` — record watch event, increment `viewsCount`
- [ ] Implement `GET /videos/trending?timeframe=24h`
- [ ] Add rate limiting to upload endpoint (10 uploads/hour per user)

**Member 4**
- [ ] Implement `GET /videos/search?q=&sort=&duration=&uploaded=`
- [ ] Implement `GET /search?q=&type=videos|channels|playlists|all`
- [ ] Implement `GET /search/suggestions?q=` — prefix match from DB
- [ ] Implement `GET /subscriptions/feed` — videos from subscribed channels

---

## 📋 PHASE 3: Advanced Features — Weeks 7–10

### Week 7–8: Real-time & Analytics

**Member 1**
- [ ] Install and configure WebSocket gateway:
  ```bash
  npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
  ```
- [ ] Create `NotificationsGateway` — emit events to connected users
- [ ] Set up Nginx config (`nginx.conf`) for reverse proxy and WebSocket upgrade
- [ ] Add health check endpoint `GET /health`

**Member 2**
- [ ] Implement `GET /users/me/history` — paginated watch history
- [ ] Implement `DELETE /users/me/history` — clear history
- [ ] Create `WatchHistory` model and migration (add to Prisma schema)
- [ ] Create `Notification` model and migration
- [ ] Implement `GET /users/me/notifications` and `PATCH /notifications/:id/read`

**Member 3**
- [ ] Implement `GET /videos/:id/analytics?timeframe=7d` (creator only):
  - Views by day
  - Watch time
  - Device breakdown
  - Geographic data
- [ ] Create `AnalyticsJob` in Bull Queue — process view events asynchronously
- [ ] Implement audience retention data recording

**Member 4**
- [ ] Add comment reply system:
  - Add `parentId` to `Comment` model and migrate
  - `POST /videos/:videoId/comments` with `parentId`
  - `GET /comments/:id/replies`
- [ ] Implement `POST /comments/:id/like`, `POST /comments/:id/dislike`, `DELETE /comments/:id/like`
- [ ] Implement `PATCH /comments/:id/pin` (video author only)
- [ ] Implement `GET /recommendations?videoId=&limit=` — basic recommendation logic

---

### Week 9–10: Content Moderation & Search Enhancement

**Member 1**
- [ ] Add rate limiting globally with `@nestjs/throttler`:
  ```bash
  npm install @nestjs/throttler
  ```
  - Search: 100 req/min per IP
  - API calls: 1000 req/hour per user
  - Comments: 50/hour per user
- [ ] Implement content moderation hooks (flagging system)
- [ ] Add `GET /admin/reports`, `PATCH /admin/reports/:id/resolve`

**Member 2**
- [ ] Implement `POST /admin/reports` — report a video or channel
- [ ] Add `loginAttempts` and account lock logic to auth
- [ ] Add `isBlocked` / `blockedUntil` to `User` model and enforce in `JwtStrategy`

**Member 3**
- [ ] Implement adaptive bitrate streaming hints in video response
- [ ] Validate video file format, size, and duration on upload
- [ ] Implement thumbnail validation (image format, dimensions)
- [ ] Add signed S3 URLs with expiry for private/unlisted videos

**Member 4**
- [ ] Integrate Elasticsearch (optional):
  ```bash
  npm install @elastic/elasticsearch
  ```
  - Index videos on publish
  - Replace `/search` DB queries with Elasticsearch queries
- [ ] Emit WebSocket events for: `new_subscriber`, `video_published`, `comment_reply`
- [ ] Trigger notification jobs from `SubscriptionsService` and `VideosService`

---

## 📋 PHASE 4: Production Ready — Weeks 11–14

### Week 11–12: Security & CI/CD

**Member 1**
- [ ] Configure `mkcert` for local HTTPS and update Nginx for SSL termination
- [ ] Final `docker-compose.prod.yml` with all services (app, postgres, redis, nginx, localstack)
- [ ] Write `.github/workflows/ci.yml`:
  - Lint + build on every PR
  - Run `jest` unit tests
  - Run `jest` e2e tests
- [ ] Write `.github/workflows/cd.yml` for deployment (staging)

**Member 2**
- [ ] Add CSRF protection headers via Helmet:
  ```bash
  npm install helmet
  ```
- [ ] Enable CORS with strict origin whitelist
- [ ] Audit all endpoints for missing `JwtAuthGuard` or `RolesGuard`
- [ ] Add input sanitization to prevent XSS in comments and descriptions

**Member 3**
- [ ] Performance: add database indexes on frequently queried columns (Prisma `@@index`)
- [ ] Run load testing with `artillery` or `k6` on video streaming endpoints
- [ ] Optimize FFmpeg presets for processing speed vs quality trade-off
- [ ] Add retry logic to failed processing jobs in Bull Queue

**Member 4**
- [ ] Write full Postman collection covering all endpoints with example responses
- [ ] Generate Swagger docs (`@nestjs/swagger`) and expose at `GET /api/docs`
- [ ] Write `e2e` tests for critical flows: register → login → upload → view

---

### Week 13–14: Final QA & Handoff

**All Members**
- [ ] Code review pass — each member reviews another's module
- [ ] Resolve all lint and TypeScript errors: `npm run lint && npm run build`
- [ ] Fix all failing tests: `npm run test && npm run test:e2e`

**Member 1**
- [ ] Write final `README.md`:
  - Prerequisites
  - `docker-compose up` setup steps
  - Environment variables reference
  - Architecture diagram

**Member 2**
- [ ] Final security audit — check all OWASP Top 10 items
- [ ] Verify JWT secret rotation and token expiry are production-safe

**Member 3**
- [ ] Verify end-to-end video pipeline: upload → queue → transcode → S3 → stream
- [ ] Confirm `GET /videos/:id/stream` handles `Range` headers correctly

**Member 4**
- [ ] Final Postman collection export and link in README
- [ ] Demo script outline for final presentation

---

## 🔀 Branch Strategy

```
main          ← production-ready releases only
dev           ← integration branch, all features merged here first
feature/auth              ← Member 2
feature/videos            ← Member 3
feature/social            ← Member 4
feature/infra             ← Member 1
```

**PR rules:**
- All PRs target `dev`
- At least 1 approval required before merge
- CI must pass (lint + build + tests)
- Merge `dev` → `main` at end of each phase

---

## 📦 Shared Modules (Member 1 owns, others consume)

| Module | Purpose |
|--------|---------|
| `PrismaModule` | Global DB access |
| `StorageModule` | File upload to S3/local |
| `CacheModule` | Redis caching |
| `QueueModule` | Bull Queue setup |
| `NotificationsModule` | WebSocket gateway |

---

## ⚡ Quick Start (All Members)

```bash
# 1. Clone repo
git clone <repo-url> && cd youtube-clone

# 2. Copy env
cp .env.example .env

# 3. Start dependencies
docker-compose up -d postgres redis localstack

# 4. Run migrations
npx prisma migrate dev

# 5. Start app
npm run start:dev
```
