'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Search, Archive, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { LoginModal } from './LoginModal';

export function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/#stories') {
      return pathname === '/' || pathname === '/#stories';
    }
    return pathname === href;
  };

  const getLinkClasses = (href: string, isMobile = false) => {
    const baseClasses = "text-sm font-medium transition-colors";
    const mobilePadding = isMobile ? "py-2" : "";
    
    if (isActiveLink(href)) {
      return `${baseClasses} text-primary font-semibold ${mobilePadding}`;
    }
    
    return `${baseClasses} text-muted-foreground hover:text-primary ${mobilePadding}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <Archive className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Regret Archive</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Share. Learn. Grow.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/#stories" className={getLinkClasses("/#stories")}>
              Browse
            </Link>
            <Link href="/categories" className={getLinkClasses("/categories")}>
              Categories
            </Link>
            <Link href="/insights" className={getLinkClasses("/insights")}>
              Insights
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/submit">
                <Plus className="h-4 w-4" />
                <span className="ml-2">Share Regret</span>
              </Link>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.name || 'Anonymous User'}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2">Logout</span>
                </Button>
              </div>
            ) : (
              <LoginModal />
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/submit">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link 
                href="/#stories" 
                className={getLinkClasses("/#stories", true)}
                onClick={closeMobileMenu}
              >
                Browse
              </Link>
              <Link 
                href="/categories" 
                className={getLinkClasses("/categories", true)}
                onClick={closeMobileMenu}
              >
                Categories
              </Link>
              <Link 
                href="/insights" 
                className={getLinkClasses("/insights", true)}
                onClick={closeMobileMenu}
              >
                Insights
              </Link>
            </nav>
            
            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-border mt-3">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {user.name || 'Anonymous User'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <LoginModal />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
