# Landbouw Museum Interactive Display

A comprehensive React.js and Node.js application for museum interactive displays, showcasing the history of agriculture through an engaging timeline interface.

## 🏛️ Project Overview

This interactive museum display application allows visitors to explore the evolution of farming from ancient times to the modern era. The system includes:

- **Interactive Timeline**: Touch-friendly timeline interface
- **Detailed Content Pages**: Rich media content with images, text, and interactive elements
- **Admin Panel**: Content management system for museum staff
- **Responsive Design**: Works on various screen sizes and touch devices
- **Database Integration**: MySQL backend with REST API

## 🏗️ Architecture

```
museum-laandbouw/
├── frontend/          # React.js frontend with Vite
├── backend/           # Node.js/Express.js API server
└── README.md          # This file
```

### Technology Stack

**Frontend:**
- React 18+ with JSX
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

**Backend:**
- Node.js with Express.js
- MySQL2 for database connectivity
- RESTful API design
- Comprehensive error handling
- Rate limiting and security middleware

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+ or MariaDB 10.3+
- Git

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd museum-laandbouw
```

2. **Set up the backend:**
```bash
cd backend
npm install
```

3. **Configure the database:**
   - Create a MySQL database named `museum_laandbouw`
   - Create a user with appropriate permissions:
```sql
CREATE DATABASE museum_laandbouw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'museum_user'@'localhost' IDENTIFIED BY 'museum_password';
GRANT ALL PRIVILEGES ON museum_laandbouw.* TO 'museum_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Configure environment variables:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your database credentials
# The app will create tables automatically on first run
```

5. **Start the backend server:**
```bash
npm run dev
# Server will start on http://localhost:5000
```

6. **Set up the frontend:**
```bash
cd ../frontend
npm install
```

7. **Start the frontend development server:**
```bash
npm run dev
# Application will open at http://localhost:3000
```

## 🗄️ Database Schema

The application automatically creates the following tables:

### `timeline_entries`
- Stores main timeline periods and basic information
- Fields: id, era, title, date_range, description, image, tags, order, is_active

### `content_entries`
- Stores detailed content for each timeline period
- Fields: id, timeline_id, era, title, subtitle, description, blocks, gallery, tags

### `visit_logs`
- Analytics data for museum visits and interactions
- Fields: id, session_id, content_id, page_path, visit_duration

### `activity_logs`
- Admin activity logging for content management
- Fields: id, type, description, user_id, details

## 🎨 Features

### Timeline Interface
- Interactive touch-friendly timeline
- Smooth animations and transitions
- Era-based color coding
- Search and filtering capabilities

### Content Management
- Rich content editor with multiple block types:
  - Text blocks with formatting
  - Image galleries with captions
  - Timeline events
  - Comparison blocks
  - Quote blocks
- Drag-and-drop reordering
- Content preview and publishing

### Admin Dashboard
- Real-time statistics and analytics
- Content overview and management
- System health monitoring
- Activity logging and audit trails
- Data export functionality

### Responsive Design
- Optimized for museum kiosk displays
- Touch-friendly interface
- High contrast mode for accessibility
- Multiple screen size support

## 📡 API Endpoints

### Timeline API
```
GET    /api/timeline              # Get all timeline entries
GET    /api/timeline/:id          # Get specific timeline entry
POST   /api/timeline              # Create new timeline entry
PUT    /api/timeline/:id          # Update timeline entry
DELETE /api/timeline/:id          # Delete timeline entry
GET    /api/timeline/search?q=    # Search timeline entries
```

### Content API
```
GET    /api/content               # Get all content entries
GET    /api/content/:id           # Get specific content entry
POST   /api/content               # Create new content entry
PUT    /api/content/:id           # Update content entry
DELETE /api/content/:id           # Delete content entry
GET    /api/content/featured      # Get featured content
```

### Admin API
```
GET    /api/admin/stats           # Dashboard statistics
GET    /api/admin/health          # System health check
GET    /api/admin/export          # Export data
GET    /api/admin/activity-logs   # Activity logs
```

## 🛠️ Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development

```bash
cd backend
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm test         # Run tests
npm run seed     # Seed database with sample data
```

### Project Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── Timeline/       # Timeline-related components
│   ├── DetailPage/     # Content detail components
│   ├── Admin/          # Admin panel components
│   └── Common/         # Shared UI components
├── pages/              # Page components
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and constants
└── styles/             # Global styles and Tailwind config

backend/src/
├── controllers/        # Route handlers and business logic
├── models/             # Database models and ORM
├── routes/             # Express route definitions
├── config/             # Database and app configuration
└── middleware/         # Custom middleware functions
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=museum_user
DB_PASSWORD=museum_password
DB_NAME=museum_laandbouw
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Customization

#### Tailwind Theme
Edit `frontend/tailwind.config.js` to customize:
- Color schemes
- Typography
- Spacing
- Museum-specific design tokens

#### Database Configuration
Modify `backend/src/config/database.js` for:
- Connection pool settings
- Query timeout configuration
- Schema customization

## 📱 Deployment

### Production Build

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Set up production environment:**
```bash
cd backend
cp .env .env.production
# Edit .env.production with production values
```

3. **Install production dependencies:**
```bash
npm ci --production
```

4. **Start the production server:**
```bash
NODE_ENV=production npm start
```

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile for the backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Features

- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers
- Environment variable management

## 📊 Monitoring & Analytics

### Built-in Analytics
- Page view tracking
- Session duration monitoring
- Popular content identification
- User interaction patterns

### Health Monitoring
- Database connection status
- Server performance metrics
- Error logging and tracking
- Automated health checks

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📚 Additional Resources

### Content Creation Guide
- Use the admin panel at `/admin` to manage content
- Support for rich media including images, videos, and interactive elements
- Content blocks can be reordered and customized
- Preview functionality before publishing

### Troubleshooting

**Common Issues:**

1. **Database Connection Failed**
   - Verify MySQL is running
   - Check credentials in `.env`
   - Ensure database exists

2. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **API Endpoints Not Working**
   - Check backend server is running
   - Verify CORS configuration
   - Check network connectivity

### Performance Optimization

- Enable gzip compression
- Implement Redis caching for frequently accessed data
- Optimize database queries with proper indexing
- Use CDN for static assets
- Implement lazy loading for images

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ for museums and cultural institutions**