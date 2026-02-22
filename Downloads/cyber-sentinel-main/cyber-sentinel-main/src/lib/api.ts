const API_BASE_URL = ''; // Use proxy - requests to /api/* will be forwarded to backend

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ token: string; user: { id: number; email: string; name: string; role: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (name: string, email: string, password: string) =>
    fetchApi<{ token: string; user: { id: number; email: string; name: string; role: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  
  me: () =>
    fetchApi<{ id: number; email: string; name: string; role: string }>('/api/auth/me'),
};

// Analytics API
export const analyticsApi = {
  getThreatScore: () => fetchApi<any>('/api/analytics/threat-score'),
  getTopAttackers: (limit?: number) => fetchApi<any[]>(`/api/analytics/top-attackers?limit=${limit || 10}`),
  getRiskDistribution: () => fetchApi<any[]>('/api/analytics/risk-distribution'),
  getIncidentTrends: (period?: string) => fetchApi<any[]>(`/api/analytics/incident-trends?period=${period || '7d'}`),
  getOverview: () => fetchApi<any>('/api/analytics/overview'),
  getRecentTraffic: (limit?: number) => fetchApi<any[]>(`/api/analytics/recent-traffic?limit=${limit || 50}`),
};

// Incidents API
export const incidentsApi = {
  getAll: () => fetchApi<any[]>('/api/incidents'),
  getById: (id: number) => fetchApi<any>(`/api/incidents/${id}`),
  updateStatus: (id: number, status: string) =>
    fetchApi<any>(`/api/incidents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  create: (incident: any) =>
    fetchApi<any>('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    }),
};

// Traffic Logs API
export const logsApi = {
  getAll: (limit?: number) => fetchApi<any[]>(`/api/logs?limit=${limit || 100}`),
  ingest: (log: any) =>
    fetchApi<any>('/api/logs/ingest', {
      method: 'POST',
      body: JSON.stringify(log),
    }),
};

// APIs API
export const apisApi = {
  getAll: () => fetchApi<any[]>('/api/apis'),
  getById: (id: number) => fetchApi<any>(`/api/apis/${id}`),
  create: (api: any) =>
    fetchApi<any>('/api/apis', {
      method: 'POST',
      body: JSON.stringify(api),
    }),
  update: (id: number, api: any) =>
    fetchApi<any>(`/api/apis/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(api),
    }),
  delete: (id: number) =>
    fetchApi<any>(`/api/apis/${id}`, {
      method: 'DELETE',
    }),
};

// Tokens API
export const tokensApi = {
  getAll: () => fetchApi<any[]>('/api/tokens'),
  revoke: (tokenId: string) =>
    fetchApi<any>(`/api/tokens/revoke`, {
      method: 'POST',
      body: JSON.stringify({ token_id: tokenId }),
    }),
};

// Endpoints API
export const endpointsApi = {
  getAll: () => fetchApi<any[]>('/api/endpoints'),
  lockdown: (id: number, duration?: number) =>
    fetchApi<any>(`/api/endpoints/${id}/lockdown`, {
      method: 'PATCH',
      body: JSON.stringify({ duration }),
    }),
  unlock: (id: number) =>
    fetchApi<any>(`/api/endpoints/${id}/unlock`, {
      method: 'PATCH',
    }),
};

// Policies API
export const policiesApi = {
  getAll: () => fetchApi<any[]>('/api/policies'),
  getById: (id: number) => fetchApi<any>(`/api/policies/${id}`),
  create: (policy: any) =>
    fetchApi<any>('/api/policies', {
      method: 'POST',
      body: JSON.stringify(policy),
    }),
  update: (id: number, policy: any) =>
    fetchApi<any>(`/api/policies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(policy),
    }),
};

// Timeline API
export const timelineApi = {
  getByIncidentId: (incidentId: number) => fetchApi<any[]>(`/api/timeline/${incidentId}`),
};

// Audit API
export const auditApi = {
  getAll: (limit?: number, offset?: number) => fetchApi<any[]>(`/api/audit?limit=${limit || 100}&offset=${offset || 0}`),
  getStats: () => fetchApi<any>('/api/audit/stats/summary'),
};

export default {
  auth: authApi,
  analytics: analyticsApi,
  incidents: incidentsApi,
  logs: logsApi,
  apis: apisApi,
  tokens: tokensApi,
  endpoints: endpointsApi,
  policies: policiesApi,
  timeline: timelineApi,
  audit: auditApi,
};
