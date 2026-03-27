🚀 SHUATS RentMart
A Student Rental, Resale & Campus Forum Platform with AI & Trust System

SHUATS RentMart is a full-stack MERN web application designed specifically for SHUATS students to rent, sell, and exchange academic resources safely within campus. The platform integrates AI-powered assistance, trust scoring, secure authentication, and campus-based meet-up suggestions to create a reliable and efficient student marketplace.

📌 Table of Contents
Project Overview
Tech Stack
Key Features
AI Features
Security Features
System Architecture

📖 Project Overview

SHUATS RentMart is a secure campus-based platform where students can:

Rent or sell academic items (books, calculators, electronics, etc.)
Communicate via real-time chat
Coordinate offline meet-ups within campus
Participate in a moderated campus forum
Use AI tools for content generation and assistance

The system ensures only verified SHUATS students can access the platform through ID verification and admin approval.

🛠️ Tech Stack

Frontend:
React.js (Vite)
Tailwind CSS
Redux Toolkit
Socket.IO Client
Leaflet (Campus Map)

Backend:
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Socket.IO

Third-party Services:

Cloudinary (Image Upload)
Nodemailer (Email System)
Gemini API (AI Features)

✅ Key Features

🔐 Authentication & Security

SHUATS email-only registration
Student ID card upload (Cloudinary)
Admin approval/rejection workflow
Pending & rejected account handling
JWT-based authentication
Forgot / Reset Password system
Role-based access control

🛍️ Marketplace System

Rent / Sell item listings
Categories, conditions, pricing
Search, filter, pagination
Request system (Buy/Rent)
Request lifecycle:
Accept / Reject / Complete / Cancel

💬 Communication System

Real-time chat using Socket.IO
Buyer ↔ Seller interaction
Offline transaction coordination

🗺️ Campus Meet-Up System

Leaflet-based campus map
Predefined safe meet-up locations
Admin-controlled location management

⭐ Trust Score System

Dynamic user rating based on:

Successful transactions
Reviews & ratings
Account activity
Reports / cancellations

🌐 Campus Forum

Admin announcements & posts
Forum access request system
Student post creation (after approval)
Post moderation by admin
Comments & likes system

🛡️ Admin Panel (Separate Interface)

Runs on separate port (5174)
User management (CRUD)
Registration approval (ID verification)
Item moderation
Request oversight
Forum moderation
Report/dispute handling
Meetup location CRUD
Analytics dashboard

🔔 Notification System

Email notifications (Nodemailer)
In-app notifications

👤 User Profiles

Profile management
Public user profiles
Trust score visibility

🤖 AI Features

AI Item Description Generator
AI Forum Title, Caption & Article Generator
AI Chat Assistant
Smart Content Suggestions using Gemini API

🔒 Security Features

Restricted email login (SHUATS only)
Admin-based account activation
Protected frontend routes
Secure JWT authentication
Role-based authorization
Verified student identity via ID upload

🏗️ System Architecture

RESTful API structure
Modular backend (MVC pattern)
Separate Admin & User frontend
Scalable MERN architecture
Cloud-based image storage (Cloudinary)
