'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Lock, UserPlus } from 'lucide-react';

export function LoginModal() {
  const { login, signup, createAnonymousSession } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData.email, loginData.password);
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(signupData.email, signupData.password, signupData.name);
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await createAnonymousSession();
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || 'Anonymous login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <User className="h-4 w-4 mr-2" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-2 border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-md">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to Regret Archive
          </DialogTitle>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg border border-border/50">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-primary/30 transition-all duration-300 hover:bg-muted/80"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-primary/30 transition-all duration-300 hover:bg-muted/80"
            >
              Sign Up
            </TabsTrigger>
            <TabsTrigger 
              value="anonymous" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-primary/30 transition-all duration-300 hover:bg-muted/80"
            >
              Anonymous
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="login-email" className="text-sm font-medium text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-10 bg-background border-2 border-border focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="login-password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pl-10 bg-background border-2 border-border focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="border-2 border-destructive/50 bg-destructive/10">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="pl-10 bg-background border-2 border-border focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="pl-10 bg-background border-2 border-border focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="pl-10 bg-background border-2 border-border focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="border-2 border-destructive/50 bg-destructive/10">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="anonymous" className="space-y-6">
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Continue Anonymously</h3>
                <p className="text-muted-foreground text-sm">
                  Browse and share regrets without creating an account. Your privacy is protected.
                </p>
              </div>
              {error && (
                <Alert variant="destructive" className="border-2 border-destructive/50 bg-destructive/10">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                onClick={handleAnonymousLogin} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue Anonymously
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
