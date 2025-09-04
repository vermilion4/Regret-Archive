"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Minus, X } from "lucide-react";

interface SlidingDoorsData {
  alternate_path: string;
  votes_better: number;
  votes_worse: number;
  votes_same: number;
}

interface SlidingDoorsModalProps {
  slidingDoors: SlidingDoorsData;
  onClose: () => void;
  onVote: () => void;
}

export function SlidingDoorsModal({
  slidingDoors,
  onClose,
  onVote,
}: SlidingDoorsModalProps) {
  const [voting, setVoting] = useState<string | null>(null);

  const handleVote = async (voteType: "better" | "worse" | "same") => {
    try {
      setVoting(voteType);

      // Here you would update the sliding doors data in the database
      // For now, we'll just simulate the update
      await new Promise((resolve) => setTimeout(resolve, 500));

      onVote();
      onClose();
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setVoting(null);
    }
  };

  const totalVotes =
    slidingDoors.votes_better +
    slidingDoors.votes_worse +
    slidingDoors.votes_same;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Sliding Doors</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">
              What could have been different:
            </h3>
            <p className="text-story bg-muted/30 rounded-lg p-4">
              {slidingDoors.alternate_path}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Would this have been better?</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVote("better")}
                disabled={voting !== null}
              >
                <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                <span>Yes, this would have been better</span>
                <span className="ml-auto rounded-full bg-green-100 px-2 py-1 text-sm text-green-800">
                  {slidingDoors.votes_better}
                </span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVote("same")}
                disabled={voting !== null}
              >
                <Minus className="mr-2 h-4 w-4 text-gray-600" />
                <span>About the same</span>
                <span className="ml-auto rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-800">
                  {slidingDoors.votes_same}
                </span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVote("worse")}
                disabled={voting !== null}
              >
                <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />
                <span>No, this would have been worse</span>
                <span className="ml-auto rounded-full bg-red-100 px-2 py-1 text-sm text-red-800">
                  {slidingDoors.votes_worse}
                </span>
              </Button>
            </div>
          </div>

          {totalVotes > 0 && (
            <div className="text-muted-foreground text-center text-sm">
              {totalVotes} people have voted on this alternate timeline
            </div>
          )}

          <div className="text-muted-foreground text-center text-xs">
            <p>
              This feature helps us understand how different choices might have
              affected outcomes. Your vote contributes to collective wisdom
              about life's "what if" moments.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
