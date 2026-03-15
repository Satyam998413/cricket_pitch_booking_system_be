# Cricket Pitch Booking System – Backend

A **scalable real-time cricket pitch booking backend** built with **Node.js, Express, MongoDB, Redis, and Socket.io**.

The system prevents **double booking**, supports **temporary slot reservations**, and handles **high concurrency** using **Redis distributed locks and MongoDB transactions**.

---

# Tech Stack

Backend Framework

* Node.js
* Express.js

Database

* MongoDB (Replica Set / Atlas)

Caching / Concurrency

* Redis Cloud
* Redlock (Distributed Locking)

Validation

* Zod

Real-Time Updates

* Socket.io

Authentication

* JWT

Environment Management

* dotenv

---

# Key Features

### 1. Slot Reservation (2 Minute Hold)

When a user selects a slot:

* Slot is reserved in Redis
* Reservation expires automatically after **120 seconds**

```
Redis Key Format

slot:{pitchId}:{date}:{timeSlot}
```

Example:

```
slot:65f1ab23:2026-03-20:07-08
```

Value:

```
userId
```

TTL:

```
120 seconds
```

---

### 2. Distributed Lock (Redlock)

To prevent **race conditions during booking confirmation**, a **Redis distributed lock** is used.

```
lock:slot:{pitchId}:{date}:{slot}
```

Example:

```
lock:slot:65f1ab23:2026-03-20:07-08
```

This ensures:

* Only **one booking process runs at a time**
* Prevents simultaneous confirmation

---

### 3. MongoDB Transactions

Booking confirmation runs inside a **MongoDB transaction**.

Steps:

1. Validate Redis reservation
2. Acquire Redis lock
3. Start MongoDB transaction
4. Check existing booking
5. Create booking
6. Commit transaction
7. Release lock
8. Delete Redis reservation

This guarantees **atomic operations**.

---

### 4. Unique Booking Constraint

MongoDB schema enforces:

```
unique(pitchId, date, slot)
```

Example:

```js
bookingSchema.index(
 { pitchId:1, date:1, slot:1 },
 { unique:true }
);
```

Even if two requests reach DB simultaneously, only **one booking succeeds**.

---

### 5. Real-Time Slot Updates

Using **Socket.io**, when a slot is booked:

* All connected clients receive update
* Slot becomes unavailable instantly

Example event:

```
slot-booked
```

---

# Project Structure

```
src
│
├── config
│   ├── env.js
│   ├── redis.js
│   ├── redlock.js
│   └── database.js
│
├── controllers
│   └── booking.controller.js
│
├── models
│   ├── user.model.js
│   ├── pitch.model.js
│   └── booking.model.js
│
├── routes
│   └── booking.routes.js
│
├── middlewares
│   ├── auth.middleware.js
│   └── validate.middleware.js
│
├── validations
│   └── booking.validation.js
│
├── utils
│   └── transaction.js
│
├── sockets
│   └── socket.js
│
├── seed
│   └── seedDatabase.js
│
├── app.js
└── server.js
```

---

# Environment Variables

Create `.env` file in project root.

Example:

```
NODE_ENV=development

PORT=5000

MONGO_URI=mongodb://localhost:27017/cricket_booking

JWT_SECRET=supersecret

REDIS_HOST=redis-16632.crce214.us-east-1-3.ec2.cloud.redislabs.com
REDIS_PORT=16632
REDIS_PASSWORD=your_password

SLOT_RESERVE_TIME=120
```

---

# Dummy `.env.example`

Create a file named:

```
.env.example
```

```
NODE_ENV=development
PORT=5000

MONGO_URI=

JWT_SECRET=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

SLOT_RESERVE_TIME=120
```

Developers can copy this to `.env`.

---

# Installation

Clone repository

```
git clone <repo-url>
```

Install dependencies

```
npm install
```

Create `.env` file

```
cp .env.example .env
```

Start server

```
npm run dev
```

---

# Database Seeding

To create default admin and pitches:

```
npm run seed
```

Default admin:

```
email: admin@cricket.com
password: admin123
```

---

# API Flow

### Reserve Slot

```
POST /api/booking/reserve
```

Body

```json
{
 "pitchId":"123",
 "date":"2026-03-20",
 "slot":"07-08"
}
```

Response

```
Slot reserved for 2 minutes
```

---

### Confirm Booking

```
POST /api/booking/confirm
```

Steps executed:

1. Check Redis reservation
2. Acquire distributed lock
3. Start MongoDB transaction
4. Create booking
5. Commit
6. Delete Redis reservation

---

# Booking Architecture

```
User selects slot
        │
        ▼
Redis reserve slot (TTL 120s)
        │
        ▼
User confirms booking
        │
        ▼
Acquire Redis distributed lock
        │
        ▼
MongoDB Transaction
        │
        ▼
Check existing booking
        │
        ▼
Create booking
        │
        ▼
Commit transaction
        │
        ▼
Release lock
        │
        ▼
Delete Redis reservation
        │
        ▼
Socket.io broadcast update
```

---

# Security Features

Password hashing using bcrypt

```
userSchema.pre("save")
```

JWT authentication

Protected routes using middleware.

---

# Validation

API validation implemented using **Zod**

Example:

```js
z.object({
 pitchId: z.string(),
 date: z.string(),
 slot: z.string()
})
```

---

# Scalability

This architecture supports:

* Horizontal scaling
* High concurrency
* Distributed locking
* Real-time updates

---

# Value Added Design Decisions

1. Redis slot reservation with TTL
2. Redis distributed lock (Redlock)
3. MongoDB transaction support
4. Unique DB index for slot safety
5. Zod API validation
6. Environment-based configuration
7. Real-time updates with Socket.io

---

# Future Improvements

* Payment integration
* Slot pricing
* Admin dashboard
* Booking cancellation
* Background job queue (BullMQ)
* Rate limiting
* API documentation (Swagger)

---

# Author

Backend implementation for **Cricket Pitch Booking Assignment**.

Designed for **high concurrency and scalable architecture**.
