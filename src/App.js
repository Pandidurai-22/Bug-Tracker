import './App.css';
import { DragDropContext } from '@hello-pangea/dnd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Dashboard from './pages/Dashboard';
import CreateBug from './pages/CreateBug';
import BugDetail from './pages/BugDetail';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  const onDragEnd = (result) => {
    // This is a no-op here since we handle drag and drop in the Dashboard component
    // We keep it here to prevent errors from the DragDropContext
  };

  return (
    <Router>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-bug" element={<CreateBug />} />
              <Route path="/bug/:id" element={<BugDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </DragDropContext>
    </Router>
  );
}

export default App;
