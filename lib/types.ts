// 模块状态
export type ModuleStatus = "online" | "offline";

// 配置状态（无草稿状态）
export type ConfigStatus = "published" | "scheduled";

// 生效范围类型
export type ScopeType = "unified" | "targeted";

// 名单类型
export type ListType = "blacklist" | "whitelist";

// Value类型
export type ValueType =
  | "number"
  | "string"
  | "json-object"
  | "string-array"
  | "number-array"
  | "json-array"
  | "custom"
  | "attachment"
  | "multilang";

// 多语言配置项
export interface MultiLangItem {
  language: string;
  text: string;
}

// Activity配置项
export interface ActivityConfigItem {
  key: string;
  valueType: ValueType;
  value: string;
  attachmentName?: string; // 附件文件名
  multiLangValues?: MultiLangItem[]; // 多语言值
}

// 模块
export interface Module {
  id: string;
  name: string;
  packageName: string;
  category: string;
  brand: string;
  model: string;
  countries: string[];
  status: ModuleStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 配置
export interface Config {
  id: string;
  name: string;
  moduleId: string;
  activityConfigs: ActivityConfigItem[];
  effectiveScope: {
    type: ScopeType;
    categories?: string[];
    brands?: string[];
    models?: string[];
    countries?: string[];
    devices?: string[];
    listType?: ListType;
  };
  scheduleDate?: string;
  scheduleTime?: string;
  status: ConfigStatus;
  createdAt: Date;
  updatedAt?: Date;
}

// 模块查询参数
export interface ModuleSearchParams {
  name?: string;
  dateRange?: [Date | null, Date | null];
  categories?: string[];
  brands?: string[];
  models?: string[];
  countries?: string[];
}

// 新增模块表单数据
export interface ModuleFormData {
  name: string;
  packageName: string;
  category: string;
  brand: string;
  model: string;
  countries: string[];
}

// 新建配置表单数据
export interface ConfigFormData {
  name: string;
  moduleId: string;
  activityConfigs: ActivityConfigItem[];
  effectiveScope: {
    type: ScopeType;
    categories?: string[];
    brands?: string[];
    models?: string[];
    countries?: string[];
    devices?: string[];
    listType?: ListType;
  };
  scheduleDate?: string;
  scheduleTime?: string;
}
