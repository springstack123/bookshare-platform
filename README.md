BookCycle — Book Exchange & Selling Platform

BookCycle is a full-stack web application designed to recycle knowledge by allowing readers to share, borrow, exchange, and sell books within their community.

Instead of letting books sit unused on shelves, BookCycle enables them to move from one reader to another, creating a sustainable knowledge-sharing ecosystem.

🌍 Project Vision

The goal of BookCycle is to promote knowledge recycling.

Instead of books staying unused after one reader finishes them, the platform allows books to circulate through a network of readers.

📖 “Recycle knowledge by passing books from one reader to another.”

This approach:

reduces educational costs

promotes sustainable learning

builds reading communities

✨ Key Features
👤 For Readers
📚 Browse Books

Search and filter books by:

Category

City

Listing Type

Author

🔁 Multiple Listing Types
Type	Description
Borrow	Borrow books for free
Exchange	Swap books with another user
Sell	Buy books at affordable prices
🔐 Authentication

Secure login and registration using JWT authentication.

❤️ Wishlist

Save books you want to read later.

⭐ Reviews & Ratings

Rate books and share reading experiences.

📖 For Book Owners
📤 List Your Books

Add books with:

Cover image

Description

Price (optional)

Book condition

⚙ Manage Listings

Update or remove your book listings anytime.

📩 Request Management

Accept or reject:

borrow requests

exchange requests

purchase requests

📊 Transaction Tracking

Track book requests and exchanges.

⚙️ Platform Features

✔ City-based book discovery
✔ Admin dashboard for management
✔ Secure authentication system
✔ Mobile-responsive UI
✔ Book condition tracking

🏗️ System Architecture
🧰 Tech Stack
Frontend

React 18

Vite

React Router

Context API

CSS Modules

Backend

Spring Boot 3.x

Spring Security

JWT Authentication

Spring Data JPA

Maven

Database

MySQL

H2 (for development)

🚀 Getting Started
Prerequisites

Make sure you have installed:

Node.js 18+

Java 17+

Maven

MySQL (optional)

🔧 Backend Setup
cd bookshare-backend

./mvnw clean install

./mvnw spring-boot:run

Backend runs at:

http://localhost:8080
💻 Frontend Setup
cd bookshare-frontend

npm install

npm run dev

Frontend runs at:

http://localhost:5173
📁 Project Structure
bookshare-platform
│
├── bookshare-backend
│   └── src/main/java/com/bookshare_backend
│       ├── controller
│       ├── service
│       ├── repository
│       ├── entity
│       ├── dto
│       ├── security
│       └── exception
│
├── bookshare-frontend
│   └── src
│       ├── components
│       ├── pages
│       ├── services
│       └── App.jsx
│
└── README.md
🔌 API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
Books
GET    /api/books
GET    /api/books/{id}
POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}
Users
GET /api/users/me
PUT /api/users/me
Wishlist
GET    /api/wishlist
POST   /api/wishlist/{bookId}
DELETE /api/wishlist/{bookId}
Requests
GET  /api/requests/sent
GET  /api/requests/received
POST /api/requests/{id}/accept
POST /api/requests/{id}/reject
📊 Database Design (Concept)
🖼 UI Highlights

The platform includes:

Pastel themed interface

Book grid and list view

Book detail pages

Wishlist system

Mobile-responsive layout

Colors used:

Primary Yellow : #FEFF86
Light Blue     : #B0DAFF
Background     : White
Text           : Dark Grey
🔮 Future Improvements

Possible future features:

AI book recommendation system

Nearby reader discovery

In-app chat between users

Book delivery integration

Mobile app version

🤝 Contributing

Fork the repository

Create a feature branch

git checkout -b feature/new-feature

Commit changes

git commit -m "Add new feature"

Push to GitHub

git push origin feature/new-feature

Open a Pull Request

📜 License

This project is licensed under the MIT License.
