"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegretForm } from "@/components/RegretForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export default function SubmitClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  const handleSubmitSuccess = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-bungee mb-4 text-3xl font-bold md:text-4xl">
            Share Your Regret
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Your story matters. Share your regret anonymously and help others
            learn from your experience.
          </p>

          {/* Guidelines Button */}
          <div className="mt-4">
            <Dialog open={isGuidelinesOpen} onOpenChange={setIsGuidelinesOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Info className="h-4 w-4" />
                  Community Guidelines
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Community Guidelines
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-600">✅ Do</h4>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>
                          • Share personal experiences and lessons learned
                        </li>
                        <li>• Be honest and vulnerable</li>
                        <li>• Focus on the lesson, not just the pain</li>
                        <li>• Respect others' experiences</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-red-600">❌ Don't</h4>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• Share identifying information about others</li>
                        <li>• Promote harmful or illegal activities</li>
                        <li>• Use this as a platform for hate speech</li>
                        <li>• Spam or post irrelevant content</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">
                      <strong>Remember:</strong> This is a space for healing and
                      growth. Your story has the power to help someone else feel
                      less alone.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Benefits */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div> */}

        {/* Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Step-by-Step
              </Badge>
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
      </div>
    </div>
  );
}
