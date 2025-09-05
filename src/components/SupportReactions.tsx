"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users, Lightbulb } from "lucide-react";
import { Regret } from "@/lib/types";
import { safeJsonParse } from "@/lib/utils";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import toast from "react-hot-toast";

interface SupportReactionsProps {
  regret: Regret;
  onUpdate?: (updatedRegret: Regret) => void;
}

export function SupportReactions({ regret, onUpdate }: SupportReactionsProps) {
  const [reacting, setReacting] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(() => 
    safeJsonParse(regret.reactions, {
      hugs: 0,
      me_too: 0,
      wisdom: 0,
    })
  );

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
        regret.$id,
        {
          reactions: JSON.stringify(newReactions),
        }
      );

      // Update parent component with new regret data
      if (onUpdate) {
        const updatedRegret = {
          ...regret,
          reactions: JSON.stringify(newReactions),
        };
        onUpdate(updatedRegret);
      }

      toast.success("Thanks for showing your support!");
    } catch (error) {
      console.error("Error adding reaction:", error);
      // Revert optimistic update on error
      setLocalReactions(safeJsonParse(regret.reactions, {
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Show Support</h3>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleReaction("me_too")}
          disabled={reacting === "me_too"}
          className="flex items-center space-x-2 hover:border-blue-300 hover:bg-blue-50"
        >
          <Users className="h-5 w-5 text-blue-500" />
          <span>Me Too</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
            {Number(localReactions.me_too || 0)}
          </span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleReaction("hugs")}
          disabled={reacting === "hugs"}
          className="flex items-center space-x-2 hover:border-red-300 hover:bg-red-50"
        >
          <Heart className="h-5 w-5 text-red-500" />
          <span>Hugs</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-800">
            {Number(localReactions.hugs || 0)}
          </span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleReaction("wisdom")}
          disabled={reacting === "wisdom"}
          className="flex items-center space-x-2 hover:border-yellow-300 hover:bg-yellow-50"
        >
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>Wisdom</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-medium text-yellow-800">
            {Number(localReactions.wisdom || 0)}
          </span>
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Choose how this regret resonates with you. Your reaction helps others
        understand the impact.
      </p>
    </div>
  );
}
