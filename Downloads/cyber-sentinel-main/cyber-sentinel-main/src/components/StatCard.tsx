import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success';
}

const variantStyles = {
  default: 'glow-cyan',
  danger: 'glow-red',
  warning: 'glow-orange',
  success: '',
};

const iconBg = {
  default: 'bg-primary/10 text-primary',
  danger: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/10 text-warning',
  success: 'bg-success/10 text-success',
};

export default function StatCard({ label, value, icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold font-mono text-foreground">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1 font-mono">{trend}</p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg[variant]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
