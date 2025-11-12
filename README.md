# 🌍 SkillsMatch

> **SkillsMatch** is a full-stack MERN web application that connects **clients** and **freelancers** from around the world.  
> It allows clients to post jobs, receive applications, and hire the right talent — while freelancers can showcase their skills, apply for jobs, and manage their applications efficiently.

---

## 🚀 Features

### 👤 **Authentication & Authorization**
- Secure login and signup with **JWT access & refresh tokens**
- Role-based access control: **Client** & **Freelancer**
- Token invalidation and refresh token rotation for improved security

### 💼 **Job Management**
- Clients can **create, update, and delete** job offers
- Freelancers can **view and apply** for available jobs
- Advanced filtering by skills, budget, and date

### 📝 **Application Management**
- Freelancers can submit proposals to job posts
- Clients can **accept or reject** applications
- Prevents duplicate submissions for the same job

### 💬 **Messaging (coming soon)**
- Real-time chat between client and freelancer after job acceptance
- Message notifications and conversation history

### ⭐ **Reviews & Ratings (coming soon)**
- Clients can rate freelancers after project completion
- Average rating displayed on freelancer profiles

### 📊 **Dashboard**
- Freelancers: track applications, accepted jobs, and feedback
- Clients: monitor posted jobs, applicants, and hiring stats

### ☁️ **Future AWS Integration**
- AWS S3 for file uploads (CVs, profile pictures)
- AWS Lambda or SNS for notifications
- AWS RDS or DynamoDB for scalability

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React, Redux Toolkit / React Query, Vite |
| **Backend** | Node.js, Express |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **Styling** | TailwindCSS |
| **Testing** | Jest, Supertest |
| **Deployment (Planned)** | AWS / Vercel / Render |

---

## 🏗️ Folder Structure

```
skillsmatch/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/skillsmatch.git
cd skillsmatch
```

### 2️⃣ Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3️⃣ Create environment files

#### In `/backend/.env`
```
PORT=5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
```

#### In `/frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

### 4️⃣ Run the application (both backend & frontend)
```bash
npm run start
```

👉 This runs both the **Express server** and the **React client** concurrently.

---

## 🧪 Testing

Run unit and integration tests in the backend:
```bash
npm run test
```

---

## 💡 Future Improvements
- [ ] Real-time chat with Socket.io  
- [ ] AWS S3 file upload  
- [ ] Payment integration (Stripe test mode)  
- [ ] Email notifications with AWS SES or Nodemailer  
- [ ] Deployment on AWS (Elastic Beanstalk / EC2)  

---

## 📸 Screenshots (coming soon)
*(Add UI screenshots here once your frontend is ready)*

---

## ✨ Author

**Félicien Ilenga**  
Full-Stack Developer | React | Node.js | AWS  
📧 [your.email@example.com]  
🔗 [LinkedIn Profile] | [Portfolio Website]

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use and modify it for learning or personal projects.
