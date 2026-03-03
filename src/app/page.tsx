'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if user has a valid token
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
          setHasToken(true);
          router.push('/dashboard');
        }
      } catch (error) {
        // Not authenticated
      }
    };
    checkAuth();
  }, [router]);

  const handleMetaLogin = () => {
    setIsLoading(true);
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_META_REDIRECT_URI || '');
    const scopes = encodeURIComponent('ads_management, ads_read');
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;
    
    window.location.href = authUrl;
  };

  if (hasToken) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 gradient-text">AVAIL</h1>
          <h2 className="text-2xl font-light text-slate-300">Studio</h2>
          <p className="text-slate-400 text-sm mt-4">
            Real-time Meta Ads Intelligence & Strategic Control
          </p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-slate-300 text-sm">
              Connect your Meta ad account to get started
            </p>
          </div>

          <button
            onClick={handleMetaLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Connecting...
              </>
            ) : (
              <>
                <span>f</span>
                Login with Meta
              </>
            )}
          </button>

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
            <p>
              By logging in, you're connecting your Meta Business account securely.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-slate-500 text-xs space-y-1">
          <p>🔐 Enterprise-grade security</p>
          <p>📊 Real-time data analytics</p>
          <p>🤖 AI-powered recommendations</p>
        </div>
      </div>
    </div>
  );
}
