'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, Button, Input, Badge } from '@/components/ui';
import { User, Mail, Lock, Shield, Bell, Palette, Eye, EyeOff, Check } from 'lucide-react';
import { UserRole } from '@/types';
import { getRoleDisplayName, getRoleBadgeColor } from '@/lib/auth';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form states
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSuccessMessage('Profile updated successfully');
    setIsLoading(false);
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccessMessage('Password changed successfully');
    setIsLoading(false);
    
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-400">Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-dark-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2">
              <Check size={18} />
              {successMessage}
            </div>
          )}

          {activeTab === 'profile' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-2xl font-bold">
                    {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{session?.user?.name || 'User'}</p>
                    <p className="text-dark-400 text-sm">{session?.user?.email}</p>
                    <Badge role={session?.user?.role || UserRole.FREE_USER} className="mt-2">
                      {getRoleDisplayName(session?.user?.role || UserRole.FREE_USER)}
                    </Badge>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User size={18} />}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail size={18} />}
                    helperText="Changing email will require verification"
                  />

                  <div className="pt-4">
                    <Button type="submit" isLoading={isLoading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="hover:text-white transition-colors"
                      >
                        {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                    required
                  />
                  
                  <Input
                    label="New Password"
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    leftIcon={<Lock size={18} />}
                    required
                  />
                  
                  <Input
                    label="Confirm New Password"
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftIcon={<Lock size={18} />}
                    error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : undefined}
                    required
                  />

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      isLoading={isLoading}
                      disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                    >
                      Change Password
                    </Button>
                  </div>
                </form>

                <div className="divider my-8" />

                <h3 className="font-semibold text-white mb-4">Two-Factor Authentication</h3>
                <p className="text-dark-400 text-sm mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="secondary">Enable 2FA</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  {[
                    { id: 'email_updates', label: 'Email updates', description: 'Receive news and updates via email' },
                    { id: 'upload_complete', label: 'Upload notifications', description: 'Get notified when uploads are processed' },
                    { id: 'marketing', label: 'Marketing emails', description: 'Receive promotional offers and tips' },
                    { id: 'security', label: 'Security alerts', description: 'Get notified about security events' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{setting.label}</p>
                        <p className="text-sm text-dark-400">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.id !== 'marketing'} />
                        <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:bg-primary-600 transition-colors">
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-white mb-4">Theme</h3>
                    <div className="flex gap-4">
                      {['dark', 'light', 'system'].map((theme) => (
                        <button
                          key={theme}
                          className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                            theme === 'dark'
                              ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                              : 'border-dark-600 text-dark-400 hover:border-dark-500'
                          }`}
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="divider" />

                  <div>
                    <h3 className="font-medium text-white mb-4">Library View</h3>
                    <div className="flex gap-4">
                      {['grid', 'list'].map((view) => (
                        <button
                          key={view}
                          className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                            view === 'grid'
                              ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                              : 'border-dark-600 text-dark-400 hover:border-dark-500'
                          }`}
                        >
                          {view.charAt(0).toUpperCase() + view.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
