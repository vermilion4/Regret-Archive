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
    console.log('Form submitted with data:', data);
    console.log('Form validation errors:', form.formState.errors);
    
    try {
      setIsSubmitting(true);
      console.log('Setting isSubmitting to true');
      
             const regretData = {
         ...data,
         anonymous_id: getAnonymousId(),
         reactions: JSON.stringify({
           me_too: 0,
           hugs: 0,
           wisdom: 0
         }),
         sliding_doors: data.sliding_doors ? JSON.stringify(data.sliding_doors) : undefined,
         comment_count: 0,
         is_featured: false
       };

      console.log('Prepared regret data:', regretData);
      console.log('Attempting to create document...');

      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        ID.unique(),
        regretData
      );

      console.log('Document created successfully:', result);
      onSuccess();
    } catch (error) {
      console.error('Error submitting regret:', error);
      alert(`There was an error submitting your regret: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('Setting isSubmitting to false');
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
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            step <= currentStep 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'bg-muted text-muted-foreground'
          } ${step === currentStep ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
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
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === category.id 
                ? 'ring-2 ring-primary border-primary shadow-lg bg-primary/5' 
                : 'hover:border-primary/50 hover:shadow-md'
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              form.setValue('category', category.id);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <span className={`text-3xl transition-all duration-300 ${
                  selectedCategory === category.id ? 'scale-110' : ''
                }`}>{category.icon}</span>
                <div>
                  <h4 className={`font-semibold text-lg transition-colors duration-300 ${
                    selectedCategory === category.id ? 'text-primary' : ''
                  }`}>{category.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
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
            className={form.formState.errors.title ? 'border-red-500 focus:border-red-500' : ''}
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.formState.errors.title.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {form.watch('title')?.length || 0}/100 characters
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Your Story</label>
          <Textarea
            placeholder="Share the details of what happened, how you felt, and what led to this regret..."
            rows={8}
            className={form.formState.errors.story ? 'border-red-500 focus:border-red-500' : ''}
            {...form.register('story')}
          />
          {form.formState.errors.story && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.formState.errors.story.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {form.watch('story')?.length || 0}/2000 characters (minimum 50)
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Lesson Learned</label>
          <Textarea
            placeholder="What did you learn from this experience? What would you do differently?"
            rows={4}
            className={form.formState.errors.lesson ? 'border-red-500 focus:border-red-500' : ''}
            {...form.register('lesson')}
          />
          {form.formState.errors.lesson && (
            <p className="text-sm text-red-500 mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {form.formState.errors.lesson.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {form.watch('lesson')?.length || 0}/500 characters (minimum 20)
          </p>
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
        
        {/* Validation Summary */}
        {!form.formState.isValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="text-red-800 font-medium mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              Please fix the following issues before submitting:
            </h4>
            <ul className="text-red-700 text-sm space-y-1">
              {form.formState.errors.title && (
                <li>• Title: {form.formState.errors.title.message}</li>
              )}
              {form.formState.errors.story && (
                <li>• Story: {form.formState.errors.story.message}</li>
              )}
              {form.formState.errors.lesson && (
                <li>• Lesson: {form.formState.errors.lesson.message}</li>
              )}
              {form.formState.errors.category && (
                <li>• Category: {form.formState.errors.category.message}</li>
              )}
            </ul>
          </div>
        )}
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
    <div className="space-y-6">
      {renderStepIndicator()}
      
      {renderCurrentStep()}
      
      <div className="flex items-center justify-between pt-8 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center space-x-3">
          {currentStep < 4 ? (
            <Button
              type="button"
              variant="navigation"
              size="lg"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !selectedCategory) ||
                (currentStep === 2 && (!form.watch('title') || !form.watch('story') || !form.watch('lesson')))
              }
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="submit"
              size="xl"
              disabled={isSubmitting || !form.formState.isValid}
              onClick={() => {
                console.log('Share My Regret button clicked');
                console.log('Form is valid:', form.formState.isValid);
                console.log('Form errors:', form.formState.errors);
                console.log('Form values:', form.getValues());
                
                // Only submit if form is valid
                if (form.formState.isValid) {
                  form.handleSubmit(onSubmit)();
                }
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Share My Regret</span>
                  <span className="ml-2 text-sm opacity-80">→</span>
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
