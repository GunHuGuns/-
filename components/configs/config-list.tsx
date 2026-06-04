'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2, Eye, Pencil } from 'lucide-react';
import { useConfigStore } from '@/lib/store';
import { useModuleStore } from '@/lib/store';
import { Config } from '@/lib/types';
import { toast } from 'sonner';

interface ConfigListProps {
  filters?: {
    status?: string;
  };
}

export function ConfigList({ filters }: ConfigListProps) {
  const router = useRouter();
  const configs = useConfigStore((state) => state.configs);
  const deleteConfig = useConfigStore((state) => state.deleteConfig);
  const modules = useModuleStore((state) => state.modules);
  const [viewingConfig, setViewingConfig] = useState<Config | null>(null);
  const [deletingConfigId, setDeletingConfigId] = useState<string | null>(null);

  const filteredConfigs = configs.filter((config) => {
    if (filters?.status && config.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getModuleName = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    return module?.name || moduleId;
  };

  const handleView = (config: Config) => {
    setViewingConfig(config);
  };

  const handleEdit = (configId: string) => {
    router.push(`/configs/${configId}/edit`);
  };

  const handleDeleteClick = (configId: string) => {
    setDeletingConfigId(configId);
  };

  const handleDeleteConfirm = () => {
    if (deletingConfigId) {
      deleteConfig(deletingConfigId);
      toast.success('配置已删除');
      setDeletingConfigId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      scheduled: 'outline',
      archived: 'destructive',
    };
    const labels: Record<string, string> = {
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
                      <DropdownMenuItem onClick={() => handleView(config)}>
                        <Eye className="size-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(config.id)}>
                        <Pencil className="size-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteClick(config.id)}
                      >
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

      {/* 查看详情对话框 */}
      <Dialog open={!!viewingConfig} onOpenChange={() => setViewingConfig(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>配置详情</DialogTitle>
            <DialogDescription>
              查看配置 "{viewingConfig?.name}" 的完整信息
            </DialogDescription>
          </DialogHeader>
          {viewingConfig && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">配置名称</div>
                  <div className="font-medium">{viewingConfig.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">所属模块</div>
                  <div className="font-medium">{getModuleName(viewingConfig.moduleId)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">OS版本</div>
                  <div className="font-medium">{viewingConfig.osVersion || '全部版本'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">状态</div>
                  <div>{getStatusBadge(viewingConfig.status)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">创建时间</div>
                  <div className="font-medium">
                    {format(new Date(viewingConfig.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">生效范围</div>
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  {viewingConfig.effectiveScope.type === 'unified' ? (
                    <div className="space-y-1">
                      <div>类型：统一生效</div>
                      {viewingConfig.effectiveScope.categories?.length ? (
                        <div>品类：{viewingConfig.effectiveScope.categories.join(', ')}</div>
                      ) : null}
                      {viewingConfig.effectiveScope.brands?.length ? (
                        <div>品牌：{viewingConfig.effectiveScope.brands.join(', ')}</div>
                      ) : null}
                      {viewingConfig.effectiveScope.models?.length ? (
                        <div>型号：{viewingConfig.effectiveScope.models.join(', ')}</div>
                      ) : null}
                      {viewingConfig.effectiveScope.countries?.length ? (
                        <div>国家：{viewingConfig.effectiveScope.countries.join(', ')}</div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>类型：定向生效（{viewingConfig.effectiveScope.listType === 'blacklist' ? '黑名单' : '白名单'}）</div>
                      {viewingConfig.effectiveScope.devices?.length ? (
                        <div>设备数量：{viewingConfig.effectiveScope.devices.length} 台</div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Activity配置</div>
                <div className="space-y-2">
                  {viewingConfig.activityConfigs.map((config, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium">{config.key}</span>
                        <Badge variant="secondary" className="text-xs">
                          {config.valueType}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono break-all">
                        {config.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {viewingConfig.scheduleDate && (
                <div>
                  <div className="text-sm text-muted-foreground">定时发布</div>
                  <div className="font-medium">
                    {viewingConfig.scheduleDate} {viewingConfig.scheduleTime || ''}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingConfig(null)}>
              关闭
            </Button>
            <Button onClick={() => {
              if (viewingConfig) {
                handleEdit(viewingConfig.id);
              }
            }}>
              编辑配置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deletingConfigId} onOpenChange={() => setDeletingConfigId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个配置吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
