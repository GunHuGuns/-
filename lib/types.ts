// 模块状态
export type ModuleStatus = "online" | "offline";

// 配置状态
export type ConfigStatus = "draft" | "published" | "scheduled";

// 生效范围类型
export type ScopeType = "unified" | "targeted";

// 名单类型
export type ListType = "blacklist" | "whitelist";

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
  activityName: string;
  activityValue: Record<string, unknown>;
  scopeType: ScopeType;
  // 统一生效
  categories?: string[];
  brands?: string[];
  models?: string[];
  countries?: string[];
  // 定向生效
  deviceList?: string[];
  listType?: ListType;
  // 定时发布
  isScheduled: boolean;
  scheduledTime?: Date;
  status: ConfigStatus;
  createdAt: Date;
  updatedAt: Date;
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
  activityName: string;
  activityValue: Record<string, unknown>;
  scopeType: ScopeType;
  categories?: string[];
  brands?: string[];
  models?: string[];
  countries?: string[];
  deviceList?: string[];
  listType?: ListType;
  isScheduled: boolean;
  scheduledTime?: Date;
}
