'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Value类型定义
export type ValueType =
  | 'number'
  | 'string'
  | 'json-object'
  | 'string-array'
  | 'number-array'
  | 'json-array'
  | 'custom';

export const VALUE_TYPE_OPTIONS: { value: ValueType; label: string }[] = [
  { value: 'number', label: '单值-数字' },
  { value: 'string', label: '单值-字符串' },
  { value: 'json-object', label: '对象-JSON' },
  { value: 'string-array', label: '数组-字符串' },
  { value: 'number-array', label: '数组-数字' },
  { value: 'json-array', label: '数组-JSON' },
  { value: 'custom', label: '自定义' },
];

export interface ActivityConfig {
  key: string;
  valueType: ValueType;
  value: string;
}

interface ActivityConfigDialogProps {
  value?: ActivityConfig[];
  onChange: (value: ActivityConfig[]) => void;
}

export function ActivityConfigDialog({
  value = [],
  onChange,
}: ActivityConfigDialogProps) {
  const [open, setOpen] = useState(false);
  const [configs, setConfigs] = useState<ActivityConfig[]>(value);
  const [newKey, setNewKey] = useState('');
  const [newValueType, setNewValueType] = useState<ValueType>('string');
  const [newValue, setNewValue] = useState('');

  const getValuePlaceholder = (type: ValueType) => {
    switch (type) {
      case 'number':
        return '例如：123';
      case 'string':
        return '例如：hello world';
      case 'json-object':
        return '例如：{"key": "value", "count": 10}';
      case 'string-array':
        return '例如：["a", "b", "c"]';
      case 'number-array':
        return '例如：[1, 2, 3]';
      case 'json-array':
        return '例如：[{"id": 1}, {"id": 2}]';
      case 'custom':
        return '输入自定义值';
      default:
        return '输入值';
    }
  };

  const validateValue = (type: ValueType, val: string): boolean => {
    if (!val.trim()) return false;
    try {
      switch (type) {
        case 'number':
          return !isNaN(Number(val));
        case 'string':
          return true;
        case 'json-object':
          const obj = JSON.parse(val);
          return typeof obj === 'object' && !Array.isArray(obj);
        case 'string-array':
          const strArr = JSON.parse(val);
          return Array.isArray(strArr) && strArr.every((i) => typeof i === 'string');
        case 'number-array':
          const numArr = JSON.parse(val);
          return Array.isArray(numArr) && numArr.every((i) => typeof i === 'number');
        case 'json-array':
          const jsonArr = JSON.parse(val);
          return Array.isArray(jsonArr);
        case 'custom':
          return true;
        default:
          return true;
      }
    } catch {
      return type === 'string' || type === 'custom';
    }
  };

  const addConfig = () => {
    if (newKey.trim() && newValue.trim()) {
      setConfigs([
        ...configs,
        { key: newKey, valueType: newValueType, value: newValue },
      ]);
      setNewKey('');
      setNewValueType('string');
      setNewValue('');
    }
  };

  const removeConfig = (index: number) => {
    setConfigs(configs.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onChange(configs);
    setOpen(false);
  };

  const getTypeLabel = (type: ValueType) => {
    return VALUE_TYPE_OPTIONS.find((o) => o.value === type)?.label || type;
  };

  const isValueValid = validateValue(newValueType, newValue);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">配置Activity</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>配置Activity</DialogTitle>
          <DialogDescription>
            填写Activity名称，选择Value类型，然后输入对应的值
          </DialogDescription>
        </DialogHeader>

        {/* 已添加的配置列表 */}
        <div className="space-y-3 max-h-64 overflow-auto">
          {configs.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              暂未添加Activity配置
            </div>
          ) : (
            configs.map((config, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg bg-muted/30 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold truncate">
                      {config.key}
                    </span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {getTypeLabel(config.valueType)}
                    </Badge>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground break-all">
                    {config.value}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeConfig(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* 添加新配置表单 */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <Label className="text-sm">Activity名称</Label>
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="例如：com.example.MainActivity"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm">Value类型</Label>
            <Select
              value={newValueType}
              onValueChange={(v) => {
                setNewValueType(v as ValueType);
                setNewValue('');
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                {VALUE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">Value值</Label>
            {newValueType === 'json-object' ||
            newValueType === 'json-array' ||
            newValueType === 'string-array' ||
            newValueType === 'number-array' ? (
              <Textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={getValuePlaceholder(newValueType)}
                className="mt-1 font-mono text-sm h-24"
              />
            ) : (
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={getValuePlaceholder(newValueType)}
                className="mt-1"
                type={newValueType === 'number' ? 'number' : 'text'}
              />
            )}
            {newValue && !isValueValid && (
              <p className="text-xs text-destructive mt-1">
                输入的值与所选类型不匹配
              </p>
            )}
          </div>

          <Button
            onClick={addConfig}
            variant="secondary"
            className="w-full"
            disabled={!newKey.trim() || !newValue.trim() || !isValueValid}
          >
            <Plus className="size-4 mr-2" />
            添加配置
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>确定</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
