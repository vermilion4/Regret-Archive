import type { Metadata } from 'next';
import SubmitClient from './SubmitClient';

export const metadata: Metadata = {
  title: 'Share Your Regret - Anonymous Story Submission',
  description: 'Share your regret anonymously and help others learn from your experience. Safe, supportive community for personal growth and wisdom sharing.',
  keywords: [
    'share regret',
    'anonymous submission',
    'personal story',
    'life lesson',
    'regret sharing',
    'anonymous story',
    'community support',
    'personal growth',
    'wisdom sharing'
  ],
  openGraph: {
    title: 'Share Your Regret - Anonymous Story Submission',
    description: 'Share your regret anonymously and help others learn from your experience. Safe, supportive community for personal growth.',
    type: 'website',
  },
  twitter: {
    title: 'Share Your Regret - Anonymous Story Submission',
    description: 'Share your regret anonymously and help others learn from your experience. Safe, supportive community for personal growth.',
  },
};

export default function SubmitPage() {
  return <SubmitClient />;
}
