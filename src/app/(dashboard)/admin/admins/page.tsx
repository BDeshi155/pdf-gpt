'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { 
  Search, 
  Shield,
  UserPlus,
  Mail,
  Edit,
  Trash2,
  Key,
  Activity
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

// Mock admins
const mockAdmins = [
  { id: '1', name: 'Admin User', email: 'admin@pdfgpt.com', permissions: ['shop', 'promotions', 'marketing'], status: 'active', createdAt: '2025-08-15', lastLogin: '2026-01-20' },
  { id: '2', name: 'Support Admin', email: 'support@pdfgpt.com', permissions: ['shop'], status: 'active', createdAt: '2025-10-01', lastLogin: '2026-01-19' },
  { id: '3', name: 'Marketing Admin', email: 'marketing@pdfgpt.com', permissions: ['marketing', 'promotions'], status: 'active', createdAt: '2025-11-15', lastLogin: '2026-01-18' },
];

const availablePermissions = [
  { key: 'shop', label: 'PDF Shop', description: 'Manage PDFs in the shop' },
  { key: 'promotions', label: 'Promotions', description: 'Create and manage promo codes' },
  { key: 'marketing', label: 'Marketing', description: 'Manage email campaigns' },
];

export default function SuperAdminAdminsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const filteredAdmins = mockAdmins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Management</h1>
          <p className="text-dark-400">Manage administrators and their permissions</p>
        </div>
        <Button leftIcon={<UserPlus size={18} />} onClick={() => setShowCreateModal(true)}>
          Add Admin
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Shield className="text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{mockAdmins.length}</p>
                <p className="text-dark-400 text-sm">Total Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {mockAdmins.filter((a) => a.status === 'active').length}
                </p>
                <p className="text-dark-400 text-sm">Active Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <Key className="text-primary-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{availablePermissions.length}</p>
                <p className="text-dark-400 text-sm">Permission Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search admins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Admins Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdmins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{admin.name}</h3>
                    <p className="text-sm text-dark-400">{admin.email}</p>
                  </div>
                </div>
                <Badge variant="success">{admin.status}</Badge>
              </div>

              <div className="mb-4">
                <p className="text-xs text-dark-500 uppercase mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {admin.permissions.map((permission) => (
                    <Badge key={permission} variant="default" size="sm">
                      {availablePermissions.find((p) => p.key === permission)?.label || permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-sm text-dark-400 space-y-1 mb-4">
                <p>Joined: {formatDate(admin.createdAt)}</p>
                <p>Last login: {formatDate(admin.lastLogin)}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Edit size={14} />}
                  onClick={() => {
                    setSelectedPermissions(admin.permissions);
                    setShowEditModal(admin.id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteModal(admin.id)}
                >
                  <Trash2 size={14} className="text-red-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Admin Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader onClose={() => setShowCreateModal(false)}>Add New Admin</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Name" placeholder="Enter admin name" />
            <Input label="Email" type="email" placeholder="admin@example.com" />
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-3">Permissions</label>
              <div className="space-y-3">
                {availablePermissions.map((permission) => (
                  <label key={permission.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 rounded"
                      checked={selectedPermissions.includes(permission.key)}
                      onChange={() => togglePermission(permission.key)}
                    />
                    <div>
                      <p className="text-white font-medium">{permission.label}</p>
                      <p className="text-sm text-dark-400">{permission.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button>Create Admin</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal isOpen={!!showEditModal} onClose={() => setShowEditModal(null)}>
        <ModalHeader onClose={() => setShowEditModal(null)}>Edit Admin</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input 
              label="Name" 
              defaultValue={mockAdmins.find((a) => a.id === showEditModal)?.name} 
            />
            <Input 
              label="Email" 
              type="email" 
              defaultValue={mockAdmins.find((a) => a.id === showEditModal)?.email} 
            />
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-3">Permissions</label>
              <div className="space-y-3">
                {availablePermissions.map((permission) => (
                  <label key={permission.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 rounded"
                      checked={selectedPermissions.includes(permission.key)}
                      onChange={() => togglePermission(permission.key)}
                    />
                    <div>
                      <p className="text-white font-medium">{permission.label}</p>
                      <p className="text-sm text-dark-400">{permission.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowEditModal(null)}>Cancel</Button>
          <Button>Save Changes</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)}>
        <ModalHeader onClose={() => setShowDeleteModal(null)}>Remove Admin</ModalHeader>
        <ModalBody>
          <p className="text-dark-300">
            Are you sure you want to remove this admin? They will lose all administrative privileges.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDeleteModal(null)}>Cancel</Button>
          <Button variant="danger">Remove Admin</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
