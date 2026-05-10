# WanderStay 🏡

🚧 Status: In Progress

## 📖 About
WanderStay is a full-stack web application for listing and managing travel stays. Users can create, edit, and manage property listings with authentication, authorization, validation, flash messages, and proper error handling using MVC architecture.

---

## 🚀 Features

- Create, edit, and delete listings (CRUD)
- User authentication using Passport.js
- Session management with express-session
- Flash messages using connect-flash
- Client-side form validation
- Server-side validation using Joi
- Custom error handling middleware
- Async error handling using wrapAsync
- Responsive UI with Bootstrap
- Authorization for listings and reviews
- Ownership-based access control
- MVC architecture for better project structure
- Review system with ratings

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- EJS
- Bootstrap
- Joi
- Passport.js
- Express-session
- Connect-flash

---

## 📂 Project Structure

models/         # Mongoose database schemas
routes/         # Express route handlers
controllers/    # Controller logic (MVC)
views/          # EJS templates
public/         # Static assets (CSS/JS/images)
init/           # Database initialization files & sample data
middleware.js   # Custom middleware functions
schema.js       # Joi validation schemas
app.js          # Main application entry point

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/bauraidiya/wanderstay.git
```

### 2. Navigate into the project folder

```bash
cd wanderstay
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
nodemon app.js
```

### 5. Open in browser

```bash
http://localhost:8080
```

---

## 📸 Screenshots


---

## 🔐 Authentication & Authorization

- User signup, login, and logout
- Session-based authentication
- Password hashing and salting
- Protected routes for authenticated users
- Authorization for listings and reviews
- Ownership-based access control
- Flash success/error messages

---

## 📌 Future Improvements

- Cloudinary image upload
- Map integration
- Deployment
- Better responsive design

---

## 👩‍💻 Author

Diya