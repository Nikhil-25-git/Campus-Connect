# 🎓 CampusConnect – Student Management Portal

A modern, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** university web portal designed for educational institutions to streamline student records, department administration, automated attendance tracking, and individual student academic dashboards.

![CampusConnect Banner](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 🔐 1. Authentication & Role-Based Authorization
- **Role-Based Access Control (RBAC):** Strict separation between **Administrator** (`admin`) and **Student** (`student`) roles.
- **Student Registration:** Public student enrollment with department, semester, roll number, and bio data.
- **Secure Password Hashing:** Powered by `bcryptjs` (salt rounds: 10).
- **JWT-Based Authentication:** Stateless JWT token authorization with HTTP headers (`Bearer <token>`).
- **Session Persistence:** Persistent user sessions stored safely with local storage synchronization.
- **One-Click Demo Login:** Fast evaluator testing buttons to auto-fill sample Admin and Student credentials.

### 📊 2. Admin Dashboard & Analytics
- **Live Institutional Metrics:**
  - Total Enrolled Students & Active Students count.
  - Total Academic Departments (Faculties).
  - Overall Institutional Attendance Average Percentage.
  - Today's Daily Attendance Percentage & Marked Headcount.
- **Interactive Visualizations:**
  - **Attendance Trend Chart:** Area chart illustrating daily attendance fluctuations over recent sessions (powered by `Recharts`).
  - **Department Distribution Chart:** Interactive donut chart showing student allocations across faculties.
- **Recent Registrations Feed:** Real-time log of the latest enrolled students with status badges and quick links.

### 👥 3. Student Management
- **Add New Students:** Comprehensive modal form with client and server-side validation.
- **View All Students:** Clean tabular layout with avatar, roll number, department, semester, attendance progress bar, and status badge.
- **Real-Time Search & Filtering:**
  - Instant text search across Student Name, Roll Number, and Email.
  - Filter by Department (`Computer Science`, `Electronics`, `Mechanical`, `Civil`, `IT`, `Electrical`).
  - Filter by Semester (`1` through `8`).
  - Filter by Status (`Active`, `Inactive`, `Graduated`, `Suspended`).
- **Edit Student Records:** Modal form with instant live synchronization.
- **Delete Student Records:** Permanent deletion with dual-confirmation dialog (cascading removal of attendance records and login credentials).
- **Student Profile View Modal:** Inspect complete student profile, contact numbers, residential address, demographics, attendance stats, and history.

### 📅 4. Attendance Management
- **Daily Attendance Marking:**
  - Interactive Date Picker (defaults to current date).
  - Department filtering to view specific classes.
  - One-click bulk actions: **"Mark All Present"** & **"Mark All Absent"**.
  - Quick toggle buttons (`Present` / `Absent`) with optional remarks (e.g. "Medical leave").
  - Instant calculations of session attendance percentage.
- **Attendance History Log:**
  - Historical date-by-date attendance records.
  - Headcounts of present and absent students.
  - Session attendance percentage with color-coded progress bars.
  - One-click review/edit for any prior session.

### 🎓 5. Student Dashboard & Portal
- **Personal Academic Overview:**
  - Welcome banner highlighting Roll Number, Department, Semester, and Status.
  - Visual circular attendance gauge indicator.
  - Automatic **Attendance Shortage Warning Alert** when attendance falls below 75%.
- **Academic Metrics:** Total classes conducted, classes attended, classes missed, and percentage.
- **Attendance History Log:** Searchable and filterable history of individual sessions and dates.
- **Profile Management:**
  - Update full name, phone number, residential address, gender, birth date, and avatar image.
  - Read-only protection for Roll Number, Department, and institutional Email.
- **Security Settings:** Change password with verification of current password.

### 🎨 6. Modern User Interface & Experience
- **Theme Palette:** University aesthetic using clean blues (`#1e40af`, `#2563eb`), slate grays (`#f8fafc`), and pure white cards.
- **Responsive Navigation:** Collapsible sidebar drawer for mobile and tablets; permanent sidebar for desktop screens.
- **Toast Notifications:** Feedback on every action using `react-toastify`.
- **Loading Animations:** Spinner animations and backdrop overlays for seamless asynchronous states.
- **Custom Scrollbars & Polished Typography:** Inter font family with crisp typography hierarchy.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v18) + Vite (v6) | High-speed single-page application bundling |
| **Routing** | React Router DOM (v6) | Declarative client-side routing & route guards |
| **Styling** | Tailwind CSS (v3) | Utility-first responsive design system |
| **Charts** | Recharts (v2) | Responsive SVG charts (Area & Donut charts) |
| **Icons** | Lucide React | Clean, modern iconography |
| **Notifications** | React Toastify | Toast notification alerts |
| **HTTP Client** | Axios | REST API requests with JWT interceptors |
| **Backend Runtime** | Node.js (v18+) | Server-side JavaScript runtime |
| **Web Framework** | Express.js (v4) | RESTful API server architecture |
| **Database** | MongoDB Atlas & Mongoose (v8) | Object Data Modeling (ODM) & cloud NoSQL storage |
| **Security** | JWT & bcryptjs | Password hashing and signed access tokens |

