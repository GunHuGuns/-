import { ConfigForm } from '@/components/configs/config-form';

export default function NewConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">新建配置</h1>
        <p className="text-muted-foreground mt-2">创建一个新的系统配置</p>
      </div>
      <ConfigForm />
    </div>
  );
}
