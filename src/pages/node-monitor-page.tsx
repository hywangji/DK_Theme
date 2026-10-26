
import { Activity, Cpu, HardDrive, MemoryStick, Network, RefreshCw, Server } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
