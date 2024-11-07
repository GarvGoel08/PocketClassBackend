# Instructor-Student Booking System

This is a web-based booking platform for students to book available time slots with instructors. It includes user signup, login, and dashboards for both students and instructors, allowing them to manage bookings, create slots, and view details.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Features
- **User Signup & Login**: Allows both students and instructors to create accounts and log in.
- **Student Dashboard**: Displays list of instructors and allows students to book time slots.
- **Instructor Dashboard**: Displays instructor's available slots and bookings, with options to create new slots.
- **Role-Based Data**: Fetches data based on user role (Student/Instructor).
  
## Technologies
- **Frontend**: React.js, Tailwind CSS for styling
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore for user data and slot management
- **Auth**: Bcrypt for password hashing
- **Hosting**: Vercel

## Usage

1. **Signup/Login**: 
   - Go to the Signup page to register as a Student or Instructor.
   - Login with valid credentials to access the respective dashboards.

2. **Student Dashboard**:
   - **View Instructors**: Displays a list of available instructors, with an option to filter by subject.
   - **Book a Slot**: Click on an instructor to view available time slots and select one to book.
   - **View Bookings**: Displays a list of all bookings made by the student, organized by status.

3. **Instructor Dashboard**:
   - **Create Slots**: Allows instructors to add available time slots for students to book.
   - **Manage Bookings**: Displays a list of student bookings, sorted by status (e.g., pending, confirmed).
   - **Slot Availability**: Shows all available slots for each instructor, allowing them to manage their schedule.

4. **Data Fetching**:
   - Bookings are fetched and displayed based on user role, and sorted by status to improve visibility of pending and confirmed slots.
   - Data is loaded from the backend using the base URL from environment variables, making it flexible for different deployment setups.

## Some API Routes

### User Routes (`/api/user`)
- **`POST /signup`** - Registers a user (either Student or Instructor) with required details.
- **`POST /signin`** - Logs in a user, returns user details including role and user ID.

### Slot Routes (`/api/slot`)
- **`POST /add`** - Instructor can create a new time slot for bookings.
- **`GET /instructor/:instructorId`** - Fetches available slots for a specific instructor based on the `InstructorID`.

### Booking Routes (`/api/booking`)
- **`POST /add`** - Creates a new booking for a student with a specified slot.
- **`GET /instructor/:userId`** - Retrieves all bookings for an instructor, organized by status.
- **`GET /student/:userId`** - Retrieves all bookings for a student, organized by status.

There are several more API Routes which are explained effectively in the HLD

