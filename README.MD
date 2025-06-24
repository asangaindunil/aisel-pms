# 🏥 Aisel Health — Advanced Patients Management System

Welcome to my technical challenge solution for **Aisel Health**!

This project demonstrates a **production-ready, full-stack Next.js Patients Management System**, built entirely in a **monolithic Next.js application** — showcasing advanced UX/UI, robust architecture, security best practices, and exceptional performance.

---

## 🎯 **Focus Areas**

✅ **Advanced UX/UI**  
- Real-time patient search & filtering  
- Optimistic UI updates for instant feedback  
- Skeleton loaders, micro-interactions & smooth animations  
- Accessible, mobile-first design  
- Modern, healthcare-inspired color system

✅ **Architectural Excellence**  
- Clean separation of concerns  
- Type-safe APIs (TypeScript)  
- Error boundaries & robust error handling  
- API routes used as backend for a seamless stack

✅ **Security**  
- JWT authentication (httpOnly cookies)  
- Role-based access control (Admin/User)  
- Comprehensive input validation

✅ **Performance**  
- Efficient state management with React Context & hooks  
- Minimal re-renders  
- Fast loading and responsive layouts

---

## 📦 **Tech Stack**

- Frontend & Backend | **Next.js 14+ (App Router)** 
- Styling | **Tailwind CSS**, **Shadcn UI** 
- State Management | **React Context**, custom hooks 
- Authentication | **JWT**, secure cookies 
- Database | **In-memory store** (can swap with Postgres) 
- Validation | **Zod** 
- Deployment Ready | Docker + Vercel/Render compatible 

---

## 🚀 Sample Credentials 

- **Admin:** `admin` / `admin123`
- **User:** `user` / `user123` 

---

## ⚡ **Quick Start**

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/aisel-pms.git
cd aisel-pms
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start the development server

```bash
npm run build
npm start
```

* ✅ **Frontend & Backend:** [http://localhost:3000](http://localhost:3000)

---

## 🗂️ **Key Project Structure**

```
src/
 ├── app/                   # Next.js App Router (pages & API routes)
 │   ├── api/               # API routes (auth, patients CRUD)
 │   ├── layout.tsx         # Root layout
 │   ├── page.tsx           # Dashboard landing page
 │   ├── globals.css        # Global styles
 ├── components/            # Reusable UI components (Table, Form, Modal, Spinner)
 ├── contexts/              # React Contexts (AuthContext)
 ├── hooks/                 # Custom hooks (usePatients)
 ├── lib/                   # Utilities (validation, JWT, DB, middleware)
 ├── types/                 # TypeScript types (Patient, Auth)
 ├── middleware.ts          # Global auth middleware for API routes
```

---

## 🔑 **Core Features**

* ✅ **JWT Authentication** with **httpOnly cookies**
* ✅ **Admin/User Roles** with RBAC
* ✅ **Patients CRUD** via API Routes
* ✅ **Real-Time Search & Filter**
* ✅ **Optimistic UI Updates** with rollback
* ✅ **Form Validation** using Zod
* ✅ **Accessibility (A11y)** for forms & modals
* ✅ **Skeleton Loaders & Smooth Transitions**
* ✅ **Mobile-First Responsive Layouts**

---

## 🎨 **Design System**

- `#3B82F6` (Blue) | Primary actions
- `#14B8A6` (Teal) | Secondary actions
- `#EF4444` (Red)  | Critical actions (e.g. Delete) 

Typography, spacing, and layout follow **modern healthcare UI guidelines** for clarity and ease of use.

---

## �� **Testing**

* ✅ **Form validation** tested with edge cases
* ✅ **API routes** validated with input sanitization
* ✅ **Role-based access** verified with secure route guards
* ✅ Optional: add Cypress or Playwright for E2E flows

---

## 📦 **Environment Variables**

- `JWT_SECRET` | Secret for signing JWT tokens 

---

## 🐳 **Docker Ready**

Run the entire app in a container:

```bash
docker build -t aisel-pms .
docker run -p 3000:3000 aisel-pms
```

---


## 💡 **Possible Enhancements**

* Connect to a real Postgres DB (easy with Prisma or Drizzle)
* Add patient timeline/audit logs
* Implement password reset flow
* Add CI/CD with GitHub Actions
* Expand E2E tests with Cypress or Playwright

---

## 🙌 **Thank You**

Thank you for reviewing this project!
It highlights my ability to design **modern, secure, performant healthcare apps** with a polished, user-friendly experience.



