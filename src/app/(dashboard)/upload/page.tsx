'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, Button, Progress, Badge } from '@/components/ui';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Crown
} from 'lucide-react';
import { UserRole } from '@/types';
import { isPro } from '@/lib/auth';
import { formatBytes, cn } from '@/lib/utils';

interface UploadFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

// Mock stats
const mockStats = {
  monthlyUploadsUsed: 7,
  monthlyUploadsLimit: 10,
};

export default function UploadPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || UserRole.FREE_USER;
  const isProUser = isPro(userRole);

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const remainingUploads = mockStats.monthlyUploadsLimit - mockStats.monthlyUploadsUsed;
  const canUpload = isProUser || remainingUploads > 0;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!canUpload) return;

    const newFiles: UploadFile[] = acceptedFiles
      .filter((file) => file.type === 'application/pdf')
      .slice(0, isProUser ? Infinity : remainingUploads)
      .map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        status: 'pending' as const,
        progress: 0,
      }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, [canUpload, isProUser, remainingUploads]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    disabled: !canUpload,
    maxFiles: isProUser ? 50 : remainingUploads,
    maxSize: isProUser ? 100 * 1024 * 1024 : 10 * 1024 * 1024, // 100MB for Pro, 10MB for Free
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    for (const uploadFile of files) {
      if (uploadFile.status !== 'pending') continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
        )
      );

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress } : f
          )
        );
      }

      // Simulate success (in real app, this would be an API call)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'success' as const } : f
        )
      );
    }

    setIsUploading(false);
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== 'success'));
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload PDFs</h1>
        <p className="text-dark-400">
          Drag and drop your PDF files or click to browse
        </p>
      </div>

      {/* Usage Stats for Free Users */}
      {!isProUser && (
        <Card className="p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-dark-300">
              Monthly uploads: <span className="text-white font-medium">{mockStats.monthlyUploadsUsed}/{mockStats.monthlyUploadsLimit}</span>
            </p>
            <Progress 
              value={mockStats.monthlyUploadsUsed} 
              max={mockStats.monthlyUploadsLimit} 
              size="sm" 
              className="mt-2 w-48" 
            />
          </div>
          {remainingUploads <= 3 && (
            <Link href="/pricing">
              <Button variant="outline" size="sm" leftIcon={<Crown size={16} />}>
                Upgrade for unlimited
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'upload-zone mb-8',
          isDragActive && 'dragging',
          !canUpload && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-4">
          <Upload className="text-primary-400" size={32} />
        </div>
        {!canUpload ? (
          <>
            <h3 className="text-lg font-medium text-white mb-2">Upload limit reached</h3>
            <p className="text-dark-400 mb-4">
              You've used all your free uploads this month
            </p>
            <Link href="/pricing">
              <Button size="sm">Upgrade to Pro</Button>
            </Link>
          </>
        ) : isDragActive ? (
          <h3 className="text-lg font-medium text-primary-400">Drop your PDFs here...</h3>
        ) : (
          <>
            <h3 className="text-lg font-medium text-white mb-2">
              Drag & drop PDFs here
            </h3>
            <p className="text-dark-400 mb-4">
              or click to browse your files
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="default">PDF only</Badge>
              <Badge variant="default">
                Max {isProUser ? '100 MB' : '10 MB'} per file
              </Badge>
              {!isProUser && (
                <Badge variant="default">{remainingUploads} uploads remaining</Badge>
              )}
            </div>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <Card className="mb-6">
          <div className="p-4 border-b border-dark-700 flex items-center justify-between">
            <h3 className="font-medium text-white">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </h3>
            <div className="flex gap-2">
              {files.some((f) => f.status === 'success') && (
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  Clear completed
                </Button>
              )}
              <Button
                size="sm"
                onClick={uploadFiles}
                isLoading={isUploading}
                disabled={files.every((f) => f.status !== 'pending')}
              >
                Upload {files.filter((f) => f.status === 'pending').length} files
              </Button>
            </div>
          </div>

          <div className="divide-y divide-dark-700 max-h-96 overflow-y-auto">
            {files.map((uploadFile) => (
              <div key={uploadFile.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <FileText className="text-red-400" size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{uploadFile.file.name}</p>
                  <p className="text-sm text-dark-400">{formatBytes(uploadFile.file.size)}</p>
                  
                  {uploadFile.status === 'uploading' && (
                    <Progress 
                      value={uploadFile.progress} 
                      max={100} 
                      size="sm" 
                      className="mt-2" 
                    />
                  )}
                  
                  {uploadFile.error && (
                    <p className="text-sm text-red-400 mt-1">{uploadFile.error}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusIcon(uploadFile.status)}
                  
                  {uploadFile.status === 'pending' && (
                    <button
                      onClick={() => removeFile(uploadFile.id)}
                      className="p-1 rounded hover:bg-white/5 text-dark-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Pro Features Promo */}
      {!isProUser && (
        <Card className="p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-primary-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
              <Crown className="text-primary-400" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Upgrade to Pro for more power
              </h3>
              <ul className="text-dark-300 text-sm space-y-1 mb-4">
                <li>✓ Unlimited uploads</li>
                <li>✓ Files up to 100 MB</li>
                <li>✓ AI-powered summaries and Q&A</li>
                <li>✓ Semantic search across all documents</li>
              </ul>
              <Link href="/pricing">
                <Button size="sm">View Pro Features</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
