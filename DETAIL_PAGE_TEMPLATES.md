# 详情页模板使用说明（Project Detail & Exhibition Detail · 2026-11-21）

适用于 `apps/xie-yike` 站点的两个详情页路由：

- **项目详情页**：`/projects/[slug]` → `app/projects/[slug]/page.tsx`
- **展览详情页**：`/exhibitions/[slug]` → `app/exhibitions/[slug]/page.tsx`

两个页面共享同一套布局骨架与组件，仅在「Details 图文详情」区块上有差异。所有标题 / 时间 / 地点 / 介绍 / 详情文字均由 `content/` 下的 **CSV** 提供（GBK 编码），并支持 **英文（默认）/ 中文** 切换。本文档沉淀其结构、数据契约、CSV 规约、组件用法与可复用约定，方便未来新增项目、展览或内容类型时快速套用。

***

## 一、整体结构总览

两个详情页采用统一的纵向分段布局，从上到下依次为：

```
┌──────────────────────────────────────────────────┐
│  顶部全宽封面图（coverImage，等比例，object-cover）│  ← 全宽，无 max-w 限制
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │  基础信息（居中：标题 / time · address）      │  │  ← max-w-7xl 容器
│  ├────────────────────────────────────────────┤  │
│  │  分割线 <hr>                                │  │
│  ├────────────────────────────────────────────┤  │
│  │  ViewsCarousel（现场图片轮播）               │  │
│  ├────────────────────────────────────────────┤  │
│  │  ExhibitionIntro（简介 + Read More 展开，双语）│  │
│  ├────────────────────────────────────────────┤  │
│  │  分割线 <hr>                                │  │
│  ├────────────────────────────────────────────┤  │
│  │  ProjectDetails（图文详情，仅项目页）⭐       │  │  ← 展览页无此区块
│  ├────────────────────────────────────────────┤  │
│  │  分割线 <hr>                                │  │
│  ├────────────────────────────────────────────┤  │
│  │  Featured Works（作品网格，1/2 列）           │  │
│  ├────────────────────────────────────────────┤  │
│  │  ← Back to Projects / Exhibitions           │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**共同容器参数**：`max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-12 md:py-16`

> 导航栏右上角含 `LanguageToggle`（EN / 中文），切换后页面所有可翻译文案即时切换，选择持久化到 `localStorage`（默认 EN）。

***

## 二、数据结构与内容源

### 2.1 Exhibition（`lib/works-data.ts`）

```ts
export interface Exhibition {
  slug: string;
  title: string;                 // 来自 CSV introduction.csv（不区分语言）
  // —— 以下三个为历史字段，保留用于兼容，但详情页已不再渲染 ——
  status: "Upcoming" | "Current" | "Past";
  dateRange: string;
  location: string;
  // —— 实际渲染的基础信息来自 CSV ——
  coverImage: string;            // 顶部全宽封面图
  contentDir?: string;           // content/exhibitions/{contentDir}/ 目录名
  time?: string;                 // 时间（不区分语言，来自 CSV，空则不渲染）
  address?: string;              // 地点（不区分语言，来自 CSV，空则不渲染）
  description: string;           // 中文简介
  descriptionEn?: string;        // 英文简介（缺省时英文模式回退中文）
  fullDescription?: string;      // 中文完整介绍（可选，Read More 展开后追加）
  fullDescriptionEn?: string;    // 英文完整介绍
  views: string[];               // 现场图片数组（ViewsCarousel 数据源）
  works: string[];               // 引用 wholeWorks 的 slug 数组
}
```

> 展览详情页当前展示：标题 + `time` + `address`（均来自 CSV）。`status / dateRange / location` 不再出现在页面上。

### 2.2 Project 与 DetailRow（`lib/works-data.ts`）

```ts
export interface Project {
  slug: string;
  title: string;                 // 来自 CSV introduction.csv
  coverImage: string;
  contentDir?: string;           // content/projects/{contentDir}/ 目录名（如 "memory"）
  time?: string;                 // 时间（来自 CSV）
  address?: string;              // 地点（来自 CSV）
  description: string;           // 中文简介
  descriptionEn?: string;        // 英文简介
  fullDescription?: string;      // 中文完整介绍（可选）
  fullDescriptionEn?: string;    // 英文完整介绍
  views: string[];
  details: DetailRow[];          // ⭐ 图文详情行（来自 details.csv，项目页特有）
  works: string[];
}

