"use client";

import { create } from "zustand";
import type { Module, Config } from "@/lib/types";
import { mockModules, mockConfigs } from "@/lib/data/mock-data";

// 模块 Store
interface ModuleStoreState {
  modules: Module[];
  addModule: (module: Omit<Module, "id" | "createdAt" | "updatedAt">) => void;
  updateModule: (id: string, data: Partial<Module>) => void;
  toggleModuleStatus: (id: string) => void;
  deleteModule: (id: string) => void;
}

// 配置 Store
interface ConfigStoreState {
  configs: Config[];
  addConfig: (config: Omit<Config, "id" | "createdAt" | "updatedAt">) => void;
  updateConfig: (id: string, data: Partial<Config>) => void;
  deleteConfig: (id: string) => void;
}

// 生成唯一ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// 模块 Store
export const useModuleStore = create<ModuleStoreState>((set) => ({
  modules: mockModules,

  addModule: (moduleData) =>
    set((state) => ({
      modules: [
        ...state.modules,
        {
          ...moduleData,
          id: generateId("mod"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateModule: (id, data) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, ...data, updatedAt: new Date() } : m
      ),
    })),

  toggleModuleStatus: (id) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === "online" ? "offline" : "online",
              updatedAt: new Date(),
            }
          : m
      ),
    })),

  deleteModule: (id) =>
    set((state) => ({
      modules: state.modules.filter((m) => m.id !== id),
    })),
}));

// 配置 Store
export const useConfigStore = create<ConfigStoreState>((set) => ({
  configs: mockConfigs,

  addConfig: (configData) =>
    set((state) => ({
      configs: [
        ...state.configs,
        {
          ...configData,
          id: generateId("cfg"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateConfig: (id, data) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date() } : c
      ),
    })),

  deleteConfig: (id) =>
    set((state) => ({
      configs: state.configs.filter((c) => c.id !== id),
    })),
}));
