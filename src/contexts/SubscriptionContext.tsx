'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SubscriptionTier = 'free' | 'pro';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isLoading: boolean;
  isPro: boolean;
  // Feature access
  canAccessDeepSpace: boolean;
  canAccessLiveVideo: boolean;
  canAccessSocialFeed: boolean;
  canAccessUnlimitedArticles: boolean;
  articleLimit: number;
  // Actions
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  isUpgradeModalOpen: boolean;
  // Auth
  isAuthConfigured: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const FREE_ARTICLE_LIMIT = 10;

interface ClerkUserLike {
  publicMetadata?: {
    subscriptionTier?: string;
  };
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthConfigured] = useState(() =>
    typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );

  useEffect(() => {
    async function checkSubscription() {
      if (!isAuthConfigured) {
        // No auth configured - default to free tier
        setTier('free');
        setIsLoading(false);
        return;
      }

      try {
        // Dynamically import Clerk and check subscription
        const clerkModule = await import('@clerk/nextjs');

        // We need to wait a bit for Clerk to initialize
        const checkUser = () => {
          // @ts-expect-error - accessing Clerk internal state
          const clerkInstance = window.Clerk;
          if (clerkInstance?.user) {
            const user = clerkInstance.user as ClerkUserLike;
            const subscriptionStatus = user.publicMetadata?.subscriptionTier;
            setTier(subscriptionStatus === 'pro' ? 'pro' : 'free');
            setIsLoading(false);
          } else if (clerkInstance && !clerkInstance.user) {
            // User not signed in
            setTier('free');
            setIsLoading(false);
          } else {
            // Clerk not ready yet, wait
            setTimeout(checkUser, 100);
          }
        };

        // Start checking after a short delay
        setTimeout(checkUser, 500);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setTier('free');
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, [isAuthConfigured]);

  const isPro = tier === 'pro';

  const value: SubscriptionContextType = {
    tier,
    isLoading,
    isPro,
    isAuthConfigured,
    // Premium features (Deep Space, Video, Social, Unlimited are PRO only)
    canAccessDeepSpace: isPro,
    canAccessLiveVideo: isPro,
    canAccessSocialFeed: isPro,
    canAccessUnlimitedArticles: isPro,
    articleLimit: isPro ? Infinity : FREE_ARTICLE_LIMIT,
    // Modal controls
    openUpgradeModal: () => setIsUpgradeModalOpen(true),
    closeUpgradeModal: () => setIsUpgradeModalOpen(false),
    isUpgradeModalOpen,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
