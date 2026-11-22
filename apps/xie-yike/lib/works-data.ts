import type { Work } from "@personal-sites/shared";
import { getProjectIntro, getProjectDetails, getExhibitionIntro } from "./content-loader";

export const R2 = "https://pub-191526e40b2f4ebe994bafe555eeeeb7.r2.dev";
const BLANK = `${R2}/images/blank.svg`;

/** R2 图片路径前缀（whole-works/） */
const IMG = `${R2}/images/whole-works`;

// ============================================================
// WholeWorks —— 资源库，不直接呈现在网页上
// projects / otherWorks / exhibitions 均通过 workId 引用此处的作品
// slug 命名规则：有英文名用英文名，中文用拼音
// aspectRatio 基于作品物理尺寸（宽/高）计算，图片加载后会被真实尺寸覆盖
// ============================================================
export const wholeWorks: Work[] = [
  {
    slug: "bloom",
    title: "Bloom 绽放",
    thumbnail: `${IMG}/bloom-2026/bloom-2026.jpg`,
    aspectRatio: 50.8 / 40.64,
    layout: "galleryView",
    year: "2026",
    dimensions: "50.8 × 40.64 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "ling",
    title: "凛",
    thumbnail: `${IMG}/ling-2026/ling-2026.jpg`,
    aspectRatio: 30.3 / 61,
    layout: "galleryView",
    year: "2026",
    dimensions: "30.3 × 61 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "white-field",
    title: "White field 白域",
    thumbnail: `${IMG}/white-field-2026/white-field-2026.jpg`,
    aspectRatio: 91.4 / 121.9,
    layout: "galleryView",
    year: "2026",
    dimensions: "91.4 × 121.9 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "imbalance",
    title: "Imbalance 失衡",
    thumbnail: `${IMG}/imbalance-2026/imbalance-2026.jpg`,
    aspectRatio: 91.4 / 121.9,
    layout: "galleryView",
    year: "2026",
    dimensions: "91.4 × 121.9 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "leng-qu",
    title: "冷区",
    thumbnail: `${IMG}/leng-qu-2026/leng-qu-2026.jpg`,
    aspectRatio: 91.4 / 121.9,
    layout: "galleryView",
    year: "2026",
    dimensions: "91.4 × 121.9 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "can-yu",
    title: "残余",
    thumbnail: `${IMG}/can-yu-2026/can-yu-2026.jpg`,
    aspectRatio: 76.2 / 101.6,
    layout: "galleryView",
    year: "2026",
    dimensions: "76.2 × 101.6 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "pan",
    title: "盼",
    thumbnail: `${IMG}/pan-2026/pan-2026.jpg`,
    aspectRatio: 30.3 / 61,
    layout: "galleryView",
    year: "2026",
    dimensions: "30.3 × 61 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "guo-jie",
    title: "过界",
    thumbnail: `${IMG}/guo-jie-2026/guo-jie-2026.jpg`,
    aspectRatio: 25.3 / 20,
    layout: "galleryView",
    year: "2026",
    dimensions: "25.3 × 20 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "blush",
    title: "Blush 粉晕",
    thumbnail: `${IMG}/blush-2026/blush-2026.jpg`,
    aspectRatio: 34.9 / 27.8,
    layout: "galleryView",
    year: "2026",
    dimensions: "34.9 × 27.8 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "wei-wen",
    title: "未稳",
    thumbnail: `${IMG}/wei-wen-2025/wei-wen-2025.jpg`,
    aspectRatio: 50.8 / 40.64,
    layout: "galleryView",
    year: "2025",
    dimensions: "50.8 × 40.64 cm",
    materials: "油画",
    description: "",
  },
  {
    slug: "jin-kou",
    title: "紧扣",
    thumbnail: `${IMG}/jin-kou-2026/jin-kou-2026.jpg`,
    aspectRatio: 20.3 / 20.3,
    layout: "galleryView",
    year: "2026",
    dimensions: "20.3 × 20.3 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "guo-bao",
    title: "过爆",
    thumbnail: `${IMG}/guo-bao-2025/guo-bao-2025.jpg`,
    aspectRatio: 50.8 / 40.64,
    layout: "galleryView",
    year: "2025",
    dimensions: "50.8 × 40.64 cm",
    materials: "油画颜料",
    description: "",
  },
  {
    slug: "lily",
    title: "lily 百合",
    thumbnail: `${IMG}/lily-2025/lily-2025.jpg`,
    aspectRatio: 50.8 / 40.64,
    layout: "galleryView",
    year: "2025",
    dimensions: "50.8 × 40.64 cm",
    materials: "油画颜料",
    description: "",
  },
  {
    slug: "lan-meng",
    title: "蓝梦",
    thumbnail: `${IMG}/lan-meng-2025/lan-meng-2025.jpg`,
    aspectRatio: 30 / 39.5,
    layout: "galleryView",
    year: "2025",
    dimensions: "30 × 39.5 cm",
    materials: "油画棒 丙烯颜料",
    description: "",
  },
  {
    slug: "sheng-zhang",
    title: "生长",
    thumbnail: `${IMG}/sheng-zhang-2026/sheng-zhang-2026.jpg`,
    aspectRatio: 25.3 / 20,
    layout: "galleryView",
    year: "2026",
    dimensions: "25.3 × 20 cm",
    materials: "油画颜料",
    description: "",
  },
  {
    slug: "blue-flamingo",
    title: "Blue flamingo",
    thumbnail: `${IMG}/blue-flamingo-2026/blue-flamingo-2026.jpg`,
    aspectRatio: 25.1 / 25.1,
    layout: "galleryView",
    year: "2026",
    dimensions: "25.1 × 25.1 cm",
    materials: "油画颜料",
    description: "",
  },
  {
    slug: "night-bloom",
    title: "Night bloom 夜绽",
    thumbnail: `${IMG}/night-bloom-2026/night-bloom-2026.jpg`,
    aspectRatio: 70 / 50,
    layout: "galleryView",
    year: "2026",
    dimensions: "70 × 50 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "kong-xi",
    title: "空隙",
    thumbnail: `${IMG}/kong-xi-2026/kong-xi-2026.jpg`,
    aspectRatio: 150 / 120,
    layout: "galleryView",
    year: "2026",
    dimensions: "150 × 120 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "chi",
    title: "池",
    thumbnail: `${IMG}/chi-2026/chi-2026.jpg`,
    aspectRatio: 1,
    layout: "galleryView",
    year: "2026",
    dimensions: "",
    materials: "",
    description: "",
    subPages: [
      {
        images: [
          { src: `${IMG}/chi-2026/chi-2026-1.jpg` },
          { src: `${IMG}/chi-2026/chi-2026-2.jpg` },
          { src: `${IMG}/chi-2026/chi-2026-3.jpg` },
          { src: `${IMG}/chi-2026/chi-2026-4.jpg` },
        ],
      },
    ],
  },
  {
    slug: "v",
    title: "V",
    thumbnail: `${IMG}/v-2025/v-2025.jpg`,
    aspectRatio: 40 / 50,
    layout: "galleryView",
    year: "2025",
    dimensions: "40 × 50 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "vii",
    title: "VII",
    thumbnail: `${IMG}/vii-2025/vii-2025.jpg`,
    aspectRatio: 40 / 50,
    layout: "galleryView",
    year: "2025",
    dimensions: "40 × 50 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "ix",
    title: "ix",
    thumbnail: `${IMG}/ix-2025/ix-2025.jpg`,
    aspectRatio: 40 / 50,
    layout: "galleryView",
    year: "2025",
    dimensions: "40 × 50 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "i",
    title: "I",
    thumbnail: `${IMG}/i-2025/i-2025.jpg`,
    aspectRatio: 40 / 50,
    layout: "galleryView",
    year: "2025",
    dimensions: "40 × 50 cm",
    materials: "布面喷漆 丙烯颜料",
    description: "",
  },
  {
    slug: "ii",
    title: "II",
    thumbnail: `${IMG}/ii-2025/ii-2025.jpg`,
    aspectRatio: 40 / 50,
    layout: "galleryView",
    year: "2025",
    dimensions: "40 × 50 cm",
    materials: "布面喷漆 丙烯颜料",
    description: "",
  },
  {
    slug: "iii",
    title: "III",
    thumbnail: `${IMG}/iii-2025/iii-2025.jpg`,
    aspectRatio: 40 / 50,
    layout: "galleryView",
    year: "2025",
    dimensions: "40 × 50 cm",
    materials: "布面喷漆 丙烯颜料",
    description: "",
  },
  {
    slug: "ning",
    title: "凝 Ning",
    thumbnail: `${IMG}/ning-2025/ning-2025.jpg`,
    aspectRatio: 40 / 50,
    layout: "galleryView",
    year: "2025",
    dimensions: "40 × 50 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "covering",
    title: "遮 Covering",
    thumbnail: `${IMG}/covering-2025/covering-2025.jpg`,
    aspectRatio: 50 / 60,
    layout: "galleryView",
    year: "2025",
    dimensions: "50 × 60 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "imprisoning",
    title: "囚 Imprisoning",
    thumbnail: `${IMG}/imprisoning-2025/imprisoning-2025.jpg`,
    aspectRatio: 30 / 40,
    layout: "galleryView",
    year: "2025",
    dimensions: "30 × 40 cm",
    materials: "布面喷漆 丙烯颜料 水彩",
    description: "",
  },
  {
    slug: "thorn",
    title: "刺 Thorn",
    thumbnail: `${IMG}/thorn-2025/thorn-2025.jpg`,
    aspectRatio: 50 / 60,
    layout: "galleryView",
    year: "2025",
    dimensions: "50 × 60 cm",
    materials: "布面喷漆 丙烯颜料",
    description: "",
  },
  {
    slug: "lost",
    title: "迷 Lost",
    thumbnail: `${IMG}/lost-2025/lost-2025.jpg`,
    aspectRatio: 45 / 60,
    layout: "galleryView",
    year: "2025",
    dimensions: "45 × 60 cm",
    materials: "丙烯颜料 油画棒 布面喷漆",
    description: "",
  },
  {
    slug: "forbidden",
    title: "禁 Forbidden",
    thumbnail: `${IMG}/forbidden-2025/forbidden-2025.jpg`,
    aspectRatio: 28 / 35,
    layout: "galleryView",
    year: "2025",
    dimensions: "28 × 35 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "realm",
    title: "境 Realm",
    thumbnail: `${IMG}/realm-2025/realm-2025.jpg`,
    aspectRatio: 28 / 35,
    layout: "galleryView",
    year: "2025",
    dimensions: "28 × 35 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "awaking",
    title: "醒 Awaking",
    thumbnail: `${IMG}/awaking-2025/awaking-2025.jpg`,
    aspectRatio: 60 / 90,
    layout: "galleryView",
    year: "2025",
    dimensions: "60 × 90 cm",
    materials: "丙烯颜料",
    description: "",
  },
  {
    slug: "hiding",
    title: "掩 Hiding",
    thumbnail: `${IMG}/hiding-2025/hiding-2025.jpg`,
    aspectRatio: 60 / 90,
    layout: "galleryView",
    year: "2025",
    dimensions: "60 × 90 cm",
    materials: "布面喷漆 丙烯颜料",
    description: "",
  },
];

