'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  OAuthSignin: 'Error in OAuth sign in. Please try again.',
  OAuthCallback: 'Error in OAuth callback. Please try again.',
  OAuthCreateAccount: 'Could not create OAuth account. Please try again.',
  EmailCreateAccount: 'Could not create email account. Please try again.',
  Callback: 'Error in callback. Please try again.',
  OAuthAccountNotLinked: 'This email is already associated with another account. Please sign in using your original method.',
  EmailSignin: 'Error sending email. Please try again.',
  CredentialsSignin: 'Invalid email or password.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An error occurred. Please try again.',
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to home
        </Link>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
          <p className="text-dark-400 mb-6">{errorMessage}</p>
          
          <div className="space-y-3">
            <Link href="/auth/login">
              <Button className="w-full">Try Again</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>

          {error === 'OAuthAccountNotLinked' && (
            <p className="text-dark-500 text-sm mt-6">
              If you previously signed up with email, please use that method to log in.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
