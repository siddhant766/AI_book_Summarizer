# BookMind AI 🧠

BookMind AI is a modern, full-stack, AI-powered Book Summarizer Web Application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

The application enables users to search for any book in the world, automatically retrieve rich metadata from the Google Books API, and leverage Gemini AI to compile original, non-copyrighted summaries, key takeaways, action checklist items, difficulty metrics, and notable figures. Additionally, users can compare books side-by-side and engage in an interactive chat directly with the context of any summarized book.

---

## Technical Stack

- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS, Framer Motion, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI Service**: Google Gemini API (`gemini-1.5-flash`)
- **Metadata Source**: Google Books API
- **Security**: JWT Authentication, bcryptjs password hashing

---

## Folder Structure

```text
bookmind-ai/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic handlers
│   ├── middleware/      # Auth & JWT checkers
│   ├── models/          # User, Book, Bookmark, History schemas
│   ├── routes/          # REST endpoints
│   ├── services/        # Google Books & Gemini integrations
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/            # React Client
    ├── public/
    ├── src/
    │   ├── components/  # Layouts (Navbar, Footer, Skeleton)
    │   ├── context/     # Auth Context state
    │   ├── pages/       # Landing, Login, Dashboard, Search, Compare, Saved
    │   ├── services/    # Axios interceptors config
    │   ├── index.css    # Tailwind styling tokens
    │   └── App.jsx      # Navigation routing
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create user profile
- `POST /api/auth/login` - Authenticate credentials & return JWT
- `GET /api/auth/profile` - Retrieve current profile details (Protected)

### BookSummaries & Analytics
- `GET /api/books` - Retrieve all summarized books library (Protected)
- `GET /api/books/search/:title` - Search Google Books volumes (Protected)
- `POST /api/books/generate-summary` - Query Gemini AI to create book analysis (Protected)
- `GET /api/books/:id` - Fetch database book details (Protected)
- `POST /api/books/:id/chat` - Discuss queries within book context (Protected)
- `POST /api/books/compare` - Compare two summarized books side-by-side (Protected)
- `GET /api/books/recommendations/dashboard` - Get analytics & personalized carousels (Protected)

### Bookmarks
- `GET /api/bookmarks` - Retrieve user's saved summaries (Protected)
- `POST /api/bookmarks` - Bookmark a summary (Protected)
- `DELETE /api/bookmarks/:id` - Delete bookmarked summary (Protected)

---

## Local Setup Instructions

### Prerequisites
- Node.js installed (v18+ recommended)
- Local MongoDB running, or a MongoDB Atlas connection string.
- Google Gemini API Key (visit [Google AI Studio](https://aistudio.google.com/) to get a free key).

### 1. Configure the Backend
Navigate to the `backend` folder:
```bash
cd backend
```

Create a `.env` file from the example:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bookmind-ai
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_BOOKS_API_KEY=
```
*Note: If `GEMINI_API_KEY` is not provided or remains empty, the backend will gracefully default to a simulated AI response fallback, enabling you to test the entire application interface instantly without api restrictions!*

Install backend packages and start the dev server:
```bash
npm install
npm run dev
```

### 2. Configure the Frontend
Navigate to the `frontend` folder:
```bash
cd ../frontend
```

Install frontend packages and launch the client:
```bash
npm install
npm run dev
```

The application will run locally on `http://localhost:5173`. Open it in your browser to begin exploring!
