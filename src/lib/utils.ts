import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  BookOpen,
  Briefcase,
  GraduationCap,
  HeartIcon,
  HelpCircle,
  UsersIcon,
  Wallet,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAnonymousId(): string {
  return (
    "anon_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  );
}

export function formatTimeAgo(date: string | undefined): string {
  if (!date) return "Unknown time";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Unknown time";
    }
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return "Unknown time";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getCategoryColor(category: string): string {
  const colors = {
    career: "blue",
    relationships: "pink",
    money: "green",
    education: "purple",
    health: "red",
    family: "orange",
    other: "gray",
  };
  return colors[category as keyof typeof colors] || "gray";
}

export function getCategoryIcon(category: string): string {
  const icons = {
    career: "Briefcase",
    relationships: "Heart",
    money: "Wallet",
    education: "GraduationCap",
    health: "Activity",
    family: "Users",
    other: "HelpCircle",
  };
  return icons[category as keyof typeof icons] || "HelpCircle";
}

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";

  let anonymousId = localStorage.getItem("regret_archive_anonymous_id");
  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    localStorage.setItem("regret_archive_anonymous_id", anonymousId);
  }
  return anonymousId;
}

// Safe JSON parse function that handles invalid JSON and single quotes
export function safeJsonParse(jsonString: string, fallback: any = {}): any {
  if (!jsonString || typeof jsonString !== "string") {
    return fallback;
  }

  try {
    // First try to parse as-is
    const parsed = JSON.parse(jsonString);
    // Ensure numeric values are actually numbers
    return ensureNumericValues(parsed);
  } catch (error) {
    try {
      // If that fails, try to fix common issues like single quotes
      let fixedString = jsonString
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes around unquoted keys
        .replace(/:\s*([^",\{\}\[\]]+)([,}\]])/g, ':"$1"$2'); // Add quotes around unquoted string values

      const parsed = JSON.parse(fixedString);
      // Ensure numeric values are actually numbers
      return ensureNumericValues(parsed);
    } catch (secondError) {
      console.warn(
        "Failed to parse JSON even after fixing quotes:",
        jsonString,
        secondError
      );
      return fallback;
    }
  }
}

// Helper function to ensure reaction values are numbers
function ensureNumericValues(obj: any): any {
  if (typeof obj === "object" && obj !== null) {
    const result = { ...obj };
    // Check for common reaction fields and ensure they're numbers
    const reactionFields = ["hugs", "me_too", "wisdom", "helpful", "heart"];
    reactionFields.forEach((field) => {
      if (field in result) {
        result[field] = Number(result[field]) || 0;
      }
    });
    return result;
  }
  return obj;
}

export const getIconComponent = (iconName: string) => {
  const iconMap = {
    BookOpen,
    Briefcase,
    Heart: HeartIcon,
    Wallet,
    GraduationCap,
    Activity,
    Users: UsersIcon,
    HelpCircle,
  };
  return iconMap[iconName as keyof typeof iconMap] || HelpCircle;
};
