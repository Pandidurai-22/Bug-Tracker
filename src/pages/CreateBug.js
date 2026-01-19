import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBug } from '../services/api';
import { analyzeBugDescription } from '../services/aiService';
import { FiZap, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const CreateBug = ({ onBugCreated }) => {
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [aiInsights, setAiInsights] = useState(null);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const debounceTimerRef = useRef(null);

  // Analyze bug description using AI
  const analyzeDescription = useCallback(async (description) => {
    if (!description || description.length < 10) {
      setAiInsights(null);
      return;
    }

    try {
      setIsAnalyzing(true);
      const analysis = await analyzeBugDescription(description);
      setAiInsights(analysis);
      
      // Auto-fill priority and severity if they haven't been manually set
      setFormData(prev => ({
        ...prev,
        priority: prev.priority || analysis.priority.toLowerCase(),
        severity: analysis.severity.toLowerCase()
      }));
      
    } catch (error) {
      console.error('Error analyzing description:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);
  
  // Debounced version of analyzeDescription
  const debouncedAnalyzeDescription = useCallback((description) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      analyzeDescription(description);
    }, 1000);
  }, [analyzeDescription]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Trigger analysis when description changes
    if (name === 'description') {
      debouncedAnalyzeDescription(value);
    }
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
        createdAt:formData.createdAt ? formatDateForBackend(formData.createdAt) : null ,
        updatedAt: now,
        dueDate: formData.dueDate ? formatDateForBackend(formData.dueDate) : null,
        status: formData.status.toLowerCase().replace(' ', '-'),
        attachments: 0,
        comments: 0
      };
      
      console.log('Submitting bug:', newBug); // For debugging

      await createBug(newBug);
      if (onBugCreated) {
        onBugCreated();
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating bug:', err);
      setError('Failed to create bug. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-bug-container flex flex-col gap-3 p-4 max-w-4xl mx-auto">
      <div className="create-bug-header mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Report a New Bug</h1>
        <p className="text-gray-600">Fill out the form below to report a new issue. Our AI will help analyze and categorize it.</p>
        {isAnalyzing && (
          <div className="mt-2 text-blue-600 text-sm flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Analyzing bug description...
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title with AI Suggestion */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Briefly describe the issue"
                required
              />
              {aiInsights?.suggestedTitle && formData.title !== aiInsights.suggestedTitle && (
                <div className="mt-1 text-sm text-gray-500">
                  Suggestion: 
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({...prev, title: aiInsights.suggestedTitle}))}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    {aiInsights.suggestedTitle}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
                {aiInsights?.priority && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (AI Suggestion: {aiInsights.priority})
                  </span>
                )}
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          
            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="done">Done</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                Severity
                {aiInsights?.severity && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (AI Suggestion: {aiInsights.severity})
                  </span>
                )}
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity || 'normal'}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="enhancement">Enhancement</option>
                <option value="minor">Minor</option>
                <option value="normal">Normal</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-2">
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
                Assignee
              </label>
              <input
                type="text"
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start typing to search..."
              />
              {aiInsights?.suggestedAssignee && (
                <div className="mt-1 text-sm text-gray-500">
                  Suggested Assignee: 
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, assignee: aiInsights.suggestedAssignee}))}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    {aiInsights.suggestedAssignee}
                  </button>
                </div>
              )}
            </div>
          
            {/* Due Date */}
            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description with AI Analysis */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              {aiInsights && (
                <button
                  type="button"
                  onClick={() => setShowAiInsights(!showAiInsights)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {showAiInsights ? 'Hide AI Analysis' : 'Show AI Analysis'}
                  <FiInfo size={14} />
                </button>
              )}
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide a detailed description of the issue, including steps to reproduce, expected behavior, and actual behavior..."
              required
            ></textarea>

            {/* AI Analysis Panel */}
            {showAiInsights && aiInsights && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <FiZap className="text-blue-600" />
                  AI Analysis
                </h3>

                {/* Similar Bugs */}
                {aiInsights.similarBugs && aiInsights.similarBugs.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiAlertTriangle className="text-orange-500" />
                      Similar Reported Issues
                    </h4>
                    <div className="space-y-2">
                      {aiInsights.similarBugs.slice(0, 3).map((bug, index) => (
                        <div key={index} className="p-2 bg-white border rounded-md">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{bug.title}</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {Math.round(bug.similarity * 100)}% match
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bug.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Solutions */}
                {aiInsights.solutions && aiInsights.solutions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiCheckCircle className="text-green-500" />
                      Suggested Solutions
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {aiInsights.solutions.map((solution, index) => (
                        <li key={index}>{solution}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Extracted Entities */}
                {aiInsights.entities && Object.keys(aiInsights.entities).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Detected Components
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(aiInsights.entities).map(([type, values]) => (
                        <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {type}: {values.join(', ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FiCheckCircle className="-ml-1 mr-2 h-5 w-5" />
                  Create Bug Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Thank you for helping us improve our application! Our AI will analyze your report to help us resolve it faster.</p>
        <p className="mt-1 text-xs">All bug reports are confidential and will be reviewed by our team.</p>
      </div>
    </div>
  );
};
export default CreateBug;
