"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/common/multi-select";
import {
  CATEGORIES,
  getBrandsByCategory,
  getModelsByBrand,
  COUNTRIES,
} from "@/lib/data/constants";
import { useModuleStore } from "@/lib/store";
import type { Module, ModuleFormData } from "@/lib/types";
import { toast } from "sonner";

interface ModuleFormProps {
  module?: Module;
  onSuccess?: () => void;
}

export function ModuleForm({ module, onSuccess }: ModuleFormProps) {
  const router = useRouter();
  const { addModule, updateModule } = useModuleStore();

  const [formData, setFormData] = useState<ModuleFormData>({
    name: module?.name || "",
    packageName: module?.packageName || "",
    category: module?.category || "",
    brand: module?.brand || "",
    model: module?.model || "",
    countries: module?.countries || [],
  });

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof ModuleFormData, string>>>({});

  // 当品类变化时，更新可选品牌
  useEffect(() => {
    if (formData.category) {
      setAvailableBrands(getBrandsByCategory(formData.category));
      // 如果当前品牌不在新的品牌列表中，清空品牌和型号
      if (!getBrandsByCategory(formData.category).includes(formData.brand)) {
        setFormData((prev) => ({ ...prev, brand: "", model: "" }));
        setAvailableModels([]);
      }
    } else {
      setAvailableBrands([]);
      setAvailableModels([]);
    }
  }, [formData.category, formData.brand]);

  // 当品牌变化时，更新可选型号
  useEffect(() => {
    if (formData.brand) {
      setAvailableModels(getModelsByBrand(formData.brand));
      // 如果当前型号不在新的型号列表中，清空型号
      if (!getModelsByBrand(formData.brand).includes(formData.model)) {
        setFormData((prev) => ({ ...prev, model: "" }));
      }
    } else {
      setAvailableModels([]);
    }
  }, [formData.brand, formData.model]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ModuleFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "请输入模块名称";
    }

    if (!formData.packageName.trim()) {
      newErrors.packageName = "请输入包名";
    } else if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(formData.packageName)) {
      newErrors.packageName = "包名格式不正确，例如：com.example.module";
    }

    if (!formData.category) {
      newErrors.category = "请选择品类";
    }

    if (!formData.brand) {
      newErrors.brand = "请选择品牌";
    }

    if (!formData.model) {
      newErrors.model = "请选择型号";
    }

    if (formData.countries.length === 0) {
      newErrors.countries = "请选择覆盖国家";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (module) {
      updateModule(module.id, formData);
      toast.success("模块更新成功");
    } else {
      addModule({
        ...formData,
        status: "offline",
      });
      toast.success("模块创建成功");
    }

    onSuccess?.();
    router.push("/modules");
  };

  const handleCancel = () => {
    router.push("/modules");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* 名称 */}
        <div className="space-y-2">
          <Label htmlFor="name">
            名称 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="请输入模块名称"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* 包名 */}
        <div className="space-y-2">
          <Label htmlFor="packageName">
            包名 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="packageName"
            placeholder="例如：com.os.settings"
            value={formData.packageName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, packageName: e.target.value }))
            }
          />
          {errors.packageName && (
            <p className="text-sm text-destructive">{errors.packageName}</p>
          )}
        </div>

        {/* 所属品类 */}
        <div className="space-y-2">
          <Label htmlFor="category">
            所属品类 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择品类" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>

        {/* 所属品牌 */}
        <div className="space-y-2">
          <Label htmlFor="brand">
            所属品牌 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.brand}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, brand: value }))
            }
            disabled={!formData.category}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={formData.category ? "请选择品牌" : "请先选择品类"}
              />
            </SelectTrigger>
            <SelectContent>
              {availableBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.brand && (
            <p className="text-sm text-destructive">{errors.brand}</p>
          )}
        </div>

        {/* 所属型号 */}
        <div className="space-y-2">
          <Label htmlFor="model">
            所属型号 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.model}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, model: value }))
            }
            disabled={!formData.brand}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={formData.brand ? "请选择型号" : "请先选择品牌"}
              />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && (
            <p className="text-sm text-destructive">{errors.model}</p>
          )}
        </div>

        {/* 覆盖国家 */}
        <div className="space-y-2">
          <Label>
            覆盖国家 <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={[...COUNTRIES]}
            selected={formData.countries}
            onChange={(countries) =>
              setFormData((prev) => ({ ...prev, countries }))
            }
            placeholder="选择覆盖国家"
          />
          {errors.countries && (
            <p className="text-sm text-destructive">{errors.countries}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleCancel}>
          取消
        </Button>
        <Button type="submit">{module ? "保存修改" : "创建模块"}</Button>
      </div>
    </form>
  );
}
