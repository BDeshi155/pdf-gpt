'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, Button, Progress, Badge } from '@/components/ui';
import { 
  FileText, 
  Upload, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Crown,
  ArrowRight,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { UserRole } from '@/types';
import { isPro, getRoleDisplayName } from '@/lib/auth';
import { formatBytes, formatDate } from '@/lib/utils';

// Mock data - replace with real data from API
const mockStats = {
  totalPDFs: 7,
  pdfLimit: 10,
  monthlyUploadsUsed: 7,
  monthlyUploadsLimit: 10,
  storageUsed: 45 * 1024 * 1024, // 45 MB
  storageLimit: 100 * 1024 * 1024, // 100 MB
};

const mockRecentPDFs = [
  { id: '1', name: 'Project Proposal.pdf', size: 2.4 * 1024 * 1024, pages: 12, date: '2026-02-01' },
  { id: '2', name: 'Annual Report 2025.pdf', size: 8.1 * 1024 * 1024, pages: 45, date: '2026-01-30' },
  { id: '3', name: 'Meeting Notes.pdf', size: 0.5 * 1024 * 1024, pages: 3, date: '2026-01-28' },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || UserRole.FREE_USER;
  const isProUser = isPro(userRole);

  const usagePercent = (mockStats.monthlyUploadsUsed / mockStats.monthlyUploadsLimit) * 100;
  const storagePercent = (mockStats.storageUsed / mockStats.storageLimit) * 100;
  const nearLimit = usagePercent >= 70;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-dark-400">
          Here's an overview of your PDF library
        </p>
      </div>

      {/* Upgrade Banner for Free Users */}
      {!isProUser && nearLimit && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Crown className="text-primary-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  You're running low on uploads!
                </h3>
                <p className="text-dark-300">
                  Upgrade to Pro for unlimited uploads and AI features.
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <Button rightIcon={<ArrowRight size={18} />}>
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <FileText className="text-primary-400" size={20} />
              </div>
              <Badge role={userRole}>{getRoleDisplayName(userRole)}</Badge>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {mockStats.totalPDFs}
              <span className="text-lg text-dark-500">/{mockStats.pdfLimit}</span>
            </p>
            <p className="text-dark-400 text-sm">Total PDFs</p>
            <Progress 
              value={mockStats.totalPDFs} 
              max={mockStats.pdfLimit} 
              size="sm" 
              className="mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Upload className="text-accent-400" size={20} />
              </div>
              <span className="text-xs text-dark-500">This month</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {mockStats.monthlyUploadsUsed}
              <span className="text-lg text-dark-500">/{mockStats.monthlyUploadsLimit}</span>
            </p>
            <p className="text-dark-400 text-sm">Uploads used</p>
            <Progress 
              value={mockStats.monthlyUploadsUsed} 
              max={mockStats.monthlyUploadsLimit} 
              size="sm" 
              className="mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {formatBytes(mockStats.storageUsed)}
            </p>
            <p className="text-dark-400 text-sm">
              of {formatBytes(mockStats.storageLimit)} used
            </p>
            <Progress 
              value={mockStats.storageUsed} 
              max={mockStats.storageLimit} 
              size="sm" 
              className="mt-3" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <MessageSquare className="text-yellow-400" size={20} />
              </div>
              {!isProUser && (
                <Badge variant="pro">Pro</Badge>
              )}
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {isProUser ? '∞' : '0'}
            </p>
            <p className="text-dark-400 text-sm">AI Queries</p>
            {!isProUser && (
              <Link href="/pricing" className="text-primary-400 text-sm hover:text-primary-300 mt-2 inline-block">
                Upgrade for AI features →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent PDFs */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/upload" className="block">
              <Card variant="hover" className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <Upload className="text-primary-400" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Upload PDF</p>
                  <p className="text-sm text-dark-400">Add new documents</p>
                </div>
                <ArrowRight className="text-dark-500" size={18} />
              </Card>
            </Link>

            <Link href="/library" className="block">
              <Card variant="hover" className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                  <FolderOpen className="text-accent-400" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Browse Library</p>
                  <p className="text-sm text-dark-400">View all PDFs</p>
                </div>
                <ArrowRight className="text-dark-500" size={18} />
              </Card>
            </Link>

            <Link href="/chat" className="block">
              <Card variant="hover" className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Sparkles className="text-green-400" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">AI Chat</p>
                  <p className="text-sm text-dark-400">Ask questions about your PDFs</p>
                </div>
                {!isProUser && <Badge variant="pro">Pro</Badge>}
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent PDFs */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent PDFs</h2>
            <Link href="/library" className="text-primary-400 hover:text-primary-300 text-sm">
              View all →
            </Link>
          </div>
          
          {mockRecentPDFs.length > 0 ? (
            <Card className="overflow-hidden">
              <div className="divide-y divide-dark-700">
                {mockRecentPDFs.map((pdf) => (
                  <div key={pdf.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
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
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <FileText className="mx-auto text-dark-500 mb-4" size={48} />
              <h3 className="text-lg font-medium text-white mb-2">No PDFs yet</h3>
              <p className="text-dark-400 mb-4">Upload your first PDF to get started</p>
              <Link href="/upload">
                <Button>Upload PDF</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
