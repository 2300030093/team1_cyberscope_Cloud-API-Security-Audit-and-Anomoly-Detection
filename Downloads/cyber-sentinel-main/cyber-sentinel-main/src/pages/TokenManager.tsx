import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Key, Globe, Shield, Trash2, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import SeverityBadge from '@/components/SeverityBadge';
import { Severity } from '@/store/security-store';

interface Token {
  id: string;
  name: string;
  owner: string;
  riskScore: number;
  severity: Severity;
  lastUsed: string;
  createdAt: string;
  expiresAt: string;
  geoLocations: string[];
  geoAnomaly: boolean;
  status: 'active' | 'revoked' | 'expired';
}

const tokens: Token[] = [
  { id: 'TKN-001', name: 'prod-api-key-main', owner: 'service-account-1', riskScore: 92, severity: 'critical', lastUsed: '2 min ago', createdAt: '2025-01-15', expiresAt: '2026-01-15', geoLocations: ['US', 'CN', 'RU'], geoAnomaly: true, status: 'active' },
  { id: 'TKN-002', name: 'staging-deploy-key', owner: 'ci-pipeline', riskScore: 67, severity: 'high', lastUsed: '15 min ago', createdAt: '2025-06-01', expiresAt: '2025-12-01', geoLocations: ['US', 'DE'], geoAnomaly: false, status: 'active' },
  { id: 'TKN-003', name: 'analytics-read-token', owner: 'dashboard-svc', riskScore: 23, severity: 'low', lastUsed: '1 hr ago', createdAt: '2025-03-10', expiresAt: '2026-03-10', geoLocations: ['US'], geoAnomaly: false, status: 'active' },
  { id: 'TKN-004', name: 'admin-override-key', owner: 'ops-team', riskScore: 85, severity: 'critical', lastUsed: '5 min ago', createdAt: '2025-02-20', expiresAt: '2025-08-20', geoLocations: ['US', 'KP', 'IR'], geoAnomaly: true, status: 'active' },
  { id: 'TKN-005', name: 'webhook-signing-key', owner: 'integration-svc', riskScore: 45, severity: 'medium', lastUsed: '30 min ago', createdAt: '2025-04-05', expiresAt: '2026-04-05', geoLocations: ['US', 'JP'], geoAnomaly: false, status: 'active' },
  { id: 'TKN-006', name: 'legacy-v1-token', owner: 'deprecated-svc', riskScore: 78, severity: 'high', lastUsed: '3 hr ago', createdAt: '2024-01-01', expiresAt: '2025-01-01', geoLocations: ['BR'], geoAnomaly: false, status: 'expired' },
  { id: 'TKN-007', name: 'compromised-key-x', owner: 'unknown', riskScore: 99, severity: 'critical', lastUsed: '30 sec ago', createdAt: '2025-07-01', expiresAt: '2026-07-01', geoLocations: ['US', 'CN', 'RU', 'IR'], geoAnomaly: true, status: 'revoked' },
];

export default function TokenManager() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null);
  const [tokenList, setTokenList] = useState(tokens);

  const handleRevoke = (id: string) => {
    setTokenList(prev => prev.map(t => t.id === id ? { ...t, status: 'revoked' as const, severity: 'info' as Severity } : t));
    setRevokeConfirm(null);
  };

  const riskColor = (score: number) => {
    if (score > 80) return 'text-destructive';
    if (score > 50) return 'text-warning';
    return 'text-success';
  };

  const statusStyle: Record<string, string> = {
    active: 'bg-success/15 text-success border-success/30',
    revoked: 'bg-destructive/15 text-destructive border-destructive/30',
    expired: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Token Security Manager</h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Monitor and manage API token risk</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Tokens', value: tokenList.filter(t => t.status === 'active').length, icon: <Key className="w-4 h-4" /> },
          { label: 'Geo Anomalies', value: tokenList.filter(t => t.geoAnomaly).length, icon: <MapPin className="w-4 h-4" /> },
          { label: 'High Risk', value: tokenList.filter(t => t.riskScore > 70).length, icon: <Shield className="w-4 h-4" /> },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{s.icon}</div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase">{s.label}</p>
              <p className="text-xl font-bold font-mono text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Token Table */}
      <div className="glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Token', 'Owner', 'Risk', 'Status', 'Geo', 'Last Used', 'Actions'].map(h => (
                <th key={h} className="text-left text-[10px] font-mono text-muted-foreground uppercase tracking-wider py-3 px-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tokenList.map((token, i) => (
              <>
                <motion.tr
                  key={token.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setExpandedId(expandedId === token.id ? null : token.id)}
                  className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-secondary/30 ${token.geoAnomaly ? 'bg-destructive/5' : ''}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {expandedId === token.id ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs font-mono text-foreground">{token.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{token.owner}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-bold font-mono ${riskColor(token.riskScore)}`}>{token.riskScore}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${statusStyle[token.status]}`}>{token.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {token.geoLocations.map(g => (
                        <span key={g} className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${token.geoAnomaly ? 'bg-destructive/15 text-destructive' : 'bg-secondary text-muted-foreground'}`}>{g}</span>
                      ))}
                      {token.geoAnomaly && <MapPin className="w-3 h-3 text-destructive ml-1" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{token.lastUsed}</td>
                  <td className="py-3 px-4">
                    {token.status === 'active' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setRevokeConfirm(token.id); }}
                        className="text-[10px] font-mono px-3 py-1 rounded-md bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors uppercase"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {expandedId === token.id && (
                    <motion.tr key={`${token.id}-detail`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <td colSpan={7} className="px-4 pb-4">
                        <div className="glass-panel p-4 mt-1 grid grid-cols-3 gap-4 text-xs font-mono">
                          <div><span className="text-muted-foreground">Created:</span> <span className="text-foreground ml-1">{token.createdAt}</span></div>
                          <div><span className="text-muted-foreground">Expires:</span> <span className="text-foreground ml-1">{token.expiresAt}</span></div>
                          <div><span className="text-muted-foreground">ID:</span> <span className="text-foreground ml-1">{token.id}</span></div>
                          <div className="col-span-3">
                            <SeverityBadge severity={token.severity} />
                            {token.geoAnomaly && <span className="ml-2 text-[10px] text-destructive">⚠️ Multi-region anomaly detected</span>}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revoke Confirmation Modal */}
      <AnimatePresence>
        {revokeConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-panel-strong glow-red p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Confirm Token Revocation</h3>
                  <p className="text-[10px] font-mono text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Revoking token <span className="text-foreground font-mono">{tokenList.find(t => t.id === revokeConfirm)?.name}</span> will immediately invalidate all active sessions using this credential.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setRevokeConfirm(null)} className="flex-1 text-[10px] font-mono px-3 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors uppercase tracking-wider">Cancel</button>
                <button onClick={() => handleRevoke(revokeConfirm)} className="flex-1 text-[10px] font-mono px-3 py-2 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors uppercase tracking-wider">Revoke Now</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
