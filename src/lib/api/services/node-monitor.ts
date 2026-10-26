import { apiClient } from '@/lib/api/client';

export interface KomariNode {
  uuid: string;
  name: string;
  online: boolean;
  time?: string | number | null;
  cpu?: number | null;
  ram?: number | null;
  ram_total?: number | null;
  disk?: number | null;
  disk_total?: number | null;
  net_in?: number | null;
  net_out?: number | null;
  uptime?: number | null;
  ping?: number | null;
}

interface KomariStatusResponse { data: KomariNode[] }
interface KomariAccessResponse { data: { allowed: boolean } }

export async function fetchKomariAccess(signal?: AbortSignal): Promise<boolean> {
  const { data } = await apiClient.get<KomariAccessResponse>('/api/v1/komari/access', { signal });
  return data.data.allowed;
}

export async function fetchKomariNodes(signal?: AbortSignal): Promise<KomariNode[]> {
  const { data } = await apiClient.get<KomariStatusResponse>('/api/v1/komari/status', { signal });
  if (!Array.isArray(data?.data)) throw new Error('节点监控接口返回格式不正确');
  return data.data;
}