// ============================================================
// PROJECTS —— 通过 workId 引用 wholeWorks
// ⚠️ 临时引用前 4 件作品，待用户指定后调整
// ============================================================
// PROJECTS —— 通过 works 数组引用 wholeWorks（结构与 Exhibition 一致）
// ============================================================
export interface DetailRow {
  image: string;
  title: string;
  text: string;
  titleEn?: string;
  textEn?: string;
  /** 0=隐藏，1=直接显示，2=隶属于上一条 level=1，展开后显示 */
  level?: number;
  /** 该详情的附加图片（detail-{行号}-{序号}.jpg），点击了解更多后显示 */
  extraImages?: string[];
}

export interface Project {
  slug: string;
  title: string;
  coverImage: string;
  /** CSV 内容目录名（content/projects/{contentDir}/），如 "memory" */
  contentDir?: string;
  /** 时间（不区分语言，来自 CSV） */
  time?: string;
  /** 地点（不区分语言，来自 CSV） */
  address?: string;
  description: string;
  descriptionEn?: string;
  fullDescription?: string;
  fullDescriptionEn?: string;
  views: string[];
  details: DetailRow[];
  works: string[];
}

/**
 * 项目数据。
 * - 文本内容（标题/介绍/详情）从 content/projects/{contentDir}/ 下的 CSV 读取
 * - 详情附加图片（detail-{行号}-{序号}.jpg）数量由 details.csv 的 extra 列声明
 * - 修改 CSV 后需重新编译（dev 下保存本文件触发，或重启 dev server）
 */