export interface DetailRow {
  image: string;                 // 详情主图（detail-{行号}.jpg）
  title: string;                 // 中文小标题
  text: string;                  // 中文正文
  titleEn?: string;              // 英文小标题（缺则回退中文）
  textEn?: string;               // 英文正文
  level?: number;                // 0=隐藏，1=直接显示，2=隶属于上一条 level=1，展开后显示
  extraImages?: string[];        // 附加图片（detail-{行号}-{序号}.jpg），展开后显示
}
```

> Project 与 Exhibition 的差异：Project 多出 `details: DetailRow[]`（图文详情区块）。两者均有 `contentDir / time / address / description* / fullDescription*`，文本来自 CSV。

### 2.3 `content/` 目录结构与 CSV 规约 ⭐

所有文本存放在 `apps/xie-yike/content/` 下，由 `lib/content-loader.ts` 在服务端读取。这是文本的**唯一来源**，编辑后 rebuild 即生效。

```
content/
├── about/introduction.csv                       # 首页 ABOUT 简介
├── projects/{contentDir}/
│   ├── introduction.csv                         # 项目标题/时间/地点/介绍
│   └── details.csv                              # 项目图文详情
└── exhibitions/{contentDir}/
    └── introduction.csv                         # 展览标题/时间/地点/介绍
