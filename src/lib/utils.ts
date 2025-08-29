import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAnonymousId(): string {
  return 'anon_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function formatTimeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getCategoryColor(category: string): string {
  const colors = {
    career: 'blue',
    relationships: 'pink',
    money: 'green',
    education: 'purple',
    health: 'red',
    family: 'orange',
    other: 'gray'
  };
  return colors[category as keyof typeof colors] || 'gray';
}

export function getCategoryIcon(category: string): string {
  const icons = {
    career: '💼',
    relationships: '💕',
    money: '💰',
    education: '🎓',
    health: '🏥',
    family: '👨‍👩‍👧‍👦',
    other: '🤔'
  };
  return icons[category as keyof typeof icons] || '🤔';
}

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  
  let anonymousId = localStorage.getItem('regret_archive_anonymous_id');
  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    localStorage.setItem('regret_archive_anonymous_id', anonymousId);
  }
  return anonymousId;
}
