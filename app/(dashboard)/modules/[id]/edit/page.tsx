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
import { ModuleForm } from '@/components/modules/module-form';
import { useModuleStore } from '@/lib/store';
import type { Module } from '@/lib/types';
import { toast } from 'sonner';

export default function EditModulePage() {
  const params = useParams();
  const router = useRouter();
  const { modules } = useModuleStore();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const foundModule = modules.find((m) => m.id === id);
    
    if (foundModule) {
      setModule(foundModule);
    } else {
      toast.error('模块不存在');
      router.push('/modules');
    }
    setLoading(false);
  }, [params.id, modules, router]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!module) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">编辑模块</h1>
        <p className="text-muted-foreground">修改模块的信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>模块信息</CardTitle>
          <CardDescription>编辑模块的基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <ModuleForm module={module} />
        </CardContent>
      </Card>
    </div>
  );
}
