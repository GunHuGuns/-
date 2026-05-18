"use client";

import { create } from "zustand";
import type { Module, Config } from "@/lib/types";
import { mockModules, mockConfigs } from "@/lib/data/mock-data";

interface StoreState {
  // 模块数据
  modules: Module[];
  addModule: (module: Omit<Module, "id" | "createdAt" | "updatedAt">) => void;
  updateModule: (id: string, data: Partial<Module>) => void;
  toggleModuleStatus: (id: string) => void;
  deleteModule: (id: string) => void;

  // 配置数据
  configs: Config[];
  addConfig: (config: Omit<Config, "id" | "createdAt" | "updatedAt">) => void;
  updateConfig: (id: string, data: Partial<Config>) => void;
  deleteConfig: (id: string) => void;
}

// 生成唯一ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useStore = create<StoreState>((set) => ({
  // 初始化模块数据
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

  // 初始化配置数据
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
