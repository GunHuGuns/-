'use client';

import { useState, useRef } from 'react';
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
import { X, Plus, Upload, FileIcon, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ValueType, MultiLangItem } from '@/lib/types';

// Value类型定义
export const VALUE_TYPE_OPTIONS: { value: ValueType; label: string }[] = [
  { value: 'number', label: '单值-数字' },
  { value: 'string', label: '单值-字符串' },
  { value: 'json-object', label: '对象-JSON' },
  { value: 'string-array', label: '数组-字符串' },
  { value: 'number-array', label: '数组-数字' },
  { value: 'json-array', label: '数组-JSON' },
  { value: 'custom', label: '自定义' },
  { value: 'attachment', label: '附件' },
  { value: 'multilang', label: '多语言' },
];

// 支持的语种
const LANGUAGES = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'en-US', label: '英语(美国)' },
  { value: 'en-GB', label: '英语(英国)' },
  { value: 'ja-JP', label: '日语' },
  { value: 'ko-KR', label: '韩语' },
  { value: 'fr-FR', label: '法语' },
  { value: 'de-DE', label: '德语' },
  { value: 'es-ES', label: '西班牙语' },
  { value: 'pt-BR', label: '葡萄牙语(巴西)' },
  { value: 'ru-RU', label: '俄语' },
  { value: 'ar-SA', label: '阿拉伯语' },
  { value: 'th-TH', label: '泰语' },
  { value: 'vi-VN', label: '越南语' },
  { value: 'id-ID', label: '印尼语' },
];

export interface ActivityConfig {
  key: string;
  valueType: ValueType;
  value: string;
  attachmentName?: string;
  multiLangValues?: MultiLangItem[];
}

interface ActivityConfigPanelProps {
  value?: ActivityConfig[];
  onChange: (value: ActivityConfig[]) => void;
}

