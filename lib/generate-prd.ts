'use client';

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';

// 截图数据 - Base64编码的图片会在运行时加载
interface ScreenshotData {
  name: string;
  path: string;
  description: string;
}

const screenshots: ScreenshotData[] = [
  { name: '模块列表', path: '/screenshots/module-list.png', description: '模块管理列表页面' },
  { name: '新增模块', path: '/screenshots/module-new.png', description: '新增模块表单页面' },
  { name: '配置列表', path: '/screenshots/config-list.png', description: '配置管理列表页面' },
  { name: '新建配置', path: '/screenshots/config-new-form.png', description: '新建配置表单页面' },
  { name: 'Activity配置', path: '/screenshots/activity-config-dialog.png', description: 'Activity配置对话框' },
  { name: 'Value类型', path: '/screenshots/value-type-dropdown.png', description: 'Value类型下拉选项' },
];

// 加载图片为ArrayBuffer
async function loadImageAsArrayBuffer(path: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

// 创建表格边框样式
const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
};

// 生成PRD Word文档
export async function generatePRDDocument(): Promise<void> {
  // 预加载所有图片
  const imageBuffers: Map<string, ArrayBuffer> = new Map();
  for (const screenshot of screenshots) {
    const buffer = await loadImageAsArrayBuffer(screenshot.path);
    if (buffer) {
      imageBuffers.set(screenshot.name, buffer);
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // 标题
          new Paragraph({
            children: [
              new TextRun({
                text: 'OS配置中心',
                bold: true,
                size: 56,
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '产品需求文档 (PRD)',
                size: 32,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ children: [] }),

          // 文档信息表格
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('版本')], borders: tableBorders, width: { size: 25, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph('1.0')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('日期')], borders: tableBorders, width: { size: 25, type: WidthType.PERCENTAGE } }),
                  new TableCell({ children: [new Paragraph(new Date().toLocaleDateString('zh-CN'))], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('作者')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('产品团队')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('状态')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('草稿')], borders: tableBorders }),
                ],
              }),
            ],
          }),
          new Paragraph({ children: [] }),
          new Paragraph({ children: [] }),

          // 1. 产品概述
          new Paragraph({
            children: [new TextRun({ text: '1. 产品概述', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '1.1 产品背景', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun('OS配置中心是一个用于管理操作系统级别配置的后台管理系统。系统支持对不同品类、品牌、型号的设备进行差异化配置管理，实现配置的统一下发和精准推送。'),
            ],
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '1.2 产品目标', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [new TextRun('• 提供统一的配置管理平台')] }),
          new Paragraph({ children: [new TextRun('• 支持多维度的设备筛选和配置下发')] }),
          new Paragraph({ children: [new TextRun('• 实现配置的版本管理和定时发布')] }),
          new Paragraph({ children: [new TextRun('• 支持黑白名单的精准配置推送')] }),
          new Paragraph({ children: [] }),

          // 2. 系统架构
          new Paragraph({
            children: [new TextRun({ text: '2. 系统架构', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [new TextRun('系统包含两个核心模块：')],
          }),
          new Paragraph({ children: [new TextRun('1. 模块管理 - 管理系统中的功能模块，定义模块的基本信息和覆盖范围')] }),
          new Paragraph({ children: [new TextRun('2. 配置管理 - 管理具体的配置项，支持关联模块和设置生效范围')] }),
          new Paragraph({ children: [] }),
          new Paragraph({ children: [] }),

          // 3. 模块管理
          new Paragraph({
            children: [new TextRun({ text: '3. 模块管理', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '3.1 模块列表', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),
          new Paragraph({
            children: [new TextRun({ text: '功能说明：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('展示系统中所有已创建的模块，支持查询、筛选、编辑和上下架操作。')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '查询条件：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 模块名称 - 支持模糊搜索')] }),
          new Paragraph({ children: [new TextRun('• 新建时间 - 支持日期范围筛选')] }),
          new Paragraph({ children: [new TextRun('• 覆盖品类 - 下拉多选')] }),
          new Paragraph({ children: [new TextRun('• 覆盖品牌 - 下拉多选（依赖品类选择）')] }),
          new Paragraph({ children: [new TextRun('• 覆盖型号 - 下拉多选（依赖品牌选择）')] }),
          new Paragraph({ children: [new TextRun('• 覆盖国家 - 下拉多选')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '列表字段：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 模块名称、包名、创建时间、品类、品牌、型号、国家、状态、操作')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '操作按钮：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 编辑 - 修改模块信息')] }),
          new Paragraph({ children: [new TextRun('• 上架/下架 - 切换模块状态（状态互斥）')] }),
          new Paragraph({ children: [] }),

          // 插入模块列表截图
          ...(imageBuffers.has('模块列表')
            ? [
                new Paragraph({
                  children: [new TextRun({ text: '【模块列表截图】', italics: true, color: '666666' })],
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffers.get('模块列表')!,
                      transformation: { width: 600, height: 350 },
                      type: 'png',
                    }),
                  ],
                }),
                new Paragraph({ children: [] }),
              ]
            : []),

          new Paragraph({
            children: [new TextRun({ text: '3.2 新增模块', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '表单字段：', bold: true })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '字段名', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '类型', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '必填', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '说明', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('模块名称')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('文本输入')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('是')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('模块的显示名称')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('包名')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('文本输入')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('是')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('模块的唯一标识，如 com.os.settings')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('所属品类')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('下拉多选')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('是')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('选择模块适用的设备品类')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('所属品牌')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('下拉多选')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('是')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('级联依赖品类，选择后显示对应品牌')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('所属型号')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('下拉多选')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('是')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('级联依赖品牌，选择后显示对应型号')], borders: tableBorders }),
                ],
              }),
            ],
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '业务规则：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 品类、品牌、型号为级联关系，必须先选择上级才能选择下级')] }),
          new Paragraph({ children: [new TextRun('• 当上级选项变更时，自动清除不适用的下级选项')] }),
          new Paragraph({ children: [new TextRun('• 包名在系统中必须唯一')] }),
          new Paragraph({ children: [] }),

          // 插入新增模块截图
          ...(imageBuffers.has('新增模块')
            ? [
                new Paragraph({
                  children: [new TextRun({ text: '【新增模块截图】', italics: true, color: '666666' })],
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffers.get('新增模块')!,
                      transformation: { width: 600, height: 400 },
                      type: 'png',
                    }),
                  ],
                }),
                new Paragraph({ children: [] }),
              ]
            : []),

          // 4. 配置管理
          new Paragraph({
            children: [new TextRun({ text: '4. 配置管理', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '4.1 配置列表', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '功能说明：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('展示所有配置项，支持查看、编辑、删除操作。')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '列表字段：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 配置名称、关联模块、生效范围、状态、创建时间、操作')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '状态说明：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 草稿 - 新创建未发布的配置')] }),
          new Paragraph({ children: [new TextRun('• 已发布 - 已生效的配置')] }),
          new Paragraph({ children: [new TextRun('• 定时发布 - 设置了定时发布时间的配置')] }),
          new Paragraph({ children: [] }),

          // 插入配置列表截图
          ...(imageBuffers.has('配置列表')
            ? [
                new Paragraph({
                  children: [new TextRun({ text: '【配置列表截图】', italics: true, color: '666666' })],
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffers.get('配置列表')!,
                      transformation: { width: 600, height: 300 },
                      type: 'png',
                    }),
                  ],
                }),
                new Paragraph({ children: [] }),
              ]
            : []),

          new Paragraph({
            children: [new TextRun({ text: '4.2 新建配置', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '基础信息：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 配置名称 - 必填，配置的显示名称')] }),
          new Paragraph({ children: [new TextRun('• 选择模块 - 必填，关联的模块')] }),
          new Paragraph({ children: [] }),

          // 插入新建配置截图
          ...(imageBuffers.has('新建配置')
            ? [
                new Paragraph({
                  children: [new TextRun({ text: '【新建配置截图】', italics: true, color: '666666' })],
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffers.get('新建配置')!,
                      transformation: { width: 600, height: 400 },
                      type: 'png',
                    }),
                  ],
                }),
                new Paragraph({ children: [] }),
              ]
            : []),

          new Paragraph({
            children: [new TextRun({ text: '4.3 Activity配置', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '功能说明：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('配置Activity及其对应的Value值，支持多种数据类型。')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '配置字段：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• Activity名称 - Activity的完整类名')] }),
          new Paragraph({ children: [new TextRun('• Value类型 - 值的数据类型')] }),
          new Paragraph({ children: [new TextRun('• Value值 - 具体的配置值')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: 'Value类型选项：', bold: true })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '类型', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '说明', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '示例', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('单值-数字')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('单个数字值')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('100')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('单值-字符串')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('单个字符串值')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('dark')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('对象-JSON')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('JSON对象格式')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('{"enabled": true}')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('数组-字符串')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('字符串数组')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('["a", "b", "c"]')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('数组-数字')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('数字数组')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('[1, 2, 3]')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('数组-JSON')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('JSON对象数组')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('[{"id": 1}, {"id": 2}]')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('自定义')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('自由格式输入')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('任意格式')], borders: tableBorders }),
                ],
              }),
            ],
          }),
          new Paragraph({ children: [] }),

          // 插入Activity配置截图
          ...(imageBuffers.has('Activity配置')
            ? [
                new Paragraph({
                  children: [new TextRun({ text: '【Activity配置对话框截图】', italics: true, color: '666666' })],
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffers.get('Activity配置')!,
                      transformation: { width: 500, height: 350 },
                      type: 'png',
                    }),
                  ],
                }),
                new Paragraph({ children: [] }),
              ]
            : []),

          // 插入Value类型截图
          ...(imageBuffers.has('Value类型')
            ? [
                new Paragraph({
                  children: [new TextRun({ text: '【Value类型下拉选项截图】', italics: true, color: '666666' })],
                }),
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageBuffers.get('Value类型')!,
                      transformation: { width: 500, height: 400 },
                      type: 'png',
                    }),
                  ],
                }),
                new Paragraph({ children: [] }),
              ]
            : []),

          new Paragraph({
            children: [new TextRun({ text: '4.4 生效范围', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '功能说明：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('设置配置的生效范围，支持统一生效和定向生效两种模式，两种模式互斥。')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '统一生效：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('按设备维度批量生效，支持以下筛选条件：')] }),
          new Paragraph({ children: [new TextRun('• 品类 - 多选，支持搜索、全选、反选')] }),
          new Paragraph({ children: [new TextRun('• 品牌 - 多选，级联依赖品类（需先选择品类）')] }),
          new Paragraph({ children: [new TextRun('• 型号 - 多选，级联依赖品牌（需先选择品牌）')] }),
          new Paragraph({ children: [new TextRun('• 国家 - 多选，支持搜索、全选、反选')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '级联规则：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 品类→品牌→型号 为从高到低的级联关系')] }),
          new Paragraph({ children: [new TextRun('• 必须先选择上级选项才能选择下级选项')] }),
          new Paragraph({ children: [new TextRun('• 当上级选项变更时，自动清除不适用的下级选项')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '定向生效：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('按设备列表精准生效，配置步骤：')] }),
          new Paragraph({ children: [new TextRun('1. 选择名单类型（黑名单/白名单）')] }),
          new Paragraph({ children: [new TextRun('   - 白名单：仅对列表中的设备生效')] }),
          new Paragraph({ children: [new TextRun('   - 黑名单：对列表中的设备不生效')] }),
          new Paragraph({ children: [new TextRun('2. 上传设备列表Excel文件')] }),
          new Paragraph({ children: [new TextRun('   - 支持格式：.xlsx, .xls')] }),
          new Paragraph({ children: [new TextRun('   - 文件需包含设备ID列')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '4.5 定时发布', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '功能说明：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('支持设置配置的定时发布时间。')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '配置选项：', bold: true })],
          }),
          new Paragraph({ children: [new TextRun('• 立即发布 - 保存后立即生效')] }),
          new Paragraph({ children: [new TextRun('• 定时发布 - 设置发布日期和时间，到期自动生效')] }),
          new Paragraph({ children: [] }),
          new Paragraph({ children: [] }),

          // 5. 数据字典
          new Paragraph({
            children: [new TextRun({ text: '5. 数据字典', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '5.1 品类列表', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [new TextRun('手机、平板、电视、穿戴设备、智能家居')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '5.2 品牌列表（按品类）', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ children: [new TextRun('• 手机：华为、小米、OPPO、vivo、荣耀、realme、一加')] }),
          new Paragraph({ children: [new TextRun('• 平板：华为、小米、联想、三星')] }),
          new Paragraph({ children: [new TextRun('• 电视：小米、TCL、海信、创维、索尼')] }),
          new Paragraph({ children: [new TextRun('• 穿戴设备：华为、小米、OPPO、vivo')] }),
          new Paragraph({ children: [new TextRun('• 智能家居：小米、华为、美的、海尔')] }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '5.3 状态定义', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '状态', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '说明', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('online/上架')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('模块/配置已启用，正常生效')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('offline/下架')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('模块/配置已禁用，不生效')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('draft/草稿')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('配置已保存但未发布')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('published/已发布')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('配置已发布生效')], borders: tableBorders }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('scheduled/定时发布')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('配置等待定时发布')], borders: tableBorders }),
                ],
              }),
            ],
          }),
          new Paragraph({ children: [] }),
          new Paragraph({ children: [] }),

          // 6. 附录
          new Paragraph({
            children: [new TextRun({ text: '6. 附录', bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({ children: [] }),

          new Paragraph({
            children: [new TextRun({ text: '6.1 版本历史', bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_2,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '版本', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '日期', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '修改内容', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '作者', bold: true })] })], borders: tableBorders, shading: { fill: 'E8E8E8' } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('1.0')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph(new Date().toLocaleDateString('zh-CN'))], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('初始版本')], borders: tableBorders }),
                  new TableCell({ children: [new Paragraph('产品团队')], borders: tableBorders }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  // 生成并下载文档
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'OS配置中心-PRD文档.docx');
}
