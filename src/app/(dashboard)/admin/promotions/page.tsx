'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { 
  Plus, 
  Search, 
  Tag, 
  Edit, 
  Trash2, 
  Copy,
  Calendar,
  Percent,
  Users
} from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

// Mock promotions
const mockPromotions = [
  { id: '1', title: 'New Year Special', code: 'NEWYEAR2026', discount: 30, validFrom: '2026-01-01', validUntil: '2026-01-31', maxUses: 100, currentUses: 45, isActive: true },
  { id: '2', title: 'Early Bird Pro', code: 'EARLYBIRD', discount: 20, validFrom: '2026-02-01', validUntil: '2026-02-28', maxUses: 50, currentUses: 12, isActive: true },
  { id: '3', title: 'Student Discount', code: 'STUDENT50', discount: 50, validFrom: '2025-09-01', validUntil: '2026-06-30', maxUses: null, currentUses: 234, isActive: true },
  { id: '4', title: 'Holiday Sale', code: 'HOLIDAY25', discount: 25, validFrom: '2025-12-01', validUntil: '2025-12-31', maxUses: 200, currentUses: 200, isActive: false },
];

export default function AdminPromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filteredPromotions = mockPromotions.filter((promo) =>
    promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // In a real app, show a toast notification
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Promotions</h1>
          <p className="text-dark-400">Create and manage promotional offers for Pro subscriptions</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowCreateModal(true)}>
          Create Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockPromotions.filter((p) => p.isActive).length}
            </p>
            <p className="text-dark-400 text-sm">Active Promotions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockPromotions.reduce((acc, p) => acc + p.currentUses, 0)}
            </p>
            <p className="text-dark-400 text-sm">Total Redemptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {Math.round(mockPromotions.reduce((acc, p) => acc + p.discount, 0) / mockPromotions.length)}%
            </p>
            <p className="text-dark-400 text-sm">Avg Discount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockPromotions.filter((p) => !p.isActive).length}
            </p>
            <p className="text-dark-400 text-sm">Expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search promotions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search size={18} />}
          className="max-w-md"
        />
      </div>

      {/* Promotions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPromotions.map((promo) => (
          <Card key={promo.id} className={cn(!promo.isActive && 'opacity-60')}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{promo.title}</h3>
                    <Badge variant={promo.isActive ? 'success' : 'error'}>
                      {promo.isActive ? 'Active' : 'Expired'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-primary-400 bg-primary-500/10 px-2 py-1 rounded text-sm">
                      {promo.code}
                    </code>
                    <button
                      onClick={() => copyCode(promo.code)}
                      className="p-1 text-dark-400 hover:text-white"
                      title="Copy code"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded hover:bg-white/5 text-dark-400 hover:text-white">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="p-2 rounded hover:bg-white/5 text-red-400 hover:text-red-300"
                    onClick={() => setShowDeleteModal(promo.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-dark-300">
                  <Percent size={14} />
                  <span>{promo.discount}% discount</span>
                </div>
                <div className="flex items-center gap-2 text-dark-300">
                  <Users size={14} />
                  <span>
                    {promo.currentUses}{promo.maxUses ? `/${promo.maxUses}` : ''} uses
                  </span>
                </div>
                <div className="flex items-center gap-2 text-dark-300">
                  <Calendar size={14} />
                  <span>From {formatDate(promo.validFrom)}</span>
                </div>
                <div className="flex items-center gap-2 text-dark-300">
                  <Calendar size={14} />
                  <span>Until {formatDate(promo.validUntil)}</span>
                </div>
              </div>

              {promo.maxUses && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-dark-400 mb-1">
                    <span>Usage</span>
                    <span>{Math.round((promo.currentUses / promo.maxUses) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(promo.currentUses / promo.maxUses) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader onClose={() => setShowCreateModal(false)}>Create Promotion</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Promotion Title" placeholder="e.g., Summer Sale" />
            <Input label="Promo Code" placeholder="e.g., SUMMER2026" className="uppercase" />
            <Input label="Discount Percentage" type="number" placeholder="20" min="1" max="100" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Valid From" type="date" />
              <Input label="Valid Until" type="date" />
            </div>
            <Input label="Max Uses (optional)" type="number" placeholder="Leave empty for unlimited" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button>Create Promotion</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)}>
        <ModalHeader onClose={() => setShowDeleteModal(null)}>Delete Promotion</ModalHeader>
        <ModalBody>
          <p className="text-dark-300">
            Are you sure you want to delete this promotion? This will invalidate the promo code.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDeleteModal(null)}>Cancel</Button>
          <Button variant="danger">Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
