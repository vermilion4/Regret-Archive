'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Lightbulb } from 'lucide-react';
import { Regret } from '@/lib/types';
import { getAnonymousId, safeJsonParse } from '@/lib/utils';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import toast from 'react-hot-toast';

interface SupportReactionsProps {
  regret: Regret;
  onUpdate: () => void;
}

export function SupportReactions({ regret, onUpdate }: SupportReactionsProps) {
  const [reacting, setReacting] = useState<string | null>(null);

  // Parse the reactions JSON string safely
  const reactions = safeJsonParse(regret.reactions, { hugs: 0, me_too: 0, wisdom: 0 });

  const handleReaction = async (reactionType: 'me_too' | 'hugs' | 'wisdom') => {
    try {
      setReacting(reactionType);
      
      const anonymousId = getAnonymousId();
      const currentReactions = { ...reactions };
      currentReactions[reactionType] += 1;

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regret.$id,
        {
          reactions: JSON.stringify(currentReactions)
        }
      );

      onUpdate();
      toast.success('Thanks for showing your support!');
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction. Please try again.');
    } finally {
      setReacting(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Show Support</h3>
      
      <div className="flex items-center flex-wrap gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleReaction('me_too')}
          disabled={reacting === 'me_too'}
          className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Users className="h-5 w-5 text-blue-500" />
          <span>Me Too</span>
          <span className="bg-blue-100 text-blue-800 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium">
            {Number(reactions.me_too || 0)}
          </span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleReaction('hugs')}
          disabled={reacting === 'hugs'}
          className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300"
        >
          <Heart className="h-5 w-5 text-red-500" />
          <span>Hugs</span>
          <span className="bg-red-100 text-red-800 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium">
            {Number(reactions.hugs || 0)}
          </span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => handleReaction('wisdom')}
          disabled={reacting === 'wisdom'}
          className="flex items-center space-x-2 hover:bg-yellow-50 hover:border-yellow-300"
        >
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>Wisdom</span>
          <span className="bg-yellow-100 text-yellow-800 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium">
            {Number(reactions.wisdom || 0)}
          </span>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Choose how this regret resonates with you. Your reaction helps others understand the impact.
      </p>
    </div>
  );
}
