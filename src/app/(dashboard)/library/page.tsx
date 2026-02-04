'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { 
  Search, 
  Grid, 
  List, 
  Filter, 
  SortAsc, 
  FileText, 
  MoreVertical,
  Download,
  Trash2,
  MessageSquare,
  ScrollText,
  Clock,
  Upload
} from 'lucide-react';
import { UserRole } from '@/types';
import { isPro } from '@/lib/auth';
import { formatBytes, formatDate, cn } from '@/lib/utils';

// Mock data - replace with real data from API
const mockPDFs = [
  { id: '1', name: 'Project Proposal.pdf', size: 2.4 * 1024 * 1024, pages: 12, date: '2026-02-01', thumbnail: null },
  { id: '2', name: 'Annual Report 2025.pdf', size: 8.1 * 1024 * 1024, pages: 45, date: '2026-01-30', thumbnail: null },
  { id: '3', name: 'Meeting Notes.pdf', size: 0.5 * 1024 * 1024, pages: 3, date: '2026-01-28', thumbnail: null },
  { id: '4', name: 'Research Paper.pdf', size: 3.2 * 1024 * 1024, pages: 24, date: '2026-01-25', thumbnail: null },
  { id: '5', name: 'Contract Draft.pdf', size: 1.1 * 1024 * 1024, pages: 8, date: '2026-01-22', thumbnail: null },
  { id: '6', name: 'Financial Summary.pdf', size: 4.5 * 1024 * 1024, pages: 15, date: '2026-01-20', thumbnail: null },
  { id: '7', name: 'Product Specifications.pdf', size: 6.3 * 1024 * 1024, pages: 32, date: '2026-01-18', thumbnail: null },
];

type ViewMode = 'grid' | 'list';
type SortOption = 'date' | 'name' | 'size';

export default function LibraryPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || UserRole.FREE_USER;
  const isProUser = isPro(userRole);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [selectedPDFs, setSelectedPDFs] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const filteredPDFs = mockPDFs.filter((pdf) =>
    pdf.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPDFs = [...filteredPDFs].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.size - a.size;
      case 'date':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const togglePDFSelection = (id: string) => {
    setSelectedPDFs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const PDFCard = ({ pdf }: { pdf: typeof mockPDFs[0] }) => (
    <Card 
      variant="hover" 
      className={cn(
        'p-4 relative',
        selectedPDFs.includes(pdf.id) && 'ring-2 ring-primary-500'
      )}
    >
      {/* Thumbnail placeholder */}
      <div className="aspect-[3/4] rounded-lg bg-dark-700 mb-4 flex items-center justify-center">
        <FileText className="text-dark-500" size={48} />
      </div>
      
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-white truncate" title={pdf.name}>
            {pdf.name}
          </h3>
          <p className="text-sm text-dark-400">
            {pdf.pages} pages • {formatBytes(pdf.size)}
          </p>
          <p className="text-xs text-dark-500 mt-1">
            {formatDate(pdf.date)}
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(showDropdown === pdf.id ? null : pdf.id)}
            className="p-1 rounded hover:bg-white/5 text-dark-400 hover:text-white"
          >
            <MoreVertical size={18} />
          </button>
          
          {showDropdown === pdf.id && (
            <div className="absolute right-0 top-full mt-1 w-48 glass rounded-lg py-1 z-10 shadow-xl">
              <button className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-white/5 flex items-center gap-2">
                <Download size={16} /> Download
              </button>
              {isProUser && (
                <>
                  <button className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-white/5 flex items-center gap-2">
                    <MessageSquare size={16} /> Ask AI
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-dark-200 hover:bg-white/5 flex items-center gap-2">
                    <ScrollText size={16} /> Summarize
                  </button>
                </>
              )}
              <div className="divider my-1" />
              <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const PDFListItem = ({ pdf }: { pdf: typeof mockPDFs[0] }) => (
    <div 
      className={cn(
        'p-4 flex items-center gap-4 hover:bg-white/5 transition-colors',
        selectedPDFs.includes(pdf.id) && 'bg-primary-500/10'
      )}
    >
      <input
        type="checkbox"
        checked={selectedPDFs.includes(pdf.id)}
        onChange={() => togglePDFSelection(pdf.id)}
        className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
      />
      
      <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
        <FileText className="text-red-400" size={24} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{pdf.name}</p>
        <p className="text-sm text-dark-400">
          {pdf.pages} pages • {formatBytes(pdf.size)}
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-dark-500 text-sm shrink-0">
        <Clock size={14} />
        {formatDate(pdf.date)}
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <button className="p-2 rounded hover:bg-white/5 text-dark-400 hover:text-white" title="Download">
          <Download size={18} />
        </button>
        {isProUser && (
          <button className="p-2 rounded hover:bg-white/5 text-dark-400 hover:text-white" title="Ask AI">
            <MessageSquare size={18} />
          </button>
        )}
        <button className="p-2 rounded hover:bg-white/5 text-red-400 hover:text-red-300" title="Delete">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Library</h1>
          <p className="text-dark-400">
            {mockPDFs.length} PDFs • {formatBytes(mockPDFs.reduce((acc, pdf) => acc + pdf.size, 0))} total
          </p>
        </div>
        <Link href="/upload">
          <Button leftIcon={<Upload size={18} />}>Upload PDF</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder={isProUser ? "Search by content or filename..." : "Search by filename..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={18} />}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-dark-800 border border-dark-700 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded',
                viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'
              )}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded',
                viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-dark-400 hover:text-white'
              )}
            >
              <List size={18} />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="input py-2 pr-8 appearance-none bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5rem',
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>
      </div>

      {/* Semantic search hint for free users */}
      {!isProUser && (
        <div className="mb-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-between">
          <p className="text-dark-300 text-sm">
            <span className="font-medium text-primary-400">Pro tip:</span> Upgrade to Pro for semantic search - 
            search by meaning, not just keywords!
          </p>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">Upgrade</Button>
          </Link>
        </div>
      )}

      {/* PDF Grid/List */}
      {sortedPDFs.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedPDFs.map((pdf) => (
              <PDFCard key={pdf.id} pdf={pdf} />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-dark-700">
              {sortedPDFs.map((pdf) => (
                <PDFListItem key={pdf.id} pdf={pdf} />
              ))}
            </div>
          </Card>
        )
      ) : (
        <Card className="p-12 text-center">
          <FileText className="mx-auto text-dark-500 mb-4" size={64} />
          <h3 className="text-xl font-medium text-white mb-2">
            {searchQuery ? 'No PDFs found' : 'Your library is empty'}
          </h3>
          <p className="text-dark-400 mb-6">
            {searchQuery 
              ? 'Try a different search term'
              : 'Upload your first PDF to get started'}
          </p>
          {!searchQuery && (
            <Link href="/upload">
              <Button>Upload PDF</Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
