'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegretForm } from '@/components/RegretForm';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Lightbulb } from 'lucide-react';

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitSuccess = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Share Your Regret
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your story matters. Share your regret anonymously and help others learn from your experience.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6">
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Completely Anonymous</h3>
            <p className="text-sm text-muted-foreground">
              No personal information required. Your privacy is protected.
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Supportive Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with others who understand and can offer support.
            </p>
          </Card>
          
          <Card className="text-center p-6">
            <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Learn & Grow</h3>
            <p className="text-sm text-muted-foreground">
              Turn your regret into wisdom that helps others.
            </p>
          </Card>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Step-by-Step
              </Badge>
              <span className="text-sm text-muted-foreground">
                Take your time. This is a safe space.
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <RegretForm 
              onSuccess={handleSubmitSuccess}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">Community Guidelines</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">✅ Do</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share personal experiences and lessons learned</li>
                  <li>• Be honest and vulnerable</li>
                  <li>• Focus on the lesson, not just the pain</li>
                  <li>• Respect others' experiences</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">❌ Don't</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share identifying information about others</li>
                  <li>• Promote harmful or illegal activities</li>
                  <li>• Use this as a platform for hate speech</li>
                  <li>• Spam or post irrelevant content</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Remember:</strong> This is a space for healing and growth. 
                Your story has the power to help someone else feel less alone.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
