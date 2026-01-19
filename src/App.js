// // In App.js
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/navbar';
// import Home from './pages/Home';
// import CreateBug from './pages/CreateBug';
// import Dashboard from './pages/Dashboard';
// import BugDetail from './pages/BugDetail';
// import './App.css';  // Make sure this import exists

// function App() {
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleBugCreated = () => {
//     setRefreshKey(prevKey => prevKey + 1);
//   };

//   return (
//     <Router>
//       <div className="min-h-screen">
//         <Navbar />
//         <main className="py-6">
//           <div className="max-w-full mx-auto  sm:px-6 lg:px-8">
//             <Routes>
//               <Route path="/" element={<Home refreshTrigger={refreshKey} />} />
//               <Route path="/dashboard" element={<Dashboard key={refreshKey} />} />
//               <Route 
//                 path="/create-bug" 
//                 element={<CreateBug onBugCreated={handleBugCreated} />} 
//               />
//               <Route path="/bug/:id" element={<BugDetail />} />
//             </Routes>
//           </div>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;


// src/App.js
import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, AuthContext, useAuth } from './contexts/auth.context';
// In App.js, update the import line to include useAuth
import { AuthProvider, AuthContext, useAuth } from './contexts/auth.context';
import Navbar from './components/navbar';
import Home from './pages/Home';
import CreateBug from './pages/CreateBug';
import Dashboard from './pages/Dashboard';
import BugDetail from './pages/BugDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
// Public Route Component (for login/register when already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleBugCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                <Route path="/" element={<Home refreshTrigger={refreshKey} />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard key={refreshKey} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-bug" 
                  element={
                    <ProtectedRoute>
                      <CreateBug onBugCreated={handleBugCreated} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/bug/:id" 
                  element={
                    <ProtectedRoute>
                      <BugDetail />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;