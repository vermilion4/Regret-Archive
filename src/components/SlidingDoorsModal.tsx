'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Minus, X } from 'lucide-react';

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

export function SlidingDoorsModal({ slidingDoors, onClose, onVote }: SlidingDoorsModalProps) {
  const [voting, setVoting] = useState<string | null>(null);

  const handleVote = async (voteType: 'better' | 'worse' | 'same') => {
    try {
      setVoting(voteType);
      
      // Here you would update the sliding doors data in the database
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onVote();
      onClose();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(null);
    }
  };

  const totalVotes = slidingDoors.votes_better + slidingDoors.votes_worse + slidingDoors.votes_same;

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
            <h3 className="font-semibold mb-2">What could have been different:</h3>
            <p className="text-story bg-muted/30 p-4 rounded-lg">
              {slidingDoors.alternate_path}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Would this have been better?</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVote('better')}
                disabled={voting !== null}
              >
                <ThumbsUp className="h-4 w-4 mr-2 text-green-600" />
                <span>Yes, this would have been better</span>
                <span className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {slidingDoors.votes_better}
                </span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVote('same')}
                disabled={voting !== null}
              >
                <Minus className="h-4 w-4 mr-2 text-gray-600" />
                <span>About the same</span>
                <span className="ml-auto bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                  {slidingDoors.votes_same}
                </span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleVote('worse')}
                disabled={voting !== null}
              >
                <ThumbsDown className="h-4 w-4 mr-2 text-red-600" />
                <span>No, this would have been worse</span>
                <span className="ml-auto bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                  {slidingDoors.votes_worse}
                </span>
              </Button>
            </div>
          </div>
          
          {totalVotes > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {totalVotes} people have voted on this alternate timeline
            </div>
          )}
          
          <div className="text-center text-xs text-muted-foreground">
            <p>
              This feature helps us understand how different choices might have affected outcomes.
              Your vote contributes to collective wisdom about life's "what if" moments.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
