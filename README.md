# 🚑 EMS Staff Dashboard

A lightweight, responsive Emergency Medical Services (EMS) dashboard built with React and TailwindCSS. It features Firebase login for doctors, a mock patient list, and simple analytics.

---
## 📁 Project Structure
```
ems-dashboard/
├── public/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Login and Dashboard pages
│   ├── utils/              # Mock data & Firebase setup
│   ├── App.jsx             # App entry point with routes
│   ├── main.jsx            # Vite entry point
│   └── index.css           # Tailwind setup
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md

```
## 🔧 Tech Stack

- **Frontend:** React (Vite)
- **Styling:** TailwindCSS
- **Authentication:** Firebase Auth (email/password)
- **Routing:** React Router DOM
- **State:** React Hooks
- **Mock Data:** Static JSON (in-memory)

---

## 📸 Features

✅ Doctor login (via Firebase)  
✅ Protected dashboard routes  
✅ Mock patient list display  
✅ Analytics cards (admissions, pending labs)  
✅ Logout functionality  
✅ Fully responsive mobile layout  
✅ Clean component structure

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/ems-dashboard.git
cd ems-dashboard
npm install 
npm run dev
