'use client';

import { useAuth } from '@/lib/auth';
import { LoginModal } from './LoginModal';
import { usePathname } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Routes that are accessible without authentication
const PUBLIC_ROUTES = ['/'];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading...</h2>
            <p className="text-muted-foreground">Checking authentication status</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated and trying to access a protected route
  if (!user && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="h-12 w-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to Regret Archive</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Please sign in or create an account to access this page. You can also continue anonymously.
          </p>
          <div className="pt-4">
            <LoginModal autoOpen={true} />
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated or accessing a public route, render the content
  return <>{children}</>;
}