export function ActivityConfigPanel({
  value = [],
  onChange,
}: ActivityConfigPanelProps) {
  const [newKey, setNewKey] = useState('');
  const [newValueType, setNewValueType] = useState<ValueType>('string');
  const [newValue, setNewValue] = useState('');
  const [newAttachment, setNewAttachment] = useState<File | null>(null);
  const [newMultiLang, setNewMultiLang] = useState<MultiLangItem[]>([
    { language: 'zh-CN', text: '' },
    { language: 'en-US', text: '' },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (type === 'attachment' || type === 'multilang') return true;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAttachment(file);
    }
  };

  const handleMultiLangChange = (index: number, field: 'language' | 'text', val: string) => {
    const updated = [...newMultiLang];
    updated[index] = { ...updated[index], [field]: val };
    setNewMultiLang(updated);
  };

  const addMultiLangRow = () => {
    const usedLanguages = newMultiLang.map((item) => item.language);
    const availableLanguage = LANGUAGES.find((l) => !usedLanguages.includes(l.value));
    if (availableLanguage) {
      setNewMultiLang([...newMultiLang, { language: availableLanguage.value, text: '' }]);
    }
  };

  const removeMultiLangRow = (index: number) => {
    if (newMultiLang.length > 1) {
      setNewMultiLang(newMultiLang.filter((_, i) => i !== index));
    }
  };

  const canAddConfig = () => {
    if (!newKey.trim()) return false;
    
    if (newValueType === 'attachment') {
      return !!newAttachment;
    }
    
    if (newValueType === 'multilang') {
      return newMultiLang.some((item) => item.text.trim());
    }
    
    return newValue.trim() && validateValue(newValueType, newValue);
  };

  const addConfig = () => {
    if (!canAddConfig()) return;

    let configValue = newValue;
    let attachmentName: string | undefined;
    let multiLangValues: MultiLangItem[] | undefined;

    if (newValueType === 'attachment' && newAttachment) {
      configValue = `attachment:${newAttachment.name}`;
      attachmentName = newAttachment.name;
    } else if (newValueType === 'multilang') {
      const validItems = newMultiLang.filter((item) => item.text.trim());
      multiLangValues = validItems;
      configValue = JSON.stringify(validItems);
    }

    onChange([
      ...value,
      {
        key: newKey,
        valueType: newValueType,
        value: configValue,
        attachmentName,
        multiLangValues,
      },
    ]);

    // 重置表单
    setNewKey('');
    setNewValueType('string');
    setNewValue('');
    setNewAttachment(null);
    setNewMultiLang([
      { language: 'zh-CN', text: '' },
      { language: 'en-US', text: '' },
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeConfig = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const getTypeLabel = (type: ValueType) => {
    return VALUE_TYPE_OPTIONS.find((o) => o.value === type)?.label || type;
  };

  const renderValueDisplay = (config: ActivityConfig) => {
    if (config.valueType === 'attachment') {
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FileIcon className="size-3.5" />
          <span>{config.attachmentName || '附件'}</span>
        </div>
      );
    }
    
    if (config.valueType === 'multilang' && config.multiLangValues) {
      return (
        <div className="text-xs text-muted-foreground">
          {config.multiLangValues.slice(0, 2).map((item, i) => (
            <span key={i}>
              {LANGUAGES.find((l) => l.value === item.language)?.label}: {item.text.slice(0, 20)}
              {item.text.length > 20 ? '...' : ''}
              {i < Math.min(config.multiLangValues!.length - 1, 1) ? ' | ' : ''}
            </span>
          ))}
          {config.multiLangValues.length > 2 && ` 等${config.multiLangValues.length}种语言`}
        </div>
      );
    }
    
    return (
      <div className="text-muted-foreground text-xs font-mono truncate" title={config.value}>
        {config.value}
      </div>
    );
  };

  const isValueValid = validateValue(newValueType, newValue);

  return (
    <div className="space-y-4">
      {/* 已添加的配置列表 */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            已配置 {value.length} 个Activity：
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {value.map((config, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg bg-background flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium truncate">
                      {config.key}
                    </span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {getTypeLabel(config.valueType)}
                    </Badge>
                  </div>
                  {renderValueDisplay(config)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeConfig(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 添加新配置表单 */}
      <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
        <div className="text-sm font-medium">添加新的Activity配置</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Activity名称</Label>
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="例如：com.example.MainActivity"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="text-sm">Value类型</Label>
            <Select
              value={newValueType}
              onValueChange={(v) => {
                setNewValueType(v as ValueType);
                setNewValue('');
                setNewAttachment(null);
              }}
            >
              <SelectTrigger className="mt-1.5">
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
        </div>

        {/* Value输入区域 - 根据类型显示不同控件 */}
        <div>
          <Label className="text-sm">Value值</Label>
          
          {newValueType === 'attachment' ? (
            /* 附件上传控件 */
            <div className="mt-1.5">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="attachment-upload"
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="size-4" />
                  选择文件
                </Button>
                {newAttachment && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileIcon className="size-4" />
                    <span>{newAttachment.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewAttachment(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : newValueType === 'multilang' ? (
            /* 多语言表单 */
            <div className="mt-1.5 border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[180px]">语种</TableHead>
                    <TableHead>文案</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newMultiLang.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={item.language}
                          onValueChange={(v) => handleMultiLangChange(index, 'language', v)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem
                                key={lang.value}
                                value={lang.value}
                                disabled={
                                  newMultiLang.some((m, i) => i !== index && m.language === lang.value)
                                }
                              >
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.text}
                          onChange={(e) => handleMultiLangChange(index, 'text', e.target.value)}
                          placeholder="输入文案内容"
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMultiLangRow(index)}
                          disabled={newMultiLang.length <= 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-2 border-t bg-muted/30">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addMultiLangRow}
                  disabled={newMultiLang.length >= LANGUAGES.length}
                  className="gap-1"
                >
                  <Plus className="size-4" />
                  添加语种
                </Button>
              </div>
            </div>
          ) : newValueType === 'json-object' ||
            newValueType === 'json-array' ||
            newValueType === 'string-array' ||
            newValueType === 'number-array' ? (
            /* JSON/数组类型使用Textarea */
            <Textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={getValuePlaceholder(newValueType)}
              className="mt-1.5 font-mono text-sm h-24"
            />
          ) : (
            /* 其他类型使用Input */
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={getValuePlaceholder(newValueType)}
              className="mt-1.5"
              type={newValueType === 'number' ? 'number' : 'text'}
            />
          )}
          
          {newValue && !isValueValid && newValueType !== 'attachment' && newValueType !== 'multilang' && (
            <p className="text-xs text-destructive mt-1">
              输入的值与所选类型不匹配
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={addConfig}
          variant="secondary"
          className="w-full"
          disabled={!canAddConfig()}
        >
          <Plus className="size-4 mr-2" />
          添加配置
        </Button>
      </div>
    </div>
  );
}