```

#### 2.3.1 编码与通用规则

- **编码必须为 GBK**：中文 Windows 的 Excel 默认保存即 GBK。读取走 `new TextDecoder("gbk")`（见 `lib/csv.ts`），按 UTF-8 读会乱码。用其他编辑器保存时务必确认编码为 GBK/ANSI。
- 字段内若含**逗号或换行**，必须用双引号包裹；字段内的双引号写作 `""`（两个连续双引号）。
- `time` / `address` 留空 → 页面不渲染（不会出现空行占位）。

#### 2.3.2 `introduction.csv`（项目 & 展览通用）

- 第 1 行表头，第 2 行数据（仅一行数据）。
- 列顺序：`title, time, address, introduction, introduction-en`

```
title,time,address,introduction,introduction-en
回忆,2026,北京,在实际布展之前……,Before the actual installation...
```

- `introduction` / `introduction-en` 中可用换行分段：
  - 详情页简介（`ExhibitionIntro`）按**任意换行**分段（正则 `/\n+/`）——Excel 单元格内 Alt+Enter 即为分段。
  - 首页 ABOUT 简介（`getAboutIntro`）按**空行**分段（连续两个换行）。

#### 2.3.3 `details.csv`（仅项目）

- 第 1 行：`count,N,,,,`（统计行，**跳过不读**）。
- 第 2 行：表头 `index,title,title-en,detail,detail-en,level`。
- 第 3 行起：数据行。

```
count,16,
index,title,title-en,detail,detail-en,level
1,空间建模,Spatial modeling,在实际布展之前……,Before the actual...,1
2,作品图总览,Overview,从几个主要角度……,From several angles...,2
3,另一组,Another group,……,……,2
```

**列含义**：

| 列 | 含义 |
|---|---|
| `index` | 详情行号，1-based，与图片 `detail-{index}.jpg` 及附加图 `detail-{index}-{m}.jpg` 对应 |
| `title` / `title-en` | 中 / 英文小标题 |
| `detail` / `detail-en` | 中 / 英文正文（`whitespace-pre-wrap` 渲染，支持换行排版） |
| `level` | 见下 |

**`level` 语义**（由 `ProjectDetails` 的 `buildGroups` 解析）：

| level | 行为 |
|---|---|
| `0` | 隐藏，不渲染（也不进入分组） |
| `1` | 直接显示，作为一个分组的「主项」 |
| `2` | 归入**上一条 level=1** 分组，默认折叠，点击该主项的「了解更多」后显示在展开区 |

> 多条连续 `level=2` 归入同一个 level=1；level=2 必须紧跟在它所属的 level=1 之后。

#### 2.3.4 构建包含

`content/` 下的路径是运行时动态构造的，Next.js 默认不会自动追踪。`apps/xie-yike/next.config.mjs` 已声明：

```js
outputFileTracingIncludes: {
  "/*": ["./content/**/*"],
}
```

确保生产构建把 CSV 打进产物。**新增内容目录后无需改配置**，但不要把 CSV 移到 `content/` 之外。

### 2.4 附加图片自动扫描（`getProjectExtraImages`）

项目详情的某条若需要更多配图，把图片按 `detail-{行号}-{序号}.{jpg|jpeg|png|webp}` 命名放入项目图片文件夹，`getProjectExtraImages` 会**自动扫描**，无需改代码：

- 第一个数字 = 详情行号（对应 `details.csv` 的 `index`，1-based）
- 第二个数字 = 该详情下的顺序（用于排序）
- 大小写不敏感；目录不存在时返回 `{}`（安全）
- 扫描结果挂到对应 `DetailRow.extraImages`

示例：

```
public/images/projects/memory/
├── detail-1.jpg          ← 主图（行号 1）
├── detail-1-1.jpg        ← 行号 1 的附加图 1
├── detail-1-2.jpg        ← 行号 1 的附加图 2
├── detail-2.jpg
└── detail-2-1.jpg
```

附加图在对应详情「了解更多」展开后显示（见 §3.5）。

### 2.5 图片资源文件夹命名约定

项目 / 展览图片存放在 `public/images/projects/` 或 `public/images/exhibitions/` 下。

- **项目**：文件夹名 = `contentDir`（主题名，如 `memory` / `through-our-own-filters`），**不是** slug。`works-data.ts` 中 `coverImage / views / details[].image` 都指向该文件夹。
- **展览**：文件夹名 = slug（如 `when-everything-changes`）。

项目文件夹内通常包含：

| 文件 | 用途 |
|---|---|
| `{contentDir}.jpg` | 封面图 `coverImage`（优先）；也可沿用 `project-N.jpg` |
| `preview/{contentDir}.webp` | 无 jpg 时的封面回退（如 project-2） |
| `view-1.jpg` ~ `view-N.jpg` | 现场图，供 ViewsCarousel（N 在 `works-data.ts` 中按实际图片数填写） |
| `detail-1.jpg` ~ `detail-N.jpg` | 详情主图，与 `details.csv` 行号一一对应 |
| `detail-{n}-{m}.jpg` | 附加图片（见 §2.4），自动扫描 |
| `preview/` 子目录 | webp 预览图，ViewsCarousel 等组件按需加载 |

> slug 保持不变（如 `project-1`），仅用于 URL 路由稳定性；图片与 CSV 用 `contentDir`（主题名）组织。

***

## 三、各区块详细说明

### 3.1 顶部封面图

```tsx
<div className="w-full bg-gray-100 relative">
  <Image src={coverImage} alt={title} width={1920} height={1080}
    className="w-full h-auto object-cover" priority />
</div>
```

- 全宽（`w-full`），不限制 max-width，撑满视口
- `object-cover` + 固定 `width/height={1920,1080}` 保证等比
- `priority` 标记为 LCP 优先加载
- 灰色底 `bg-gray-100` 作为加载占位

### 3.2 基础信息

**展览页**（居中：标题 + time + address，均来自 CSV）：

```tsx
<div className="text-center mb-12">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
      style={{ fontFamily: TITLE_FONT }}>{exhibition.title}</h1>
  <p className="text-sm text-gray-500 mb-1 tracking-wide">{exhibition.time}</p>
  <p className="text-base text-gray-700">{exhibition.address}</p>
