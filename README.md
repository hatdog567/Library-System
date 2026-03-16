📚 ArkLib

ArkLib is a Digital Library and Book Management System (SaaS) that allows users to upload, manage, and browse books in a centralized online platform.

The system enables users to create accounts, submit books, edit book details, and explore a growing collection of digital resources.

🏗️ System Architecture

ArkLib follows a Full-Stack Web Application structure composed of three layers:

Frontend

Built using:

HTML

CSS

JavaScript

Responsible for:

User interface

Forms and modals

Book display and search features

Backend

Built using:

PHP

Handles:

User authentication

Form processing

Business logic

Communication with the database

Database

Built using:

MySQL

Stores:

User accounts

Book information

Uploaded book covers

📂 Project Structure
ArkLib
│
├── index.php              # Landing page (Login / Signup)
├── main_site.php          # Main dashboard
│
├── database.php           # Database connection
├── login-auth.php         # Authentication handler
├── forgot_password.php    # Password recovery
├── submit_book.php        # Book submission handler
├── update_book.php        # Book editing handler
├── logout.php             # Logout system
│
├── script.js              # Frontend interactivity
├── style.css              # Global styling
├── main.css
├── main_site.css
│
├── create_books_table.sql # Database setup
│
├── img/                   # Static images
└── uploads/               # User uploaded book covers
⚙️ Key Features

User authentication (Login / Signup)

Book submission and management

Book cover uploads

Dashboard with book listings

Search functionality

Password recovery system

🔄 Example Workflow (Submitting a Book)

User logs into the dashboard.

User clicks Submit Book.

A form appears using JavaScript modal.

The form sends data to submit_book.php.

The backend validates the data.

The book details are stored in MySQL.

The uploaded cover is saved in uploads/.

The book appears on the dashboard.

🚀 Version

ArkLib v1.0