export const projects: Project[] = [
  (() => {
    const contentDir = "memory";
    const intro = getProjectIntro(contentDir);
    const detailsCsv = getProjectDetails(contentDir);
    // 详情图路径与 CSV 行一一对应
    const detailImages = Array.from(
      { length: detailsCsv.length },
      (_, i) => `${R2}/images/projects/${contentDir}/detail-${i + 1}.jpg`
    );
    return {
      slug: "project-1",
      title: intro.title || "回忆",
      coverImage: `${R2}/images/projects/${contentDir}/project-1.jpg`,
      contentDir,
      time: intro.time || undefined,
      address: intro.address || undefined,
      description: intro.zh,
      descriptionEn: intro.en,
      views: Array.from(
        { length: 12 },
        (_, i) => `${R2}/images/projects/${contentDir}/view-${i + 1}.jpg`
      ),
      details: detailsCsv.map((d, i) => ({
        image: detailImages[i] ?? "",
        title: d.title,
        text: d.detail,
        titleEn: d.titleEn || undefined,
        textEn: d.detailEn || undefined,
        level: d.level,
        extraImages: d.extra > 0
          ? Array.from(
              { length: d.extra },
              (_, k) => `${R2}/images/projects/${contentDir}/detail-${d.index}-${k + 1}.jpg`
            )
          : undefined,
      })),
      works: ["sheng-zhang", "bloom", "ling", "blue-flamingo", "guo-jie", "jin-kou", "chi"],
    };
  })(),
  (() => {
    const contentDir = "through-our-own-filters";
    const intro = getProjectIntro(contentDir);
    const detailsCsv = getProjectDetails(contentDir);
    const detailImages = Array.from(
      { length: detailsCsv.length },
      (_, i) => `${R2}/images/projects/${contentDir}/detail-${i + 1}.jpg`
    );
    return {
      slug: "project-2",
      title: intro.title || "Through Our Own Filters",
      coverImage: `${R2}/images/projects/${contentDir}/preview/through-our-own-filters.webp`,
      contentDir,
      time: intro.time || undefined,
      address: intro.address || undefined,
      description: intro.zh,
      descriptionEn: intro.en,
      views: Array.from(
        { length: 8 },
        (_, i) => `${R2}/images/projects/${contentDir}/view-${i + 1}.jpg`
      ),
      details: detailsCsv.map((d, i) => ({
        image: detailImages[i] ?? "",
        title: d.title,
        text: d.detail,
        titleEn: d.titleEn || undefined,
        textEn: d.detailEn || undefined,
        level: d.level,
        extraImages: d.extra > 0
          ? Array.from(
              { length: d.extra },
              (_, k) => `${R2}/images/projects/${contentDir}/detail-${d.index}-${k + 1}.jpg`
            )
          : undefined,
      })),
      works: [],
    };
  })(),
  (() => {
    const contentDir = "behind-the-display";
    const intro = getProjectIntro(contentDir);
    const detailsCsv = getProjectDetails(contentDir);
    const detailImages = Array.from(
      { length: detailsCsv.length },
      (_, i) => `${R2}/images/projects/${contentDir}/detail-${i + 1}.jpg`
    );
    return {
      slug: "project-3",
      title: intro.title || "Behind the Display",
      coverImage: `${R2}/images/projects/${contentDir}/behind-the-display.jpg`,
      contentDir,
      time: intro.time || undefined,
      address: intro.address || undefined,
      description: intro.zh,
      descriptionEn: intro.en,
      views: Array.from(
        { length: 13 },
        (_, i) => `${R2}/images/projects/${contentDir}/view-${i + 1}.jpg`
      ),
      details: detailsCsv.map((d, i) => ({
        image: detailImages[i] ?? "",
        title: d.title,
        text: d.detail,
        titleEn: d.titleEn || undefined,
        textEn: d.detailEn || undefined,
        level: d.level,
        extraImages: d.extra > 0
          ? Array.from(
              { length: d.extra },
              (_, k) => `${R2}/images/projects/${contentDir}/detail-${d.index}-${k + 1}.jpg`
            )
          : undefined,
      })),
      works: [],
    };
  })(),
  (() => {
    const contentDir = "drawn-into-the-depths";
    const intro = getProjectIntro(contentDir);
    const detailsCsv = getProjectDetails(contentDir);
    const detailImages = Array.from(
      { length: detailsCsv.length },
      (_, i) => `${R2}/images/projects/${contentDir}/detail-${i + 1}.jpg`
    );
    return {
      slug: "project-4",
      title: intro.title || "Drawn into the Depths",
      coverImage: `${R2}/images/projects/${contentDir}/drawn-into-the-depths.jpg`,
      contentDir,
      time: intro.time || undefined,
      address: intro.address || undefined,
      description: intro.zh,
      descriptionEn: intro.en,
      views: Array.from(
        { length: 11 },
        (_, i) => `${R2}/images/projects/${contentDir}/view-${i + 1}.jpg`
      ),
      details: detailsCsv.map((d, i) => ({
        image: detailImages[i] ?? "",
        title: d.title,
        text: d.detail,
        titleEn: d.titleEn || undefined,
        textEn: d.detailEn || undefined,
        level: d.level,
        extraImages: d.extra > 0
          ? Array.from(
              { length: d.extra },
              (_, k) => `${R2}/images/projects/${contentDir}/detail-${d.index}-${k + 1}.jpg`
            )
          : undefined,
      })),
      works: [],
    };
  })(),
];

