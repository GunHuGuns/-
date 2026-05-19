"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModuleStore } from "@/lib/store";
import { ModuleForm } from "./module-form";
import type { Module, ModuleSearchParams } from "@/lib/types";
import { toast } from "sonner";

interface ModuleListProps {
  searchParams: ModuleSearchParams;
}

export function ModuleList({ searchParams }: ModuleListProps) {
  const { modules, toggleModuleStatus } = useModuleStore();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [statusDialogModule, setStatusDialogModule] = useState<Module | null>(null);

  // 根据搜索条件过滤模块
  const filteredModules = modules.filter((module) => {
    // 名称搜索
    if (
      searchParams.name &&
      !module.name.toLowerCase().includes(searchParams.name.toLowerCase())
    ) {
      return false;
    }

    // 日期范围
    if (searchParams.dateRange) {
      const [start, end] = searchParams.dateRange;
      const moduleDate = new Date(module.createdAt);
      if (start && moduleDate < start) return false;
      if (end && moduleDate > end) return false;
    }

    // 品类
    if (
      searchParams.categories &&
      searchParams.categories.length > 0 &&
      !searchParams.categories.includes(module.category)
    ) {
      return false;
    }

    // 品牌
    if (
      searchParams.brands &&
      searchParams.brands.length > 0 &&
      !searchParams.brands.includes(module.brand)
    ) {
      return false;
    }

    // 型号
    if (
      searchParams.models &&
      searchParams.models.length > 0 &&
      !searchParams.models.includes(module.model)
    ) {
      return false;
    }

    // 国家
    if (
      searchParams.countries &&
      searchParams.countries.length > 0 &&
      !module.countries.some((c) => searchParams.countries!.includes(c))
    ) {
      return false;
    }

    return true;
  });

  const handleToggleStatus = () => {
    if (statusDialogModule) {
      toggleModuleStatus(statusDialogModule.id);
      toast.success(
        statusDialogModule.status === "online" ? "模块已下架" : "模块已上架"
      );
      setStatusDialogModule(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">模块名称</TableHead>
              <TableHead className="w-[200px]">包名</TableHead>
              <TableHead>新建时间</TableHead>
              <TableHead>品类</TableHead>
              <TableHead>品牌</TableHead>
              <TableHead>型号</TableHead>
              <TableHead>国家</TableHead>
              <TableHead className="w-[80px]">状态</TableHead>
              <TableHead className="w-[80px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              filteredModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {module.packageName}
                  </TableCell>
                  <TableCell>
                    {format(new Date(module.createdAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell>{module.category}</TableCell>
                  <TableCell>{module.brand}</TableCell>
                  <TableCell>{module.model}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {module.countries.slice(0, 2).map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                      {module.countries.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{module.countries.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={module.status === "online" ? "default" : "secondary"}
                    >
                      {module.status === "online" ? "已上架" : "已下架"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">操作菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingModule(module)}>
                          <Pencil className="mr-2 size-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setStatusDialogModule(module)}
                        >
                          {module.status === "online" ? (
                            <>
                              <ArrowDownCircle className="mr-2 size-4" />
                              下架
                            </>
                          ) : (
                            <>
                              <ArrowUpCircle className="mr-2 size-4" />
                              上架
                            </>
                          )}
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

      {/* 编辑模块对话框 */}
      <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>编辑模块</DialogTitle>
          </DialogHeader>
          {editingModule && (
            <ModuleForm
              module={editingModule}
              onSuccess={() => setEditingModule(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 上下架确认对话框 */}
      <AlertDialog
        open={!!statusDialogModule}
        onOpenChange={() => setStatusDialogModule(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              确认{statusDialogModule?.status === "online" ? "下架" : "上架"}模块？
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusDialogModule?.status === "online"
                ? "下架后，该模块将无法被配置关联。"
                : "上架后，该模块可以被配置关联使用。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