</div>
```

**项目页**（居中标题 + time · address，仅当至少一个非空时显示该行）：

```tsx
<div className="text-center mb-12">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
      style={{ fontFamily: TITLE_FONT }}>{project.title}</h1>
  {(project.time || project.address) && (
    <p className="text-sm sm:text-base text-gray-500">
      {[project.time, project.address].filter(Boolean).join(" · ")}
    </p>
  )}
</div>
```

> `time` / `address` 来自 CSV，留空则不渲染；标题不参与翻译（中英共用）。

### 3.3 ViewsCarousel（现场图片轮播）

组件路径：`components/views-carousel.tsx`，`"use client"`。

**Props**：`{ views: string[] }`

**行为**：

- 自动播放：6 秒切换一次；手动点击箭头后暂停 15 秒再恢复
- 切换动画：700ms 交叉淡入淡出（opacity 过渡）
- 图片展示：16:9 容器，`object-contain`（完整展示不裁剪）
- 箭头：位于图片容器**外部两侧**，纯 SVG 无背景
- 进度条 + 计数器：图片下方，`当前序号 / 总数`
- 空状态：`views.length === 0` 时显示 16:9 灰底 + `t("ui.viewsEmpty")`（「现场图待补充」/ "Views to be added"）

**布局示意**：

```
┌─────────────────────────────────────────────┐
│  ←  │   ┌─────────────────────────┐   │  →  │
│     │   │   图片 (object-contain)  │   │     │
│     │   └─────────────────────────┘   │     │
├─────┴─────────────────────────────────┴─────┤
│  ▓▓▓▓▓▓░░░░░░░░░░  3 / 12                    │  ← 进度条 + 计数器
└──────────────────────────────────────────────┘
```

### 3.4 ExhibitionIntro（简介 + Read More · 双语）

组件路径：`app/exhibitions/[slug]/exhibition-intro.tsx`，`"use client"`，项目页与展览页共用。

**Props**：

```ts
{
  description: string;            // 中文简介
  fullDescription?: string;       // 中文完整介绍（可选）
  descriptionEn?: string;         // 英文简介
  fullDescriptionEn?: string;     // 英文完整介绍（可选）
  variant?: "exhibition" | "project";  // 决定 Read More 按钮文案 key
}
```

**行为**：

- 语言选择：`useEn = lang === "en" && descriptionEn`；英文模式用 `descriptionEn` / `fullDescriptionEn`，缺失时回退中文（`fullDescriptionEn ?? fullDescription`）。
- 分段：按**任意换行**分段（`activeDescription.split(/\n+/)`），即 Excel 单元格内 Alt+Enter = 段落分隔。
- `hasMore = fullParagraphs.length > 0`：仅当存在非空 `fullDescription` 时显示按钮。
- 按钮文案：展开前 `t(variant === "project" ? "ui.readMoreProject" : "ui.readMoreExhibition")`，展开后 `t("ui.readLess")`。

### 3.5 ProjectDetails（图文详情 · 仅项目页）⭐

组件路径：`components/project-details.tsx`，`"use client"`。

**Props**：`{ details: DetailRow[] }`

**分组逻辑（`buildGroups`）**：

- `level=0` 直接丢弃；
- `level=1` 新建一个分组，作为分组主项（header）；
- 紧随其后的连续 `level=2` 归入该分组的 `children`。

**左右交替规则**：

- 以**分组序号** `groupIndex` 决定左右：`isEven = groupIndex % 2 === 1`；
- 奇数分组（index 0,2,4…）左图右文，偶数分组（index 1,3,5…）左文右图；
- `level=2` 子项**继承所属 level=1 的方向**（与主项同侧），视觉上保持同一组对齐。

**展开（Learn More）**：

- `hasExpandable = 有 level=2 子项 || 有附加图片`；满足其一才显示按钮。
- 按钮文案：展开前 `t("ui.learnMore")`，展开后 `t("ui.readLess")`。
- 展开区内容顺序：
  1. **附加图片**（`extraImages`）：每张一行内 2 张、左右两列**都是图片**（`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12`）；奇数张时最后一张单独占左列。
  2. **level=2 子项**：用 `renderRow` 渲染，方向与父级主项一致。

**文字与语言**：

- 标题：`lang === "en" && row.titleEn` 时用英文，否则中文；
- 正文：英文模式用 `row.textEn ?? row.text`，缺英文回退中文；正文用 `whitespace-pre-wrap` 渲染，支持换行排版。

**空状态**：`details.length === 0` 时显示居中 `t("ui.detailsEmpty")`。

```
分组 0 (level=1，左图右文)        分组 1 (level=1，左文右图)
┌──────────┬──────────┐          ┌──────────┬──────────┐
│  Image   │  Title   │          │  Title   │  Image   │
│          │  Text    │          │  Text    │          │
│          │ [Learn More]         │          │ [Learn More]
└──────────┴──────────┘          └──────────┴──────────┘
   ↓ 展开                            ↓ 展开
