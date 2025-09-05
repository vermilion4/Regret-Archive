import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Heart,
  MessageCircle,
  Lightbulb,
  Clock,
  ExternalLink,
  Users,
  DoorOpen,
} from "lucide-react";
import { Regret } from "@/lib/types";
import { safeJsonParse, getAnonymousId } from "@/lib/utils";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import toast from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";

interface RegretOfTheDayProps {
  featuredRegret: Regret;
  onUpdate?: (updatedRegret: Regret) => void;
}

export function RegretOfTheDay({
  featuredRegret,
  onUpdate,
}: RegretOfTheDayProps) {
  const [reacting, setReacting] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(() => 
    safeJsonParse(featuredRegret.reactions, {
      hugs: 0,
      me_too: 0,
      wisdom: 0,
    })
  );
  const totalReactions =
    Number(localReactions.hugs || 0) +
    Number(localReactions.me_too || 0) +
    Number(localReactions.wisdom || 0);

  const handleReaction = async (reactionType: "me_too" | "hugs" | "wisdom") => {
    try {
      setReacting(reactionType);

      // Optimistically update local state
      const newReactions = { ...localReactions };
      newReactions[reactionType] += 1;
      setLocalReactions(newReactions);

      // Update the database
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        featuredRegret.$id,
        {
          reactions: JSON.stringify(newReactions),
        }
      );

      // Update parent component with new regret data
      if (onUpdate) {
        const updatedRegret = {
          ...featuredRegret,
          reactions: JSON.stringify(newReactions),
        };
        onUpdate(updatedRegret);
      }

      toast.success("Thanks for showing your support!");
    } catch (error) {
      console.error("Error adding reaction:", error);
      // Revert optimistic update on error
      setLocalReactions(safeJsonParse(featuredRegret.reactions, {
        hugs: 0,
        me_too: 0,
        wisdom: 0,
      }));
      toast.error("Failed to add reaction. Please try again.");
    } finally {
      setReacting(null);
    }
  };

  return (
    <div className="relative mb-16">
      {/* Background glow effects */}
      <div className="from-primary/20 to-secondary/20 absolute -inset-4 rounded-3xl bg-gradient-to-r via-purple-500/20 opacity-30 blur-2xl" />
      <div className="from-primary/10 to-secondary/10 absolute -inset-2 rounded-2xl bg-gradient-to-br opacity-50 blur-xl" />

      <div className="relative">
        {/* Header with improved badge */}
        <div className="mb-8 flex items-center justify-center">
          <Badge className="text-foreground border-primary/30 rounded-full bg-black/50 px-6 py-3 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="text-primary mr-2 h-4 w-4 animate-pulse" />
            Regret of the Day
            <div className="bg-primary/20 ml-3 rounded-full px-2 py-1 text-xs">
              {totalReactions} reactions
            </div>
          </Badge>
        </div>

        {/* Enhanced card */}
        <Card className="from-background/95 via-background to-background/90 border-primary/20 relative border-2 bg-gradient-to-br shadow-2xl backdrop-blur-md">
          {/* Subtle gradient overlay */}
          <div className="from-primary/5 to-secondary/5 absolute inset-0 rounded-2xl bg-gradient-to-br via-transparent" />

          {/* Animated corner accent */}
          <div className="bg-primary absolute top-4 right-4 h-2 w-2 animate-pulse rounded-full" />

          <CardContent className="relative p-8 md:p-12">
            {/* Category and timestamp */}
            <div className="mb-6 flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-primary/10 border-primary/30 text-primary capitalize"
              >
                {featuredRegret.category}
              </Badge>
              <div className="text-muted-foreground flex items-center text-sm">
                <Clock className="mr-1 h-4 w-4" />
                {new Date(featuredRegret.$createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-foreground mb-6 text-2xl leading-tight font-bold md:text-3xl">
              {featuredRegret.title}
            </h2>

            {/* Story content with better typography */}
            <div className="prose prose-lg mb-8 max-w-none">
              <p className="text-foreground/90 text-lg leading-relaxed">
                {featuredRegret.story}
              </p>
            </div>

            {/* Lesson learned */}
            {featuredRegret.lesson && (
              <div className="from-primary/10 to-secondary/10 border-primary/20 mb-8 rounded-xl border bg-gradient-to-r p-6">
                <div className="flex items-start">
                  <Lightbulb className="text-primary mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h3 className="text-foreground mb-2 font-semibold">
                      What I learned:
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      {featuredRegret.lesson}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reaction buttons */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReaction("hugs")}
                disabled={reacting === "hugs"}
                className="cursor-pointer border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
                <Heart className="mr-2 h-4 w-4" />
                {Number(localReactions.hugs || 0)} Hugs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReaction("me_too")}
                disabled={reacting === "me_too"}
                className="cursor-pointer border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
              >
                <Users className="mr-2 h-4 w-4" />
                {Number(localReactions.me_too || 0)} Me Too
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReaction("wisdom")}
                disabled={reacting === "wisdom"}
                className="cursor-pointer border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                {Number(localReactions.wisdom || 0)} Wisdom
              </Button>
            </div>

            {/* Action buttons */}
            <div className="border-border/50 flex flex-col gap-3 border-t pt-4 sm:flex-row">
              <Button className="bg-primary hover:bg-primary/90 flex-1" asChild>
                <Link href={`/regret/${featuredRegret.$id}#comments`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Add Support
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/regret/${featuredRegret.$id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Full Story
                </Link>
              </Button>
              {featuredRegret.sliding_doors && (
                <Button
                  variant="outline"
                  className="from-primary/10 to-secondary/10 border-primary/20 hover:bg-primary/20 text-primary flex-1 bg-gradient-to-r"
                  asChild
                >
                  <Link href={`/regret/${featuredRegret.$id}#sliding-doors`}>
                    <DoorOpen className="mr-2 h-4 w-4" />
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
