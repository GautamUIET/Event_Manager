// app/admin/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [activeTab, setActiveTab] = useState('organizers');
  const [organizers, setOrganizers] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authError, setAuthError] = useState('');

  const router = useRouter();

  // Check if already authenticated (from sessionStorage)
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    // Simple admin key validation - you can make this more secure
    const validAdminKeys = ['admin123', 'campus2024', 'eventmaster']; // Add your admin keys here
    
    if (validAdminKeys.includes(adminKey.trim())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      fetchDashboardData();
    } else {
      setAuthError('Invalid admin key. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    sessionStorage.removeItem('adminAuthenticated');
    setOrganizers([]);
    setStudents([]);
    setStats({});
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch organizers
      const orgResponse = await fetch('/backend/api/admin');
      const orgData = await orgResponse.json();
      
      // Fetch students
      const stuResponse = await fetch('/backend/api/adminSt');
      const stuData = await stuResponse.json();

      if (orgData.success && stuData.success) {
        setOrganizers(orgData.data);
        setStudents(stuData.data);
        
        // Calculate stats
        const totalEvents = orgData.data.reduce((sum, org) => sum + org.totalEvents, 0);
        const totalRegistrations = stuData.data.reduce((sum, student) => sum + student.totalRegistrations, 0);
        const activeEvents = orgData.data.reduce((sum, org) => sum + org.events.filter(e => e.status === 'published').length, 0);
        
        setStats({
          totalOrganizers: orgData.data.length,
          totalStudents: stuData.pagination?.totalStudents || stuData.data.length,
          totalEvents,
          totalRegistrations,
          activeEvents
        });
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemEvents = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-purple-100 text-purple-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Education': 'bg-blue-100 text-blue-800',
      'Arts & Culture': 'bg-pink-100 text-pink-800',
      'Business': 'bg-indigo-100 text-indigo-800',
      'Social': 'bg-teal-100 text-teal-800',
      'Workshop': 'bg-amber-100 text-amber-800',
      'Conference': 'bg-cyan-100 text-cyan-800',
      'Seminar': 'bg-lime-100 text-lime-800',
      'Networking': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Computer Science': 'bg-blue-100 text-blue-800',
      'Engineering': 'bg-green-100 text-green-800',
      'Business': 'bg-purple-100 text-purple-800',
      'Arts': 'bg-pink-100 text-pink-800',
      'Science': 'bg-orange-100 text-orange-800',
      'Medicine': 'bg-red-100 text-red-800',
      'Law': 'bg-indigo-100 text-indigo-800',
      'Education': 'bg-teal-100 text-teal-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  // Filter data based on search term
  const filteredOrganizers = organizers.filter(org => 
    org.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Admin Authentication Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter admin key to access the dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
            <div>
              <label htmlFor="adminKey" className="sr-only">
                Admin Key
              </label>
              <input
                id="adminKey"
                name="adminKey"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
            </div>

            {authError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{authError}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Access Dashboard
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard Content
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage organizers, students, and events in one place
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Organizers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrganizers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-teal-100 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('organizers')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'organizers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Organizers ({filteredOrganizers.length})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students ({filteredStudents.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={fetchDashboardData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Organizers Tab */}
                {activeTab === 'organizers' && (
                  <div className="space-y-4">
                    {filteredOrganizers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No organizers found
                      </div>
                    ) : (
                      filteredOrganizers.map((organizer) => (
                        <div key={organizer._id} className="border border-gray-200 rounded-lg">
                          <div 
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleItemEvents(organizer._id)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {organizer.organizerName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {organizer.organizerName}
                                </h3>
                                <p className="text-sm text-gray-600">{organizer.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {organizer.totalEvents} Events
                              </span>
                              <svg 
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  expandedItem === organizer._id ? 'transform rotate-180' : ''
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          
                          {expandedItem === organizer._id && organizer.events && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <h4 className="font-medium text-gray-900 mb-3">Events</h4>
                              <div className="grid gap-3">
                                {organizer.events.map((event) => (
                                  <div key={event._id} className="bg-white p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-medium text-gray-900">{event.title}</h5>
                                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                                            {event.status}
                                          </span>
                                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(event.category)}`}>
                                            {event.category}
                                          </span>
                                          {event.date && (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full">
                                              {new Date(event.date).toLocaleDateString()}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right text-sm text-gray-600">
                                        <div>Capacity: {event.capacity}</div>
                                        <div>Registrations: {event.registrations || 0}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                  <div className="space-y-4">
                    {filteredStudents.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No students found
                      </div>
                    ) : (
                      filteredStudents.map((student) => (
                        <div key={student._id} className="border border-gray-200 rounded-lg">
                          <div 
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleItemEvents(student._id)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-semibold">
                                  {student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-sm text-gray-600">{student.email}</p>
                                  <span className="text-gray-300">•</span>
                                  <p className="text-sm text-gray-600">{student.studentId}</p>
                                  {student.department && (
                                    <>
                                      <span className="text-gray-300">•</span>
                                      <span className={`px-2 py-1 text-xs rounded-full ${getDepartmentColor(student.department)}`}>
                                        {student.department}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {student.totalRegistrations} Registrations
                              </span>
                              <svg 
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  expandedItem === student._id ? 'transform rotate-180' : ''
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          
                          {expandedItem === student._id && student.registeredEvents && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <h4 className="font-medium text-gray-900 mb-3">Registered Events</h4>
                              <div className="grid gap-3">
                                {student.registeredEvents.map((registration) => (
                                  <div key={registration._id} className="bg-white p-3 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h5 className="font-medium text-gray-900">{registration.eventTitle}</h5>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Organizer: {registration.organizerName}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(registration.eventCategory)}`}>
                                            {registration.eventCategory}
                                          </span>
                                          <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full">
                                            Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                                          </span>
                                          <span className={`px-2 py-1 text-xs rounded-full ${
                                            registration.status === 'confirmed' 
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {registration.status}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}