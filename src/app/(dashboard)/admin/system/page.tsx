'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge } from '@/components/ui';
import { 
  Settings,
  Database,
  Shield,
  Bell,
  Mail,
  Key,
  Globe,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SuperAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'api', label: 'API', icon: Key },
  ];

  // Mock system status
  const systemStatus = [
    { name: 'Database', status: 'healthy', latency: '12ms' },
    { name: 'Supabase', status: 'healthy', latency: '45ms' },
    { name: 'OpenAI API', status: 'healthy', latency: '230ms' },
    { name: 'Storage', status: 'healthy', usage: '45%' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-dark-400">Configure global application settings</p>
      </div>

      {/* System Status */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">System Status</h2>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}>
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                <CheckCircle className="text-green-400" size={20} />
                <div>
                  <p className="text-white font-medium">{service.name}</p>
                  <p className="text-xs text-dark-400">
                    {service.latency || service.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-dark-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
                  
                  <div className="space-y-4">
                    <Input label="Application Name" defaultValue="PDF-GPT" />
                    <Input label="Support Email" defaultValue="support@pdfgpt.com" />
                    <Input label="Contact Email" defaultValue="contact@pdfgpt.com" />
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Maintenance Mode
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="maintenance" defaultChecked />
                          <span className="text-dark-300">Off</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="maintenance" />
                          <span className="text-dark-300">On</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Changes</Button>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Password Requirements
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-dark-300">Minimum 8 characters</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-dark-300">Require uppercase letter</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-dark-300">Require number</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-dark-300">Require special character</span>
                        </label>
                      </div>
                    </div>

                    <Input 
                      label="Session Timeout (minutes)" 
                      type="number" 
                      defaultValue="60" 
                    />
                    
                    <Input 
                      label="Max Login Attempts" 
                      type="number" 
                      defaultValue="5" 
                    />

                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Two-Factor Authentication
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="2fa" />
                          <span className="text-dark-300">Disabled</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="2fa" />
                          <span className="text-dark-300">Optional</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="2fa" defaultChecked />
                          <span className="text-dark-300">Required for Admins</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Changes</Button>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Email Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Email Provider
                      </label>
                      <select className="input">
                        <option value="smtp">SMTP</option>
                        <option value="sendgrid">SendGrid</option>
                        <option value="resend" selected>Resend</option>
                        <option value="mailgun">Mailgun</option>
                      </select>
                    </div>
                    
                    <Input label="From Name" defaultValue="PDF-GPT" />
                    <Input label="From Email" defaultValue="noreply@pdfgpt.com" />
                    <Input label="Reply-To Email" defaultValue="support@pdfgpt.com" />
                    
                    <Button variant="secondary">Send Test Email</Button>
                  </div>
                  
                  <Button>Save Changes</Button>
                </div>
              )}

              {activeTab === 'storage' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Storage Settings</h2>
                  
                  <div className="bg-dark-800 rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-dark-300">Storage Used</span>
                      <span className="text-white">45.2 GB / 100 GB</span>
                    </div>
                    <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Input 
                      label="Max File Size (MB)" 
                      type="number" 
                      defaultValue="50" 
                    />
                    
                    <Input 
                      label="Free User Storage Limit (MB)" 
                      type="number" 
                      defaultValue="100" 
                    />
                    
                    <Input 
                      label="Pro User Storage Limit (GB)" 
                      type="number" 
                      defaultValue="10" 
                    />

                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Allowed File Types
                      </label>
                      <div className="flex gap-2">
                        <Badge variant="default">PDF</Badge>
                        <Badge variant="default">DOC</Badge>
                        <Badge variant="default">DOCX</Badge>
                        <Badge variant="default">TXT</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Changes</Button>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">API Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        OpenAI API Key
                      </label>
                      <div className="flex gap-2">
                        <Input 
                          type="password" 
                          defaultValue="sk-••••••••••••••••••••••••" 
                          className="flex-1"
                        />
                        <Button variant="secondary">Update</Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Supabase URL
                      </label>
                      <Input 
                        defaultValue="https://xxxxx.supabase.co" 
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Supabase Anon Key
                      </label>
                      <div className="flex gap-2">
                        <Input 
                          type="password" 
                          defaultValue="eyJ••••••••••••••••••••" 
                          className="flex-1"
                        />
                        <Button variant="secondary">Update</Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">
                        Rate Limiting
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          label="Free Users (req/min)" 
                          type="number" 
                          defaultValue="10" 
                        />
                        <Input 
                          label="Pro Users (req/min)" 
                          type="number" 
                          defaultValue="60" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button>Save Changes</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
