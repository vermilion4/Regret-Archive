"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
import { RegretFormData, RegretCategory, CATEGORIES } from "@/lib/types";
import { getAnonymousId, getIconComponent } from "@/lib/utils";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { ID } from "appwrite";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters")
    .max(2000, "Story must be less than 2000 characters"),
  lesson: z
    .string()
    .min(20, "Lesson must be at least 20 characters")
    .max(500, "Lesson must be less than 500 characters"),
  category: z.enum([
    "career",
    "relationships",
    "money",
    "education",
    "health",
    "family",
    "other",
  ]),
  age_when_happened: z.number().min(1).max(120).optional().or(z.undefined()),
  years_ago: z.number().min(0).max(100).optional().or(z.undefined()),
  sliding_doors: z.object({
    alternate_path: z
      .string()
      .min(20, "Alternate path must be at least 20 characters")
      .max(500, "Alternate path must be less than 500 characters"),
  }).optional().or(z.undefined()),
}).refine((data) => {
  // Custom validation: if sliding doors is enabled, alternate_path is required
  // This will be handled by our custom validation logic instead
  return true;
});

interface RegretFormProps {
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  formRef: React.RefObject<HTMLDivElement>;
}

export function RegretForm({
  onSuccess,
  isSubmitting,
  setIsSubmitting,
  formRef,
}: RegretFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<RegretCategory | null>(null);
  const [includeSlidingDoors, setIncludeSlidingDoors] = useState(false);
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  const handleSlidingDoorsToggle = (include: boolean) => {
    setIncludeSlidingDoors(include);
    if (!include) {
      // Clear the sliding_doors field when toggling off
      form.setValue("sliding_doors", undefined);
      // Clear any validation errors for sliding doors
      form.clearErrors("sliding_doors.alternate_path");
    } else {
      // When enabling sliding doors, check if field is empty and show error
      const currentValue = form.getValues("sliding_doors.alternate_path");
      if (!currentValue || currentValue.length < 20) {
        setHasAttemptedValidation(true);
        form.setError("sliding_doors.alternate_path", {
          type: "required",
          message: "Alternate path is required when sliding doors is enabled"
        });
      }
    }
  };

  const isFormValid = () => {
    const values = form.getValues();
    const errors = form.formState.errors;

    // Check required fields
    if (!values.title || !values.story || !values.lesson || !values.category) {
      return false;
    }

    // Check sliding doors validation only if it's enabled
    if (
      includeSlidingDoors &&
      (!values.sliding_doors?.alternate_path ||
        values.sliding_doors.alternate_path.length < 20)
    ) {
      return false;
    }

    // Check for any validation errors
    return Object.keys(errors).length === 0;
  };

  const validateCurrentStep = () => {
    const values = form.getValues();
    const errors = form.formState.errors;

    switch (currentStep) {
      case 1:
        // Step 1: Category selection
        return selectedCategory !== null;
      
      case 2:
        // Step 2: Title, Story, and Lesson
        const step2Errors = [];
        if (!values.title || values.title.length < 10) {
          step2Errors.push("title");
        }
        if (!values.story || values.story.length < 50) {
          step2Errors.push("story");
        }
        if (!values.lesson || values.lesson.length < 20) {
          step2Errors.push("lesson");
        }
        return step2Errors.length === 0;
      
      case 3:
        // Step 3: Optional fields, but sliding doors is required if enabled
        if (includeSlidingDoors) {
          return values.sliding_doors?.alternate_path && 
                 values.sliding_doors.alternate_path.length >= 20;
        }
        return true;
      
      case 4:
        // Step 4: Review - check if sliding doors is valid if enabled
        if (includeSlidingDoors) {
          return values.sliding_doors?.alternate_path && 
                 values.sliding_doors.alternate_path.length >= 20;
        }
        return true;
      
      default:
        return true;
    }
  };

  const form = useForm<RegretFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      story: "",
      lesson: "",
      category: "other",
      age_when_happened: undefined,
      years_ago: undefined,
      sliding_doors: undefined,
    },
  });

  // Clear validation errors as user fixes them
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && name) {
        // Clear the specific field error when user starts typing
        if (form.formState.errors[name as keyof RegretFormData]) {
          form.clearErrors(name as keyof RegretFormData);
        }
        
        // Special handling for sliding doors field
        if (name === "sliding_doors.alternate_path" && includeSlidingDoors) {
          const fieldValue = value.sliding_doors?.alternate_path;
          if (fieldValue && fieldValue.length >= 20) {
            // Clear error if field is now valid
            form.clearErrors("sliding_doors.alternate_path");
          } else if (fieldValue && fieldValue.length < 20) {
            // Set error if field is too short
            form.setError("sliding_doors.alternate_path", {
              type: "min",
              message: "Alternate path must be at least 20 characters"
            });
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, includeSlidingDoors]);

  const onSubmit = async (data: RegretFormData) => {
    try {
      setIsSubmitting(true);
      
      // Filter out undefined values for Appwrite compatibility
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
      );
      
      const regretData = {
        ...cleanData,
        anonymous_id: getAnonymousId(),
        reactions: JSON.stringify({
          me_too: 0,
          hugs: 0,
          wisdom: 0,
        }),
        sliding_doors: data.sliding_doors
          ? JSON.stringify({
              ...data.sliding_doors,
              votes_better: 0,
              votes_worse: 0,
              votes_same: 0,
            })
          : null,
        comment_count: 0,
        is_featured: false,
      };

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.REGRETS,
        ID.unique(),
        regretData
      );

      toast.success(
        "Your regret has been shared successfully! Thank you for your courage."
      );
      onSuccess();
    } catch (error) {
      console.error("Error submitting regret:", error);
      toast.error(
        `Failed to submit your regret: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      // Mark that user has attempted validation
      setHasAttemptedValidation(true);
      
      // Always trigger validation to show error messages
      form.trigger();
      
      // Mark form as submitted to show step 1 validation error
      if (currentStep === 1) {
        form.handleSubmit(() => {})();
      }
      
      // Only proceed if validation passes
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
        // Reset validation attempt flag for new step
        setHasAttemptedValidation(false);
        // Scroll to top of form when moving to next step
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of form when moving to previous step
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-6 flex items-center justify-center px-4 sm:mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 sm:h-10 sm:w-10 sm:text-sm ${
              step <= currentStep
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground"
            } ${step === currentStep ? "ring-primary/20 scale-110 ring-2 sm:ring-4" : ""}`}
          >
            {step < currentStep ? <Check className="h-3 w-3 sm:h-5 sm:w-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`mx-2 h-1 w-8 rounded-full transition-all duration-300 sm:mx-3 sm:w-20 ${
                step < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold">Choose a Category</h3>
        <p className="text-muted-foreground mb-6">
          Select the category that best fits your regret. This helps others find
          stories they can relate to.
        </p>
        {!selectedCategory && hasAttemptedValidation && (
          <p className="mb-4 flex items-center text-sm text-red-500">
            <span className="mr-1">⚠️</span>
            Please select a category to continue
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className={`transform cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedCategory === category.id
                ? "ring-primary border-primary bg-primary/5 shadow-lg ring-2"
                : "hover:border-primary/50 hover:shadow-md"
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              form.setValue("category", category.id);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <span
                  className={`text-3xl transition-all duration-300 ${
                    selectedCategory === category.id ? "scale-110" : ""
                  }`}
                >
                  {(() => {
                    const IconComponent = getIconComponent(category.icon);
                    return <IconComponent className="h-8 w-8" />;
                  })()}
                </span>
                <div>
                  <h4
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      selectedCategory === category.id ? "text-primary" : ""
                    }`}
                  >
                    {category.name}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {category.description}
                  </p>
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
        <h3 className="mb-4 text-xl font-semibold">Share Your Story</h3>
        <p className="text-muted-foreground mb-6">
          Tell us about your regret. Be honest and vulnerable - your story can
          help others.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Title</label>
          <Input
            placeholder="A brief title for your regret..."
            className={
              form.formState.errors.title
                ? "border-red-500 focus:border-red-500"
                : ""
            }
            {...form.register("title")}
          />
          {hasAttemptedValidation && form.formState.errors.title && (
            <p className="mt-1 flex items-center text-sm text-red-500">
              <span className="mr-1">⚠️</span>
              {form.formState.errors.title.message}
            </p>
          )}
          <p className="text-muted-foreground mt-1 text-xs">
            {form.watch("title")?.length || 0}/100 characters
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Your Story</label>
          <Textarea
            placeholder="Share the details of what happened, how you felt, and what led to this regret..."
            rows={8}
            className={
              form.formState.errors.story
                ? "border-red-500 focus:border-red-500"
                : ""
            }
            {...form.register("story")}
          />
          {hasAttemptedValidation && form.formState.errors.story && (
            <p className="mt-1 flex items-center text-sm text-red-500">
              <span className="mr-1">⚠️</span>
              {form.formState.errors.story.message}
            </p>
          )}
          <p className="text-muted-foreground mt-1 text-xs">
            {form.watch("story")?.length || 0}/2000 characters (minimum 50)
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Lesson Learned
          </label>
          <Textarea
            placeholder="What did you learn from this experience? What would you do differently?"
            rows={4}
            className={
              form.formState.errors.lesson
                ? "border-red-500 focus:border-red-500"
                : ""
            }
            {...form.register("lesson")}
          />
          {hasAttemptedValidation && form.formState.errors.lesson && (
            <p className="mt-1 flex items-center text-sm text-red-500">
              <span className="mr-1">⚠️</span>
              {form.formState.errors.lesson.message}
            </p>
          )}
          <p className="text-muted-foreground mt-1 text-xs">
            {form.watch("lesson")?.length || 0}/500 characters (minimum 20)
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold">Add Context (Optional)</h3>
        <p className="text-muted-foreground mb-6">
          Help others understand the context of your regret. This information is
          completely optional.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Age When It Happened
          </label>
          <Input
            type="number"
            placeholder="e.g., 25"
            {...form.register("age_when_happened", { 
              setValueAs: (value) => {
                if (value === "" || value === null || value === undefined) return undefined;
                const num = Number(value);
                return isNaN(num) ? undefined : num;
              }
            })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Years Ago</label>
          <Input
            type="number"
            placeholder="e.g., 5"
            {...form.register("years_ago", { 
              setValueAs: (value) => {
                if (value === "" || value === null || value === undefined) return undefined;
                const num = Number(value);
                return isNaN(num) ? undefined : num;
              }
            })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sliding-doors"
            checked={includeSlidingDoors}
            onChange={(e) => handleSlidingDoorsToggle(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="sliding-doors" className="text-sm font-medium">
            Add "Sliding Doors" Alternate Timeline
          </label>
        </div>

        {includeSlidingDoors && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              What Could Have Been Different
            </label>
            <Textarea
              placeholder="Describe an alternate path or decision that could have changed the outcome..."
              rows={4}
              {...form.register("sliding_doors.alternate_path")}
            />
            {hasAttemptedValidation && form.formState.errors.sliding_doors?.alternate_path && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.sliding_doors.alternate_path.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold">Review & Submit</h3>
        <p className="text-muted-foreground mb-6">
          Review your regret before submitting. You can go back to make changes.
        </p>

        {/* Validation Summary */}
        {hasAttemptedValidation && !form.formState.isValid && !isFormValid() && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <h4 className="mb-2 flex items-center font-medium text-red-800">
              <span className="mr-2">⚠️</span>
              Please fix the following issues before submitting:
            </h4>
            <ul className="space-y-1 text-sm text-red-700">
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
              {form.formState.errors.age_when_happened && (
                <li>• Age when happened: {form.formState.errors.age_when_happened.message}</li>
              )}
              {form.formState.errors.years_ago && (
                <li>• Years ago: {form.formState.errors.years_ago.message}</li>
              )}
              {form.formState.errors.sliding_doors?.alternate_path && (
                <li>• Sliding doors: {form.formState.errors.sliding_doors.alternate_path.message}</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {(() => {
                const category = CATEGORIES.find((c) => c.id === form.watch("category"));
                if (category) {
                  const IconComponent = getIconComponent(category.icon);
                  return <IconComponent className="h-5 w-5" />;
                }
                return null;
              })()}
            </span>
            <Badge
              variant="secondary"
              className={`category-${form.watch("category")}`}
            >
              {CATEGORIES.find((c) => c.id === form.watch("category"))?.name}
            </Badge>
          </div>
          <h4 className="text-lg font-semibold">{form.watch("title")}</h4>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h5 className="mb-2 font-medium">Your Story</h5>
            <p className="text-story">{form.watch("story")}</p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h5 className="mb-2 font-medium">Lesson Learned</h5>
            <p className="text-quote">"{form.watch("lesson")}"</p>
          </div>

          {(() => {
            const age = form.watch("age_when_happened");
            const years = form.watch("years_ago");
            const hasValidAge = age !== undefined && age !== null && !isNaN(Number(age));
            const hasValidYears = years !== undefined && years !== null && !isNaN(Number(years));
            
            if (hasValidAge || hasValidYears) {
              return (
                <div className="text-meta">
                  {hasValidAge && (
                    <span>Age when happened: {age}</span>
                  )}
                  {hasValidAge && hasValidYears && <span> • </span>}
                  {hasValidYears && (
                    <span>{years} years ago</span>
                  )}
                </div>
              );
            }
            return null;
          })()}

          {includeSlidingDoors &&
            form.watch("sliding_doors.alternate_path") && (
              <div>
                <h5 className="mb-2 font-medium">Sliding Doors</h5>
                <p className="text-story">
                  {form.watch("sliding_doors.alternate_path")}
                </p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="space-y-6">
      {renderStepIndicator()}

      {renderCurrentStep()}

      <div className="border-border flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row sm:pt-8">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Previous</span>
        </Button>

        <div className="flex w-full items-center justify-center space-x-3 sm:w-auto">
          {currentStep < 4 ? (
            <Button
              type="button"
              variant="navigation"
              size="lg"
              onClick={nextStep}
              className="w-full sm:w-auto"
            >
              <span className="text-sm sm:text-base">Next</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="submit"
              size="xl"
              disabled={isSubmitting || !isFormValid()}
              onClick={() => {
                // Mark that user has attempted validation
                setHasAttemptedValidation(true);
                // Trigger validation to show any errors
                form.trigger();
                // Only submit if form is valid
                if (isFormValid()) {
                  form.handleSubmit(onSubmit)();
                }
              }}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white sm:h-5 sm:w-5"></div>
                  <span className="text-sm sm:text-base">Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-sm sm:text-base">Share My Regret</span>
                  <span className="ml-2 text-xs opacity-80 sm:text-sm">→</span>
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
