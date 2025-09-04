export type RegretCategory =
  | "career"
  | "relationships"
  | "money"
  | "education"
  | "health"
  | "family"
  | "other";

export interface Regret {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  story: string;
  lesson: string;
  category: RegretCategory;
  age_when_happened?: number;
  years_ago?: number;
  anonymous_id: string;
  reactions: string; // JSON stringified object
  comment_count: number;
  sliding_doors?: string; // JSON stringified object
  is_featured: boolean;
}

export interface Comment {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  regret_id: string;
  content: string;
  anonymous_id: string;
  comment_type: "support" | "similar_experience" | "advice";
  reactions: string; // JSON stringified object
}

export interface Reaction {
  $id: string;
  target_id: string;
  target_type: "regret" | "comment";
  reaction_type: string;
  anonymous_id: string;
  created_at: string;
}

export interface RegretFormData {
  title: string;
  story: string;
  lesson: string;
  category: RegretCategory;
  age_when_happened?: number;
  years_ago?: number;
  sliding_doors?: {
    alternate_path: string;
  };
}

export interface CategoryInfo {
  id: RegretCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "career",
    name: "Career",
    description: "Job choices, missed opportunities, workplace decisions",
    icon: "Briefcase",
    color: "blue",
  },
  {
    id: "relationships",
    name: "Relationships",
    description: "Love, friendships, family dynamics, social connections",
    icon: "Heart",
    color: "pink",
  },
  {
    id: "money",
    name: "Money",
    description: "Financial decisions, investments, spending habits",
    icon: "Wallet",
    color: "green",
  },
  {
    id: "education",
    name: "Education",
    description: "Academic choices, learning opportunities, skill development",
    icon: "GraduationCap",
    color: "purple",
  },
  {
    id: "health",
    name: "Health",
    description: "Physical and mental health decisions, lifestyle choices",
    icon: "Activity",
    color: "red",
  },
  {
    id: "family",
    name: "Family",
    description: "Parenting, family relationships, generational decisions",
    icon: "Users",
    color: "orange",
  },
  {
    id: "other",
    name: "Other",
    description: "Miscellaneous regrets and life choices",
    icon: "HelpCircle",
    color: "gray",
  },
];
