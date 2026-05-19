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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

export interface ActivityConfig {
  key: string;
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
  const [newValue, setNewValue] = useState('');

  const addConfig = () => {
    if (newKey.trim() && newValue.trim()) {
      setConfigs([...configs, { key: newKey, value: newValue }]);
      setNewKey('');
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">配置Activity</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>配置Activity</DialogTitle>
          <DialogDescription>
            填写Activity及其对应的Value
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-auto">
          {configs.map((config, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg bg-muted/30 flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="font-mono text-sm">
                  <span className="font-semibold">{config.key}</span>
                  <span className="text-muted-foreground mx-2">=</span>
                  <span>{config.value}</span>
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
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t">
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
            <Label className="text-sm">Value值</Label>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="例如：value123"
              className="mt-1"
            />
          </div>
          <Button
            onClick={addConfig}
            variant="secondary"
            className="w-full"
            disabled={!newKey.trim() || !newValue.trim()}
          >
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
