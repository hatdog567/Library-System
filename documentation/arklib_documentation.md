# ArkLib - Project Documentation

Welcome to the documentation for **ArkLib**, a digital library and book management Software as a Service (SaaS). 

This guide is written for beginners to understand how the system works behind the scenes. We will not be diving into complicated lines of code here. Instead, we'll explain the **purpose of each file**, what it does, and how all the moving parts connect together to create the website you see in your browser.

---

## 🏗️ 1. How the System Generally Works

ArkLib is what we call a **Full-Stack Web Application**. It has three main layers:

1. **The Frontend (What you see):** Made with HTML, CSS, and Javascript. This handles displaying the book covers, forms, and ensuring the website looks visually appealing when you click around.
2. **The Backend (The brain):** Made with PHP. This handles logic. For example, when you try to log in, PHP takes your password and checks if it's correct.
3. **The Database (The memory):** Made with MySQL. This stores all the permanent information, like user accounts, book titles, and descriptions. 

When you click "Submit Book", your browser sends the data to the Backend (PHP), which then stores it safely into the Database (MySQL). When you refresh the page, the application gets that data back out of the Database and shows it to you on the Frontend.

---

## 📂 2. File Directory Overview

Here is a simple breakdown of every file in the project and the role it plays.

### 🏠 The User Interface (Frontend Pages)
These are the physical pages a user visits and interacts with.

* **[index.php](file:///c:/xampp/htdocs/projects/Library%20System/index.php)**
  * **What it is:** The Landing Page.
  * **Function:** This is the first page visitors see. It shows off the library and has the main buttons to **Login**, **Sign Up**, and view the **About** section. It contains the visual layout for the authentication forms (username, email, password).
* **[main_site.php](file:///c:/xampp/htdocs/projects/Library%20System/main_site.php)**
  * **What it is:** The Main Dashboard.
  * **Function:** Once a user successfully logs in, they are brought here. This page displays the entire collection of uploaded books. It has the features to display the welcome banner, the live statistics (e.g., "Your Submissions"), the search bar, and the interactive modals (pop-up windows) used to Add or Edit books.

### ⚙️ The Mechanics (Backend Processing Files)
These files mostly operate silently in the background. You don't "see" them, but they do the heavy lifting when you submit a form.

* **[database.php](file:///c:/xampp/htdocs/projects/Library%20System/database.php)**
  * **What it is:** The Connection file.
  * **Function:** A small file that acts as a bridge. It simply tells the rest of the application how to connect to the MySQL database (using the database name, username, and password). All other PHP files load this first.
* **[login-auth.php](file:///c:/xampp/htdocs/projects/Library%20System/login-auth.php)**
  * **What it is:** The Bouncer.
  * **Function:** When a user clicks "Login" or "Sign Up" on the landing page, the data is sent here. It creates new user accounts, checks if login passwords are correct, and either grants access to the [main_site.php](file:///c:/xampp/htdocs/projects/Library%20System/main_site.php) dashboard or sends an error back.
* **[forgot_password.php](file:///c:/xampp/htdocs/projects/Library%20System/forgot_password.php)**
  * **What it is:** The Password Resetter.
  * **Function:** Handles the logic when a user forgets their password. It verifies their email and safely updates their account with the new password they provided.
* **[submit_book.php](file:///c:/xampp/htdocs/projects/Library%20System/submit_book.php)**
  * **What it is:** The Book Receiver.
  * **Function:** Connected to the "Submit a Book" form. It checks if the title, author, and links provided are valid. If a cover image was uploaded, it saves the image into the `uploads` folder and saves the book details to the database so it can be displayed on the dashboard.
* **[update_book.php](file:///c:/xampp/htdocs/projects/Library%20System/update_book.php)**
  * **What it is:** The Book Editor.
  * **Function:** Connected to the "Edit Book" form. Similar to submitting a book, but instead of creating a new book, it finds the specific book in the database and overwrites its old data (like changing the URL or updating the author name) with your new changes.
* **[logout.php](file:///c:/xampp/htdocs/projects/Library%20System/logout.php) & [logout.js](file:///c:/xampp/htdocs/projects/Library%20System/logout.js)**
  * **What it is:** The Exit Door.
  * **Function:** These simply destroy the user's logged-in status (session) and redirect them securely back to the main landing page ([index.php](file:///c:/xampp/htdocs/projects/Library%20System/index.php)), ensuring that nobody else can access their dashboard if they leave the computer.

### 🎨 The Styling and Interactivity (CSS & Javascript)
These files make sure the system looks great and feels responsive.

* **[main.css](file:///c:/xampp/htdocs/projects/Library%20System/main.css), [main_site.css](file:///c:/xampp/htdocs/projects/Library%20System/main_site.css) & [style.css](file:///c:/xampp/htdocs/projects/Library%20System/style.css)**
  * **What they are:** Stylesheets.
  * **Function:** They contain all the definitions for colors, fonts, margins, positioning, and hover effects. They are the reason the site has a rich, premium aesthetic with smooth transitions and organized cards. 
* **[script.js](file:///c:/xampp/htdocs/projects/Library%20System/script.js)**
  * **What it is:** Frontend interactivity scripts.
  * **Function:** Makes things happen without needing to refresh the page. For instance, when you click "Login," the modal smoothly slides into view. This Javascript handles those pop-up states and switches between the "Sign Up" and "Login" tabs easily.

### 🗄️ Database & Storage
Where everything is remembered.

* **[create_books_table.sql](file:///c:/xampp/htdocs/projects/Library%20System/create_books_table.sql)**
  * **What it is:** Blueprint instructions for MySQL.
  * **Function:** This file isn't run by the website itself; rather, it contains the instructions to originally create the tables (think Excel spreadsheets) in the database. It sets up columns for `title`, `author`, `genre`, and lists some starting books (like *The Great Gatsby*).
* **`img/` Folder**
  * **Function:** Holds static website images, like the ArkLib logo, user avatars, and background images.
* **`uploads/` Folder**
  * **Function:** A folder managed by the system. When users upload their own custom book covers from their computer, the files are safely stored in this directory.

---

## 🚀 3. Summary of a Data Journey 
*(Example: Adding a Book)*

To completely understand how ArkLib works, here is a step-by-step trace of what happens when you decide to add a book:
1. You click "Submit Book" on **[main_site.php](file:///c:/xampp/htdocs/projects/Library%20System/main_site.php)**. A Javascript function opens a visual pop-up form.
2. You fill in the title, author, and attach a picture, then click Submit.
3. The form packages your text and image and sends it securely to **[submit_book.php](file:///c:/xampp/htdocs/projects/Library%20System/submit_book.php)**.
4. **[submit_book.php](file:///c:/xampp/htdocs/projects/Library%20System/submit_book.php)** connects to the database using **[database.php](file:///c:/xampp/htdocs/projects/Library%20System/database.php)**.
5. It checks your inputs. If everything looks good, it drops your photo into the **`uploads/`** folder and inserts a new row into the **`books`** table inside the MySQL database.
6. The system sends a "Success" message back to the dashboard. The Javascript hides the pop-up, instantly bumps up your "Your Submissions" number, and refreshes the page so your new masterpiece appears on the rack!

---

*Documentation prepared for ArkLib Version 1.0.*
