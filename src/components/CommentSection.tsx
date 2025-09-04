'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Clock, Send, ThumbsUp } from 'lucide-react';
import { Comment } from '@/lib/types';
import { getAnonymousId, formatTimeAgo, safeJsonParse } from '@/lib/utils';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const commentSchema = z.object({
  content: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must be less than 500 characters'),
  comment_type: z.enum(['support', 'similar_experience', 'advice'])
});

interface CommentSectionProps {
  regretId: string;
  onCommentAdded?: () => void;
}

export function CommentSection({ regretId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
      comment_type: 'support' as const
    }
  });

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        [
          Query.equal('regret_id', regretId),
          Query.orderDesc('$createdAt')
        ]
      );
      setComments(response.documents as unknown as Comment[]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [regretId]);

  useEffect(() => {
    fetchComments();
  }, []);

  const updateRegretCommentCount = async () => {
    try {
      // Get current regret to get the current comment count
      const currentRegret = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regretId
      );
      
      const currentCount = currentRegret.comment_count || 0;
      
      // Update the regret with incremented comment count
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        regretId,
        {
          comment_count: currentCount + 1
        }
      );
      
      console.log('Successfully updated comment count for regret:', regretId);
    } catch (error) {
      console.error('Error updating regret comment count:', error);
      // Don't throw error here as the comment was already created successfully
      // The comment count will be updated when the parent component refreshes
    }
  };

  const onSubmit = async (data: { content: string; comment_type: 'support' | 'similar_experience' | 'advice' }) => {
    try {
      setSubmitting(true);
      
      const commentData = {
        regret_id: regretId,
        content: data.content,
        anonymous_id: getAnonymousId(),
        comment_type: data.comment_type,
        reactions: JSON.stringify({
          helpful: 0,
          heart: 0
        })
      };

      // Create the comment
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        ID.unique(),
        commentData
      );

      // Update the regret's comment count
      await updateRegretCommentCount();

      form.reset();
      fetchComments();
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Notify parent component that a comment was added
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('There was an error submitting your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCommentTypeInfo = (type: string) => {
    const types = {
      support: { label: 'Support', color: 'bg-green-100 text-green-800', icon: '🤗' },
      similar_experience: { label: 'Similar Experience', color: 'bg-blue-100 text-blue-800', icon: '💭' },
      advice: { label: 'Advice', color: 'bg-purple-100 text-purple-800', icon: '💡' }
    };
    return types[type as keyof typeof types] || types.support;
  };

  return (
    <div id="comments" className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Comments</h2>
        <Badge variant="secondary">{comments.length}</Badge>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Comment posted successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Comment Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Add a Comment</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Comment Type</label>
              <Select
                value={form.watch('comment_type')}
                onValueChange={(value) => form.setValue('comment_type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">🤗 Support</SelectItem>
                  <SelectItem value="similar_experience">💭 Similar Experience</SelectItem>
                  <SelectItem value="advice">💡 Advice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your Comment</label>
              <Textarea
                placeholder="Share your thoughts, support, or advice..."
                rows={4}
                {...form.register('content')}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.content.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No comments yet</h3>
                <p className="text-muted-foreground">
                  Be the first to share your thoughts and support.
                </p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => {
              const typeInfo = getCommentTypeInfo(comment.comment_type);
              const reactions = safeJsonParse(comment.reactions, { helpful: 0, heart: 0 });
              return (
                <Card key={comment.$id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{typeInfo.icon}</span>
                        <Badge className={typeInfo.color}>
                          {typeInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{formatTimeAgo(comment.$createdAt)}</span>
                      </div>
                    </div>
                    
                    <p className="text-story mb-3">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="text-sm">{reactions.helpful}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{reactions.heart}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
