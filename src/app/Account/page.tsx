"use client";

import { useState, useEffect } from 'react';
import TopNav from '../../components/TopNav';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Notif from '../../components/Notif';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  contact: string;
}

export default function AccountSettings() {
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    contact: '',
    new_password: '',
    current_password: '',
  });
  
  // Notification state
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'error' as 'success' | 'error',
    title: '',
    message: ''
  });
  
  const { isLoggedIn, getToken } = useAuth();
  const router = useRouter();

  // Show notification helper
  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  // Close notification helper
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };
  
  // Check authentication
  useEffect(() => {
    const checkAuthentication = async () => {
      // Small delay to ensure auth state is loaded
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!isLoggedIn) {
        router.push('/Login');
        return;
      }
      
      setCheckingAuth(false);
    };
    
    checkAuthentication();
  }, [isLoggedIn, router]);
  
  // Fetch user profile data
  useEffect(() => {
    if (checkingAuth) return;
    
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch('http://localhost:8000/users/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication expired. Please log in again.');
          }
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        
        // Initialize form data with profile data (except password)
        setFormData({
          username: data.username || '',
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          address: data.address || '',
          contact: data.contact || '',
          new_password: '',
          current_password: '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        showNotification('error', 'Error', err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [checkingAuth, getToken]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Require current password for any changes
    if (!formData.current_password) {
      showNotification('error', 'Password Required', 'Please enter your current password to save changes');
      return;
    }
    
    // Get the token
    const token = getToken();
    if (!token) {
      showNotification('error', 'Authentication Error', 'Your session has expired. Please log in again.');
      return;
    }
    
    setSaving(true);
    
    try {
      // Prepare update data - only include fields that should be updated
      const updateData: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        address: string;
        contact: string;
        current_password: string;
        new_password?: string;
      } = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        address: formData.address,
        contact: formData.contact,
        current_password: formData.current_password,
      };
      
      // Only include new_password if it's not empty
      if (formData.new_password) {
        updateData.new_password = formData.new_password;
      }
      
      const response = await fetch('http://localhost:8000/users/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        // Success - show notification
        showNotification('success', 'Profile Updated', 'Your account information has been updated successfully');
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          new_password: '',
          current_password: ''
        }));
      } else {
        // Handle various error responses
        const errorData = await response.json();
        let errorMessage = 'Failed to update profile';
        
        if (response.status === 400) {
          // Validation errors
          if (errorData.current_password) {
            errorMessage = 'Incorrect password. Please enter your current password correctly.';
          } else if (typeof errorData === 'object') {
            const errors = Object.entries(errorData)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n');
            errorMessage = errors || errorMessage;
          }
        } else if (response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        }
        
        showNotification('error', 'Update Failed', errorMessage);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showNotification('error', 'Connection Error', 'Failed to connect to the server');
    } finally {
      setSaving(false);
    }
  };
  
  if (checkingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-[#171717]">
        <div className="h-20">
          <TopNav />
        </div>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6C1814] border-r-transparent" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-white mt-4">Verifying login status...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col overflow-x-hidden min-h-screen bg-[#171717]">
      {/* Navigation */}
      <div className="h-20">
        <TopNav />
      </div>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6C1814] border-r-transparent" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="text-white mt-4">Loading your profile...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900 text-white p-4 rounded-md mb-6">
              {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg">
              <div className="space-y-5">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-white mb-2">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                    required
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                    required
                  />
                </div>
                
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className="block text-white mb-2">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                    required
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className="block text-white mb-2">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                    required
                  />
                </div>
                
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-white mb-2">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                    required
                  />
                </div>
                
                {/* Contact */}
                <div>
                  <label htmlFor="contact" className="block text-white mb-2">Contact Number</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                    required
                  />
                </div>
                
                <div className="border-t border-[#333] my-6 pt-6">
                  <h2 className="text-xl text-white mb-4">Change Password</h2>
                  <p className="text-gray-400 text-sm mb-4">Leave this field empty if you don&apos;t want to change your password.</p>
                  
                  {/* New Password */}
                  <div>
                    <label htmlFor="new_password" className="block text-white mb-2">New Password</label>
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                    />
                  </div>
                </div>
                
                <div className="border-t border-[#333] my-6 pt-6">
                  <div className="bg-[#312e2c] p-4 rounded mb-4">
                    <p className="text-amber-300 text-sm">
                      <strong>Important:</strong> Please enter your current password to confirm changes
                    </p>
                  </div>
                  
                  {/* Current Password for Confirmation */}
                  <div>
                    <label htmlFor="current_password" className="block text-white mb-2">Current Password</label>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] text-white border border-[#333] rounded p-2 focus:outline-none focus:border-[#F05A19]"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`bg-[#6C1814] text-white px-6 py-2 rounded hover:bg-[#d04e17] transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Notification component */}
      <Notif
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
}