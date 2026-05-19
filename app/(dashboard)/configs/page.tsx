import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { ConfigList } from '@/components/configs/config-list';

export default function ConfigsPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">配置管理</h1>
          <p className="text-muted-foreground mt-2">创建和管理系统配置</p>
        </div>
        <Link href="/configs/new">
          <Button>
            <Plus className="size-4 mr-2" />
            新建配置
          </Button>
        </Link>
      </div>

      {/* 配置列表 */}
      <Card>
        <CardHeader>
          <CardTitle>全部配置</CardTitle>
          <CardDescription>管理和查看所有系统配置</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfigList />
        </CardContent>
      </Card>
    </div>
  );
}
