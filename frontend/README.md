# CampusHubX Frontend

React frontend application for CampusHubX platform.

## Tech Stack

- React 18
- Vite
- TailwindCSS
- React Router v6
- Axios
- React Hook Form + Zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

- `/src/components` - Reusable components
- `/src/pages` - Page components
- `/src/services/api` - API service functions
- `/src/contexts` - React contexts
- `/src/hooks` - Custom hooks
- `/src/utils` - Utility functions
- `/src/routes` - Route configuration

## Features

- Authentication (Login/Register)
- Role-based dashboards (Student, College, Recruiter)
- Opportunity browsing and matching
- Application management
- Profile management
- Responsive design
