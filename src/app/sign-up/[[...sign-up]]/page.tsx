'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ClerkSignUp, setClerkSignUp] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const loadClerk = async () => {
      if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        try {
          const { SignUp } = await import('@clerk/nextjs');
          setClerkSignUp(() => SignUp as React.ComponentType<unknown>);
          setIsConfigured(true);
        } catch (e) {
          console.error('Failed to load Clerk:', e);
        }
      }
      setIsLoading(false);
    };

    loadClerk();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-tactical-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isConfigured || !ClerkSignUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Not Configured</h1>
          <p className="text-text-muted mb-6">Set up Clerk to enable sign up.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-tactical-green text-background font-medium rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Start Monitoring
          </h1>
          <p className="text-text-muted">
            Create your account to track global crises in real-time
          </p>
        </div>
        <ClerkSignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-surface border border-border shadow-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
