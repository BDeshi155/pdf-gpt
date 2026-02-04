'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, Button, Badge, Progress } from '@/components/ui';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Crown, 
  Check, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '@/types';
import { isPro, getRoleDisplayName } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

// Mock billing data
const mockBillingData = {
  plan: 'free',
  status: 'active',
  currentPeriodEnd: '2026-03-01',
  paymentMethod: null,
  invoices: [
    { id: '1', date: '2026-01-01', amount: 0, status: 'paid', description: 'Free plan' },
  ],
};

const mockUsage = {
  uploads: { used: 7, limit: 10 },
  storage: { used: 45, limit: 100 }, // in MB
};

export default function BillingPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || UserRole.FREE_USER;
  const isProUser = isPro(userRole);
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-dark-400">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-white">Current Plan</h2>
                <Badge role={userRole}>{getRoleDisplayName(userRole)}</Badge>
              </div>
              <p className="text-dark-400">
                {isProUser 
                  ? 'You have access to all Pro features' 
                  : 'Upgrade to Pro for unlimited access'}
              </p>
            </div>
            {!isProUser ? (
              <Link href="/pricing">
                <Button leftIcon={<Crown size={18} />}>Upgrade to Pro</Button>
              </Link>
            ) : (
              <Button variant="secondary" onClick={() => setShowCancelModal(true)}>
                Manage Subscription
              </Button>
            )}
          </div>

          {isProUser && (
            <div className="mt-6 pt-6 border-t border-dark-700">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-dark-300">
                  <Calendar size={16} />
                  <span>Next billing date: {formatDate(mockBillingData.currentPeriodEnd)}</span>
                </div>
                <div className="flex items-center gap-2 text-dark-300">
                  <CreditCard size={16} />
                  <span>Visa ending in 4242</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Usage This Month</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-dark-300">Uploads</span>
                <span className="text-white">
                  {mockUsage.uploads.used} / {isProUser ? '∞' : mockUsage.uploads.limit}
                </span>
              </div>
              <Progress 
                value={mockUsage.uploads.used} 
                max={isProUser ? 100 : mockUsage.uploads.limit} 
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-dark-300">Storage</span>
                <span className="text-white">
                  {mockUsage.storage.used} MB / {isProUser ? '10 GB' : `${mockUsage.storage.limit} MB`}
                </span>
              </div>
              <Progress 
                value={mockUsage.storage.used} 
                max={isProUser ? 10240 : mockUsage.storage.limit} 
              />
            </div>
          </div>

          {!isProUser && mockUsage.uploads.used >= mockUsage.uploads.limit * 0.8 && (
            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-400" size={20} />
                <span className="text-yellow-400">You're running low on uploads</span>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant="outline">Upgrade</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      {!isProUser && (
        <Card className="mb-8 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-primary-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Upgrade to Pro and unlock everything
                </h3>
                <ul className="text-dark-300 text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-400" />
                    Unlimited uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-400" />
                    AI-powered Q&A and summaries
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-400" />
                    Semantic search
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-400" />
                    Priority support
                  </li>
                </ul>
              </div>
              <Link href="/pricing">
                <Button rightIcon={<ArrowRight size={18} />}>
                  View Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
            <Button variant="secondary" size="sm">Add Method</Button>
          </div>

          {isProUser ? (
            <div className="flex items-center justify-between p-4 rounded-lg bg-dark-800/50 border border-dark-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 rounded bg-dark-600 flex items-center justify-center">
                  <CreditCard className="text-dark-300" size={20} />
                </div>
                <div>
                  <p className="text-white">Visa ending in 4242</p>
                  <p className="text-sm text-dark-400">Expires 12/2027</p>
                </div>
              </div>
              <Badge variant="success">Default</Badge>
            </div>
          ) : (
            <p className="text-dark-400">No payment methods on file</p>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Billing History</h2>

          {mockBillingData.invoices.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mockBillingData.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{formatDate(invoice.date)}</td>
                      <td>{invoice.description}</td>
                      <td>${invoice.amount.toFixed(2)}</td>
                      <td>
                        <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td>
                        <button className="text-primary-400 hover:text-primary-300">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-dark-400">No billing history</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