---

## 📂 Project Architecture

```
CampusConnect/
├── backend/
│   ├── .env                       # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example               # Template environment configuration
│   ├── package.json               # Backend dependencies and run scripts
│   └── src/
│       ├── config/
│       │   └── db.js              # MongoDB Atlas connection & auto-fallback handler
│       ├── controllers/
│       │   ├── authController.js       # Register, login, me, update profile, change password
│       │   ├── studentController.js    # Student CRUD, search, department filtering
│       │   ├── attendanceController.js # Bulk marking, date-wise sheets, student history
│       │   └── dashboardController.js  # Aggregated metrics for Admin & Student portals
│       ├── middleware/
│       │   ├── authMiddleware.js       # JWT verification, adminOnly & studentOnly guards
│       │   └── errorMiddleware.js      # Structured 404 & JSON error handler
│       ├── models/
│       │   ├── User.js            # User model (name, email, password, role)
│       │   ├── Student.js         # Student profile (rollNumber, dept, semester, bio)
│       │   └── Attendance.js      # Attendance record (student, date, status, remarks)
│       ├── routes/
│       │   ├── authRoutes.js           # /api/auth routes
│       │   ├── studentRoutes.js        # /api/students routes
│       │   ├── attendanceRoutes.js     # /api/attendance routes
│       │   └── dashboardRoutes.js      # /api/dashboard routes
│       ├── services/
│       │   └── dataService.js     # Unified data layer supporting Atlas & in-memory engine
│       ├── utils/
│       │   ├── generateToken.js   # JWT token generator
│       │   └── seeder.js          # Demo accounts and attendance seeder
│       └── server.js              # Express app bootstrap, CORS, and route mounting
│
├── frontend/
│   ├── .env                       # Frontend env variables (VITE_API_BASE_URL)
│   ├── .env.example               # Template frontend env
│   ├── index.html                 # Single page application entry point
│   ├── package.json               # Frontend dependencies & Vite scripts
│   ├── postcss.config.js          # PostCSS configuration
│   ├── tailwind.config.js         # Tailwind theme & color extensions
│   ├── vite.config.js             # Vite configuration with API proxy
│   └── src/
│       ├── api/
│       │   └── axiosClient.js     # Axios client with JWT header interceptors
│       ├── context/
│       │   └── AuthContext.jsx    # Authentication provider & user session state
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx          # Header with user menu, role badge & mobile toggle
│       │   │   ├── Sidebar.jsx         # Responsive sidebar with role-filtered links
│       │   │   └── DashboardLayout.jsx # Master layout wrapper
│       │   ├── common/
│       │   │   ├── Badge.jsx           # Status, role & attendance pills
│       │   │   ├── ConfirmDialog.jsx   # Delete confirmation modal
│       │   │   ├── EmptyState.jsx      # Placeholder for empty query results
│       │   │   ├── Modal.jsx           # Animated modal overlay
│       │   │   ├── Spinner.jsx         # Loading spinner
│       │   │   └── StatCard.jsx        # Dashboard metric summary card
│       │   └── charts/
│       │       ├── AttendanceTrendChart.jsx # Recharts Area Chart
│       │       └── DepartmentPieChart.jsx   # Recharts Donut Pie Chart
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx           # Sign-in page with 1-click demo buttons
│       │   │   └── Register.jsx        # Public student registration
│       │   ├── admin/
│       │   │   ├── AdminDashboard.jsx  # Overview metrics, charts & recent signups
│       │   │   ├── StudentList.jsx     # Search, filter, CRUD student table
│       │   │   ├── AddEditStudentModal.jsx # Student modal form
│       │   │   ├── StudentDetailsModal.jsx # Student profile & performance modal
│       │   │   └── AttendanceManagement.jsx # Daily attendance marker & date history
│       │   ├── student/
│       │   │   ├── StudentDashboard.jsx    # Student greeting, gauge & recent records
│       │   │   ├── StudentAttendance.jsx   # Detailed personal attendance log
│       │   │   └── StudentProfile.jsx      # Bio editor & password change
│       │   └── NotFound.jsx            # 404 error page
│       ├── routes/
│       │   └── AppRoutes.jsx      # Role-based route guards (AdminRoute, StudentRoute)
│       ├── App.jsx                # Router, ToastContainer & AuthProvider wrapper
│       ├── main.jsx               # React DOM entry point
│       └── index.css              # Tailwind base directives & custom scrollbars
│
├── package.json                   # Root monorepo launcher scripts
└── README.md                      # Comprehensive project documentation
```

