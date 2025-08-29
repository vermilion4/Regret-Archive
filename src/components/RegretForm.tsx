'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';
import { RegretFormData, RegretCategory, CATEGORIES } from '@/lib/types';
import { getAnonymousId } from '@/lib/utils';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID } from 'appwrite';

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title must be less than 100 characters'),
  story: z.string().min(50, 'Story must be at least 50 characters').max(2000, 'Story must be less than 2000 characters'),
  lesson: z.string().min(20, 'Lesson must be at least 20 characters').max(500, 'Lesson must be less than 500 characters'),
  category: z.enum(['career', 'relationships', 'money', 'education', 'health', 'family', 'other']),
  age_when_happened: z.number().min(1).max(120).optional(),
  years_ago: z.number().min(0).max(100).optional(),
  sliding_doors: z.object({
    alternate_path: z.string().min(20, 'Alternate path must be at least 20 characters').max(500, 'Alternate path must be less than 500 characters')
  }).optional()
});

interface RegretFormProps {
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
}

export function RegretForm({ onSuccess, isSubmitting, setIsSubmitting }: RegretFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<RegretCategory | null>(null);
  const [includeSlidingDoors, setIncludeSlidingDoors] = useState(false);

  const form = useForm<RegretFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      story: '',
      lesson: '',
      category: 'other',
      age_when_happened: undefined,
      years_ago: undefined,
      sliding_doors: undefined
    }
  });

  const onSubmit = async (data: RegretFormData) => {
    try {
      setIsSubmitting(true);
      
      const regretData = {
        ...data,
        anonymous_id: getAnonymousId(),
        reactions: {
          me_too: 0,
          hugs: 0,
          wisdom: 0
        },
        comment_count: 0,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        ID.unique(),
        regretData
      );

      onSuccess();
    } catch (error) {
      console.error('Error submitting regret:', error);
      alert('There was an error submitting your regret. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {step < currentStep ? <Check className="h-4 w-4" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-0.5 mx-2 ${
              step < currentStep ? 'bg-primary' : 'bg-muted'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Choose a Category</h3>
        <p className="text-muted-foreground mb-6">
          Select the category that best fits your regret. This helps others find stories they can relate to.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all ${
              selectedCategory === category.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              form.setValue('category', category.id);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Share Your Story</h3>
        <p className="text-muted-foreground mb-6">
          Tell us about your regret. Be honest and vulnerable - your story can help others.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            placeholder="A brief title for your regret..."
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Your Story</label>
          <Textarea
            placeholder="Share the details of what happened, how you felt, and what led to this regret..."
            rows={8}
            {...form.register('story')}
          />
          {form.formState.errors.story && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.story.message}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Lesson Learned</label>
          <Textarea
            placeholder="What did you learn from this experience? What would you do differently?"
            rows={4}
            {...form.register('lesson')}
          />
          {form.formState.errors.lesson && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.lesson.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Add Context (Optional)</h3>
        <p className="text-muted-foreground mb-6">
          Help others understand the context of your regret. This information is completely optional.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Age When It Happened</label>
          <Input
            type="number"
            placeholder="e.g., 25"
            {...form.register('age_when_happened', { valueAsNumber: true })}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Years Ago</label>
          <Input
            type="number"
            placeholder="e.g., 5"
            {...form.register('years_ago', { valueAsNumber: true })}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sliding-doors"
            checked={includeSlidingDoors}
            onChange={(e) => setIncludeSlidingDoors(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="sliding-doors" className="text-sm font-medium">
            Add "Sliding Doors" Alternate Timeline
          </label>
        </div>
        
        {includeSlidingDoors && (
          <div>
            <label className="text-sm font-medium mb-2 block">What Could Have Been Different</label>
            <Textarea
              placeholder="Describe an alternate path or decision that could have changed the outcome..."
              rows={4}
              {...form.register('sliding_doors.alternate_path')}
            />
            {form.formState.errors.sliding_doors?.alternate_path && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.sliding_doors.alternate_path.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
        <p className="text-muted-foreground mb-6">
          Review your regret before submitting. You can go back to make changes.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{CATEGORIES.find(c => c.id === form.watch('category'))?.icon}</span>
            <Badge variant="secondary" className={`category-${form.watch('category')}`}>
              {CATEGORIES.find(c => c.id === form.watch('category'))?.name}
            </Badge>
          </div>
          <h4 className="text-lg font-semibold">{form.watch('title')}</h4>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h5 className="font-medium mb-2">Your Story</h5>
            <p className="text-story">{form.watch('story')}</p>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Lesson Learned</h5>
            <p className="text-quote">"{form.watch('lesson')}"</p>
          </div>
          
          {(form.watch('age_when_happened') || form.watch('years_ago')) && (
            <div className="text-meta">
              {form.watch('age_when_happened') && <span>Age when happened: {form.watch('age_when_happened')}</span>}
              {form.watch('age_when_happened') && form.watch('years_ago') && <span> • </span>}
              {form.watch('years_ago') && <span>{form.watch('years_ago')} years ago</span>}
            </div>
          )}
          
          {includeSlidingDoors && form.watch('sliding_doors.alternate_path') && (
            <div>
              <h5 className="font-medium mb-2">Sliding Doors</h5>
              <p className="text-story">{form.watch('sliding_doors.alternate_path')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {renderStepIndicator()}
      
      {renderCurrentStep()}
      
      <div className="flex items-center justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center space-x-2">
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !selectedCategory) ||
                (currentStep === 2 && (!form.watch('title') || !form.watch('story') || !form.watch('lesson')))
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Submitting...' : 'Share My Regret'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
