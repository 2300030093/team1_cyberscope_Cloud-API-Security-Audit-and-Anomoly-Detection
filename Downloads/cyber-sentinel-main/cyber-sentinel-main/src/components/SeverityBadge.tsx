import { motion } from 'framer-motion';
import { Severity } from '@/store/security-store';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const styles: Record<Severity, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
  high: 'bg-high/15 text-high border-high/30',
  medium: 'bg-medium/15 text-medium border-medium/30',
  low: 'bg-low/15 text-low border-low/30',
  info: 'bg-info/15 text-info border-info/30',
};

export default function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${styles[severity]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${severity === 'critical' ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: 'currentColor' }}
      />
      {severity}
    </span>
  );
}
