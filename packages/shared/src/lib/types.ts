export type SubPage = {
  images: { src: string; alt?: string; caption?: string }[];
  description?: string;
  layout?: "grid" | "single" | "stackedRight" | "textLeftStackedRight" | "fiveImageStack" | "row" | "leftMainRightStacked" | "rowCaption" | "multiRow" | "sevenSplit" | "becomingHumanCollage5";
  /**
   * multiRow 模板专用：每行放哪几张图片（images 中的下标索引），
   * 例：[[0,1,2,3], [4,5]] 表示共两行，第一行是第1~4张，第二行是第5~6张
   */
  rows?: number[][];
  /**
   * sevenSplit 模板专用：左右两栏宽度比，默认 [2, 3]（左:右 = 2:3）
   * 例：[1, 1] 表示左右各占一半，[1, 2] 表示左 1/3, 右 2/3
   */
  splitRatio?: [number, number];
  /**
   * sevenSplit 模板专用：右上一列的图片数量（默认 3）。
   * images 下标映射：images[1] ~ images[topRightCount]（共 topRightCount 张）
   */
  topRightCount?: number;
  /**
   * sevenSplit 模板专用：左下一列的图片数量（默认 2）。
   * images 下标映射：images[topRightCount + 2] ~ images[topRightCount + 1 + leftBottomCount]
   * （共 leftBottomCount 张）
   */
  leftBottomCount?: number;
  /**
   * row / multiRow 模板专用：所有行图片整体占父容器的宽度百分比（1~100），
   * 默认 100（占满整行）。例如设置为 75 时每行仅占 75% 页面宽度并居中。
   * 也可用于其他行优先布局（如 rowCaption），同样默认 100。
   */
  widthPercent?: number;
  /**
   * 【可选】显式声明 images[] 每一张图的宽高比（width / height）。
   * 当组件首帧渲染、图片 onLoad 尚未触发（或浏览器缓存命中导致 onLoad 事件不派发）时，
   * FiveImageStack / GridSubPage / sevenSplit 等需要"真实比例做同行等高校准"的布局
   * 会先用这些数值计算 scale & 定位，避免 dims 兜底 aspect=1（正方形假设）导致整体
   * 布局被等比缩小。
   *
   * 数组长度必须与 images[] 一致；缺失的下标仍走"dims[0..n] onLoad 校准 → 兜底 1"链路。
   * 本字段与 Work.aspectRatio / Work.coverAspectRatio 是同一设计理念（数据写死 →
   * 不依赖 img natural dims 异步到达）。
   */
  imageAspects?: number[];
};

export type Work = {
  slug: string;
  title: string;
  displayTitle?: string;
  /**
   * 作品详情页（WorkDetail）使用的主图：
   *  - SideBySideLayout / HeroImageLayout / HeroImageBottomLayout 等都读取此图作为首屏主图；
   *  - 当作品只有一张主图时，此图就是作品本体；
   *  - 分类画廊（WORKS / Paintings / 2025 等层级）展示的缩略图优先走 cover 字段（若存在），
   *    cover 为空时 fallback 到 thumbnail。
   */
  thumbnail: string;
  /**
   * 分类画廊（WORKS / Paintings / 2025 等）专用缩略图：
   *  - 路径规则：`${R2}/images/{category}-{year}/covers/{slug}.{ext}`
   *  - 与 thumbnail 分离：thumbnail 用于详情页主图，cover 用于分类页 justified-gallery
   *    这样可以为每个分类年份单独准备一套展示图（避免详情页长卷 / 多图影响分类页比例）。
   *  - 可选：未填写时自动 fallback 到 thumbnail。
   */
  cover?: string;
  aspectRatio: number;
  /**
   * 【可选】cover 图像自身的宽高比（width / height）。
   * 仅当作品填了 cover 时才需要填写。
   *
   * 用途：JustifiedGallery 在分类年份页面（WORKS/Paintings/2025 等）渲染缩略图时，
   * 会先按这个比例做"首屏布局"，等图片真实尺寸 onLoad 测到后再用真实 ratio 精算一次。
   * 若不填，画廊会 fallback 到 aspectRatio（thumbnail 主图的比例）。
   *
   * 由于 cover 与 thumbnail 可能是不同的裁剪图，比例不一致时首屏会出现：
   *   "img 元素等高（容器按 thumbnail 比例撑开），但实际图片内容因 object-contain 缩放/留白
   *    导致同行内容高度不相等"的视觉偏差。
   * 填 coverAspectRatio 即可彻底消除这种首屏跳动与不等高。
   */
  coverAspectRatio?: number;
  description?: string;
  materials?: string;
  /** 作品创作年份，如 "2025" */
  year?: string;
  /** 作品尺寸，如 "60×80 cm" */
  dimensions?: string;
  layout?: "left" | "center" | "wide" | "partial" | "right" | "bottom" | "wideBottom" | "grid" | "galleryView";
  /**
   * GridLayout（layout = "grid"）专用：桌面端 grid 列数（≥768px 生效，移动端始终 1 列）。
   * 例如：
   *   gridColumns = 2 → 每行 2 张（10 张图时正好 10 行）
   *   省略不写 → 默认自适应：sm 屏 2 列 / lg 屏 3 列（原 legacy 行为）
   */
  gridColumns?: number;
  imgWidthRatio?: number;
  link?: string;
  images?: { src: string; alt?: string; caption?: string }[];
  subPages?: SubPage[];
  /**
   * 【可选】作品详情页"主图区域"的点击跳转链接（如外部视频、媒体报道）。
   * 设置后主图会被包上 <a target="_blank" rel="noopener noreferrer">。
   * 典型用法：纪录片截图 → 跳 YouTube / B 站原片。
   */
  heroLink?: string;
  /**
   * 【可选】作品详情页"主图区域"正下方的 caption，样式与分类画廊 caption 统一：
   * mt-2 / 10px / text-center / text-gray-700 / opacity 0.5
   */
  heroCaption?: string;
};

/**
 * 分类年份画廊行布局条目：
 *   - number 简写：等价于 { count: n, widthPercent: 100 }
 *   - 对象形式：count = 本行几张图，widthPercent（1-100，默认 100）= 行内容占容器宽度百分比
 */
export type LayoutRowSpec = number | { count: number; widthPercent?: number };

export type WorkCategory = {
  slug: string;
  title: string;
  coverImage: string;
  coverAspectRatio: number;
  years: number[];
  worksByYear?: Record<number, Work[]>;
  layoutByYear?: Record<number, LayoutRowSpec[]>;
};
