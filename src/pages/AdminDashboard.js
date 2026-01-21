import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiTrendingUp, FiActivity, 
  FiSettings, FiBarChart2, FiUserPlus, FiEdit2,
  FiTrash2, FiSearch, FiFilter, FiRefreshCw,
  FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo
} from 'react-icons/fi';
import { FaBug } from 'react-icons/fa';
import { getBugs, updateBug, deleteBug } from '../services/api';
import authService from '../services/auth.service';

const AdminDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingBug, setEditingBug] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleEditBug = (bug) => {
    setEditingBug(bug);
    setEditFormData({
      title: bug.title || '',
      description: bug.description || '',
      status: bug.status || 'open',
      priority: bug.priority || 'medium',
      severity: bug.severity || 'medium',
      assignee: bug.assignee || '',
      tags: bug.tags || '',
    });
    setShowEditModal(true);
  };

  const handleSaveBug = async () => {
    if (!editingBug) return;
    
    try {
      setIsSaving(true);
      await updateBug(editingBug.id, editFormData);
      setShowEditModal(false);
      setEditingBug(null);
      await loadData(); // Reload bugs
    } catch (error) {
      console.error('Error saving bug:', error);
      alert('Failed to update bug: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBug = async (bugId) => {
    if (!window.confirm('Are you sure you want to delete this bug?')) {
      return;
    }

    try {
      await deleteBug(bugId);
      await loadData(); // Reload bugs
    } catch (error) {
      console.error('Error deleting bug:', error);
      alert('Failed to delete bug: ' + error.message);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const bugsData = await getBugs();
      setBugs(bugsData);
      // Mock users data - replace with actual API call
      setUsers([
        { id: 1, username: 'admin', email: 'admin@bugtracker.com', role: 'ADMIN', active: true },
        { id: 2, username: 'developer1', email: 'dev1@bugtracker.com', role: 'DEVELOPER', active: true },
        { id: 3, username: 'tester1', email: 'tester1@bugtracker.com', role: 'TESTER', active: true },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalBugs: bugs.length,
    openBugs: bugs.filter(b => b.status?.toLowerCase() === 'open').length,
    inProgress: bugs.filter(b => b.status?.toLowerCase() === 'in-progress').length,
    resolved: bugs.filter(b => ['resolved', 'done', 'closed'].includes(b.status?.toLowerCase())).length,
    criticalBugs: bugs.filter(b => b.severity?.toLowerCase() === 'critical').length,
    highPriority: bugs.filter(b => b.priority?.toLowerCase() === 'high').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.active).length,
  };

  // Bugs by status
  const bugsByStatus = {
    'Open': bugs.filter(b => b.status?.toLowerCase() === 'open').length,
    'In Progress': bugs.filter(b => b.status?.toLowerCase() === 'in-progress').length,
    'In Review': bugs.filter(b => b.status?.toLowerCase() === 'in-review').length,
    'Resolved': bugs.filter(b => b.status?.toLowerCase() === 'resolved').length,
    'Done': bugs.filter(b => b.status?.toLowerCase() === 'done').length,
    'Closed': bugs.filter(b => b.status?.toLowerCase() === 'closed').length,
  };

  // Bugs by priority
  const bugsByPriority = {
    'Low': bugs.filter(b => b.priority?.toLowerCase() === 'low').length,
    'Medium': bugs.filter(b => b.priority?.toLowerCase() === 'medium').length,
    'High': bugs.filter(b => b.priority?.toLowerCase() === 'high').length,
    'Critical': bugs.filter(b => b.priority?.toLowerCase() === 'critical').length,
  };

  // Bugs by severity
  const bugsBySeverity = {
    'Low': bugs.filter(b => b.severity?.toLowerCase() === 'low').length,
    'Medium': bugs.filter(b => b.severity?.toLowerCase() === 'medium').length,
    'High': bugs.filter(b => b.severity?.toLowerCase() === 'high').length,
    'Critical': bugs.filter(b => b.severity?.toLowerCase() === 'critical').length,
  };

  // Filter bugs
  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = 
      bug.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.assignee?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || bug.status?.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Recent bugs (last 10)
  const recentBugs = [...bugs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your bug tracker system</p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FiBarChart2 },
              { id: 'users', label: 'Users', icon: FiUsers },
              { id: 'bugs', label: 'Bugs', icon: FaBug },
              { id: 'settings', label: 'Settings', icon: FiSettings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Bugs"
                value={stats.totalBugs}
                icon={FaBug}
                color="blue"
                change={`${stats.openBugs} open`}
              />
              <StatCard
                title="Open Bugs"
                value={stats.openBugs}
                icon={FiAlertCircle}
                color="yellow"
                change={`${stats.inProgress} in progress`}
              />
              <StatCard
                title="Resolved"
                value={stats.resolved}
                icon={FiCheckCircle}
                color="green"
                change={`${((stats.resolved / stats.totalBugs) * 100).toFixed(1)}%`}
              />
              <StatCard
                title="Critical Issues"
                value={stats.criticalBugs}
                icon={FiXCircle}
                color="red"
                change={`${stats.highPriority} high priority`}
              />
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={FiUsers}
                color="purple"
                change={`${stats.activeUsers} active`}
              />
              <StatCard
                title="AI Analyzed"
                value={bugs.filter(b => b.aiAnalyzed).length}
                icon={FiTrendingUp}
                color="indigo"
                change={`${((bugs.filter(b => b.aiAnalyzed).length / stats.totalBugs) * 100).toFixed(1)}%`}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Bugs by Status" data={bugsByStatus} color="blue" />
              <ChartCard title="Bugs by Priority" data={bugsByPriority} color="blue" />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiActivity />
                Recent Bugs
              </h2>
              <div className="space-y-3">
                {recentBugs.slice(0, 5).map(bug => (
                  <div key={bug.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{bug.title}</p>
                      <p className="text-sm text-gray-500">
                        {bug.assignee || 'Unassigned'} • {bug.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        bug.priority === 'high' || bug.priority === 'critical' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {bug.priority || 'Medium'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <FiUserPlus />
                  Add User
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => alert('User editing coming soon!')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit User"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              onClick={() => alert('User deletion coming soon!')}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bugs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">All Bugs</h2>
                <div className="flex items-center gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="done">Done</option>
                    <option value="closed">Closed</option>
                  </select>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bugs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AI Analyzed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBugs.map(bug => (
                      <tr key={bug.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{bug.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {bug.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            bug.status === 'open' ? 'bg-blue-100 text-blue-800' :
                            bug.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            bug.status === 'resolved' || bug.status === 'done' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {bug.status || 'Open'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            bug.priority === 'high' || bug.priority === 'critical' 
                              ? 'bg-red-100 text-red-800' 
                              : bug.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {bug.priority || 'Medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            bug.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            bug.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            bug.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {bug.severity || 'Medium'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bug.assignee || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {bug.aiAnalyzed ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <FiCheckCircle />
                              Yes
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400">
                              <FiXCircle />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEditBug(bug)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Bug"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              onClick={() => handleDeleteBug(bug.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Bug"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <SettingSection
                  title="AI Service"
                  description="Configure AI analysis settings"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Enable AI Analysis</label>
                        <p className="text-sm text-gray-500">Automatically analyze bugs with AI</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  title="Notifications"
                  description="Manage notification preferences"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                        <p className="text-sm text-gray-500">Receive email updates for bug changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </SettingSection>

                <SettingSection
                  title="System Information"
                  description="View system details"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Bugs</p>
                      <p className="text-lg font-semibold">{stats.totalBugs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-lg font-semibold">{stats.totalUsers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">AI Analyzed</p>
                      <p className="text-lg font-semibold">{bugs.filter(b => b.aiAnalyzed).length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">System Status</p>
                      <p className="text-lg font-semibold text-green-600">Online</p>
                    </div>
                  </div>
                </SettingSection>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Bug Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Bug</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBug(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="in-review">In Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="done">Done</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={editFormData.priority}
                      onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Severity and Assignee */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      value={editFormData.severity}
                      onChange={(e) => setEditFormData({ ...editFormData, severity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignee
                    </label>
                    <input
                      type="text"
                      value={editFormData.assignee}
                      onChange={(e) => setEditFormData({ ...editFormData, assignee: e.target.value })}
                      placeholder="Enter assignee name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={editFormData.tags}
                    onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                    placeholder="Comma-separated tags"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBug(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBug}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className="text-sm text-gray-500 mt-1">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, data, color }) => {
  const maxValue = Math.max(...Object.values(data));
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{key}</span>
                <span className="text-sm text-gray-500">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${color}-600 transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Setting Section Component
const SettingSection = ({ title, description, children }) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default AdminDashboard;

