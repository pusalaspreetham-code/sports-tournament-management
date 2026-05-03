# 🏆 Sports Tournament Management System

A full-stack **DBMS-based web application** to manage sports tournaments, teams, players, matches, and results with secure user authentication using Firebase.

---

## 📌 Project Overview

This system helps in managing the complete lifecycle of a sports tournament including:

* Team creation and management
* Player registration
* Tournament creation
* Match scheduling
* Leaderboard generation

It replaces manual processes with an efficient **database-driven system**.

---

## 🚀 Features

* 🔐 **User Authentication (Firebase)**

  * Email/Password login
  * Google Sign-In
  * Session management

* 🏆 **Tournament Management**

  * Create and manage tournaments
  * View tournament details

* 👥 **Team Management**

  * Add/Delete teams
  * Assign coach details

* 🧑‍🤝‍🧑 **Player Management**

  * Add players to teams
  * View players by team

* ⚽ **Match System**

  * Generate matches (Round Robin)
  * Update match results

* 📊 **Leaderboard**

  * Auto-calculated rankings based on match results

* 👤 **User-based Data Isolation**

  * Each user sees only their own tournaments and teams

---

## 🛠️ Tech Stack

**Frontend**

* HTML, CSS, JavaScript
* Firebase Authentication

**Backend**

* Node.js
* Express.js

**Database**

* MySQL

---

## 🔐 Authentication (Firebase)

We used Firebase Authentication to:

* Secure user login
* Avoid storing passwords in database
* Provide Google login support
* Generate unique user IDs (UID)

---

## 📂 Project Structure

```
DBMS PROJECT/
│
├── backend/
│   ├── src/
│   ├── .env
│   ├── server.js
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── auth.js
│   ├── firebase.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=proj
PORT=5000
```

Run backend:

```
npm start
```

---

### 3️⃣ Frontend Setup

Simply open:

```
frontend/login.html
```

OR use live server.

---

## 🗄️ Database

Make sure MySQL is running and create database:

```
CREATE DATABASE proj;
```

Import required tables before running.

---

## 📊 ER Diagram

The system includes entities:

* Teams
* Players
* Tournaments
* Matches
* Registrations

Relationships:

* Teams ↔ Tournaments (M:N via Registrations)
* Teams → Players (1:N)
* Tournament → Matches (1:N)

---

## ⚠️ Limitations

* User mapping handled in application layer (JSON)
* No role-based access control
* Name stored as single field (not split)

---

## 🔮 Future Improvements

* Add user_id in database tables
* Implement role-based access (Admin/User)
* Split name into first_name and last_name
* Replace JSON mapping with database relations
* Deploy application (cloud hosting)

---

## 👨‍💻 Author

* Preetham

---

## 📌 Conclusion

This project demonstrates how DBMS concepts can be applied to build a real-world system with secure authentication and structured data management.
