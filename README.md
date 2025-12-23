# Job Hiring Platform – Backend (Node.js)

A backend REST API for a Job Hiring Platform similar to **Naukri.com**, built using **Node.js, Express, and MongoDB**.  
It supports resume uploads, recruiter applicant management, admin features, and role-based access.

---

## 🚀 Features

### 👤 Candidate
- Upload resume (PDF/DOC)
- Apply for jobs
- View application status

### 🧑‍💼 Recruiter
- View applicants
- Download resumes
- Shortlist / Reject candidates

### 🛠 Admin
- Manage users (candidates & recruiters)
- View platform analytics

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **GridFS** (Resume Storage)
- **JWT Authentication**
- **Multer** (File Upload)
- **Postman** (API Testing)

---

## 📁 Folder Structure

```txt
backend/
│───├
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   
│
├── .env
├── package.json
├── server.js
└── README.md
