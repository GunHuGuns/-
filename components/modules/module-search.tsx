"use client";

import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MultiSelect } from "@/components/common/multi-select";
import { CATEGORIES, getAllBrands, getAllModels, COUNTRIES } from "@/lib/data/constants";
import type { ModuleSearchParams } from "@/lib/types";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleSearchProps {
  onSearch: (params: ModuleSearchParams) => void;
}

export function ModuleSearch({ onSearch }: ModuleSearchProps) {
  const [name, setName] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch({
      name: name || undefined,
      dateRange: dateRange[0] || dateRange[1] ? dateRange : undefined,
      categories: categories.length > 0 ? categories : undefined,
      brands: brands.length > 0 ? brands : undefined,
      models: models.length > 0 ? models : undefined,
      countries: countries.length > 0 ? countries : undefined,
    });
  };

  const handleReset = () => {
    setName("");
    setDateRange([null, null]);
    setCategories([]);
    setBrands([]);
    setModels([]);
    setCountries([]);
    onSearch({});
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 模块名称 */}
        <div className="space-y-2">
          <Label htmlFor="name">模块名称</Label>
          <Input
            id="name"
            placeholder="输入模块名称搜索"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 新建时间 */}
        <div className="space-y-2">
          <Label>新建时间</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange[0] && !dateRange[1] && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {dateRange[0] ? (
                  dateRange[1] ? (
                    <>
                      {format(dateRange[0], "yyyy-MM-dd", { locale: zhCN })} -{" "}
                      {format(dateRange[1], "yyyy-MM-dd", { locale: zhCN })}
                    </>
                  ) : (
                    format(dateRange[0], "yyyy-MM-dd", { locale: zhCN })
                  )
                ) : (
                  "选择日期范围"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange[0] || undefined,
                  to: dateRange[1] || undefined,
                }}
                onSelect={(range) => {
                  setDateRange([range?.from || null, range?.to || null]);
                }}
                numberOfMonths={2}
                locale={zhCN}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 覆盖品类 */}
        <div className="space-y-2">
          <Label>覆盖品类</Label>
          <MultiSelect
            options={[...CATEGORIES]}
            selected={categories}
            onChange={setCategories}
            placeholder="选择品类"
          />
        </div>

        {/* 覆盖品牌 */}
        <div className="space-y-2">
          <Label>覆盖品牌</Label>
          <MultiSelect
            options={getAllBrands()}
            selected={brands}
            onChange={setBrands}
            placeholder="选择品牌"
          />
        </div>

        {/* 覆盖型号 */}
        <div className="space-y-2">
          <Label>覆盖型号</Label>
          <MultiSelect
            options={getAllModels()}
            selected={models}
            onChange={setModels}
            placeholder="选择型号"
          />
        </div>

        {/* 覆盖国家 */}
        <div className="space-y-2">
          <Label>覆盖国家</Label>
          <MultiSelect
            options={[...COUNTRIES]}
            selected={countries}
            onChange={setCountries}
            placeholder="选择国家"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 size-4" />
          重置
        </Button>
        <Button onClick={handleSearch}>
          <Search className="mr-2 size-4" />
          查询
        </Button>
      </div>
    </div>
  );
}
