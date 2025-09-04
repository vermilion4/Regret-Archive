'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Lightbulb, Clock } from 'lucide-react';
import { Regret } from '@/lib/types';
import { formatTimeAgo, truncateText, getCategoryIcon, safeJsonParse } from '@/lib/utils';

interface RegretCardProps {
  regret: Regret;
  variant?: 'compact' | 'featured' | 'detailed';
}

export function RegretCard({ regret, variant = 'compact' }: RegretCardProps) {
  const isFeatured = variant === 'featured';
  const isDetailed = variant === 'detailed';
  
  // Parse the reactions JSON string safely
  const reactions = safeJsonParse(regret.reactions, { hugs: 0, me_too: 0, wisdom: 0 });

  return (
    <Link href={`/regret/${regret.$id}`} className="h-full block">
      <Card className={`regret-card h-full flex flex-col ${isFeatured ? 'ring-2 ring-primary/20' : ''}`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={`category-${regret.category}`}>
              <span className="text-lg">{getCategoryIcon(regret.category)}</span>
                {regret.category}
              </Badge>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{formatTimeAgo(regret.$createdAt)}</span>
            </div>
          </div>
          
          <h3 className={`font-semibold ${isFeatured ? 'text-xl' : 'text-lg'} line-clamp-2`}>
            {regret.title}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            <p className="text-story line-clamp-3">
              {isDetailed ? regret.story : truncateText(regret.story, 200)}
            </p>
            
            {isDetailed && (
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-quote">
                  "Lesson learned: {regret.lesson}"
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">{Number(reactions.me_too || 0)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{Number(regret.comment_count || 0)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{Number(reactions.wisdom || 0)}</span>
              </div>
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
