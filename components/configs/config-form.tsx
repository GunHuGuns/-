'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useConfigStore } from '@/lib/store';
import { useModuleStore } from '@/lib/store';
import { EffectiveScopeDialog, type EffectiveScope } from './effective-scope-dialog';
import { ActivityConfigPanel, type ActivityConfig, VALUE_TYPE_OPTIONS } from './activity-config-panel';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Config } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(1, '配置名称不能为空'),
  moduleId: z.string().min(1, '请选择模块'),
  activities: z.array(
    z.object({
      key: z.string(),
      valueType: z.string(),
      value: z.string(),
    })
  ),
  effectiveScope: z.object({
    type: z.enum(['unified', 'targeted']),
    categories: z.array(z.string()).optional(),
    brands: z.array(z.string()).optional(),
    models: z.array(z.string()).optional(),
    countries: z.array(z.string()).optional(),
    devices: z.array(z.string()).optional(),
    listType: z.enum(['blacklist', 'whitelist']).optional(),
  }),
  enableSchedule: z.boolean().default(false),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ConfigForm() {
  const router = useRouter();
  const modules = useModuleStore((state) => state.modules);
  const addConfig = useConfigStore((state) => state.addConfig);
  const [effectiveScope, setEffectiveScope] = useState<EffectiveScope>({
    type: 'unified',
  });
  const [activities, setActivities] = useState<ActivityConfig[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      moduleId: '',
      activities: [],
      effectiveScope: { type: 'unified' },
      enableSchedule: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    addConfig({
      name: values.name,
      moduleId: values.moduleId,
      activityConfigs: activities,
      effectiveScope,
      scheduleDate: values.enableSchedule ? values.scheduleDate : undefined,
      scheduleTime: values.enableSchedule ? values.scheduleTime : undefined,
      status: values.enableSchedule ? 'scheduled' : 'published',
    });

    router.push('/configs');
  };

  const enableSchedule = form.watch('enableSchedule');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>新建配置</CardTitle>
          <CardDescription>填写配置基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="font-semibold">基本信息</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>配置名称</FormLabel>
                      <FormControl>
                        <Input placeholder="输入配置名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>选择模块</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择要关联的模块" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modules.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              {module.name} ({module.packageName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Activity配置 - 直接展示在页面 */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold">Activity配置</h3>
                <ActivityConfigPanel
                  value={activities}
                  onChange={setActivities}
                />
              </div>

              {/* 生效范围 */}
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold">生效范围</h3>
                <EffectiveScopeDialog
                  value={effectiveScope}
                  onChange={setEffectiveScope}
                />
                <div className="text-sm text-muted-foreground">
                  生效方式：
                  {effectiveScope.type === 'unified' ? (
                    <span>
                      统一生效（品类: {effectiveScope.categories?.length || 0}, 品牌:{' '}
                      {effectiveScope.brands?.length || 0}, 型号:{' '}
                      {effectiveScope.models?.length || 0}, 国家:{' '}
                      {effectiveScope.countries?.length || 0}）
                    </span>
                  ) : (
                    <span>
                      定向生效（{effectiveScope.listType === 'blacklist' ? '黑名单' : '白名单'}，设备: {effectiveScope.devices?.length || 0}）
                    </span>
                  )}
                </div>
              </div>

              {/* 定时发布 */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <FormField
                    control={form.control}
                    name="enableSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Label className="font-semibold cursor-pointer">
                    启用定时发布
                  </Label>
                </div>

                {enableSchedule && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <FormField
                      control={form.control}
                      name="scheduleDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>发布日期</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="scheduleTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>发布时间</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
                <Button type="submit">创建配置</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
