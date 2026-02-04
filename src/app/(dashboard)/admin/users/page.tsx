'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { 
  Search, 
  Filter,
  User,
  Crown,
  Shield,
  MoreVertical,
  Ban,
  Mail,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { UserRole } from '@/types';
import { formatDate, cn } from '@/lib/utils';

// Mock users
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: UserRole.PRO_USER, status: 'active', pdfCount: 45, createdAt: '2025-11-15', lastActive: '2026-01-20' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: UserRole.FREE_USER, status: 'active', pdfCount: 3, createdAt: '2025-12-01', lastActive: '2026-01-19' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: UserRole.PRO_USER, status: 'active', pdfCount: 128, createdAt: '2025-10-20', lastActive: '2026-01-20' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: UserRole.FREE_USER, status: 'suspended', pdfCount: 5, createdAt: '2025-11-25', lastActive: '2026-01-05' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: UserRole.ADMIN, status: 'active', pdfCount: 22, createdAt: '2025-09-10', lastActive: '2026-01-20' },
];

const roleFilters = [
  { value: 'all', label: 'All Users' },
  { value: UserRole.FREE_USER, label: 'Free Users' },
  { value: UserRole.PRO_USER, label: 'Pro Users' },
  { value: UserRole.ADMIN, label: 'Admins' },
];

export default function SuperAdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState<string | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="text-yellow-400" size={16} />;
      case UserRole.ADMIN:
        return <Shield className="text-blue-400" size={16} />;
      case UserRole.PRO_USER:
        return <Crown className="text-primary-400" size={16} />;
      default:
        return <User className="text-dark-400" size={16} />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Badge variant="warning">Super Admin</Badge>;
      case UserRole.ADMIN:
        return <Badge variant="info">Admin</Badge>;
      case UserRole.PRO_USER:
        return <Badge variant="pro">Pro</Badge>;
      default:
        return <Badge variant="default">Free</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-dark-400">View and manage all users on the platform</p>
        </div>
        <Button leftIcon={<UserPlus size={18} />}>
          Invite User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">{mockUsers.length}</p>
            <p className="text-dark-400 text-sm">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockUsers.filter((u) => u.role === UserRole.PRO_USER).length}
            </p>
            <p className="text-dark-400 text-sm">Pro Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockUsers.filter((u) => u.status === 'active').length}
            </p>
            <p className="text-dark-400 text-sm">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockUsers.filter((u) => u.status === 'suspended').length}
            </p>
            <p className="text-dark-400 text-sm">Suspended</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          {roleFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setRoleFilter(filter.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                roleFilter === filter.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-300 hover:text-white'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden mb-6">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>PDFs</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-dark-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </td>
                  <td>{user.pdfCount}</td>
                  <td>
                    <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastActive)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded hover:bg-white/5 text-dark-400 hover:text-white"
                        onClick={() => setShowUserModal(user.id)}
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-2 rounded hover:bg-white/5 text-dark-400 hover:text-white" title="Email user">
                        <Mail size={16} />
                      </button>
                      <button 
                        className={cn(
                          "p-2 rounded hover:bg-white/5",
                          user.status === 'suspended' ? 'text-green-400' : 'text-yellow-400'
                        )}
                        onClick={() => setShowSuspendModal(user.id)}
                        title={user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-dark-400 text-sm">
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled={currentPage === 1}>
            <ChevronLeft size={16} />
            Previous
          </Button>
          <span className="px-4 py-2 text-dark-300">Page {currentPage}</span>
          <Button variant="ghost" size="sm">
            Next
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal isOpen={!!showUserModal} onClose={() => setShowUserModal(null)}>
        <ModalHeader onClose={() => setShowUserModal(null)}>Edit User</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Name" defaultValue={mockUsers.find((u) => u.id === showUserModal)?.name} />
            <Input label="Email" defaultValue={mockUsers.find((u) => u.id === showUserModal)?.email} />
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">Role</label>
              <select className="input" defaultValue={mockUsers.find((u) => u.id === showUserModal)?.role}>
                <option value={UserRole.FREE_USER}>Free User</option>
                <option value={UserRole.PRO_USER}>Pro User</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowUserModal(null)}>Cancel</Button>
          <Button>Save Changes</Button>
        </ModalFooter>
      </Modal>

      {/* Suspend Modal */}
      <Modal isOpen={!!showSuspendModal} onClose={() => setShowSuspendModal(null)}>
        <ModalHeader onClose={() => setShowSuspendModal(null)}>
          {mockUsers.find((u) => u.id === showSuspendModal)?.status === 'suspended' ? 'Unsuspend' : 'Suspend'} User
        </ModalHeader>
        <ModalBody>
          <p className="text-dark-300">
            {mockUsers.find((u) => u.id === showSuspendModal)?.status === 'suspended'
              ? 'Are you sure you want to unsuspend this user? They will regain access to their account.'
              : 'Are you sure you want to suspend this user? They will lose access to their account.'}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowSuspendModal(null)}>Cancel</Button>
          <Button variant={mockUsers.find((u) => u.id === showSuspendModal)?.status === 'suspended' ? 'primary' : 'danger'}>
            {mockUsers.find((u) => u.id === showSuspendModal)?.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
