'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConfigForm } from '@/components/configs/config-form';
import { useConfigStore } from '@/lib/store';
import type { Config } from '@/lib/types';
import { toast } from 'sonner';

export default function EditConfigPage() {
  const params = useParams();
  const router = useRouter();
  const { configs } = useConfigStore();
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const foundConfig = configs.find((c) => c.id === id);

    if (foundConfig) {
      setConfig(foundConfig);
    } else {
      toast.error('配置不存在');
      router.push('/configs');
    }
    setLoading(false);
  }, [params.id, configs, router]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!config) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">编辑配置</h1>
        <p className="text-muted-foreground">修改配置的信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>配置详情</CardTitle>
          <CardDescription>编辑配置的基本信息和生效范围</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
