'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Search, Archive, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { LoginModal } from './LoginModal';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Archive className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Regret Archive</h1>
              <p className="text-xs text-muted-foreground">Share. Learn. Grow.</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Browse
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/insights" className="text-sm font-medium hover:text-primary transition-colors">
              Insights
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/submit">
                <Plus className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Share Regret</span>
              </Link>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.name || 'Anonymous User'}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <LoginModal />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
