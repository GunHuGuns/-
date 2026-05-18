"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onUpload: (devices: string[]) => void;
  className?: string;
}

export function FileUpload({ onUpload, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [devices, setDevices] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (uploadedFile: File) => {
      setFile(uploadedFile);

      // 模拟解析文件内容
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // 假设每行一个设备ID
        const deviceList = content
          .split(/[\r\n,]+/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        setDevices(deviceList);
        onUpload(deviceList);
      };
      reader.readAsText(uploadedFile);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setDevices([]);
    onUpload([]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!file ? (
        <div
          className={cn(
            "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept=".csv,.txt,.xlsx,.xls"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className="mb-2 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            拖拽文件到此处，或点击上传
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            支持 CSV、TXT、Excel 格式
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <FileText className="size-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              已解析 {devices.length} 个设备
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleRemove}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {devices.length > 0 && (
        <div className="rounded-lg border p-3">
          <p className="mb-2 text-sm font-medium">设备列表预览：</p>
          <div className="max-h-[120px] overflow-auto">
            <p className="text-xs text-muted-foreground">
              {devices.slice(0, 10).join("、")}
              {devices.length > 10 && `... 等 ${devices.length} 个设备`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
