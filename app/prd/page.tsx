'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, CheckCircle, Loader2 } from 'lucide-react';
import { generatePRDDocument } from '@/lib/generate-prd';
import { toast } from 'sonner';

export default function PRDPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generatePRDDocument();
      setIsGenerated(true);
      toast.success('PRD文档已生成并下载');
      // 3秒后重置状态
      setTimeout(() => setIsGenerated(false), 3000);
    } catch (error) {
      console.error('生成PRD失败:', error);
      toast.error('生成PRD文档失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">PRD文档</h1>
        <p className="text-muted-foreground mt-1">
          下载OS配置中心的产品需求文档
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              OS配置中心 PRD
            </CardTitle>
            <CardDescription>
              完整的产品需求文档，包含系统架构、模块说明、业务规则和界面截图
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">文档包含内容：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>产品概述与目标</li>
                <li>系统架构说明</li>
                <li>模块管理功能详解</li>
                <li>配置管理功能详解</li>
                <li>Activity配置规则</li>
                <li>生效范围设置说明</li>
                <li>数据字典</li>
                <li>各模块界面截图</li>
              </ul>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>格式：</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                Word (.docx)
              </span>
            </div>
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在生成文档...
                </>
              ) : isGenerated ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  下载完成
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  下载PRD文档
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>文档预览</CardTitle>
            <CardDescription>PRD文档目录结构</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2 font-mono bg-muted p-4 rounded-lg">
              <div className="font-bold">OS配置中心 PRD</div>
              <div className="pl-4 space-y-1 text-muted-foreground">
                <div>1. 产品概述</div>
                <div className="pl-4">1.1 产品背景</div>
                <div className="pl-4">1.2 产品目标</div>
                <div>2. 系统架构</div>
                <div>3. 模块管理</div>
                <div className="pl-4">3.1 模块列表</div>
                <div className="pl-4">3.2 新增模块</div>
                <div>4. 配置管理</div>
                <div className="pl-4">4.1 配置列表</div>
                <div className="pl-4">4.2 新建配置</div>
                <div className="pl-4">4.3 Activity配置</div>
                <div className="pl-4">4.4 生效范围</div>
                <div className="pl-4">4.5 定时发布</div>
                <div>5. 数据字典</div>
                <div>6. 附录</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>截图列表</CardTitle>
          <CardDescription>文档中包含的界面截图</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: '模块列表', path: '/screenshots/module-list.png' },
              { name: '新增模块', path: '/screenshots/module-new.png' },
              { name: '配置列表', path: '/screenshots/config-list.png' },
              { name: '新建配置', path: '/screenshots/config-new-form.png' },
              { name: 'Activity配置', path: '/screenshots/activity-config-dialog.png' },
              { name: 'Value类型', path: '/screenshots/value-type-dropdown.png' },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                  <img
                    src={item.path}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
