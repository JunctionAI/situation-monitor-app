'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserData {
  fullName?: string;
  email?: string;
  imageUrl?: string;
}

export default function AccountPage() {
  const { tier, isPro, openUpgradeModal, isAuthConfigured } = useSubscription();
  const [isManaging, setIsManaging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (!isAuthConfigured) {
      setIsLoading(false);
      return;
    }

    // Check for user via Clerk global
    const checkUser = () => {
      // @ts-expect-error - accessing Clerk global
      const clerk = window.Clerk;
      if (clerk) {
        if (clerk.user) {
          setUser({
            fullName: clerk.user.fullName,
            email: clerk.user.emailAddresses?.[0]?.emailAddress,
            imageUrl: clerk.user.imageUrl,
          });
        }
        setIsLoading(false);
      } else {
        setTimeout(checkUser, 100);
      }
    };

    setTimeout(checkUser, 500);
  }, [isAuthConfigured]);

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      const response = await fetch('/api/create-portal', {
        method: 'POST',
      });
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
    setIsManaging(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-tactical-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthConfigured) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Not Configured</h1>
          <p className="text-text-muted mb-6">Set up Clerk to enable user accounts.</p>
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sign in required</h1>
          <p className="text-text-muted mb-6">Please sign in to view your account.</p>
          <Link
            href="/sign-in"
            className="px-6 py-3 bg-tactical-green text-background font-medium rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🌍</span>
            <span className="font-bold text-foreground">Situation Monitor</span>
          </Link>
          <Link href="/" className="text-text-muted hover:text-foreground text-sm">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>

        {/* Profile Section */}
        <section className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.fullName || 'Profile'}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <div className="text-foreground font-medium">
                {user.fullName || user.email}
              </div>
              {user.email && (
                <div className="text-text-muted text-sm">
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Subscription Section */}
        <section className="bg-surface border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Subscription</h2>

          <div className="flex items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                isPro
                  ? 'bg-gradient-to-r from-tactical-green to-emerald-600 text-background'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {isPro ? 'PRO' : 'FREE'}
            </span>
            <span className="text-text-muted">
              {isPro ? '$9.99/month' : 'Basic access'}
            </span>
          </div>

          {isPro ? (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Your PRO benefits:</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">✓</span>
                  Deep Space Explorer
                </li>
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">✓</span>
                  Live Video Streams
                </li>
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">✓</span>
                  Unlimited Articles
                </li>
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">✓</span>
                  Full Crisis Briefings
                </li>
              </ul>
              <button
                onClick={handleManageSubscription}
                disabled={isManaging}
                className="px-4 py-2 bg-background border border-border hover:border-tactical-green text-foreground text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isManaging ? 'Loading...' : 'Manage Subscription'}
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Upgrade to PRO:</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">→</span>
                  Deep Space Explorer - JWST imagery
                </li>
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">→</span>
                  Live Video from Al Jazeera, DW News
                </li>
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">→</span>
                  Unlimited article access
                </li>
                <li className="flex items-center gap-2 text-sm text-text-muted">
                  <span className="text-tactical-green">→</span>
                  Full crisis briefings & alerts
                </li>
              </ul>
              <button
                onClick={openUpgradeModal}
                className="px-6 py-3 bg-gradient-to-r from-tactical-green to-emerald-600 hover:from-tactical-green/90 hover:to-emerald-600/90 text-background font-semibold rounded-lg transition-all"
              >
                Upgrade to PRO - $9.99/mo
              </button>
              <p className="text-xs text-text-muted mt-2">7-day free trial. Cancel anytime.</p>
            </div>
          )}
        </section>

        {/* Back to Dashboard */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </main>
    </div>
  );
}