┌─────────────┬─────────────┐    ┌─────────────┬─────────────┐
│  extraImg1  │  extraImg2  │    │ level2 文字 │ level2 图    │  ← 子项方向与父级一致
└─────────────┴─────────────┘    └─────────────┴─────────────┘
┌─────────────┬─────────────┐
│ level2 图   │ level2 文字 │   ← 继承父级"左图右文"方向
└─────────────┴─────────────┘
```

### 3.6 Featured Works（作品网格）

两个页面共用同一套渲染逻辑（项目页 `?from=project:slug`，展览页 `?from=exhibition:slug`）：

```tsx
<section>
  <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-8"
      style={{ fontFamily: TITLE_FONT }}>
    <T k="ui.featuredWorks" />
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
    {works.map((work, index) => {
      const ref = project.works[index]; // 或 exhibition.works[index]
      const href = `/whole-works/${ref}?from=project:${slug}`;
      return (
        <div key={work.slug}>
          <img src={work.thumbnail} alt={work.title} loading="lazy"
            className="w-full h-auto block" />
          <h3 className="text-base font-medium italic text-gray-900"
              style={{ fontFamily: TITLE_FONT }}>
            {work.displayTitle || work.title}
          </h3>
          {work.year && <p className="text-sm text-gray-600 mt-1">{work.year}</p>}
          <Link href={href} prefetch={false} className="...">
            <T k="ui.learnMore" />
          </Link>
        </div>
      );
    })}
  </div>
</section>
```

**要点**：

- 响应式列数：**移动端 1 列，sm 及以上 2 列**（`grid-cols-1 sm:grid-cols-2`），无 lg 3 列。
- 图片 `w-full h-auto`，完整展示不裁剪。
- 仅显示**作品名 + 年份**（不显示创作者/材料/尺寸）；「了解更多」按钮文案走 i18n。
- 跳转统一为 `/whole-works/[slug]`，`?from=` 传递上下文；`prefetch={false}` 避免 dev 预取中断报错。
- `works.length === 0` 时整个 section 不渲染。

### 3.7 返回链接

文案走 i18n，不再硬编码：

```tsx
<Link href="/#projects" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
  <T k="ui.backToProjects" />
