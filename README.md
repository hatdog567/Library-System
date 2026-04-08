# ArkLib

ArkLib is a Digital Library and Book Management System that allows users to upload, manage, and browse books in a centralized online platform.

The system enables users to create accounts, submit books, edit book details, and explore a growing collection of digital resources.

## System Architecture

ArkLib is built as a **Next.js** full-stack web application (converted from PHP).

### Frontend
- **Framework:** Next.js 15 (React)
- **Styling:** Tailwind CSS + Custom CSS
- **Features:** User interface, forms, modals, book display and search

### Backend
- **Framework:** Next.js API Routes
- **Authentication:** JWT-based sessions with HTTP-only cookies
- **Data Storage:** In-memory storage (demo mode) or database integration

### Database Support
- Neon PostgreSQL (optional integration)
- In-memory storage for demo/development

## Project Structure

```
arklib/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── register/route.js
│   │   │   ├── logout/route.js
│   │   │   ├── session/route.js
│   │   │   └── forgot-password/route.js
│   │   └── books/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── dashboard/
│   │   └── page.js               # Main dashboard (protected)
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Landing page
│
├── components/                   # React Components
│   ├── auth-modal.js             # Login/Signup modal
│   └── book-modal.js             # Add/Edit book modal
│
├── lib/                          # Utilities
│   ├── auth.js                   # Authentication helpers (JWT)
│   └── db.js                     # Database/storage layer
│
├── public/                       # Static assets
│   ├── img/                      # Images
│   └── uploads/                  # User uploads
│
├── scripts/                      # Database scripts
│   └── setup-db.sql
│
├── documentation/                # Project documentation
│   └── arklib_documentation.md
│
├── legacy/                       # Original PHP version (archived)
│   ├── php/                      # PHP files
│   ├── css/                      # Legacy stylesheets
│   ├── js/                       # Legacy JavaScript
│   └── sql/                      # SQL scripts
│
├── middleware.js                 # Route protection
├── next.config.js
├── package.json
└── README.md
```

## Key Features

- User authentication (Login / Signup)
- Password show/hide toggle
- Book submission and management
- Book cover uploads
- Dashboard with book listings
- Search functionality
- Password recovery system
- Responsive design (mobile & desktop)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Clone or download the project

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Mode

The app runs in demo mode with in-memory storage by default. Data will persist during the session but will reset when the server restarts.

### Production Mode (with Database)

To use persistent storage, connect a Neon PostgreSQL database:
1. Create a Neon database at [neon.tech](https://neon.tech)
2. Add the `DATABASE_URL` environment variable
3. Run the setup script in `scripts/setup-db.sql`

## Example Workflow (Submitting a Book)

1. User logs into the dashboard
2. User clicks "Add New Book"
3. A form modal appears
4. The form sends data to `/api/books`
5. The backend validates and stores the data
6. The book appears on the dashboard

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **bcryptjs** - Password hashing
- **jose** - JWT handling
- **SWR** - Data fetching (optional)

## Version

ArkLib v2.0 (Next.js Edition)

---

*Converted from PHP to Next.js for modern web deployment*
