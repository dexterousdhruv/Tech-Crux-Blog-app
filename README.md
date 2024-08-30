# TechCrux

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [API Documentation](#api-documentation)

## Project Overview

Welcome to TechCrux, a full-stack project designed to deliver a seamless and dynamic blogging experience. Built with React and Redux Toolkit on the frontend, and powered by Node.js, Express, and MongoDB on the backend, this application provides robust functionality and a clean user interface.

![TechCrux](/client/public/Logo.png)


The project is structured as a monorepo with two main directories:
- `client`: The frontend application built with React
- `api`: The backend API server built with Node.js and Express

## Technology Stack

### Frontend (client)
- React.js
- React Router for navigation
- Redux Toolkit for centralized state management
- Tailwind CSS and Flowbite for styling
- Axios for API requests

### Backend (api)
- Node.js
- Express.js
- MongoDB for database operations
- Firebase for authentication and image uploads


## Project Structure

```
TechCrux/
├── client/             # Frontend directory
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── firebase.js
│   │   ├── index.css
│   │   └── main.js
│   ├── public/
│   └── package.json
│
└── api/                # Backend directory
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/vedhsaka/NotHotDog.git
   cd NotHotDog
   ```

2. Install dependencies for both packages:
   ```
   cd client
   npm install

   cd ../api
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `client` directory
   - Create a `.env` file in the `api` directory
   - For the frontend (`client/.env`):
     ```
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_API_BASE_URL=http://localhost:3000/api
     ```

   - For the backend (`api/.env`):
     ```
     PORT=3000
     MONGODB_URL=your_mongodb_connection_string
     JWT_SECRET=jwt_secret_key
     CLIENT_URL=http://localhost:5173

     ```

4. Start the development servers:
   - For the frontend:
     ```
     cd client
     npm run dev
     ```
   - For the backend:
     ```
     cd backend
     npm run dev
     ```

## API Documentation

The backend API provides the following main endpoints:

- `/api/auth`: Signup and signin management
- `/api/user`: User management
- `/api/post`: Blog post management
- `/api/comment`: Comment management