</Link>
```

展览页对应 `href="/#exhibitions"` + `<T k="ui.backToExhibitions" />`。

***

## 四、多语言（i18n）与页面级辅助组件

### 4.1 语言上下文

- `lib/i18n.tsx`：`LanguageProvider` + `useLanguage()`，`app/layout.tsx` 全局包裹。默认 **EN**，持久化 key `xie-yike-lang`。
- `useLanguage()` 返回 `{ lang, setLang, toggle, t }`，客户端组件直接消费。
- 服务端组件中渲染固定文案 → 用 `<T k="..." />`（`components/i18n-text.tsx`，轻量客户端包装）。
- 动态内容（项目/展览介绍、详情文字）走数据模型的 `*En` 字段，组件内按 `lang` 取值并回退。
- 新增界面文案：在 `i18n.tsx` 的 `uiTranslations` 中同时补 `en` / `zh` 两个 key；`t()` 找不到 key 时返回 key 本身（便于发现漏译）。

> 不翻译的内容：作品标题、首页艺术家名（保持原样）。

### 4.2 ScrollRestorer（滚动位置恢复）

组件路径：`app/exhibitions/[slug]/scroll-restorer.tsx`，`"use client"`，项目页与展览页共用。

- 挂载时从 `sessionStorage` 读取 `exhibition-scroll:${slug}` 恢复 `scrollY`；滚动时持续保存。
- 从作品详情页（`/whole-works/[slug]?from=...`）点 Back 返回时，回到之前浏览位置而非顶部。

### 4.3 Navigation（导航 + 语言切换）

通过 `<Suspense fallback={null}><Navigation /></Suspense>` 懒加载，避免阻塞首屏。右上角固定容器内含 `LanguageToggle`（EN / 中文）与汉堡菜单，语言切换在左、汉堡在右。

***

## 五、路由与元数据

两个页面统一使用 `generateStaticParams` + `generateMetadata`：

```ts
export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  return {
    title: `${item.title} | Xie Yike`,
    description: `${item.title} by Xie Yike.`,
  };
}
```

找不到对应 slug 时调用 `notFound()`。

***

## 六、复用与新建流程

### 6.1 为新内容类型（如 Publications / Events）创建详情页

1. 判断是否符合此模板：顶部封面 + 基础信息 + 图片轮播 + 简介 + （可选详情）+ 关联作品列表 → 直接复用。
2. 新建数据类型：参考 `Project` / `Exhibition` 接口，按需增减字段；文本走 `content-loader` 的 CSV。
3. 复用组件：`ViewsCarousel`、`ExhibitionIntro`、`ScrollRestorer`、`ProjectDetails` 可直接 import。
4. 差异化区块：若需要新的中间区块，新建独立组件插入到分割线之间。
5. 保持容器统一：`max-w-7xl` 容器 + 相同 padding，确保多详情页视觉一致。

### 6.2 新建 Project 的标准流程（CSV 驱动，无需手写文字）

1. **建内容目录**：在 `content/projects/` 下新建主题名文件夹（如 `memory`），放入：
   - `introduction.csv`（GBK，表头 `title,time,address,introduction,introduction-en`，第 2 行数据）
   - `details.csv`（GBK，第 1 行 `count,N`，第 2 行表头，第 3 行起数据；含 `level` 列）
2. **建图片目录**：在 `public/images/projects/` 下新建**同名**主题名文件夹，放入封面图、`view-N.jpg`、`detail-N.jpg`，需要时放 `detail-{n}-{m}.jpg` 附加图（自动扫描）。
3. **注册数据**：在 `lib/works-data.ts` 的 `projects` 数组末尾追加一个 IIFE 条目，设置 `contentDir`、`slug`、封面图回退标题、views 数量、`works`：

   ```ts
   (() => {
     const contentDir = "my-theme";
     const intro = getProjectIntro(contentDir);
     const detailsCsv = getProjectDetails(contentDir);
     const extraImages = getProjectExtraImages(contentDir);
     const detailImages = Array.from(
       { length: detailsCsv.length },
       (_, i) => `/images/projects/${contentDir}/detail-${i + 1}.jpg`
     );
     return {
       slug: "project-5",
       title: intro.title || "My Theme",
       coverImage: `/images/projects/${contentDir}/my-theme.jpg`,
       contentDir,
       time: intro.time || undefined,
       address: intro.address || undefined,
       description: intro.zh,
       descriptionEn: intro.en,
       views: Array.from({ length: 6 }, (_, i) => `/images/projects/${contentDir}/view-${i + 1}.jpg`),
       details: detailsCsv.map((d, i) => ({
         image: detailImages[i] ?? "",
         title: d.title, text: d.detail,
         titleEn: d.titleEn || undefined, textEn: d.detailEn || undefined,
         level: d.level, extraImages: extraImages[d.index] ?? undefined,
       })),
       works: [], // 待指定作品 slug
     };
   })(),
   ```

4. **关联作品**：在 `works` 数组填入 `wholeWorks` 中的 slug（留空则不显示 Featured Works 区块）。
5. **触发重编译**：dev 模式下编辑 CSV / 加图后，保存一次 `works-data.ts` 或重启 dev server（见 §6.4）。
6. `npx tsc --noEmit` 验证类型。

### 6.3 新建 Exhibition 的标准流程

1. 在 `content/exhibitions/` 下新建文件夹（用 slug 名），放入 `introduction.csv`。
2. 在 `public/images/exhibitions/{slug}/` 放入封面图 `{slug}.jpg`、`view-N.jpg`。
3. 在 `lib/works-data.ts` 的 `exhibitions` 数组追加 IIFE 条目（结构同 §6.2，但无 `details`），填 `works`。
4. 触发重编译 + 类型检查。

### 6.4 开发注意（重要）

- **CSV 编码 GBK**：保存时务必确认，否则中文乱码。
- **改 CSV / 增删图片不自动热更新**：`works-data.ts` 在模块加载时读取 CSV 并 `readdirSync` 扫描图片。dev 下需保存一次 `works-data.ts`（哪怕只加注释）或重启 dev server，新内容才会生效。
- **`.next` 缓存**：安装新依赖或新增导出后若出现 `MODULE_NOT_FOUND` / `xxx is not defined`，删除 `apps/xie-yike/.next` 后重启。

***

## 七、代码索引

| 组件 / 模块 / 页面 | 路径 | 说明 |
|---|---|---|
| 项目详情页 | `apps/xie-yike/app/projects/[slug]/page.tsx` | 封面 → 信息 → Views → 简介 → Details → Featured Works |
| 展览详情页 | `apps/xie-yike/app/exhibitions/[slug]/page.tsx` | 同上，无 Details 区块 |
| 根布局（语言 Provider） | `apps/xie-yike/app/layout.tsx` | 包裹 `<LanguageProvider>` |
| ViewsCarousel | `apps/xie-yike/components/views-carousel.tsx` | 现场图轮播 |
| ProjectDetails | `apps/xie-yike/components/project-details.tsx` | level 分组 + 附加图片展开 + 双语 |
| ExhibitionIntro | `apps/xie-yike/app/exhibitions/[slug]/exhibition-intro.tsx` | 简介 + Read More，双语，项目/展览共用 |
| ScrollRestorer | `apps/xie-yike/app/exhibitions/[slug]/scroll-restorer.tsx` | 滚动位置恢复，两页共用 |
| Navigation + LanguageToggle | `apps/xie-yike/components/navigation.tsx` | 汉堡菜单 + EN/中文切换 |
| i18n 上下文 | `apps/xie-yike/lib/i18n.tsx` | `LanguageProvider` / `useLanguage` / `uiTranslations` |
| `<T>` 可翻译文案 | `apps/xie-yike/components/i18n-text.tsx` | 服务端组件中渲染翻译文案 |
| ABOUT 简介 | `apps/xie-yike/components/about-introduction.tsx` | 按语言渲染 zh/en 段落 |
| CSV 读取/解析 | `apps/xie-yike/lib/csv.ts` | GBK 解码 + 引号字段解析 |
| 内容加载器 | `apps/xie-yike/lib/content-loader.ts` | `getAboutIntro` / `getProjectIntro` / `getExhibitionIntro` / `getProjectDetails` / `getProjectExtraImages` |
| 数据类型与数据 | `apps/xie-yike/lib/works-data.ts` | `Project` / `Exhibition` / `DetailRow` / `wholeWorks` / 查询函数 |
| 构建配置 | `apps/xie-yike/next.config.mjs` | `outputFileTracingIncludes` 包含 `content/**` |
