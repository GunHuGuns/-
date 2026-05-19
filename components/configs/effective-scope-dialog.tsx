'use client';

import { useState, useRef } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Upload, FileSpreadsheet, Check } from 'lucide-react';
import {
  CATEGORIES,
  COUNTRIES,
  getBrandsByCategory,
  getModelsByBrand,
} from '@/lib/data/constants';
import type { ListType } from '@/lib/types';

export interface EffectiveScope {
  type: 'unified' | 'targeted';
  categories?: string[];
  brands?: string[];
  models?: string[];
  countries?: string[];
  devices?: string[];
  listType?: ListType;
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
  const [scopeType, setScopeType] = useState<'unified' | 'targeted'>(
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

  // 定向生效状态
  const [listType, setListType] = useState<ListType>(
    value?.listType || 'whitelist'
  );
  const [devices, setDevices] = useState<string[]>(value?.devices || []);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 级联选择：根据选中的品类获取可用品牌
  const availableBrands =
    selectedCategories.length > 0
      ? Array.from(
          new Set(selectedCategories.flatMap((cat) => getBrandsByCategory(cat)))
        ).sort()
      : [];

  // 级联选择：根据选中的品牌获取可用型号
  const availableModels =
    selectedBrands.length > 0
      ? Array.from(
          new Set(selectedBrands.flatMap((brand) => getModelsByBrand(brand)))
        ).sort()
      : [];

  // 过滤后的选项
  const filteredCategories = CATEGORIES.filter((c) =>
    c.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredBrands = availableBrands.filter((b) =>
    b.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredModels = availableModels.filter((m) =>
    m.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(searchText.toLowerCase())
  );

  // 品类改变时清除无效的品牌和型号
  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);

    // 清除不适用的品牌
    const validBrands = Array.from(
      new Set(newCategories.flatMap((cat) => getBrandsByCategory(cat)))
    );
    const newBrands = selectedBrands.filter((b) => validBrands.includes(b));
    setSelectedBrands(newBrands);

    // 清除不适用的型号
    const validModels = Array.from(
      new Set(newBrands.flatMap((brand) => getModelsByBrand(brand)))
    );
    setSelectedModels(selectedModels.filter((m) => validModels.includes(m)));
  };

  // 品牌改变时清除无效的型号
  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(newBrands);

    // 清除不适用的型号
    const validModels = Array.from(
      new Set(newBrands.flatMap((b) => getModelsByBrand(b)))
    );
    setSelectedModels(selectedModels.filter((m) => validModels.includes(m)));
  };

  const handleModelChange = (model: string) => {
    setSelectedModels(
      selectedModels.includes(model)
        ? selectedModels.filter((m) => m !== model)
        : [...selectedModels, model]
    );
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountries(
      selectedCountries.includes(country)
        ? selectedCountries.filter((c) => c !== country)
        : [...selectedCountries, country]
    );
  };

