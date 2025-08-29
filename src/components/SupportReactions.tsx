'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Lightbulb } from 'lucide-react';
import { Regret } from '@/lib/types';
import { getAnonymousId } from '@/lib/utils';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';

interface SupportReactionsProps {
  regret: Regret;
  onUpdate: () => void;
}

export function SupportReactions({ regret, onUpdate }: SupportReactionsProps) {
  const [reacting, setReacting] = useState<string | null>(null);

  const handleReaction = async (reactionType: 'me_too' | 'hugs' | 'wisdom') => {
    try {
      setReacting(reactionType);
      
      const anonymousId = getAnonymousId();
      const currentReactions = { ...regret.reactions };
      currentReactions[reactionType] += 1;

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regret.$id,
        {
          reactions: currentReactions
        }
      );

      onUpdate();
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setReacting(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Show Support</h3>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleReaction('me_too')}
          disabled={reacting === 'me_too'}
          className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Users className="h-5 w-5 text-blue-500" />
          <span>Me Too</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {regret.reactions.me_too}
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
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
            {regret.reactions.hugs}
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
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
            {regret.reactions.wisdom}
          </span>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Choose how this regret resonates with you. Your reaction helps others understand the impact.
      </p>
    </div>
  );
}
