import { Code2, Briefcase, Palette, Rocket } from 'lucide-react';

export const PORTFOLIO_STYLES = [
  {
    id: 'developer',
    label: 'Developer',
    Icon: Code2,
    description: 'Clean terminal-inspired layout for engineers and open-source contributors.',
    accent: '#2563eb',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    Icon: Briefcase,
    description: 'Polished, formal design for business professionals and executives.',
    accent: '#0f766e',
  },
  {
    id: 'creative',
    label: 'Creative',
    Icon: Palette,
    description: 'Expressive layout for designers, artists, and content creators.',
    accent: '#7c3aed',
  },
  {
    id: 'modern-startup',
    label: 'Modern Startup',
    Icon: Rocket,
    description: 'Bold and minimal design tailored for founders and product leaders.',
    accent: '#ea580c',
  },
];

export const GENERATION_STEPS = [
  { id: 'upload',   label: 'Uploading Resume',       duration: 1500 },
  { id: 'extract',  label: 'Extracting Information', duration: 2500 },
  { id: 'analyze',  label: 'Analyzing Content',      duration: 2000 },
  { id: 'generate', label: 'Generating Portfolio',   duration: 3000 },
];
