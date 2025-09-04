"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Lightbulb, Clock, Users } from "lucide-react";
import { Regret } from "@/lib/types";
import {
  formatTimeAgo,
  truncateText,
  getCategoryIcon,
  safeJsonParse,
  getIconComponent,
} from "@/lib/utils";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import toast from "react-hot-toast";
import { useState } from "react";

interface RegretCardProps {
  regret: Regret;
  variant?: "compact" | "featured" | "detailed";
  onUpdate?: () => void;
}

export function RegretCard({
  regret,
  variant = "compact",
  onUpdate,
}: RegretCardProps) {
  const [reacting, setReacting] = useState<string | null>(null);
  const isFeatured = variant === "featured";
  const isDetailed = variant === "detailed";

  // Parse the reactions JSON string safely
  const reactions = safeJsonParse(regret.reactions, {
    hugs: 0,
    me_too: 0,
    wisdom: 0,
  });

  const handleReaction = async (
    e: React.MouseEvent,
    reactionType: "me_too" | "hugs" | "wisdom"
  ) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();

    try {
      setReacting(reactionType);

      const currentReactions = { ...reactions };
      currentReactions[reactionType] += 1;

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regret.$id,
        {
          reactions: JSON.stringify(currentReactions),
        }
      );

      if (onUpdate) {
        onUpdate();
      }
      toast.success("Thanks for showing your support!");
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Failed to add reaction. Please try again.");
    } finally {
      setReacting(null);
    }
  };

  return (
    <Link href={`/regret/${regret.$id}`} className="block h-full">
      <Card
        className={`regret-card flex h-full flex-col ${isFeatured ? "ring-primary/20 ring-2" : ""}`}
      >
        <CardHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 capitalize">
              <Badge
                variant="secondary"
                className={`category-${regret.category}`}
              >
                <span className="text-lg">
                  {(() => {
                    const IconComponent = getIconComponent(
                      getCategoryIcon(regret.category)
                    );
                    return <IconComponent className="h-4 w-4" />;
                  })()}
                </span>
                {regret.category}
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs">
                {formatTimeAgo(regret.$createdAt)}
              </span>
            </div>
          </div>

          <h3
            className={`font-semibold ${isFeatured ? "text-xl" : "text-lg"} line-clamp-2`}
          >
            {regret.title}
          </h3>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col space-y-4">
          <div className="flex-1 space-y-2">
            <p className="text-story line-clamp-3">
              {isDetailed ? regret.story : truncateText(regret.story, 200)}
            </p>

            {isDetailed && (
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-quote">"Lesson learned: {regret.lesson}"</p>
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => handleReaction(e, "hugs")}
                disabled={reacting === "hugs"}
                className="flex cursor-pointer items-center space-x-1 rounded-md px-2 py-1 transition-colors hover:bg-red-50/50 disabled:opacity-50"
                title="Send hugs"
              >
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">{Number(reactions.hugs || 0)}</span>
              </button>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {Number(regret.comment_count || 0)}
                </span>
              </div>
              <button
                onClick={(e) => handleReaction(e, "me_too")}
                disabled={reacting === "me_too"}
                className="flex cursor-pointer items-center space-x-1 rounded-md px-2 py-1 transition-colors hover:bg-blue-50/50 disabled:opacity-50"
                title="Me too"
              >
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{Number(reactions.me_too || 0)}</span>
              </button>
              <button
                onClick={(e) => handleReaction(e, "wisdom")}
                disabled={reacting === "wisdom"}
                className="flex cursor-pointer items-center space-x-1 rounded-md px-2 py-1 transition-colors hover:bg-yellow-50/50 disabled:opacity-50"
                title="Share wisdom"
              >
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{Number(reactions.wisdom || 0)}</span>
              </button>
            </div>

            {regret.sliding_doors && (
              <Badge variant="outline" className="text-xs">
                Sliding Doors
              </Badge>
            )}
          </div>

          {isDetailed && regret.age_when_happened && (
            <div className="text-meta mt-2">
              <span>Age when happened: {regret.age_when_happened}</span>
              {regret.years_ago && <span> • {regret.years_ago} years ago</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
