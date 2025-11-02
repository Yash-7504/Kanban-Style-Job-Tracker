# Neon DB Setup Guide

## Quick Setup with Neon DB

1. **Create a Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project

2. **Get Your Connection String**
   - In your Neon dashboard, go to your project
   - Click on "Connection Details"
   - Copy the connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

3. **Update Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `.env` and replace the DATABASE_URL:
   ```
   PORT=5000
   DATABASE_URL="your-neon-connection-string-here"
   ```

4. **Initialize Database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the Application**
   ```bash
   # From the root directory
   npm run dev
   ```

## Alternative: Use a Demo Connection String

For quick testing, you can use this demo connection string (read-only):
```
DATABASE_URL="postgresql://demo:demo@demo.neon.tech/demo?sslmode=require"
```

**Note**: This is just for testing. Create your own Neon DB for a real application.