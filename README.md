# Kanban Job Tracker

A modern, interactive Kanban-style job application tracker built with Next.js, Express.js, and MongoDB. Track your job applications across different stages with smooth drag-and-drop functionality.

## Features

- **Interactive Kanban Board**: Drag and drop job cards between different status columns
- **CRUD Operations**: Add, edit, and delete job applications
- **Real-time Updates**: Changes are immediately persisted to MongoDB
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript**: Full type safety across the entire application
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **@dnd-kit** for drag-and-drop functionality
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **PostgreSQL** (Neon DB) with Prisma ORM
- **TypeScript** for type safety
- **CORS** enabled for cross-origin requests

## Job Status Columns

- **Applied**: Jobs you've recently applied to
- **Interviewing**: Jobs in the interview process
- **Offer Received**: Jobs where you've received an offer
- **Rejected**: Jobs that didn't work out

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Neon DB account (free tier available)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Kanban-style-Job-Tracke
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up Neon DB**
   - Create a free account at [Neon](https://neon.tech)
   - Create a new project and database
   - Copy your connection string

4. **Set up environment variables**
   ```bash
   # In the server directory
   cd server
   cp .env.example .env
   # Edit .env with your Neon DB connection string
   ```

5. **Set up the database**
   ```bash
   cd server
   npm run db:push
   npm run db:generate
   ```

6. **Run the application**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
Kanban-style-Job-Tracke/
├── client/                 # Next.js frontend
│   ├── app/               # Next.js 14 app directory
│   ├── components/        # React components
│   ├── lib/              # API utilities
│   ├── types/            # TypeScript type definitions
│   └── package.json
├── server/                # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## API Endpoints

- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job
- `PUT /api/jobs/:id` - Update a job
- `DELETE /api/jobs/:id` - Delete a job
- `GET /api/health` - Health check

## Usage

1. **Add a Job**: Click the "Add Job" button to create a new job application entry
2. **Edit a Job**: Click the "Edit" button on any job card to modify its details
3. **Move Jobs**: Drag and drop job cards between columns to update their status
4. **Delete Jobs**: Click the "Delete" button to remove a job application

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variable: `API_URL=https://your-backend-url.com/api`
4. Deploy

### Backend (Render/Railway)
1. Create a new web service
2. Connect your repository
3. Set environment variables:
   - `DATABASE_URL=your-neon-db-connection-string`
   - `PORT=5000`
4. Add build command: `npm run build`
5. Deploy

### Database (Neon DB)
1. Create a free account at Neon
2. Create a new project and database
3. Get your connection string
4. Update the `DATABASE_URL` environment variable
5. Run `npm run db:push` to sync the schema


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [@dnd-kit](https://dndkit.com/) for the excellent drag-and-drop library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Next.js](https://nextjs.org/) for the React framework
- [MongoDB](https://www.mongodb.com/) for the database solution