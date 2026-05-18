"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleSearch } from "@/components/modules/module-search";
import { ModuleList } from "@/components/modules/module-list";
import type { ModuleSearchParams } from "@/lib/types";

export default function ModulesPage() {
  const [searchParams, setSearchParams] = useState<ModuleSearchParams>({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">模块管理</h1>
          <p className="text-muted-foreground">
            管理系统模块，包括新增、编辑和上下架操作
          </p>
        </div>
        <Button asChild>
          <Link href="/modules/new">
            <PlusCircle className="mr-2 size-4" />
            新增模块
          </Link>
        </Button>
      </div>

      <ModuleSearch onSearch={setSearchParams} />
      <ModuleList searchParams={searchParams} />
    </div>
  );
}
