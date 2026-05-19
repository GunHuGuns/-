'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2, Eye } from 'lucide-react';
import { useConfigStore } from '@/lib/store';
import { Config } from '@/lib/types';

interface ConfigListProps {
  filters?: {
    status?: string;
  };
}

export function ConfigList({ filters }: ConfigListProps) {
  const configs = useConfigStore((state) => state.configs);
  const deleteConfig = useConfigStore((state) => state.deleteConfig);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredConfigs = configs.filter((config) => {
    if (filters?.status && config.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      published: 'default',
      scheduled: 'outline',
      archived: 'destructive',
    };
    const labels: Record<string, string> = {
      draft: '草稿',
      published: '已发布',
      scheduled: '定时发布',
      archived: '已归档',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>配置名称</TableHead>
            <TableHead>模块ID</TableHead>
            <TableHead>生效范围</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredConfigs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                暂无配置数据
              </TableCell>
            </TableRow>
          ) : (
            filteredConfigs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="font-semibold">{config.name}</TableCell>
                <TableCell className="font-mono text-sm">{config.moduleId}</TableCell>
                <TableCell className="text-sm">
                  {config.effectiveScope.type === 'unified' ? (
                    <span>统一生效</span>
                  ) : (
                    <span>
                      定向生效
                      {config.effectiveScope.listType === 'blacklist' ? '(黑名单)' : '(白名单)'}
                    </span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(config.status)}</TableCell>
                <TableCell className="text-sm">
                  {format(new Date(config.createdAt), 'yyyy-MM-dd HH:mm')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="size-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem>编辑</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="size-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