---

## 🗄️ Database Schemas (Mongoose)

### 1. `User` Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false }, // Hashed with bcryptjs
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  studentProfile: { type: ObjectId, ref: 'Student', default: null },
  avatar: { type: String, default: '' },
  timestamps: true
}
```

### 2. `Student` Model
```javascript
{
  user: { type: ObjectId, ref: 'User' },
  rollNumber: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true, min: 1, max: 8, default: 1 },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  dateOfBirth: { type: Date, default: null },
  address: { type: String, default: '' },
  enrollmentYear: { type: Number, default: 2024 },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated', 'Suspended'], default: 'Active' },
  avatar: { type: String, default: '' },
  timestamps: true
}
```

### 3. `Attendance` Model
```javascript
{
  student: { type: ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // Normalized YYYY-MM-DD
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'], default: 'Present' },
  remarks: { type: String, default: '' },
  markedBy: { type: ObjectId, ref: 'User' },
  timestamps: true
}
// Unique compound index: { student: 1, date: 1 } prevents duplicate attendance per day
```

---

## 🌐 REST API Documentation

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Authenticate Admin or Student & receive JWT |
| `GET` | `/api/auth/me` | Private | Retrieve currently authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update student profile details (phone, address, etc.) |
| `PUT` | `/api/auth/change-password` | Private | Change account password with old password verification |

### 👨‍🎓 Student Management (`/api/students`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Private | Get students with search (`search`), filters (`department`, `semester`, `status`) and attendance % |
| `GET` | `/api/students/:id` | Private | Get student by ID with full profile & attendance stats |
| `GET` | `/api/students/departments` | Private | Get list of distinct departments with student counts |
| `POST` | `/api/students` | Admin | Create a new student profile and user account |
| `PUT` | `/api/students/:id` | Admin | Update student information |
| `DELETE` | `/api/students/:id` | Admin | Delete student record, associated user, and attendance |

### 📋 Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/attendance/by-date` | Admin | Get attendance sheet for a date (`?date=YYYY-MM-DD&department=...`) |
| `GET` | `/api/attendance/dates` | Admin | Get list of historical dates with attendance rates |
| `POST` | `/api/attendance/bulk` | Admin | Bulk upsert attendance records for a specific date |
| `GET` | `/api/attendance/student/:studentId` | Private | Get attendance history for a student or `/student/me` |

### 📈 Dashboard (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/admin` | Admin | Summary statistics, trend charts, department stats, recent students |
| `GET` | `/api/dashboard/student` | Student | Student attendance summary, percentage gauge, recent records |

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Optional: MongoDB Atlas cluster URI (an automatic in-memory database engine is also included for instant evaluation!)

### 1. Clone or Open the Project
```bash
cd full_project
```

### 2. Configure Backend Environment
Navigate to `backend/`:
```bash
cd backend
```
Review or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect?retryWrites=true&w=majority
JWT_SECRET=campusconnect_super_secret_jwt_key_2026_secured
JWT_EXPIRE=7d
```

> **Note on MongoDB Connection:**
> If you have a MongoDB Atlas account, paste your connection string into `MONGO_URI`. If you want to run the project immediately without configuring an Atlas cluster, CampusConnect includes an automatic high-performance database engine fallback so that all features, logins, and CRUD actions run smoothly out of the box!

### 3. Configure Frontend Environment
Navigate to `frontend/`:
```bash
cd ../frontend
```
The file `frontend/.env` is pre-configured with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 Exact Terminal Commands to Run Locally

You can run the application by opening **two terminal windows**:

### Terminal 1: Start the Backend Server
```bash
cd backend
npm start
```
*The backend API server will start on [http://localhost:5000](http://localhost:5000).*

### Terminal 2: Start the Frontend Application
```bash
cd frontend
npm run dev
```
*The Vite development server will start on [http://localhost:5173](http://localhost:5173).*

Now open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Pre-Configured Demo Credentials

The portal is pre-seeded with initial institutional data for testing:

| Role | Email Address | Password | Roll Number | Department |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campusconnect.edu` | `Admin@12345` | — | Management |
| **Student (Demo 1)** | `rahul.sharma@campusconnect.edu` | `Student@12345` | `CS2023001` | Computer Science & Eng. |
| **Student (Demo 2)** | `priya.patel@campusconnect.edu` | `Student@12345` | `EC2023002` | Electronics & Comm. |
| **Student (Demo 3)** | `aman.verma@campusconnect.edu` | `Student@12345` | `ME2023003` | Mechanical Engineering |
| **Student (Demo 4)** | `sneha.kulkarni@campusconnect.edu` | `Student@12345` | `IT2023004` | Information Technology |

*(💡 You can also use the **"Admin Login"** and **"Student Login"** 1-click fill buttons directly on the login screen for instantaneous sign-in!)*

---

## 🧪 Testing the Portal Features

1. **Test Admin Login:** Click **"Admin Login"** on `/login` to sign in as Administrator.
2. **Review Analytics:** Inspect the statistical cards, attendance trend chart, department distribution chart, and recent registrations.
3. **Manage Students:** Go to **Student Records** to search, filter by department or semester, add a student, edit existing records, or view complete student performance profiles.
4. **Mark Attendance:** Go to **Attendance Manager**, select a date, toggle student statuses (or use "Mark All Present"), enter optional remarks, and click **Save Attendance**.
5. **Review Attendance History:** Switch to the **Attendance History Log** tab to see historical attendance records.
6. **Test Student Portal:** Log out and click **"Student Login"** on `/login` to sign in as Rahul Sharma. Notice the student dashboard with personalized attendance gauge, shortage warning indicator, personal profile editor, and password management.
7. **Test Student Registration:** Click **Register** on the login page to register a brand new student and immediately view their student profile.

---

## 🛡️ License
This project is open-source and developed for college portal demonstrations and academic evaluations.
