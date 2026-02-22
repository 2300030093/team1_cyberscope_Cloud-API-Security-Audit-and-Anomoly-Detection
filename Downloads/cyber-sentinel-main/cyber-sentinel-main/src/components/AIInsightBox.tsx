import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const insights = [
  "⚠️ Abnormal token usage detected — automatic rate-limit triggered on /api/data/export",
  "🔍 SQL injection pattern identified from 192.168.45.12 — signature added to blocklist",
  "🛡️ Zero-trust policy blocked 3 unauthorized admin access attempts in the last hour",
  "📊 API traffic anomaly: 340% spike on /api/payments — DDoS mitigation active",
  "🔐 Token geo-anomaly: credential used from 3 countries simultaneously — auto-revoked",
];

export default function AIInsightBox() {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel neon-border glow-cyan p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-primary">AI Threat Intelligence</p>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentInsight}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-foreground leading-relaxed"
            >
              {insights[currentInsight]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
