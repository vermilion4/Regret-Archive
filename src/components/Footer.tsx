import Link from 'next/link';
import { Heart, Shield, Users, Lightbulb } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-bungee">Regret Archive</h3>
            <p className="text-sm text-muted-foreground">
              A safe, anonymous platform for sharing regrets and life lessons. 
              Connect with others who understand your experiences.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Regrets
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
                  Share Your Story
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-muted-foreground hover:text-foreground transition-colors">
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Community</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Anonymous & Safe</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Supportive Community</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                <span>Learn & Grow</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">About</h4>
            <p className="text-sm text-muted-foreground">
              Built with compassion and understanding. Every regret shared helps someone else feel less alone.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Developed by Adaeze Ndupu</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Regret Archive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
