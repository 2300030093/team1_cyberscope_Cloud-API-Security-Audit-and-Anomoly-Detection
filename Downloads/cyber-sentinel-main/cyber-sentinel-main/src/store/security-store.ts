import { create } from 'zustand';
import { analyticsApi, incidentsApi, policiesApi } from '../lib/api';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Incident {
  id: number;
  title: string;
  severity: Severity;
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  source: string;
  timestamp: string;
  aiExplanation: string;
  endpoint: string;
  risk_score: number;
  description: string;
  api_id: number;
}

export interface TrafficLog {
  id: number;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  ip: string;
  timestamp: string;
  severity: Severity;
  flagged: boolean;
  risk_score: number;
}

export interface AutomationRule {
  id: number;
  name: string;
  description: string;
  type: 'rate-limit' | 'token-revoke' | 'endpoint-lock' | 'ip-block';
  enabled: boolean;
  triggerCount: number;
  lastTriggered: string | null;
  risk_threshold: number;
  auto_rate_limit: boolean;
  auto_token_revoke: boolean;
  auto_lockdown: boolean;
}

export interface TopAttacker {
  ip_address: string;
  request_count: number;
  high_risk_count: number;
  avg_risk_score: number;
}

export interface RiskDistribution {
  risk_level: string;
  count: number;
}

export interface IncidentTrend {
  date: string;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface SecurityState {
  globalThreatScore: number;
  activeIncidents: number;
  autoResponsesTriggered: number;
  totalRequests: number;
  blockedRequests: number;
  incidents: Incident[];
  trafficLogs: TrafficLog[];
  automationRules: AutomationRule[];
  topAttackers: TopAttacker[];
  riskDistribution: RiskDistribution[];
  incidentTrends: IncidentTrend[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  toggleAutomation: (id: number) => void;
}

export const useSecurityStore = create<SecurityState>((set) => ({
  globalThreatScore: 0,
  activeIncidents: 0,
  autoResponsesTriggered: 0,
  totalRequests: 0,
  blockedRequests: 0,
  incidents: [],
  trafficLogs: [],
  automationRules: [],
  topAttackers: [],
  riskDistribution: [],
  incidentTrends: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('[SecurityStore] Fetching dashboard data from API...');
      
      // Fetch overview
      const overviewRes = await analyticsApi.getOverview();
      console.log('[SecurityStore] Overview response:', overviewRes);
      
      if (overviewRes.error) {
        console.error('[SecurityStore] Overview error:', overviewRes.error);
      }
      
      if (overviewRes.data) {
        set({
          activeIncidents: overviewRes.data.activeIncidents || 0,
          totalRequests: overviewRes.data.totalApis || 0,
          blockedRequests: overviewRes.data.highRiskRequests || 0,
        });
      }

      // Fetch threat score
      const threatRes = await analyticsApi.getThreatScore();
      console.log('[SecurityStore] Threat score response:', threatRes);
      
      if (threatRes.error) {
        console.error('[SecurityStore] Threat score error:', threatRes.error);
      }

      if (threatRes.data) {
        set({
          globalThreatScore: threatRes.data.threat_score || 0,
          autoResponsesTriggered: threatRes.data.critical_incidents || 0,
        });
      }

      // Fetch incidents
      const incidentsRes = await incidentsApi.getAll();
      console.log('[SecurityStore] Incidents response:', incidentsRes);
      
      if (incidentsRes.error) {
        console.error('[SecurityStore] Incidents error:', incidentsRes.error);
      }

      if (incidentsRes.data) {
        const mappedIncidents: Incident[] = incidentsRes.data.map((inc: any) => ({
          id: inc.id,
          title: inc.title,
          severity: inc.severity,
          status: inc.status,
          source: inc.api_id?.toString() || 'Unknown',
          timestamp: inc.created_at,
          aiExplanation: inc.description || 'No explanation available',
          endpoint: '/api/unknown',
          risk_score: inc.risk_score,
          description: inc.description,
          api_id: inc.api_id,
        }));
        set({ incidents: mappedIncidents });
      }

      // Fetch policies (automation rules)
      const policiesRes = await policiesApi.getAll();
      console.log('[SecurityStore] Policies response:', policiesRes);
      
      if (policiesRes.error) {
        console.error('[SecurityStore] Policies error:', policiesRes.error);
      }

      if (policiesRes.data) {
        const mappedRules: AutomationRule[] = policiesRes.data.map((pol: any) => ({
          id: pol.id,
          name: pol.policy_name,
          description: `Risk threshold: ${pol.risk_threshold}`,
          type: 'rate-limit',
          enabled: pol.auto_rate_limit || false,
          triggerCount: 0,
          lastTriggered: null,
          risk_threshold: pol.risk_threshold,
          auto_rate_limit: pol.auto_rate_limit,
          auto_token_revoke: pol.auto_token_revoke,
          auto_lockdown: pol.auto_lockdown,
        }));
        set({ automationRules: mappedRules });
      }

      // Fetch recent traffic
      const trafficRes = await analyticsApi.getRecentTraffic(50);
      console.log('[SecurityStore] Traffic response:', trafficRes);
      
      if (trafficRes.error) {
        console.error('[SecurityStore] Traffic error:', trafficRes.error);
      }

      if (trafficRes.data) {
        const mappedLogs: TrafficLog[] = trafficRes.data.map((log: any) => ({
          id: log.id,
          method: log.request_method || 'GET',
          endpoint: log.ip_address || '/unknown',
          statusCode: log.status_code || 200,
          responseTime: log.latency || 0,
          ip: log.ip_address || '0.0.0.0',
          timestamp: log.created_at,
          severity: log.risk_score >= 80 ? 'critical' : log.risk_score >= 60 ? 'high' : log.risk_score >= 40 ? 'medium' : 'low',
          flagged: log.risk_score >= 60,
          risk_score: log.risk_score || 0,
        }));
        set({ trafficLogs: mappedLogs });
      }

      // Fetch top attackers
      const attackersRes = await analyticsApi.getTopAttackers(5);
      console.log('[SecurityStore] Top attackers response:', attackersRes);
      
      if (attackersRes.data) {
        set({ topAttackers: attackersRes.data });
      }

      // Fetch risk distribution
      const riskRes = await analyticsApi.getRiskDistribution();
      console.log('[SecurityStore] Risk distribution response:', riskRes);
      
      if (riskRes.data) {
        set({ riskDistribution: riskRes.data });
      }

      // Fetch incident trends
      const trendsRes = await analyticsApi.getIncidentTrends('7d');
      console.log('[SecurityStore] Incident trends response:', trendsRes);
      
      if (trendsRes.data) {
        set({ incidentTrends: trendsRes.data });
      }

      set({ isLoading: false });
      console.log('[SecurityStore] Data fetch complete');
    } catch (error) {
      console.error('[SecurityStore] Error fetching data:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch data' 
      });
    }
  },

  toggleAutomation: (id) =>
    set((state) => ({
      automationRules: state.automationRules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    })),
}));
