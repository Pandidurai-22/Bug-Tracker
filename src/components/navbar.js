// src/components/navbar.js
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBug, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/auth.context';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/create-bug', label: 'Create Bug', icon: <FaPlus className="mr-1" /> },
  ] : [];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <FaBug className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">BugTracker</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <div className="ml-4 flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Report Bug
              </Link>
            )}
          </div>
        </div>

      
      {/* Mobile Hamburger */}
           <div className="flex items-center sm:hidden">
             <button
               onClick={() => setMenuOpen(!menuOpen)}
               type="button"
               className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 
               focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
             >
               <svg
                 className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>

               <svg
                 className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           </div>

         </div>
       

       {/* Mobile Menu */}
       {menuOpen && (
         <div id="mobile-menu" className="sm:hidden px-4 pb-4 space-y-2 bg-white shadow">
           {navLinks.map((link) => (
             <Link
                 key={link.path}
                 to={link.path}
                 onClick={() => setMenuOpen(false)}
                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
             >
               {link.icon}
               {link.label}
             </Link>
           ))}

           {isAuthenticated ? (
              <div className="ml-4 flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Report Bug
              </Link>
            )}

           <div className="flex items-center px-3 py-2">
             <img
               src="/assets/pandi.jpg"
               className="h-8 w-8 rounded-full"
               alt=""
             />
             <span className="ml-2 text-gray-700 font-medium">Profile</span>
           </div>
         </div>
       )}
      </nav>
  );
};

export default Navbar;

// import { Link, useLocation } from 'react-router-dom';
// import { useState } from 'react';
// import { FaBug, FaPlus } from 'react-icons/fa';

// const Navbar = () => {
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const navLinks = [
//     { path: '/dashboard', label: 'Dashboard' },
//     { path: '/create-bug', label: 'Create Bug', icon: <FaPlus className="mr-1" /> },
//   ];

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">

//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <FaBug className="h-6 w-6 text-indigo-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900">
//                 BugTracker
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden sm:flex sm:items-center space-x-8">
//             {navLinks.map((link) => {
//               const isActive = location.pathname === link.path;
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
//                     isActive
//                       ? 'border-indigo-500 text-gray-900'
//                       : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
//                   }`}
//                 >
//                   {link.icon}
//                   {link.label}
//                 </Link>
//               );
//             })}

//             {/* Profile Icon */}
//             <div className="ml-3">
//               <img
//                 src="/assets/pandi.jpg"
//                 className="h-8 w-8 rounded-full cursor-pointer"
//                 alt=""
//               />
//             </div>
//           </div>

//           {/* Mobile Hamburger */}
//           <div className="flex items-center sm:hidden">
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               type="button"
//               className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 
//               focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
//             >
//               <svg
//                 className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>

//               <svg
//                 className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div id="mobile-menu" className="sm:hidden px-4 pb-4 space-y-2 bg-white shadow">
//           {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               onClick={() => setMenuOpen(false)}
//               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
//             >
//               {link.icon}
//               {link.label}
//             </Link>
//           ))}

//           <div className="flex items-center px-3 py-2">
//             <img
//               src="/assets/pandi.jpg"
//               className="h-8 w-8 rounded-full"
//               alt=""
//             />
//             <span className="ml-2 text-gray-700 font-medium">Profile</span>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