  // Excel文件上传处理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      // 模拟解析Excel内容
      const reader = new FileReader();
      reader.onload = () => {
        // 这里模拟解析结果，实际应使用xlsx库解析
        const mockDevices = [
          'DEVICE001',
          'DEVICE002',
          'DEVICE003',
          'SN123456',
          'SN789012',
        ];
        setDevices(mockDevices);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    if (scopeType === 'unified') {
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
        devices,
        listType,
      });
    }
    setOpen(false);
  };

  const selectAllCategories = () => {
    if (selectedCategories.length === CATEGORIES.length) {
      setSelectedCategories([]);
      setSelectedBrands([]);
      setSelectedModels([]);
    } else {
      setSelectedCategories([...CATEGORIES]);
    }
  };

  const selectAllBrands = () => {
    if (selectedBrands.length === availableBrands.length) {
      setSelectedBrands([]);
      setSelectedModels([]);
    } else {
      setSelectedBrands([...availableBrands]);
    }
  };

  const selectAllModels = () => {
    if (selectedModels.length === availableModels.length) {
      setSelectedModels([]);
    } else {
      setSelectedModels([...availableModels]);
    }
  };

  const selectAllCountries = () => {
    if (selectedCountries.length === COUNTRIES.length) {
      setSelectedCountries([]);
    } else {
      setSelectedCountries([...COUNTRIES]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">设置生效范围</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>设置生效范围</DialogTitle>
          <DialogDescription>
            选择配置生效的范围和方式
          </DialogDescription>
        </DialogHeader>

        {/* 生效类型选择 - 互斥单选 */}
        <div className="border rounded-lg p-4">
          <Label className="text-sm font-semibold mb-3 block">生效类型</Label>
          <RadioGroup
            value={scopeType}
            onValueChange={(v) => setScopeType(v as 'unified' | 'targeted')}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="unified" id="scope-unified" />
              <Label htmlFor="scope-unified" className="cursor-pointer">
                统一生效
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="targeted" id="scope-targeted" />
              <Label htmlFor="scope-targeted" className="cursor-pointer">
                定向生效
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 统一生效内容 */}
        {scopeType === 'unified' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
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
                  <Button variant="ghost" size="xs" onClick={selectAllCategories}>
                    {selectedCategories.length === CATEGORIES.length
                      ? '全不选'
                      : '全选'}
                  </Button>
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {filteredCategories.map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox
                          id={`cat-${cat}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => handleCategoryChange(cat)}
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

              {/* 品牌 - 级联依赖品类 */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm">品牌</h4>
                    {selectedCategories.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        请先选择品类
                      </span>
                    )}
                  </div>
                  {selectedCategories.length > 0 && (
                    <Button variant="ghost" size="xs" onClick={selectAllBrands}>
                      {selectedBrands.length === availableBrands.length
                        ? '全不选'
                        : '全选'}
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {selectedCategories.length === 0 ? (
                      <div className="text-xs text-muted-foreground p-2">
                        请先选择品类以查看可用品牌
                      </div>
                    ) : filteredBrands.length === 0 ? (
                      <div className="text-xs text-muted-foreground p-2">
                        无匹配的品牌
                      </div>
                    ) : (
                      filteredBrands.map((brand) => (
                        <div key={brand} className="flex items-center gap-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandChange(brand)}
                          />
                          <Label
                            htmlFor={`brand-${brand}`}
                            className="text-sm cursor-pointer"
                          >
                            {brand}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* 型号 - 级联依赖品牌 */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-sm">型号</h4>
                    {selectedBrands.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        请先选择品牌
                      </span>
                    )}
                  </div>
                  {selectedBrands.length > 0 && (
                    <Button variant="ghost" size="xs" onClick={selectAllModels}>
                      {selectedModels.length === availableModels.length
                        ? '全不选'
                        : '全选'}
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {selectedBrands.length === 0 ? (
                      <div className="text-xs text-muted-foreground p-2">
                        请先选择品牌以查看可用型号
                      </div>
                    ) : filteredModels.length === 0 ? (
                      <div className="text-xs text-muted-foreground p-2">
                        无匹配的型号
                      </div>
                    ) : (
                      filteredModels.map((model) => (
                        <div key={model} className="flex items-center gap-2">
                          <Checkbox
                            id={`model-${model}`}
                            checked={selectedModels.includes(model)}
                            onCheckedChange={() => handleModelChange(model)}
                          />
                          <Label
                            htmlFor={`model-${model}`}
                            className="text-sm cursor-pointer"
                          >
                            {model}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* 国家 */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">国家</h4>
                  <Button variant="ghost" size="xs" onClick={selectAllCountries}>
                    {selectedCountries.length === COUNTRIES.length
                      ? '全不选'
                      : '全选'}
                  </Button>
                </div>
                <ScrollArea className="h-32">
                  <div className="flex flex-col gap-2 pr-4">
                    {filteredCountries.map((country) => (
                      <div key={country} className="flex items-center gap-2">
                        <Checkbox
                          id={`country-${country}`}
                          checked={selectedCountries.includes(country)}
                          onCheckedChange={() => handleCountryChange(country)}
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
          </div>
        )}

        {/* 定向生效内容 */}
        {scopeType === 'targeted' && (
          <div className="flex-1 flex flex-col gap-4">
            {/* 黑白名单选择 */}
            <div className="border rounded-lg p-4">
              <Label className="text-sm font-semibold mb-3 block">
                名单类型
              </Label>
              <RadioGroup
                value={listType}
                onValueChange={(v) => setListType(v as ListType)}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="whitelist" id="list-whitelist" />
                  <Label htmlFor="list-whitelist" className="cursor-pointer">
                    白名单
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="blacklist" id="list-blacklist" />
                  <Label htmlFor="list-blacklist" className="cursor-pointer">
                    黑名单
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-2">
                {listType === 'whitelist'
                  ? '仅允许列表中的设备应用此配置'
                  : '排除列表中的设备，其他设备均可应用此配置'}
              </p>
            </div>

            {/* Excel上传 */}
            <div className="border rounded-lg p-4">
              <Label className="text-sm font-semibold mb-3 block">
                上传设备列表
              </Label>
              <div className="flex flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full justify-center gap-2"
                >
                  <Upload className="size-4" />
                  选择Excel文件
                </Button>

                {uploadedFileName && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileSpreadsheet className="size-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{uploadedFileName}</p>
                      <p className="text-xs text-muted-foreground">
                        已解析 {devices.length} 个设备
                      </p>
                    </div>
                    <Check className="size-4 text-green-600" />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  支持 .xlsx, .xls, .csv 格式，请确保第一列为设备ID或SN号
                </p>
              </div>
            </div>

            {/* 设备列表预览 */}
            {devices.length > 0 && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">
                    设备列表预览
                  </Label>
                  <Badge variant="secondary">{devices.length} 个设备</Badge>
                </div>
                <ScrollArea className="h-24">
                  <div className="flex flex-wrap gap-1.5">
                    {devices.map((device, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="font-mono text-xs"
                      >
                        {device}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

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
