import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, MessageCircle, Lightbulb, Clock, ExternalLink, Users, DoorOpen } from 'lucide-react';
import { Regret } from '@/lib/types';
import { safeJsonParse, getAnonymousId } from '@/lib/utils';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';

interface RegretOfTheDayProps {
  featuredRegret: Regret;
  onUpdate?: () => void;
}

export function RegretOfTheDay({ featuredRegret, onUpdate }: RegretOfTheDayProps) {
  const [reacting, setReacting] = useState<string | null>(null);
  const reactions = safeJsonParse(featuredRegret.reactions, { hugs: 0, me_too: 0, wisdom: 0 });
  const totalReactions = Number(reactions.hugs || 0) + Number(reactions.me_too || 0) + Number(reactions.wisdom || 0);

  const handleReaction = async (reactionType: 'me_too' | 'hugs' | 'wisdom') => {
    try {
      setReacting(reactionType);
      
      const currentReactions = { ...reactions };
      currentReactions[reactionType] += 1;

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        featuredRegret.$id,
        {
          reactions: JSON.stringify(currentReactions)
        }
      );

      if (onUpdate) {
        onUpdate();
      }
      toast.success('Thanks for showing your support!');
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction. Please try again.');
    } finally {
      setReacting(null);
    }
  };

  return (
    <div className="relative mb-16">
      {/* Background glow effects */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-secondary/20 blur-2xl opacity-30 rounded-3xl" />
      <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-secondary/10 blur-xl opacity-50 rounded-2xl" />
      
      <div className="relative">
        {/* Header with improved badge */}
        <div className="flex items-center justify-center mb-8">
          <Badge className="bg-black/50 text-foreground border-primary/30 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
            Regret of the Day
            <div className="ml-3 px-2 py-1 bg-primary/20 rounded-full text-xs">
              {totalReactions} reactions
            </div>
          </Badge>
        </div>
        
        {/* Enhanced card */}
        <Card className="relative bg-gradient-to-br from-background/95 via-background to-background/90 border-2 border-primary/20 shadow-2xl backdrop-blur-md">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl" />
          
          {/* Animated corner accent */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
          
          <CardContent className="relative p-8 md:p-12">
            {/* Category and timestamp */}
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary capitalize">
                {featuredRegret.category}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(featuredRegret.$createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground leading-tight">
              {featuredRegret.title}
            </h2>

            {/* Story content with better typography */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-foreground/90 leading-relaxed text-lg">
                {featuredRegret.story}
              </p>
            </div>

            {/* Lesson learned */}
            {featuredRegret.lesson && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-8 border border-primary/20">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">What I learned:</h3>
                    <p className="text-foreground/80 leading-relaxed">{featuredRegret.lesson}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reaction buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleReaction('hugs')}
                disabled={reacting === 'hugs'}
                className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-500 cursor-pointer"
              >
                <Heart className="h-4 w-4 mr-2" />
                {Number(reactions.hugs || 0)} Hugs
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleReaction('me_too')}
                disabled={reacting === 'me_too'}
                className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-500 cursor-pointer"
              >
                <Users className="h-4 w-4 mr-2" />
                {Number(reactions.me_too || 0)} Me Too
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleReaction('wisdom')}
                disabled={reacting === 'wisdom'}
                className="bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-500 cursor-pointer"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {Number(reactions.wisdom || 0)} Wisdom
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
              <Button className="flex-1 bg-primary hover:bg-primary/90" asChild>
                <Link href={`/regret/${featuredRegret.$id}#comments`}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Add Support
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/regret/${featuredRegret.$id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Story
                </Link>
              </Button>
              {featuredRegret.sliding_doors && (
                <Button variant="outline" className="flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:bg-primary/20 text-primary" asChild>
                  <Link href={`/regret/${featuredRegret.$id}#sliding-doors`}>
                    <DoorOpen className="h-4 w-4 mr-2" />
                    Sliding Doors
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}