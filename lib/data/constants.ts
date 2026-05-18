// 品类列表
export const CATEGORIES = [
  "手机",
  "平板",
  "电视",
  "穿戴设备",
  "智能家居",
] as const;

// 品牌列表（按品类分组）
export const BRANDS: Record<string, string[]> = {
  手机: ["华为", "小米", "OPPO", "vivo", "荣耀", "苹果", "三星"],
  平板: ["华为", "小米", "联想", "荣耀", "苹果", "三星"],
  电视: ["华为", "小米", "TCL", "海信", "创维", "索尼", "三星"],
  穿戴设备: ["华为", "小米", "OPPO", "vivo", "苹果", "三星"],
  智能家居: ["华为", "小米", "美的", "海尔", "格力"],
};

// 型号列表（按品牌分组）
export const MODELS: Record<string, string[]> = {
  华为: [
    "Mate 60 Pro",
    "Mate 60",
    "P60 Pro",
    "P60",
    "Nova 12",
    "Nova 12 Pro",
    "MatePad Pro 13.2",
    "MatePad 11.5",
    "Watch GT 4",
    "Watch 4 Pro",
  ],
  小米: [
    "14 Pro",
    "14",
    "14 Ultra",
    "Redmi K70 Pro",
    "Redmi K70",
    "Pad 6 Pro",
    "Pad 6",
    "TV ES Pro 86",
    "Watch S3",
  ],
  OPPO: [
    "Find X7 Ultra",
    "Find X7",
    "Reno 11 Pro",
    "Reno 11",
    "Watch 4 Pro",
  ],
  vivo: [
    "X100 Pro",
    "X100",
    "X Fold3 Pro",
    "X Fold3",
    "Watch 3",
  ],
  荣耀: [
    "Magic 6 Pro",
    "Magic 6",
    "100 Pro",
    "100",
    "MagicPad 13",
  ],
  苹果: [
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
    "iPad Pro 12.9",
    "iPad Air",
    "Apple Watch Ultra 2",
  ],
  三星: [
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy Tab S9",
    "Galaxy Watch 6",
  ],
  联想: [
    "小新 Pad Pro 12.7",
    "小新 Pad 2024",
    "拯救者 Y900",
  ],
  TCL: [
    "98Q10H",
    "85C12G",
    "75V8E Pro",
  ],
  海信: [
    "85E8N Pro",
    "75E5N Pro",
    "65E55H",
  ],
  创维: [
    "85A5D Pro",
    "75A5D",
    "65A3D",
  ],
  索尼: [
    "XR-85X95L",
    "XR-75X90L",
    "KD-65X85L",
  ],
  美的: [
    "智能空调 酷省电",
    "智能冰箱 508L",
    "智能洗衣机 10kg",
  ],
  海尔: [
    "卡萨帝空调",
    "卡萨帝冰箱",
    "卡萨帝洗衣机",
  ],
  格力: [
    "云锦II",
    "臻新风",
    "冷静王III",
  ],
};

// 国家列表
export const COUNTRIES = [
  "中国",
  "美国",
  "日本",
  "韩国",
  "德国",
  "法国",
  "英国",
  "印度",
  "巴西",
  "俄罗斯",
  "澳大利亚",
  "加拿大",
  "意大利",
  "西班牙",
  "墨西哥",
  "印度尼西亚",
  "泰国",
  "越南",
  "马来西亚",
  "新加坡",
] as const;

// 获取所有品牌（去重）
export function getAllBrands(): string[] {
  const brandsSet = new Set<string>();
  Object.values(BRANDS).forEach((brands) => {
    brands.forEach((brand) => brandsSet.add(brand));
  });
  return Array.from(brandsSet).sort();
}

// 获取所有型号（去重）
export function getAllModels(): string[] {
  const modelsSet = new Set<string>();
  Object.values(MODELS).forEach((models) => {
    models.forEach((model) => modelsSet.add(model));
  });
  return Array.from(modelsSet).sort();
}

// 根据品类获取品牌
export function getBrandsByCategory(category: string): string[] {
  return BRANDS[category] || [];
}

// 根据品牌获取型号
export function getModelsByBrand(brand: string): string[] {
  return MODELS[brand] || [];
}