// ============================================================
// OTHER WORKS —— 通过 workId 引用 wholeWorks
// ⚠️ 临时引用第 5~10 件作品，待用户指定后调整
// ============================================================
export interface OtherWorkRef {
  slug: string;
  workId: string;
}

export const otherWorks: OtherWorkRef[] = [
  { slug: "leng-qu", workId: "leng-qu" },
  { slug: "can-yu", workId: "can-yu" },
  { slug: "pan", workId: "pan" },
  { slug: "guo-jie", workId: "guo-jie" },
  { slug: "blush", workId: "blush" },
  { slug: "wei-wen", workId: "wei-wen" },
];

// ============================================================
// EXHIBITIONS —— 通过 works 数组引用 wholeWorks
// ============================================================
export interface Exhibition {
  slug: string;
  title: string;
  status: "Upcoming" | "Current" | "Past";
  dateRange: string;
  location: string;
  coverImage: string;
  /** CSV 内容目录名（content/exhibitions/{contentDir}/） */
  contentDir?: string;
  /** 时间（不区分语言，来自 CSV） */
  time?: string;
  /** 地点（不区分语言，来自 CSV） */
  address?: string;
  /** 简介（不区分语言） */
  description: string;
  /** 英文简介 */
  descriptionEn?: string;
  /** 完整介绍（Read More 展开后追加显示），可选 */
  fullDescription?: string;
  fullDescriptionEn?: string;
  /** 现场图片数组 */
  views: string[];
  /** 引用 wholeWorks 的 slug 数组 */
  works: string[];
}

