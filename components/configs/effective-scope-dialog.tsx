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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { CATEGORIES, getAllBrands, getAllModels, COUNTRIES } from '@/lib/data/constants';

export interface EffectiveScope {
  type: 'unified' | 'targeted';
  categories?: string[];
  brands?: string[];
  models?: string[];
  countries?: string[];
  devices?: string[]; // CSV内容
  blacklist?: string[]; // 黑名单OR白名单
}

interface EffectiveScopeDialogProps {
  value?: EffectiveScope;
  onChange: (value: EffectiveScope) => void;
  trigger?: React.ReactNode;
}

export function EffectiveScopeDialog({
  value,
  onChange,
  trigger,
}: EffectiveScopeDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'unified' | 'targeted'>(
    value?.type || 'unified'
  );
  const [searchText, setSearchText] = useState('');

  // 统一生效状态
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    value?.categories || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    value?.brands || []
  );
  const [selectedModels, setSelectedModels] = useState<string[]>(
    value?.models || []
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    value?.countries || []
  );

  const allBrands = getAllBrands();
  const allModels = getAllModels();

  // 定向生效状态
  const [deviceText, setDeviceText] = useState(value?.devices?.join('\n') || '');
  const [blacklistText, setBlacklistText] = useState(
    value?.blacklist?.join('\n') || ''
  );

  const filteredCategories = CATEGORIES.filter((c) =>
    c.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredBrands = allBrands.filter((b) =>
    b.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredModels = allModels.filter((m) =>
    m.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSave = () => {
    if (activeTab === 'unified') {
      onChange({
        type: 'unified',
        categories: selectedCategories,
        brands: selectedBrands,
        models: selectedModels,
        countries: selectedCountries,
      });
    } else {
      onChange({
        type: 'targeted',
        devices: deviceText.split('\n').filter((d) => d.trim()),
        blacklist: blacklistText.split('\n').filter((b) => b.trim()),
      });
    }
    setOpen(false);
  };

  const toggleItem = (
    item: string,
    selected: string[],
    setSelected: (items: string[]) => void
  ) => {
    setSelected(
      selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item]
    );
  };

  const selectAll = (
    items: string[],
    selected: string[],
    setSelected: (items: string[]) => void
  ) => {
    if (selected.length === items.length) {
      setSelected([]);
    } else {
      setSelected(items);
    }
  };

  const reverseSelection = (
    items: string[],
    selected: string[],
    setSelected: (items: string[]) => void
  ) => {
    const newSelected = items.filter((i) => !selected.includes(i));
    setSelected(newSelected);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">设置生效范围</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>设置生效范围</DialogTitle>
          <DialogDescription>
            选择配置生效的范围和方式
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'unified' | 'targeted')}
          className="flex-1 flex flex-col"
        >
          <TabsList>
            <TabsTrigger value="unified">统一生效</TabsTrigger>
            <TabsTrigger value="targeted">定向生效</TabsTrigger>
          </TabsList>

          <TabsContent value="unified" className="flex-1 flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="搜索品类、品牌、型号、国家..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1"
              />
              {searchText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchText('')}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-auto grid grid-cols-2 gap-4">
              {/* 品类 */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">品类</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        selectAll(
                          filteredCategories,
                          selectedCategories,
                          setSelectedCategories
                        )
                      }
                    >
                      {selectedCategories.length === CATEGORIES.length
                        ? '全不选'
                        : '全选'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        reverseSelection(
                          filteredCategories,
                          selectedCategories,
                          setSelectedCategories
                        )
                      }
                    >
                      反选
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {filteredCategories.map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() =>
                            toggleItem(
                              cat,
                              selectedCategories,
                              setSelectedCategories
                            )
                          }
                        />
                        <Label
                          htmlFor={`cat-${cat}`}
                          className="text-sm cursor-pointer"
                        >
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 品牌 */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">品牌</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        selectAll(
                          allBrands,
                          selectedBrands,
                          setSelectedBrands
                        )
                      }
                    >
                      {selectedBrands.length === allBrands.length
                        ? '全不选'
                        : '全选'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        reverseSelection(
                          filteredBrands,
                          selectedBrands,
                          setSelectedBrands
                        )
                      }
                    >
                      反选
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {filteredBrands.map((brand) => (
                      <div key={brand} className="flex items-center gap-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() =>
                            toggleItem(brand, selectedBrands, setSelectedBrands)
                          }
                        />
                        <Label
                          htmlFor={`brand-${brand}`}
                          className="text-sm cursor-pointer"
                        >
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 型号 */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">型号</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        selectAll(
                          allModels,
                          selectedModels,
                          setSelectedModels
                        )
                      }
                    >
                      {selectedModels.length === allModels.length
                        ? '全不选'
                        : '全选'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        reverseSelection(
                          filteredModels,
                          selectedModels,
                          setSelectedModels
                        )
                      }
                    >
                      反选
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {filteredModels.map((model) => (
                      <div key={model} className="flex items-center gap-2">
                        <Checkbox
                          id={`model-${model}`}
                          checked={selectedModels.includes(model)}
                          onCheckedChange={() =>
                            toggleItem(
                              model,
                              selectedModels,
                              setSelectedModels
                            )
                          }
                        />
                        <Label
                          htmlFor={`model-${model}`}
                          className="text-sm cursor-pointer"
                        >
                          {model}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* 国家 */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">国家</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        selectAll(
                          filteredCountries,
                          selectedCountries,
                          setSelectedCountries
                        )
                      }
                    >
                      {selectedCountries.length === COUNTRIES.length
                        ? '全不选'
                        : '全选'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        reverseSelection(
                          filteredCountries,
                          selectedCountries,
                          setSelectedCountries
                        )
                      }
                    >
                      反选
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {filteredCountries.map((country) => (
                      <div key={country} className="flex items-center gap-2">
                        <Checkbox
                          id={`country-${country}`}
                          checked={selectedCountries.includes(country)}
                          onCheckedChange={() =>
                            toggleItem(
                              country,
                              selectedCountries,
                              setSelectedCountries
                            )
                          }
                        />
                        <Label
                          htmlFor={`country-${country}`}
                          className="text-sm cursor-pointer"
                        >
                          {country}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="targeted" className="flex-1 flex flex-col gap-4">
            <div>
              <Label className="text-sm font-semibold">设备信息 (每行一个)</Label>
              <textarea
                value={deviceText}
                onChange={(e) => setDeviceText(e.target.value)}
                placeholder="设备ID或SN&#10;每行一个设备&#10;示例：ABC123&#10;DEF456"
                className="mt-2 w-full h-32 p-3 border rounded-lg font-mono text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                输入需要应用配置的设备，每行一个
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold">
                黑/白名单 (选择黑名单OR白名单)
              </Label>
              <textarea
                value={blacklistText}
                onChange={(e) => setBlacklistText(e.target.value)}
                placeholder="黑名单条目&#10;每行一个&#10;示例：XYZ789&#10;UVW012"
                className="mt-2 w-full h-32 p-3 border rounded-lg font-mono text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                输入黑名单或白名单条目，系统会根据选择应用
              </p>
            </div>
          </TabsContent>
        </Tabs>

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
