"use client";
import Link from "next/link";
import { Heart, Shield, Users, Lightbulb } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { LoginModal } from "./LoginModal";

export function Footer() {
  const { user } = useAuth();
  return (
    <footer className="border-border bg-card/50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Regret Archive"
              width={200}
              height={200}
            />
            <p className="text-muted-foreground text-sm">
              A safe, anonymous platform for sharing regrets and life lessons.
              Connect with others who understand your experiences.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {user ? (
                  <Link
                    href="/#stories"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Browse Regrets
                  </Link>
                ) : (
                  <LoginModal 
                    trigger={
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        Browse Regrets
                      </button>
                    }
                  />
                )}
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Share Your Story
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Community</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Anonymous & Safe</span>
              </li>
              <li className="text-muted-foreground flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Supportive Community</span>
              </li>
              <li className="text-muted-foreground flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Learn & Grow</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">About</h4>
            <p className="text-muted-foreground text-sm">
              Built with compassion and understanding. Every regret shared helps
              someone else feel less alone.
            </p>
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Developed by Adaeze Ndupu</span>
            </div>
          </div>
        </div>

        <div className="border-border text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Regret Archive. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
