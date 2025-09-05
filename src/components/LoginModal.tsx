"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Mail, Lock, UserPlus } from "lucide-react";

interface LoginModalProps {
  autoOpen?: boolean;
  trigger?: React.ReactNode;
}

export function LoginModal({ autoOpen = false, trigger }: LoginModalProps) {
  const { user, login, signup, createAnonymousSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Auto-open the modal if autoOpen prop is true
  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  // Handle modal open/close with routing logic
  const handleOpenChange = (open: boolean) => {
    if (autoOpen && !user) {
      // If modal is auto-opened and user is not authenticated, closing should redirect home
      if (!open) {
        router.push("/");
        return;
      }
    }
    setIsOpen(open);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(loginData.email, loginData.password);
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(signupData.email, signupData.password, signupData.name);
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await createAnonymousSession();
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || "Anonymous login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="group from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground border-primary/20 relative overflow-hidden rounded-full border-2 bg-gradient-to-r px-8 py-3 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center">
              <User className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              Get Started
            </span>
            <div className="from-primary/20 absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-primary/20 shadow-primary/10 border-2 shadow-2xl backdrop-blur-md sm:max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent">
            Welcome to Regret Archive
          </DialogTitle>
          <div className="via-primary/30 h-px w-full bg-gradient-to-r from-transparent to-transparent"></div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 border-border/50 grid w-full grid-cols-3 rounded-lg border p-1">
            <TabsTrigger
              value="login"
              className="hover:bg-muted/80 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:border-2 data-[state=active]:font-semibold data-[state=active]:shadow-lg"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="hover:bg-muted/80 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:border-2 data-[state=active]:font-semibold data-[state=active]:shadow-lg"
            >
              Sign Up
            </TabsTrigger>
            <TabsTrigger
              value="anonymous"
              className="hover:bg-muted/80 transition-all duration-300 data-[state=active]:scale-105 data-[state=active]:border-2 data-[state=active]:font-semibold data-[state=active]:shadow-lg"
            >
              Anonymous
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-5 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="login-email"
                  className="text-foreground text-sm font-medium"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary border-2 pl-10 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="login-password"
                  className="text-foreground text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary border-2 pl-10 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="border-destructive/50 bg-destructive/10 border-2"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-3 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-5 space-y-6">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="signup-name"
                  className="text-foreground text-sm font-medium"
                >
                  Name
                </Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your name"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary border-2 pl-10 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="signup-email"
                  className="text-foreground text-sm font-medium"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary border-2 pl-10 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="signup-password"
                  className="text-foreground text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="bg-background border-border focus:border-primary border-2 pl-10 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="border-destructive/50 bg-destructive/10 border-2"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-3 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="anonymous" className="mt-5 space-y-6">
            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                  <User className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-foreground text-lg font-semibold">
                  Continue Anonymously
                </h3>
                <p className="text-muted-foreground text-sm">
                  Browse and share regrets without creating an account. Your
                  privacy is protected.
                </p>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="border-destructive/50 bg-destructive/10 border-2"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleAnonymousLogin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-3 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue Anonymously
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Small hint for users who want to go back */}
        {autoOpen && (
          <div className="border-border/50 border-t pt-4 text-center">
            <p className="text-muted-foreground text-xs">
              Close this modal to return to the home page
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
