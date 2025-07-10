# 📖 Inkwell - Blogging Platform Frontend

A modern, responsive React frontend for the Inkwell blogging platform. Built with React, React Router, and Axios for seamless communication with the Django REST Framework backend.

## ✨ Features

- **User Authentication**: Register, login, and logout functionality
- **Article Management**: Create, edit, delete, and view articles
- **Rich Editor**: Write and format articles with estimated reading time
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Draft System**: Save articles as drafts or publish immediately
- **User Dashboard**: Manage your articles in a dedicated dashboard
- **Public Feed**: Browse published articles from all users
- **SEO Friendly**: Article URLs use human-readable slugs

## 🛠️ Tech Stack

- **React 19.1.0** - Frontend framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with responsive design
- **Context API** - State management for authentication

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Django backend running on `http://127.0.0.1:8000`

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd inkwell-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx           # User login form
│   │   └── Register.jsx        # User registration form
│   ├── articles/
│   │   ├── ArticleDetail.jsx   # Single article view
│   │   ├── CreateArticle.jsx   # Article creation form
│   │   └── EditArticle.jsx     # Article editing form
│   ├── layout/
│   │   └── Layout.jsx          # Main layout with navigation
│   └── common/
│       └── ProtectedRoute.jsx  # Route protection component
├── pages/
│   ├── Home.jsx                # Homepage with article list
│   └── MyArticles.jsx          # User's article dashboard
├── services/
│   ├── api.jsx                 # Axios instance configuration
│   ├── authService.jsx         # Authentication API calls
│   └── articleServices.jsx     # Article API calls
├── context/
│   └── AuthContext.jsx         # Authentication context
├── App.js                      # Main app component with routing
└── index.js                    # Application entry point
```

## 🔧 Available Scripts

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.\
The build is optimized for the best performance.

## 🌐 API Integration

The frontend communicates with a Django REST Framework backend:

- **Base URL**: `http://127.0.0.1:8000/api`
- **Authentication**: Token-based authentication
- **CORS**: Properly configured for cross-origin requests

### API Endpoints Used

- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `GET /articles/` - List published articles
- `POST /articles/` - Create new article
- `GET /articles/{slug}/` - Get article by slug
- `PUT /articles/{id}/` - Update article
- `DELETE /articles/{id}/` - Delete article
- `GET /articles/my_articles/` - Get user's articles

## 🎨 Features Showcase

### Authentication System
- Secure token-based authentication
- Form validation with error handling
- Persistent login state
- Protected routes for authenticated users

### Article Management
- Rich text editor for content creation
- Auto-generated slugs from titles
- Draft and publish status options
- Estimated reading time calculation
- Responsive article cards

### User Experience
- Intuitive navigation with breadcrumbs
- Loading states and error handling
- Mobile-responsive design
- Clean, modern UI

## 🔗 Related Projects

- **Backend**: [Inkwell Django Backend](../inkwell/README.md)
- **API Documentation**: Available at `/api/` when backend is running

## 📝 Environment Configuration

Create a `.env` file in the root directory for custom configuration:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Create React App](https://github.com/facebook/create-react-app)
- Icons and emojis for enhanced user experience
- Responsive design patterns for modern web applications
