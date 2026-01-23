'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const PRO_FEATURES = [
  { icon: '🔭', name: 'Deep Space Explorer', desc: 'Journey through the cosmos with James Webb imagery' },
  { icon: '📺', name: 'Live Video Streams', desc: 'Al Jazeera, France 24, DW News, and more' },
  { icon: '📱', name: 'X Social Feed', desc: 'Real-time updates from verified journalists' },
  { icon: '📰', name: 'Unlimited Articles', desc: 'Access all 50+ articles from 20+ sources' },
  { icon: '🔔', name: 'Push Notifications', desc: 'Alerts for escalating situations' },
  { icon: '📊', name: 'Zone Briefings', desc: 'Detailed crisis analysis per region' },
];

export function UpgradeModal() {
  const { isUpgradeModalOpen, closeUpgradeModal, isAuthConfigured } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Check sign-in status via Clerk's global object
  useEffect(() => {
    if (!isAuthConfigured) return;

    const checkAuth = () => {
      // @ts-expect-error - accessing Clerk global
      const clerk = window.Clerk;
      if (clerk) {
        setIsSignedIn(!!clerk.user);
      } else {
        setTimeout(checkAuth, 100);
      }
    };

    checkAuth();
  }, [isAuthConfigured]);

  if (!isUpgradeModalOpen) return null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeUpgradeModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-tactical-green/20 via-purple-500/20 to-tactical-blue/20 p-6 pb-8">
          <button
            onClick={closeUpgradeModal}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tactical-green/20 border border-tactical-green/30 rounded-full text-tactical-green text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-tactical-green rounded-full animate-pulse" />
              PRO
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Unlock Full Access
            </h2>
            <p className="text-text-muted">
              Get unlimited access to all premium features
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="p-6 space-y-3">
          {PRO_FEATURES.map((feature) => (
            <div key={feature.name} className="flex items-start gap-3">
              <span className="text-xl">{feature.icon}</span>
              <div>
                <div className="font-medium text-foreground">{feature.name}</div>
                <div className="text-sm text-text-muted">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="px-6 pb-6">
          <div className="bg-background rounded-xl p-4 mb-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-foreground">$9.99</span>
              <span className="text-text-muted">/month</span>
            </div>
            <p className="text-center text-text-muted text-sm mt-1">
              Cancel anytime. 7-day free trial.
            </p>
          </div>

          {!isAuthConfigured ? (
            <p className="text-center text-text-muted text-sm py-4">
              Authentication not configured. Please set up Clerk to enable subscriptions.
            </p>
          ) : isSignedIn ? (
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-tactical-green to-emerald-600 hover:from-tactical-green/90 hover:to-emerald-600/90 text-background font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Start Free Trial'}
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="block w-full py-3 bg-gradient-to-r from-tactical-green to-emerald-600 hover:from-tactical-green/90 hover:to-emerald-600/90 text-background font-semibold rounded-xl transition-all text-center"
            >
              Sign In to Start Trial
            </Link>
          )}

          <p className="text-center text-text-muted text-xs mt-3">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
