"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import toast from "react-hot-toast";

interface SlidingDoorsData {
  alternate_path: string;
  votes_better: number;
  votes_worse: number;
  votes_same: number;
}

interface SlidingDoorsModalProps {
  slidingDoors: SlidingDoorsData;
  regretId: string;
  onClose: () => void;
  onVote: (updatedRegret: any) => void;
}

export function SlidingDoorsModal({
  slidingDoors,
  regretId,
  onClose,
  onVote,
}: SlidingDoorsModalProps) {
  const [voting, setVoting] = useState<string | null>(null);
  const [localVotes, setLocalVotes] = useState({
    votes_better: slidingDoors.votes_better || 0,
    votes_worse: slidingDoors.votes_worse || 0,
    votes_same: slidingDoors.votes_same || 0,
  });

  // Check if user has already voted on this regret's sliding doors
  const hasVoted = () => {
    if (typeof window === 'undefined') return false;
    const votedRegrets = JSON.parse(localStorage.getItem('slidingDoorsVotes') || '[]');
    return votedRegrets.includes(regretId);
  };

  // Mark this regret as voted on
  const markAsVoted = () => {
    if (typeof window === 'undefined') return;
    const votedRegrets = JSON.parse(localStorage.getItem('slidingDoorsVotes') || '[]');
    if (!votedRegrets.includes(regretId)) {
      votedRegrets.push(regretId);
      localStorage.setItem('slidingDoorsVotes', JSON.stringify(votedRegrets));
    }
  };

  const handleVote = async (voteType: "better" | "worse" | "same") => {
    // Check if user has already voted
    if (hasVoted()) {
      toast.error("You have already voted on this sliding doors scenario.");
      return;
    }

    try {
      setVoting(voteType);

      // Optimistically update local state
      const newVotes = { ...localVotes };
      newVotes[`votes_${voteType}`] += 1;
      setLocalVotes(newVotes);

      // Update the database
      const updatedSlidingDoors = {
        ...slidingDoors,
        ...newVotes,
      };

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regretId,
        {
          sliding_doors: JSON.stringify(updatedSlidingDoors),
        }
      );

      // Mark as voted to prevent duplicate votes
      markAsVoted();

      // Get the updated regret data to pass to parent
      const updatedRegret = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regretId
      );

      onVote(updatedRegret);
      toast.success("Thanks for your vote!");
      onClose();
    } catch (error) {
      console.error("Error voting:", error);
      // Revert optimistic update on error
      setLocalVotes({
        votes_better: slidingDoors.votes_better || 0,
        votes_worse: slidingDoors.votes_worse || 0,
        votes_same: slidingDoors.votes_same || 0,
      });
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setVoting(null);
    }
  };

  const totalVotes =
    (localVotes.votes_better || 0) +
    (localVotes.votes_worse || 0) +
    (localVotes.votes_same || 0);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sliding Doors</DialogTitle>
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
            {hasVoted() ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">
                  You have already voted on this sliding doors scenario.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleVote("better")}
                  disabled={voting !== null}
                >
                  <ThumbsUp className="mr-2 h-4 w-4 text-green-600" />
                  <span className="line-clamp-1">Yes, this would have been better</span>
                  <span className="ml-auto rounded-full bg-green-100 px-2.5 py-1 text-sm text-green-800">
                    {localVotes.votes_better || 0}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleVote("same")}
                  disabled={voting !== null}
                >
                  <Minus className="mr-2 h-4 w-4 text-gray-600" />
                  <span className="line-clamp-1">About the same</span>
                  <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-1 text-sm text-gray-800">
                    {localVotes.votes_same || 0}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleVote("worse")}
                  disabled={voting !== null}
                >
                  <ThumbsDown className="mr-2 h-4 w-4 text-red-600" />
                  <span className="line-clamp-1">No, this would have been worse</span>
                  <span className="ml-auto rounded-full bg-red-100 px-2.5 py-1 text-sm text-red-800">
                    {localVotes.votes_worse || 0}
                  </span>
                </Button>
              </div>
            )}
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
