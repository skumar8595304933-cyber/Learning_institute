# Learning_institute
A comprehensive learning management system for tracking student progress and courses.  Centralized repository for managing academic curriculum, resources, and student enrollment.  An open-source platform designed to streamline the administration of online educational institutions.




controller:
# Auth
# Authentication API (Node.js, Express, MongoDB)

## Overview

This project implements a complete authentication system using:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* Bcrypt
* OTP Verification
* HTTP Cookies

Features included:

* Send OTP
* User Registration (Signup)
* User Login
* Change Password
* Password Hashing
* JWT Authentication
* Profile Creation

---

# Project Structure

```text
project/
│
├── config/
│   └── database.js
│
├── controllers/
│   └── Auth.js
│   └── ResetPassword.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   ├── OTP.js
│   └── Profile.js
│   └── tags.js
│   └── SubSection.js
│   └── Section.js
│   └── RatingAndReview.js
│   └── CourseProgress.js
│   └── Course.js
│
├── routes/
│   └── Auth.js
│
├── utils/
│   └── mailSender.js
│
├── .env
├── index.js
├── package.json
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd project
```

## Install Dependencies

```bash
npm install
```

## Start Server

```bash
npm run dev
```

or

```bash
nodemon server.js
```

---

# Environment Variables

Create a `.env` file:

```env
PORT=4000

DATABASE_URL=your_mongodb_connection_string

JWT_SECRET=your_secret_key

MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

---

# Authentication Flow

## Send OTP

### Endpoint

```http
POST /api/v1/auth/sendotp
```

### Request Body

```json
{
  "email": "user@example.com"
}
```

### Flow

1. Check whether user already exists.
2. Generate 6-digit OTP.
3. Ensure OTP is unique.
4. Save OTP in database.
5. Return success response.

---

## Signup

### Endpoint

```http
POST /api/v1/auth/signup
```

### Request Body

```json
{
  "firstName": "Suraj",
  "lastName": "Kumar",
  "email": "suraj@gmail.com",
  "password": "12345678",
  "confirmPassword": "12345678",
  "accountType": "Student",
  "contactNumber": "9876543210",
  "otp": "123456"
}
```

### Flow

1. Validate all fields.
2. Match password and confirm password.
3. Check if user already exists.
4. Verify latest OTP.
5. Hash password using bcrypt.
6. Create profile document.
7. Create user document.
8. Return success response.

---

## Login

### Endpoint

```http
POST /api/v1/auth/login
```

### Request Body

```json
{
  "email": "suraj@gmail.com",
  "password": "12345678"
}
```

### Flow

1. Validate credentials.
2. Check if user exists.
3. Compare password using bcrypt.
4. Generate JWT token.
5. Store token in cookie.
6. Return user data.

### Response

```json
{
  "success": true,
  "token": "jwt_token",
  "message": "Login Successful"
}
```

---

## Change Password

### Endpoint

```http
POST /api/v1/auth/changepassword
```

### Headers

```http
Authorization: Bearer <jwt_token>
```

### Request Body

```json
{
  "oldPassword": "12345678",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### Flow

1. Extract user ID from JWT.
2. Verify old password.
3. Match new password and confirm password.
4. Hash new password.
5. Update password.
6. Send confirmation email.
7. Return success response.

---

# Database Models

## User Model

```js
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  accountType: String,
  contactNumber: String,
  additionalDetails: ObjectId,
  image: String
}
```

---

## Profile Model

```js
{
  gender: String,
  dateOfBirth: Date,
  about: String,
  contactNumber: String
}
```

---

## OTP Model

```js
{
  email: String,
  otp: String,
  createdAt: Date
}
```

---

# Security Features

* Password hashing using bcrypt
* JWT-based authentication
* HTTP-only cookies
* OTP verification before registration
* Protected password update functionality

---

# Required Packages

```bash
npm install express mongoose bcrypt jsonwebtoken dotenv otp-generator cookie-parser nodemailer
```

Development dependency:

```bash
npm install nodemon --save-dev
```

---

# Author

Suraj Kumar

Node.js | Express.js | MongoDB | Authentication System
