"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { LoginModal } from "./LoginModal";
import Image from "next/image";

export function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/#stories") {
      return pathname === "/" || pathname === "/#stories";
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
      console.error("Logout failed:", error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <Image
              src="/logo.png"
              alt="Regret Archive"
              width={130}
              height={130}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 lg:flex">
            {user ? (
              <Link href="/#stories" className={getLinkClasses("/#stories")}>
                Browse
              </Link>
            ) : (
              <LoginModal 
                trigger={
                  <button className={getLinkClasses("/#stories")}>
                    Browse
                  </button>
                }
              />
            )}
            <Link href="/categories" className={getLinkClasses("/categories")}>
              Categories
            </Link>
            <Link href="/insights" className={getLinkClasses("/insights")}>
              Insights
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-3 lg:flex">
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
                <span className="text-muted-foreground text-sm">
                  {user.name || "Anonymous User"}
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
          <div className="flex items-center space-x-2 lg:hidden">
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
          <div className="border-border mt-4 border-t pb-4 lg:hidden">
            <nav className="flex flex-col space-y-3 pt-4">
              {user ? (
                <Link
                  href="/#stories"
                  className={getLinkClasses("/#stories", true)}
                  onClick={closeMobileMenu}
                >
                  Browse
                </Link>
              ) : (
                <LoginModal 
                  trigger={
                    <button 
                      className={getLinkClasses("/#stories", true)}
                      onClick={closeMobileMenu}
                    >
                      Browse
                    </button>
                  }
                />
              )}
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
            <div className="border-border mt-3 border-t pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground text-sm">
                      {user.name || "Anonymous User"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
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
