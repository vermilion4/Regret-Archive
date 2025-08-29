'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Regret } from '@/lib/types';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { formatTimeAgo, getCategoryIcon } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Lightbulb, Clock, ArrowLeft, Share2, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { CommentSection } from '@/components/CommentSection';
import { SupportReactions } from '@/components/SupportReactions';
import { SlidingDoorsModal } from '@/components/SlidingDoorsModal';
import Link from 'next/link';

export default function RegretDetailPage() {
  const params = useParams();
  const regretId = params.id as string;
  
  const [regret, setRegret] = useState<Regret | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSlidingDoors, setShowSlidingDoors] = useState(false);

  useEffect(() => {
    if (regretId) {
      fetchRegret();
    }
  }, [regretId]);

  const fetchRegret = async () => {
    try {
      setLoading(true);
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regretId
      );
      setRegret(response as Regret);
    } catch (error) {
      console.error('Error fetching regret:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!regret) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Regret Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The regret you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Regrets
          </Link>
        </Button>

        {/* Regret Content */}
        <Card className="mb-8">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getCategoryIcon(regret.category)}</span>
                <Badge variant="secondary" className={`category-${regret.category}`}>
                  {regret.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
                {regret.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-meta">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeAgo(regret.created_at)}</span>
                </div>
                {regret.age_when_happened && (
                  <span>Age {regret.age_when_happened}</span>
                )}
                {regret.years_ago && (
                  <span>{regret.years_ago} years ago</span>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Story */}
            <div>
              <h2 className="text-xl font-semibold mb-4">The Story</h2>
              <div className="text-story leading-relaxed">
                {regret.story.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Lesson Learned */}
            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Lesson Learned</h2>
              <blockquote className="text-quote text-lg">
                "{regret.lesson}"
              </blockquote>
            </div>

            {/* Sliding Doors */}
            {regret.sliding_doors && (
              <div className="border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Sliding Doors</h2>
                <p className="text-story mb-4">
                  <strong>What could have been different:</strong>
                </p>
                <p className="text-story mb-6">
                  {regret.sliding_doors.alternate_path}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Would this have been better?</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{regret.sliding_doors.votes_better}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Minus className="h-4 w-4" />
                        <span>{regret.sliding_doors.votes_same}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>{regret.sliding_doors.votes_worse}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Support Reactions */}
            <SupportReactions regret={regret} onUpdate={fetchRegret} />

            {/* Stats */}
            <div className="flex items-center justify-between text-meta">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{regret.reactions.hugs} hugs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span>{regret.comment_count} comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>{regret.reactions.wisdom} wisdom</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentSection regretId={regret.$id} />
      </div>

      {/* Sliding Doors Modal */}
      {showSlidingDoors && regret.sliding_doors && (
        <SlidingDoorsModal
          slidingDoors={regret.sliding_doors}
          onClose={() => setShowSlidingDoors(false)}
          onVote={fetchRegret}
        />
      )}
    </div>
  );
}
