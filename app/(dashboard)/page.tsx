import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Package, Settings, Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">OS配置中心</h1>
        <p className="text-muted-foreground mt-2">
          管理应用模块和配置，控制系统行为
        </p>
      </div>

      {/* 快速统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">模块总数</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              其中已上架 8 个
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">配置总数</CardTitle>
            <Settings className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              其中已发布 18 个
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">定时发布</CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              等待发布中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>快速访问常用功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/modules">
              <Button variant="outline" className="w-full">
                <Package className="size-4 mr-2" />
                管理模块
              </Button>
            </Link>
            <Link href="/configs">
              <Button variant="outline" className="w-full">
                <Settings className="size-4 mr-2" />
                管理配置
              </Button>
            </Link>
            <Link href="/modules/new">
              <Button variant="outline" className="w-full">
                <Plus className="size-4 mr-2" />
                新增模块
              </Button>
            </Link>
            <Link href="/configs/new">
              <Button variant="outline" className="w-full">
                <Plus className="size-4 mr-2" />
                新建配置
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>系统最近的操作记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b last:pb-0 last:border-0">
              <div className="size-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">发布了配置 "推送优化"</p>
                <p className="text-xs text-muted-foreground">2 小时前</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b last:pb-0 last:border-0">
              <div className="size-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">新增模块 "数据同步"</p>
                <p className="text-xs text-muted-foreground">5 小时前</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b last:pb-0 last:border-0">
              <div className="size-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">上架了模块 "性能优化"</p>
                <p className="text-xs text-muted-foreground">1 天前</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
