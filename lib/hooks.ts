import { useState, useEffect } from 'react';
import type { DistressedLead, LeadHunterSettings, AdminLeadStats, AgentLeadStats } from './types/leads';

// Placeholder hooks - replace with actual API calls later
export function useVelocity() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock data for now
    setData({
      kpis: {
        actives: 847,
        pendings: 712,
        convRate: 0.84
      },
      comps: {
        aboveFiveYrAvgPct: 12
      },
      series: [
        { label: 'Last Week', active: 195, pending: 185 },
        { label: 'This Week', active: 260, pending: 195 }
      ],
      updated: {
        updated: new Date().toISOString()
      }
    });
  }, []);

  return { data };
}

export function usePriceGap() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData({
      bySegment: [
        { segment: 'SFH <$400K', gapPct: 2.1 },
        { segment: 'Townhome <$400K', gapPct: 1.8 },
        { segment: 'SFH $400-600K', gapPct: -0.5 },
        { segment: 'Condo $400-600K', gapPct: -1.2 },
        { segment: 'SFH >$600K', gapPct: 3.4 }
      ],
      updated: {
        updated: new Date().toISOString()
      }
    });
  }, []);

  return { data };
}

export function useTTC() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setData({
      kpis: {
        median: 18,
        target: 21,
        stance: 'Fast market'
      },
      series: Array.from({ length: 30 }, (_, i) => ({
        label: `Day ${i + 1}`,
        ttc: 10 + Math.random() * 25
      })),
      updated: {
        updated: new Date().toISOString()
      }
    });
  }, []);

  return { data };
}

export function useZipIntel(zip: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock data for ZIP codes
    setData({
      zip,
      kpis: {
        dom: Math.floor(Math.random() * 30) + 10
      },
      trend: Array.from({ length: 30 }, (_, i) => ({
        price: 400000 + Math.random() * 200000
      })),
      ai: {
        hotBands: '$400K-$600K'
      }
    });
  }, [zip]);

  return { data };
}

// ===== LEAD MANAGEMENT HOOKS =====

export function useLeads(role: 'admin' | 'agent' = 'admin') {
  const [data, setData] = useState<DistressedLead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const endpoint = role === 'admin' ? '/api/admin/leads' : '/api/agent/leads';
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [role]);

  return { data, loading, error };
}

export function useLeadStats(role: 'admin' | 'agent' = 'admin') {
  const [data, setData] = useState<AdminLeadStats | AgentLeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leads/stats?role=${role}`);

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [role]);

  return { data, loading, error };
}

export function useLeadHunterSettings() {
  const [data, setData] = useState<LeadHunterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/lead-hunter/settings');

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (settings: Partial<LeadHunterSettings>) => {
    try {
      const response = await fetch('/api/lead-hunter/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();
      setData(result.data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  return { data, loading, error, updateSettings };
}