export const exhibitions: Exhibition[] = [
  (() => {
    const contentDir = "when-everything-changes";
    const intro = getExhibitionIntro(contentDir);
    return {
      slug: "when-everything-changes",
      title: intro.title || "When everything changes",
      status: "Upcoming",
      dateRange: "2026",
      location: "TBD",
      coverImage:
        `${R2}/images/exhibitions/when-everything-changes/when-everything-changes.jpg`,
      contentDir,
      time: intro.time || undefined,
      address: intro.address || undefined,
      description: intro.zh,
      descriptionEn: intro.en,
      views: Array.from(
        { length: 6 },
        (_, i) => `${R2}/images/exhibitions/when-everything-changes/view-${i + 1}.jpg`
      ),
      works: [
        "bloom", "ling", "white-field", "imbalance", "leng-qu",
        "can-yu", "pan", "guo-jie", "blush", "wei-wen",
        "jin-kou", "guo-bao", "lily", "lan-meng", "sheng-zhang",
        "blue-flamingo", "night-bloom", "kong-xi",
      ],
    };
  })(),
  (() => {
    const contentDir = "the-landscape-of-chaos";
    const intro = getExhibitionIntro(contentDir);
    return {
      slug: "the-landscape-of-chaos",
      title: intro.title || "The landscape of chaos",
      status: "Past",
      dateRange: "2025",
      location: "TBD",
      coverImage:
        `${R2}/images/exhibitions/the-landscape-of-chaos/the-landscape-of-chaos.jpg`,
      contentDir,
      time: intro.time || undefined,
      address: intro.address || undefined,
      description: intro.zh,
      descriptionEn: intro.en,
      views: Array.from(
        { length: 5 },
        (_, i) => `${R2}/images/exhibitions/the-landscape-of-chaos/view-${i + 1}.jpg`
      ),
      works: [
        "v", "vii", "ix", "i", "ii", "iii",
        "ning", "covering", "imprisoning", "thorn", "lost",
        "forbidden", "realm", "awaking", "hiding",
      ],
    };
  })(),
];

