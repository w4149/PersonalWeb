import { readdirSync } from "node:fs";
import { join } from "node:path";
import { readCsv } from "./csv";

/**
 * 内容加载器：从 content/ 目录下的 CSV 文件读取文本内容。
 * CSV 是网站文本的唯一来源，编辑 CSV 后重新 build 即可生效。
 *
 * 仅在服务端使用（依赖 node:fs）。
 */

/** 以空行分隔的段落数组 */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

// ─── 首页 ABOUT 简介 ───────────────────────────────────────────────

export interface AboutIntro {
  zh: string[];
  en: string[];
}

/**
 * 读取首页艺术家简介。
 * CSV 格式：header = `introduction,introduction-en`，第 2 行为内容。
 */
export function getAboutIntro(): AboutIntro {
  const rows = readCsv("content/about/introduction.csv");
  // rows[0] 是表头，rows[1] 是内容行
  const zh = rows[1]?.[0] ?? "";
  const en = rows[1]?.[1] ?? "";
  return {
    zh: splitParagraphs(zh),
    en: splitParagraphs(en),
  };
}

// ─── 项目简介 ─────────────────────────────────────────────────────

export interface ProjectIntro {
  /** 标题（不区分语言） */
  title: string;
  /** 时间（不区分语言） */
  time: string;
  /** 地点（不区分语言） */
  address: string;
  /** 中文介绍 */
  zh: string;
  /** 英文介绍 */
  en: string;
}

/**
 * 读取项目简介。
 * CSV 格式（第 1 行表头，第 2 行数据）：
 *   title, time, address, introduction, introduction-en
 */
export function getProjectIntro(contentDir: string): ProjectIntro {
  const rows = readCsv(`content/projects/${contentDir}/introduction.csv`);
  const row = rows[1] ?? [];
  return {
    title: row[0] ?? "",
    time: row[1] ?? "",
    address: row[2] ?? "",
    zh: row[3] ?? "",
    en: row[4] ?? "",
  };
}

// ─── 展览简介 ─────────────────────────────────────────────────────

/**
 * 读取展览简介。
 * CSV 格式（第 1 行表头，第 2 行数据）：
 *   title, time, address, introduction, introduction-en
 */
export function getExhibitionIntro(contentDir: string): ProjectIntro {
  const rows = readCsv(`content/exhibitions/${contentDir}/introduction.csv`);
  const row = rows[1] ?? [];
  return {
    title: row[0] ?? "",
    time: row[1] ?? "",
    address: row[2] ?? "",
    zh: row[3] ?? "",
    en: row[4] ?? "",
  };
}

// ─── 项目详情 ─────────────────────────────────────────────────────

export interface ProjectDetailCsv {
  index: number;
  title: string;
  titleEn: string;
  detail: string;
  detailEn: string;
  level: number;
}

/**
 * 读取项目详情列表。
 * CSV 格式：
 *   第 1 行：count,N,,,,,（统计行，跳过）
 *   第 2 行：index,title,title-en,detail,detail-en,level（表头）
 *   第 3 行起：数据
 * level 含义：0=隐藏，1=直接显示，2=隶属于上一条 level=1，点击展开后显示
 */
export function getProjectDetails(contentDir: string): ProjectDetailCsv[] {
  const rows = readCsv(`content/projects/${contentDir}/details.csv`);
  // 跳过前两行（count 行 + 表头行）
  const dataRows = rows.slice(2);
  return dataRows.map((row) => ({
    index: parseInt(row[0] ?? "0", 10),
    title: row[1] ?? "",
    titleEn: row[2] ?? "",
    detail: row[3] ?? "",
    detailEn: row[4] ?? "",
    level: parseInt(row[5] ?? "0", 10),
  }));
}

// ─── 项目详情附加图片 ─────────────────────────────────────────────

/**
 * 扫描项目图片目录，返回每条详情的附加图片。
 * 文件名规则：detail-{详情行号}-{序号}.jpg（如 detail-1-1.jpg、detail-2-3.jpg）
 * - 第一个数字 = 详情行号（1-based，对应 details.csv 的 index 列）
 * - 第二个数字 = 附加图片在该详情下的顺序
 *
 * 返回：{ 详情行号: [按序号排序的 web 图片路径] }
 * 仅在服务端使用。
 */
export function getProjectExtraImages(
  contentDir: string
): Record<number, string[]> {
  const dir = join(process.cwd(), `public/images/projects/${contentDir}`);
  let files: string[] = [];
  try {
    files = readdirSync(dir);
  } catch {
    return {};
  }

  const re = /^detail-(\d+)-(\d+)\.(jpg|jpeg|png|webp)$/i;
  const map = new Map<number, { m: number; name: string }[]>();

  for (const name of files) {
    const m = name.match(re);
    if (!m) continue;
    const detailIdx = parseInt(m[1], 10);
    const order = parseInt(m[2], 10);
    if (!map.has(detailIdx)) map.set(detailIdx, []);
    map.get(detailIdx)!.push({ m: order, name });
  }

  const result: Record<number, string[]> = {};
  for (const [idx, arr] of map) {
    arr.sort((a, b) => a.m - b.m);
    result[idx] = arr.map(
      (x) => `/images/projects/${contentDir}/${x.name}`
    );
  }
  return result;
}
