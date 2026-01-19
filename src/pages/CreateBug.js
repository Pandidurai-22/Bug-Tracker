import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBug } from '../services/api';

const CreateBug = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    assignee: '',
    dueDate: '',
    type: 'Bug'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Format date for backend (LocalDateTime format: "yyyy-MM-dd'T'HH:mm:ss")
      const formatDateForBackend = (dateString) => {
        if (!dateString) return null;
        // Add time part if not present (for date-only inputs)
        const dateTimeString = dateString.includes('T') 
          ? dateString 
          : `${dateString}T00:00:00`;
        return dateTimeString;
      };

      const now = new Date().toISOString().slice(0, 19); // Format: "YYYY-MM-DDTHH:mm:ss"
      const newBug = {
        ...formData,
        // Generate a temporary ID that will be replaced by the backend
        id: null, // Let the backend generate the ID
        key: `TEMP-${Date.now()}`,
        reporter: 'Current User', // This should come from auth context in a real app
        // Format dates properly for backend
        createdAt: now,
        updatedAt: now,
        dueDate: formData.dueDate ? formatDateForBackend(formData.dueDate) : null,
        status: formData.status.toLowerCase().replace(' ', '-'),
        attachments: 0,
        comments: 0
      };
      
      console.log('Submitting bug:', newBug); // For debugging

      await createBug(newBug);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating bug:', err);
      setError('Failed to create bug. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-bug-container flex flex-col gap-3 p-4">
      <div className="create-bug-header mb-4">
        <h1 className="text-2xl font-bold">Create a New Bug</h1>
        <p className="text-gray-600">Fill out the form below to report a new bug.</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="create-bug-image flex w-full justify-center">
        <form onSubmit={handleSubmit} className="create-bug-form flex flex-col w-1/2 gap-4 p-4">
          <div className="form-group w-full flex gap-2">
            <label className="w-1/4" htmlFor="title">Title:</label>
            <input 
              className="w-3/4 p-1 border rounded" 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group flex gap-2">
            <label className="w-1/4" htmlFor="priority">Priority:</label>
            <select 
              className="w-3/4 p-1 border rounded" 
              id="priority" 
              name="priority" 
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="form-group flex gap-2">
            <label className="w-1/4" htmlFor="status">Status:</label>
            <select 
              className="w-3/4 p-1 border rounded" 
              id="status" 
              name="status" 
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div className="form-group flex gap-2">
            <label className="w-1/4" htmlFor="assignee">Assignee:</label>
            <input 
              className="w-3/4 p-1 border rounded" 
              type="text" 
              id="assignee" 
              name="assignee" 
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Optional" 
            />
          </div>
          
          <div className="form-group flex gap-2">
            <label className="w-1/4" htmlFor="dueDate">Due Date:</label>
            <input 
              className="w-3/4 p-1 border rounded" 
              type="date" 
              id="dueDate" 
              name="dueDate" 
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group flex">
            <label className="w-1/4" htmlFor="description">Description:</label>
            <textarea 
              className="w-3/4 p-1 border rounded" 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group flex justify-center items-center gap-2 mt-4">
            <button 
              className={`bg-black text-white p-2 rounded w-32 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`} 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Bug'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 text-gray-800 p-2 rounded w-32 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <div className="create-bug-footer mt-6">
        <p className="text-gray-500">Thank you for helping us improve our application!</p>
      </div>
    </div>
  );
};
export default CreateBug;