// ============================================================
// 查询函数
// ============================================================

/** 根据 id（slug）从资源库获取作品 */
export function getWorkById(id: string): Work | undefined {
  return wholeWorks.find((w) => w.slug === id);
}

/** 获取项目 */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** 获取项目关联的作品列表 */
export function getProjectWorks(project: Project): Work[] {
  return project.works
    .map((id) => getWorkById(id))
    .filter((w): w is Work => !!w);
}

/** 获取 Other Work 详情（解析 workId 到实际作品数据） */
export function getOtherWork(slug: string): Work | undefined {
  const ref = otherWorks.find((w) => w.slug === slug);
  return ref ? getWorkById(ref.workId) : undefined;
}

/** 获取展览 */
export function getExhibition(slug: string): Exhibition | undefined {
  return exhibitions.find((e) => e.slug === slug);
}

/** 获取展览关联的作品列表 */
export function getExhibitionWorks(exhibition: Exhibition): Work[] {
  return exhibition.works
    .map((id) => getWorkById(id))
    .filter((w): w is Work => !!w);
}

/**
 * 根据作品 slug 返回其在站点中的访问路径。
 * 统一使用 /whole-works/{slug} 路由。
 */
export function getWorkHref(workId: string): string {
  return `/whole-works/${workId}`;
}
