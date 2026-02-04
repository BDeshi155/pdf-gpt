'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { 
  Search, 
  Filter,
  Mail,
  Users,
  Send,
  BarChart3,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock campaign data
const mockCampaigns = [
  { id: '1', name: 'Free Trial Reminder', type: 'email', target: 'free_users', sent: 1250, opened: 845, clicked: 234, status: 'completed' },
  { id: '2', name: 'Pro Upgrade Offer', type: 'email', target: 'free_users', sent: 0, opened: 0, clicked: 0, status: 'draft' },
  { id: '3', name: 'New Features Announcement', type: 'email', target: 'all', sent: 3500, opened: 2100, clicked: 567, status: 'completed' },
];

const mockAudience = {
  total: 5280,
  freeUsers: 4200,
  proUsers: 1080,
  newThisMonth: 345,
};

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'audience'>('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketing</h1>
          <p className="text-dark-400">Manage campaigns and engage with your audience</p>
        </div>
        <Button leftIcon={<Send size={18} />} onClick={() => setShowCreateModal(true)}>
          Create Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <Users className="text-primary-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mockAudience.total.toLocaleString()}</p>
                <p className="text-dark-400 text-sm">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">+{mockAudience.newThisMonth}</p>
                <p className="text-dark-400 text-sm">New This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Mail className="text-accent-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {mockCampaigns.reduce((acc, c) => acc + c.sent, 0).toLocaleString()}
                </p>
                <p className="text-dark-400 text-sm">Emails Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <BarChart3 className="text-yellow-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Math.round(
                    (mockCampaigns.reduce((acc, c) => acc + c.opened, 0) /
                      mockCampaigns.reduce((acc, c) => acc + c.sent, 0)) *
                      100
                  ) || 0}%
                </p>
                <p className="text-dark-400 text-sm">Avg Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-dark-700">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={cn(
            'px-4 py-2 font-medium transition-colors border-b-2 -mb-px',
            activeTab === 'campaigns'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-dark-400 hover:text-white'
          )}
        >
          Campaigns
        </button>
        <button
          onClick={() => setActiveTab('audience')}
          className={cn(
            'px-4 py-2 font-medium transition-colors border-b-2 -mb-px',
            activeTab === 'audience'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-dark-400 hover:text-white'
          )}
        >
          Audience
        </button>
      </div>

      {activeTab === 'campaigns' && (
        <>
          {/* Campaigns Table */}
          <Card className="overflow-hidden">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Target</th>
                    <th>Sent</th>
                    <th>Opened</th>
                    <th>Clicked</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCampaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                            <Mail className="text-accent-400" size={20} />
                          </div>
                          <span className="font-medium text-white">{campaign.name}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant="default">
                          {campaign.target === 'all' ? 'All Users' : 'Free Users'}
                        </Badge>
                      </td>
                      <td>{campaign.sent.toLocaleString()}</td>
                      <td>
                        {campaign.sent > 0 ? (
                          <span>
                            {campaign.opened.toLocaleString()}{' '}
                            <span className="text-dark-500">
                              ({Math.round((campaign.opened / campaign.sent) * 100)}%)
                            </span>
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {campaign.sent > 0 ? (
                          <span>
                            {campaign.clicked.toLocaleString()}{' '}
                            <span className="text-dark-500">
                              ({Math.round((campaign.clicked / campaign.sent) * 100)}%)
                            </span>
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <Badge 
                          variant={
                            campaign.status === 'completed' ? 'success' : 
                            campaign.status === 'draft' ? 'default' : 'warning'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </td>
                      <td>
                        {campaign.status === 'draft' && (
                          <Button size="sm">Send</Button>
                        )}
                        {campaign.status === 'completed' && (
                          <Button size="sm" variant="ghost">View Report</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'audience' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">User Segments</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="text-dark-300">Free Users</span>
                  </div>
                  <span className="text-white font-medium">{mockAudience.freeUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span className="text-dark-300">Pro Users</span>
                  </div>
                  <span className="text-white font-medium">{mockAudience.proUsers.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 h-4 rounded-full overflow-hidden flex">
                <div 
                  className="bg-gray-500" 
                  style={{ width: `${(mockAudience.freeUsers / mockAudience.total) * 100}%` }}
                />
                <div 
                  className="bg-primary-500" 
                  style={{ width: `${(mockAudience.proUsers / mockAudience.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Target size={18} />}>
                  Target Free Users Near Limit
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Mail size={18} />}>
                  Send Pro Feature Highlight
                </Button>
                <Button variant="secondary" className="w-full justify-start" leftIcon={<Users size={18} />}>
                  Re-engage Inactive Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader onClose={() => setShowCreateModal(false)}>Create Campaign</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Campaign Name" placeholder="e.g., Summer Promotion" />
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">Target Audience</label>
              <select className="input">
                <option value="all">All Users</option>
                <option value="free_users">Free Users Only</option>
                <option value="pro_users">Pro Users Only</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>
            <Input label="Subject Line" placeholder="Enter email subject" />
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">Email Content</label>
              <textarea 
                className="input min-h-[150px]" 
                placeholder="Write your email content here..."
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="secondary">Save as Draft</Button>
          <Button>Send Now</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
