‎src/pages/node-monitor-page.tsx‎
+86
-83
Lines changed: 86 additions & 83 deletions
Original file line number	Diff line number	Diff line change
@@ -1,92 +1,95 @@
import { useEffect, useState } from 'react';
import { fetchKomariNodes, type KomariNode } from '@/lib/api/services/node-monitor';

import { Activity, Cpu, HardDrive, MemoryStick, Network, RefreshCw, Server } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
const INTERVAL_MS = 10_000;
const bytes = (v?: number | null) => {
  if (v == null || !Number.isFinite(v)) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let n = v, i = 0;
  while (Math.abs(n) >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};
const percent = (v?: number | null) => v == null || !Number.isFinite(v) ? '—' : `${Math.max(0, Math.min(100, v)).toFixed(1)}%`;
const usage = (used?: number | null, total?: number | null) => used == null || total == null || total <= 0 ? '—' : `${bytes(used)} / ${bytes(total)}`;
const duration = (seconds?: number | null) => {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '—';
  const days = Math.floor(seconds / 86400), hours = Math.floor((seconds % 86400) / 3600);
  return days > 0 ? `${days}天 ${hours}小时` : `${hours}小时 ${Math.floor((seconds % 3600) / 60)}分钟`;
};
const getError = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { status?: number } }).response;
    if (response?.status === 403) return '当前套餐未获得节点监控权限，或套餐已过期。';
    if (response?.status === 503) return '节点监控服务暂不可用，请稍后重试。';
  }
  return error instanceof Error ? error.message : '获取节点监控数据失败';
};

export function NodeMonitorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        badge="节点监控"
        title="服务器实时监控"
        actions={
          <Badge variant="outline">
            Komari Monitor
          </Badge>
        }
      />
export default function NodeMonitorPage() {
  const [nodes, setNodes] = useState<KomariNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

      <div className="px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Server className="size-4" />
                授权节点
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              --
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="size-4" />
                在线节点
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              --
            </CardContent>
          </Card>
  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      controller = new AbortController();
      try {
        const result = await fetchKomariNodes(controller.signal);
        if (!active) return;
        setNodes(result);
        setUpdatedAt(new Date());
        setError('');
      } catch (e) {
        if (active && !controller.signal.aborted) setError(getError(e));
      } finally {
        if (active) {
          setLoading(false);
          timer = setTimeout(load, INTERVAL_MS);
        }
      }
    };
    void load();
    return () => { active = false; if (timer) clearTimeout(timer); controller?.abort(); };
  }, []);

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Network className="size-4" />
                离线节点
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              --
            </CardContent>
          </Card>
        </div>
  const online = nodes.filter(n => n.online).length;
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-semibold">节点监控</h1><p className="text-sm text-muted-foreground">仅显示当前套餐授权的 Komari 节点 · 约每 10 秒刷新</p></div>
        <span className="text-xs text-muted-foreground">{updatedAt ? `上次更新：${updatedAt.toLocaleTimeString('zh-CN')}` : '尚未更新'}</span>
      </div>
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>节点监控列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-10 text-center">
              <Server className="size-10 text-muted-foreground" />
              <div className="text-lg font-medium">
                Komari 监控接口尚未启用
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                页面已准备就绪。后续将通过 XBoard 插件读取当前套餐授权的服务器监控数据。
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Cpu className="size-4" />CPU</span>
                <span className="flex items-center gap-1"><MemoryStick className="size-4" />内存</span>
                <span className="flex items-center gap-1"><HardDrive className="size-4" />磁盘</span>
                <span className="flex items-center gap-1"><RefreshCw className="size-4" />实时刷新</span>
              </div>
              <Button variant="outline" disabled>
                <RefreshCw className="size-4" />
                刷新监控数据
              </Button>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {([['授权节点', nodes.length], ['在线节点', online], ['离线节点', nodes.length - online]] as const).map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-card p-5"><div className="text-sm text-muted-foreground">{label}</div><div className="mt-2 text-3xl font-semibold">{value}</div></div>
        ))}
      </div>
      {error && <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{error}{updatedAt && '（页面保留上一次成功获取的数据）'}</div>}
      {loading && <p className="text-sm text-muted-foreground">正在加载节点数据…</p>}
      {!loading && !error && nodes.length === 0 && <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">当前套餐暂无可显示的节点</div>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {nodes.map(n => (
          <section key={n.uuid} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><h2 className="break-words font-semibold">{n.name}</h2><div className="mt-1 break-all text-xs text-muted-foreground">{n.uuid}</div></div>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${n.online ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>{n.online ? '在线' : '离线'}</span>
            </div>
          </CardContent>
        </Card>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div><dt className="text-muted-foreground">CPU</dt><dd className="mt-1 font-medium">{percent(n.cpu)}</dd></div>
              <div><dt className="text-muted-foreground">内存</dt><dd className="mt-1 font-medium">{percent(n.ram_total && n.ram != null ? n.ram / n.ram_total * 100 : null)}</dd><dd className="text-xs text-muted-foreground">{usage(n.ram, n.ram_total)}</dd></div>
              <div><dt className="text-muted-foreground">磁盘</dt><dd className="mt-1 font-medium">{percent(n.disk_total && n.disk != null ? n.disk / n.disk_total * 100 : null)}</dd><dd className="text-xs text-muted-foreground">{usage(n.disk, n.disk_total)}</dd></div>
              <div><dt className="text-muted-foreground">运行时间</dt><dd className="mt-1 font-medium">{duration(n.uptime)}</dd></div>
              <div><dt className="text-muted-foreground">入站速率</dt><dd className="mt-1 font-medium">{n.net_in == null ? '—' : `${bytes(n.net_in)}/s`}</dd></div>
              <div><dt className="text-muted-foreground">出站速率</dt><dd className="mt-1 font-medium">{n.net_out == null ? '—' : `${bytes(n.net_out)}/s`}</dd></div>
              {n.ping != null && <div><dt className="text-muted-foreground">延迟</dt><dd className="mt-1 font-medium">{n.ping} ms</dd></div>}
            </dl>
          </section>
        ))}
      </div>
    </div>
  )
  );
}
