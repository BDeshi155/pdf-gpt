'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Download,
  Filter
} from 'lucide-react';
import { formatBytes, formatDate, cn } from '@/lib/utils';

// Mock shop PDFs
const mockShopPDFs = [
  { id: '1', title: 'Getting Started Guide', category: 'Tutorial', pages: 25, size: 2.5 * 1024 * 1024, downloads: 1250, featured: true, proOnly: false, uploadedAt: '2026-01-15' },
  { id: '2', title: 'Advanced AI Techniques', category: 'Guide', pages: 45, size: 8.2 * 1024 * 1024, downloads: 890, featured: true, proOnly: true, uploadedAt: '2026-01-10' },
  { id: '3', title: 'Best Practices Handbook', category: 'Reference', pages: 120, size: 15.3 * 1024 * 1024, downloads: 567, featured: false, proOnly: true, uploadedAt: '2026-01-05' },
  { id: '4', title: 'Quick Reference Card', category: 'Reference', pages: 4, size: 0.5 * 1024 * 1024, downloads: 2340, featured: false, proOnly: false, uploadedAt: '2026-01-01' },
];

const categories = ['All', 'Tutorial', 'Guide', 'Reference', 'Template'];

export default function AdminShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filteredPDFs = mockShopPDFs.filter((pdf) => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">PDF Shop Management</h1>
          <p className="text-dark-400">Upload and manage PDFs available in the shop</p>
        </div>
        <Button leftIcon={<Plus size={18} />} onClick={() => setShowUploadModal(true)}>
          Upload PDF
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">{mockShopPDFs.length}</p>
            <p className="text-dark-400 text-sm">Total PDFs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockShopPDFs.reduce((acc, pdf) => acc + pdf.downloads, 0).toLocaleString()}
            </p>
            <p className="text-dark-400 text-sm">Total Downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockShopPDFs.filter((pdf) => pdf.featured).length}
            </p>
            <p className="text-dark-400 text-sm">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">
              {mockShopPDFs.filter((pdf) => pdf.proOnly).length}
            </p>
            <p className="text-dark-400 text-sm">Pro Only</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Search PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-300 hover:text-white'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* PDF Table */}
      <Card className="overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Size</th>
                <th>Downloads</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPDFs.map((pdf) => (
                <tr key={pdf.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <FileText className="text-red-400" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{pdf.title}</p>
                        <p className="text-xs text-dark-400">{pdf.pages} pages</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="default">{pdf.category}</Badge>
                  </td>
                  <td>{formatBytes(pdf.size)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Download size={14} className="text-dark-400" />
                      {pdf.downloads.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {pdf.featured && (
                        <Badge variant="warning">
                          <Star size={12} className="mr-1" />
                          Featured
                        </Badge>
                      )}
                      {pdf.proOnly && <Badge variant="pro">Pro</Badge>}
                    </div>
                  </td>
                  <td>{formatDate(pdf.uploadedAt)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded hover:bg-white/5 text-dark-400 hover:text-white">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded hover:bg-white/5 text-dark-400 hover:text-white">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-2 rounded hover:bg-white/5 text-red-400 hover:text-red-300"
                        onClick={() => setShowDeleteModal(pdf.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <ModalHeader onClose={() => setShowUploadModal(false)}>Upload PDF to Shop</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input label="Title" placeholder="Enter PDF title" />
            <Input label="Description" placeholder="Enter description" />
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">Category</label>
              <select className="input">
                {categories.filter((c) => c !== 'All').map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-dark-300">
                <input type="checkbox" className="rounded" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-dark-300">
                <input type="checkbox" className="rounded" />
                Pro Only
              </label>
            </div>
            <div className="upload-zone">
              <FileText className="text-dark-500 mb-2" size={32} />
              <p className="text-dark-400">Drop PDF here or click to browse</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowUploadModal(false)}>Cancel</Button>
          <Button>Upload</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)}>
        <ModalHeader onClose={() => setShowDeleteModal(null)}>Delete PDF</ModalHeader>
        <ModalBody>
          <p className="text-dark-300">
            Are you sure you want to delete this PDF? This action cannot be undone.
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
