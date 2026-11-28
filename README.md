# Personal Sites Monorepo

艺术家个人作品展示网站 monorepo，基于 **npm workspaces** 管理，当前包含两个独立站点和一个共享组件包：

| 站点 | 包名 | 说明 |
|---|---|---|
| **Deng Manyuan（邓蔓媛）** | `@personal-sites/deng-manyuan` | 按分类 × 年份组织的作品画廊，6 种主页布局模板 + 10 种附页模板，图片走 Cloudflare R2 CDN |
| **Xie Yike（谢一可）** | `@personal-sites/xie-yike` | 单页滚动首页（HOME / ABOUT / EXHIBITIONS / PROJECTS / OTHER WORKS / NEWS）+ 项目/展览/作品详情页，图片存本地 `public/images/`，文本由 `content/` 下的 CSV 统一管理，支持 **EN / 中文** 切换 |
| **Shared** | `@personal-sites/shared` | 跨站点复用组件：`work-detail`、`previewable-image`、`justified-gallery`、`category-gallery`、类型与工具函数 |

---

## 目录

- [技术栈](#技术栈)
- [Monorepo 目录结构](#monorepo-目录结构)
- [站点一：Deng Manyuan](#站点一deng-manyuan)
- [站点二：Xie Yike](#站点二xie-yike)
- [共享包 Shared](#共享包-shared)
- [模板文档清单](#模板文档清单)
- [图片预览图（WebP）生成](#图片预览图webp生成)
- [启动 / 构建 / 类型检查](#启动--构建--类型检查)
- [开发注意事项](#开发注意事项)
- [版本快照](#版本快照)

---

## 技术栈

| 层 | 技术 | 版本 / 说明 |
|---|---|---|
| 框架 | Next.js | **15.2.8**（App Router，RSC + `"use client"` 交互组件）|
| 视图层 | React | 18.3.1 |
| 类型 | TypeScript | 严格模式，每轮修改通过 `npx tsc --noEmit` 0 输出验证 |
| 样式 | Tailwind CSS | 3.4.13 |
| 图片存储 | Cloudflare R2 CDN + 本地 | deng-manyuan 走 R2；xie-yike 存本地 `public/images/` |
| 内容源 | CSV（GBK 编码） | xie-yike 的所有项目/展览/简介文字均来自 `content/` 下的 CSV，编辑后 rebuild 即生效 |
| 包管理 | npm workspaces | `apps/*` + `packages/*` |

---

## Monorepo 目录结构

```
.
├── apps/
│   ├── deng-manyuan/                 # 站点一：邓蔓媛
│   │   ├── app/
│   │   │   ├── page.tsx              # 首页
│   │   │   ├── about/, news/, researches/
│   │   │   └── works/
│   │   │       ├── page.tsx          # WORKS 顶层分类卡
│   │   │       └── [category]/[year]/
│   │   │           ├── page.tsx      # 分类画廊（JustifiedGallery）
│   │   │           └── [slug]/page.tsx  # 作品详情（WorkDetail）
│   │   ├── components/               # navigation 等
│   │   ├── lib/works-data.ts         # 31 件作品数据（单一数据源）
│   │   ├── scripts/                  # prepare-images / generate-previews 等
│   │   └── public/images/            # R2 回退本地图
│   │
│   └── xie-yike/                     # 站点二：谢一可
│       ├── app/
│       │   ├── layout.tsx            # 包裹 <LanguageProvider>
│       │   ├── page.tsx              # 首页（6 section 单页滚动）
│       │   ├── exhibitions/[slug]/   # 展览详情页（含 ExhibitionIntro / ScrollRestorer）
│       │   ├── projects/[slug]/      # 项目详情页
│       │   ├── whole-works/[slug]/   # 作品详情页（galleryView）
│       │   └── other-works/[slug]/   # 其他作品详情页
│       ├── components/
│       │   ├── navigation.tsx        # 汉堡菜单 + LanguageToggle（EN / 中文）
│       │   ├── i18n-text.tsx         # <T k="..." /> 服务端可翻译文案
│       │   ├── about-introduction.tsx# ABOUT 简介（按当前语言渲染 zh/en 段落）
│       │   ├── views-carousel.tsx    # 现场图轮播
│       │   └── project-details.tsx   # 图文详情（level 分组 + 附加图片展开）
│       ├── lib/
│       │   ├── i18n.tsx              # LanguageContext / Provider / useLanguage / uiTranslations
│       │   ├── csv.ts                # GBK CSV 读取与解析
│       │   ├── content-loader.ts     # 从 content/ 加载简介/详情/附加图片
│       │   └── works-data.ts         # WholeWorks 资源库 + projects + exhibitions
│       ├── content/                  # ⭐ 文本唯一来源（CSV，GBK）
│       │   ├── about/introduction.csv
│       │   ├── projects/{contentDir}/introduction.csv + details.csv
│       │   └── exhibitions/{contentDir}/introduction.csv
│       ├── scripts/generate-previews.mjs  # WebP 预览图生成
│       ├── next.config.mjs           # outputFileTracingIncludes 包含 content/**
│       └── public/images/            # 本地图片（whole-works / projects / exhibitions）
│
├── packages/
│   └── shared/                       # @personal-sites/shared
│       └── src/
│           ├── components/
│           │   ├── work-detail.tsx       # 6 主页模板 + 附页模板 + SafeImg
│           │   ├── previewable-image.tsx # PreviewableImg + LightboxProvider
│           │   ├── justified-gallery.tsx # 同行等高校准画廊
│           │   └── category-gallery.tsx  # WORKS 顶层分类卡
│           └── lib/                   # types, gallery-config, utils
│
├── WORK_LAYOUT_TEMPLATES.md          # 作品主页 6 模板文档
├── SUBPAGE_TEMPLATES.md              # 作品附页模板文档
├── DETAIL_PAGE_TEMPLATES.md          # 项目/展览详情页模板 + CSV 规约（2026-11 更新）
├── package.json                      # workspaces 根配置
└── README.md                         # ← 本文件
```

---

## 站点一：Deng Manyuan

艺术家邓蔓媛个人作品展示网站，采用数据驱动的作品管理模式，支持 4 大分类 × 3 年 × 31 件作品的灵活组织。

### 数据架构

**单源真值**：`apps/deng-manyuan/lib/works-data.ts`

```
workCategories: WorkCategory[]
  ├── name / slug
  └── years: YearGroup[]
       ├── year
       └── works: Work[]
            ├── slug / title / materials / description
            ├── thumbnail / aspectRatio / cover / coverAspectRatio
            ├── images[] / layout / imgWidthRatio / gridColumns
            ├── heroLink / heroCaption / link
            └── subPages: SubPage[]
```

### 路由

| 路由 | 页面 |
|---|---|
| `/` | 首页 |
| `/works` | WORKS 顶层 4 分类卡片 |
| `/works/[category]/[year]` | 分类画廊（JustifiedGallery 同行等高） |
| `/works/[category]/[year]/[slug]` | 作品详情页（WorkDetail，6 种 layout + 附页） |

### 图片资源

全部走 **Cloudflare R2 CDN**，前缀：`https://pub-0152450371c44ecb87bb433ea94e2039.r2.dev`

| 用途 | 路径 | 字段 |
|---|---|---|
| 分类画廊封面 | `images/{category}-{YYYY}/covers/{slug}.{jpg,png}` | `Work.cover` |
| 作品主图 | `images/{category}-{YYYY}/{slug}/main-1.{jpg,png}` | `Work.thumbnail` |
| 附页图片 | `images/{category}-{YYYY}/{slug}/part-{N}.{jpg,png}` | `SubPage.images[].src` |

### 模板

- **作品主页 6 模板**：SideBySide / Centered / HeroImage / HeroImageBottom / Grid / GalleryView → 详见 [WORK_LAYOUT_TEMPLATES.md](./WORK_LAYOUT_TEMPLATES.md)
- **附页 10 模板**：multiRow / single / row / grid / stackedRight / textLeftStackedRight / leftMainRightStacked / sevenSplit / fiveImageStack / becomingHumanCollage5 → 详见 [SUBPAGE_TEMPLATES.md](./SUBPAGE_TEMPLATES.md)

---

## 站点二：Xie Yike

艺术家谢一可个人网站，首页采用单页滚动 + 汉堡导航 + scroll snap，作品通过 **WholeWorks 集中资源库** 统一管理；所有项目/展览/简介文字由 `content/` 下的 CSV 驱动，界面支持 **英文（默认）/ 中文** 切换。

### 数据架构：WholeWorks 资源库 + CSV 内容源

`apps/xie-yike/lib/works-data.ts` 采用**资源库 + 引用**模式，文本内容在模块加载时从 `content/` 的 CSV 读取：

```
wholeWorks: Work[]          ← 资源库（34 件作品），不直接展示
  └── 每件作品含 slug / title / thumbnail / aspectRatio / layout("galleryView")
      / year / dimensions / materials / description / subPages?

projects: Project[]         ← 通过 works: string[] 引用 wholeWorks 的 slug
  ├── contentDir / coverImage / views[]
  ├── title / time / address            ← 来自 content/projects/{dir}/introduction.csv
  ├── description / descriptionEn       ← 简介（中/英）
  ├── fullDescription / fullDescriptionEn?  ← 可选，Read More 展开后追加
  └── details: DetailRow[]              ← 来自 details.csv（含 level / 中英 / 附加图）

exhibitions: Exhibition[]   ← 通过 works: string[] 引用 wholeWorks 的 slug
  ├── contentDir / coverImage / views[]
  ├── title / time / address            ← 来自 content/exhibitions/{dir}/introduction.csv
  ├── description / descriptionEn / fullDescription? / fullDescriptionEn?
  └── works: string[]

otherWorks: OtherWorkRef[]  ← 通过 workId 引用 wholeWorks
```

> 项目/展览的**标题、时间、地点、介绍、详情**全部从 CSV 读取（仅作品标题与首页艺术家名仍在 `works-data.ts` 中维护）。编辑 CSV 后 rebuild 即生效，无需改代码。

### 多语言切换（i18n）

- 实现：`lib/i18n.tsx` 暴露 `LanguageProvider` + `useLanguage()`（返回 `{ lang, setLang, toggle, t }`），`app/layout.tsx` 全局包裹。
- 默认语言：**English**（`DEFAULT_LANG = "en"`），选择持久化到 `localStorage`（key：`xie-yike-lang`）。
- 切换入口：导航栏右上角 `LanguageToggle`（`EN` / `中文` 文本按钮），位于汉堡菜单左侧。
- 文案来源：
  - 界面固定文案 → `uiTranslations` 字典（`nav.*` / `section.*` / `ui.*` / `lang.*`），在 `i18n.tsx` 增改。
  - 动态内容（项目/展览介绍、详情文字）→ 数据模型的 `*En` 字段（来自 CSV），组件按当前语言取值，缺英文时回退中文。
  - 服务端组件中渲染可翻译文案 → 用 `<T k="ui.xxx" />`（`components/i18n-text.tsx`，轻量客户端包装）。

> 约定：新增 UI 文案时在 `uiTranslations` 的 `en` / `zh` 同时补 key；缺失 key 时 `t()` 返回 key 本身（便于发现漏译）。

### 内容管理：CSV 唯一来源

`content/` 是文本的唯一来源，`lib/content-loader.ts` 在服务端读取并解析。

```
content/
├── about/introduction.csv                 # 首页 ABOUT 简介（zh / en 段落）
├── projects/{contentDir}/
│   ├── introduction.csv                   # title,time,address,introduction,introduction-en
│   └── details.csv                        # index,title,title-en,detail,detail-en,level
└── exhibitions/{contentDir}/
    └── introduction.csv                   # 同项目 introduction.csv
```

**关键规约**：

- **编码：GBK**（中文 Windows 的 Excel 默认）。读取用 `new TextDecoder("gbk")`，**不要**按 UTF-8 读，否则中文乱码。保存 CSV 时务必选「CSV (MS-DOS)」/ GBK，或用支持指定编码的编辑器。
- **introduction.csv**：第 1 行表头，第 2 行数据。`time` / `address` 为空 → 页面不渲染（不会留空行）。段落：ABOUT 按空行分段；详情页简介按任意换行（`\n+`）分段（Excel 中 Alt+Enter 即可）。
- **details.csv**：第 1 行 `count,N,,,,`（统计行，跳过），第 2 行表头 `index,title,title-en,detail,detail-en,level`，第 3 行起为数据。`level`：`0`=隐藏，`1`=直接显示，`2`=隶属于上一条 `level=1`，点击「了解更多」后显示。
- 含逗号/换行的字段必须用双引号包裹；字段内的双引号写作 `""`。
- 构建包含：`next.config.mjs` 的 `outputFileTracingIncludes` 已声明 `./content/**/*`，确保生产构建打包 CSV。

CSV 格式与 `details.csv` 的 level / 附加图片联动详见 [DETAIL_PAGE_TEMPLATES.md](./DETAIL_PAGE_TEMPLATES.md) §二。

### 路由

| 路由 | 页面 |
|---|---|
| `/` | 首页（HOME / ABOUT / EXHIBITIONS / PROJECTS / OTHER WORKS / NEWS）|
| `/projects/[slug]` | 项目详情页 |
| `/exhibitions/[slug]` | 展览详情页 |
| `/whole-works/[slug]` | 作品详情页（galleryView，支持 `?from=project:slug` / `?from=exhibition:slug` 上下文）|
| `/other-works/[slug]` | 其他作品详情页 |

### 首页布局约定

首页为单页滚动 + scroll snap，每个区块独立成页。滚动容器使用 `snap-y snap-proximity`（就近吸附，允许停在过渡区域）。

**区块顺序（每个 `snap-start`）**：

```
1. HOME          ← 全屏背景图 + 黑色蒙版 + 白色文字（艺术家名 / 身份 / 简介）
2. ABOUT         ← 居中艺术家照片 + 左对齐简介（文字来自 CSV，按语言切换；无 ABOUT 标题）
2.5 BRIDGE       ← 半屏（50vh）过渡图，全宽，宽度中间 80% 裁剪
3. EXHIBITIONS   ← 每个展览独占一页（大图居中 + 元数据），标题仅在第一页显示
4. PROJECTS      ← 每个项目独占一页（大图居中 + 标题），标题仅在第一页显示
5. OTHER WORKS   ← JustifiedGallery 作品墙
6. NEWS          ← Coming soon（占位）
```

**各区块细节**：

| 区块 | 关键样式 |
|---|---|
| **HOME** | 背景图 `background-1.jpg`，宽度取中间 80%（容器 125% 左移 12.5%），高度取中间 60%（容器 166.67% 上移 33.33%）；叠加 `bg-black/40`；文字全白（`text-white` / `text-white/70` / `text-white/90`） |
| **ABOUT** | 无标题；照片 `yike_xie.jpg` 居中（`max-w-md`）；简介文字 `max-w-4xl mx-auto`，左对齐，段落来自 `content/about/introduction.csv`，随语言切换 |
| **BRIDGE** | `h-[50vh]`；图片 `bridge-to-exhibition.jpg` 全宽，宽度中间 80% 裁剪；无文字 |
| **EXHIBITIONS / PROJECTS** | 每个条目 `snap-start min-h-screen` 独立一页；封面图 `max-w-4xl` 4:3 居中；下方居中显示标题/元数据；区块大标题仅在 `index === 0` 时显示 |

**通用约定**：
- 内容容器统一 `max-w-5xl mx-auto`，内边距 `px-6 sm:px-8 md:px-16 lg:px-24`
- 封面图容器需加 `relative`，避免 `Image fill` 溢出
- 图片裁剪技巧：需取图片中间 N% 时，容器设为 `100/N * 100%` 宽度/高度，`left/top` 偏移 `-(100/N * 100 - 100) / 2`%，父级 `overflow-hidden`

### 详情页结构

项目详情页与展览详情页共享统一骨架，差异仅在 Details 区块：

```
封面图（全宽）→ 基础信息（标题 + time · address）→ ViewsCarousel → ExhibitionIntro
→ [ProjectDetails]（仅项目页：level 分组 + 附加图片展开）→ Featured Works（2 列）→ 返回链接
```

详见 [DETAIL_PAGE_TEMPLATES.md](./DETAIL_PAGE_TEMPLATES.md)。

### 图片资源

**存本地** `apps/xie-yike/public/images/`：

| 用途 | 路径 | 说明 |
|---|---|---|
| 首页背景图 | `backgrounds/background-1.jpg` | HOME 区块全屏背景 |
| 过渡图 | `bridges/bridge-to-exhibition.jpg` | ABOUT → EXHIBITIONS 之间的 bridge |
| 艺术家照片 | `introduction/yike_xie.jpg` | ABOUT 区块 |
| 作品图 | `whole-works/{slug}/main.jpg` + `preview/*.webp` | WholeWorks 资源库 |
| 项目图 | `projects/{contentDir}/...` | **文件夹用主题名**（如 `memory`），非 slug |
| 展览图 | `exhibitions/{slug}/...` | 文件夹用 slug |

项目图片文件夹内通常包含：

| 文件 | 用途 |
|---|---|
| `{contentDir}.jpg`（或沿用 `project-N.jpg` / `preview/{contentDir}.webp`） | 封面图 `coverImage`，优先 jpg，无 jpg 时回退 `preview/` 下的 webp |
| `view-1.jpg` ~ `view-N.jpg` | 现场图，供 ViewsCarousel（数量在 `works-data.ts` 中按实际填写） |
| `detail-1.jpg` ~ `detail-N.jpg` | 详情主图，与 `details.csv` 行号一一对应 |
| `detail-{n}-{m}.jpg` | 附加图片：n=详情行号，m=序号，自动扫描，在「了解更多」展开区显示（2 张一行） |
| `preview/` 子目录 | webp 预览图，ViewsCarousel 等组件按需使用 |

> 文件夹命名、level 与附加图片联动详见 [DETAIL_PAGE_TEMPLATES.md](./DETAIL_PAGE_TEMPLATES.md) §二。

---

## 共享包 Shared

`packages/shared`（`@personal-sites/shared`）提供跨站点复用能力：

| 模块 | 说明 |
|---|---|
| `work-detail.tsx` | 作品详情页：6 种主页 layout + 附页模板 + `SafeImg` 三级容错 |
| `previewable-image.tsx` | `PreviewableImg`（预览图→原图渐现）+ `LightboxProvider` 全屏看图 |
| `justified-gallery.tsx` | 同行等高校准画廊（onLoad natural dims + ResizeObserver） |
| `category-gallery.tsx` | WORKS 顶层分类卡片 |
| `lib/types.ts` | `Work` / `SubPage` 等共享类型 |
| `lib/gallery-config.ts` | `GAP = 24` 等全局常量 |

---

## 模板文档清单

| 文档 | 内容 |
|---|---|
| [WORK_LAYOUT_TEMPLATES.md](./WORK_LAYOUT_TEMPLATES.md) | 作品主页 6 种 layout 模板（SideBySide / Centered / HeroImage / HeroImageBottom / Grid / GalleryView） |
| [SUBPAGE_TEMPLATES.md](./SUBPAGE_TEMPLATES.md) | 作品附页模板（multiRow / sevenSplit / fiveImageStack 等） |
| [DETAIL_PAGE_TEMPLATES.md](./DETAIL_PAGE_TEMPLATES.md) | 项目/展览详情页模板 + CSV 内容规约 + i18n + 新建流程 |

---

## 图片预览图（WebP）生成

作品详情页的 `PreviewableImg` 会先加载 `preview/{name}.webp` 低分辨率预览图，再渐现原图。WebP 预览图需通过脚本生成：

```bash
# 为 xie-yike 生成预览图
cd apps/xie-yike
node scripts/generate-previews.mjs

# deng-manyuan 同理
cd apps/deng-manyuan
node scripts/generate-previews.mjs
```

脚本会扫描 `public/images/` 下所有 `.jpg/.jpeg/.png`（跳过 `preview/` 子目录），按长边阈值等比缩放输出 `.webp` 到同级 `preview/` 目录，增量检测（preview 更新时间 ≥ 原图则跳过）。

---

## 启动 / 构建 / 类型检查

```bash
# 安装依赖（根目录执行，workspaces 自动链接）
npm install

# 启动单个站点开发服务器
npm run dev:deng-manyuan      # http://localhost:3000
npm run dev:xie-yike          # http://localhost:3000（若 3000 被占则 3001）

# 生产构建
npm run build:deng-manyuan
npm run build:xie-yike
npm run build:all             # 构建所有 workspace

# 类型检查（进入对应 app 目录执行）
cd apps/xie-yike ; npx tsc --noEmit
cd apps/deng-manyuan ; npx tsc --noEmit
```

> Windows PowerShell 5 不支持 `&&`，用 `;` 分隔或分两次执行；npm 用 `.cmd`（`npm.cmd run dev`）。端口冲突时 Next.js 自动 fallback 到下一个可用端口，两个站点同时运行时先启的占 3000。

---

## 开发注意事项

- **CSV 必须存为 GBK**：Excel 在中文 Windows 下默认即 GBK；若用其他编辑器保存请确认编码，否则中文乱码（`lib/csv.ts` 用 `TextDecoder("gbk")` 读取）。
- **编辑 CSV / 增删图片后需触发重编译**：`works-data.ts` 在模块加载时（IIFE）调用 `content-loader` 读取 CSV 并 `readdirSync` 扫描图片。dev 模式下改 CSV 或加图**不会自动刷新**，需保存一次 `works-data.ts`（任意改动、甚至只加注释）或重启 dev server。
- **清空 `.next` 缓存**：安装新依赖或新增导出函数后，若出现 `MODULE_NOT_FOUND` / `xxx is not defined` 等运行时错误，先删除 `apps/xie-yike/.next` 再重启 dev server。
- **字符串引号**：TS 源码字面量里若出现英文直引号 `"` 会引发 `TS1005`，文本内容现已从 CSV 运行时读取、不受影响；仅在代码字符串中需用 `\u2019`（撇号）/ `\u201c`/`\u201d`（引号）等转义。
- **i18n 作用域**：作品标题与首页艺术家名暂不翻译，保持原样；其余可翻译文案走 `uiTranslations` 或数据 `*En` 字段。

---

## 内容维护规约（常见操作 SOP）

以下操作均围绕 `apps/xie-yike` 的内容（CSV 文案 + R2 图片 + 预览图），是日常维护最容易踩坑的环节。命令均已在本仓库验证可用。

### CSV 编辑（GBK 编码，必须用 PowerShell）

`content/` 下所有 CSV 均为 **GBK 编码**（`lib/csv.ts` 用 `TextDecoder("gbk")` 读取）。

> ⚠️ **不要**用编辑器或 IDE 的 Edit 工具直接保存 CSV——会被转成 UTF-8，导致中文乱码。
> ⚠️ **Grep 工具搜不到 GBK 中文**（ripgrep 默认按 UTF-8 匹配），搜索 CSV 内容必须用 PowerShell。

**读取（GBK → 控制台 UTF-8 显示）：**

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$gbk = [System.Text.Encoding]::GetEncoding(936)
$path = "apps/xie-yike/content/projects/through-our-own-filters/details.csv"
$text = [System.IO.File]::ReadAllText($path, $gbk)
Write-Output $text
```

**修改并写回（保持 GBK 编码）：**

```powershell
$gbk = [System.Text.Encoding]::GetEncoding(936)
$path = "apps/xie-yike/content/projects/xxx/details.csv"
$text = [System.IO.File]::ReadAllText($path, $gbk)
$text = $text -replace "旧文本", "新文本"          # 正则替换；匹配换行用 (\r?\n)+
[System.IO.File]::WriteAllText($path, $text, $gbk)  # 必须用 GBK 写回
```

### R2 图片探测 + view 数量对齐

`works-data.ts` 中每个项目的 `views: Array.from({ length: N })` 的 **N 必须与 R2 上实际存在的 `view-1.jpg ~ view-N.jpg` 数量一致**，否则页面会出现 404 空白。

- R2 公共前缀（xie-yike）：`https://pub-191526e40b2f4ebe994bafe555eeeeb7.r2.dev`，在 `lib/works-data.ts` 中导出为 `R2`。
- 完整 URL = `${R2}/images/projects/{contentDir}/view-N.jpg`。

**探测 R2 上某项目的 view 文件是否存在（HEAD 请求）：**

```powershell
$base = "https://pub-191526e40b2f4ebe994bafe555eeeeb7.r2.dev/images/projects/behind-the-display"
for ($i = 1; $i -le 12; $i++) {
  try {
    $r = Invoke-WebRequest -Uri "$base/view-$i.jpg" -Method Head -UseBasicParsing -TimeoutSec 20
    Write-Output ("view-{0}: OK" -f $i)
  } catch {
    Write-Output ("view-{0}: {1}" -f $i, $_.Exception.Response.StatusCode.value__)
  }
}
```

改完 `length` 后务必 build + 浏览器验证对应页面的计数器上限、无 404、无空白。

### CSV 文案审查（防止擅自添加内容）

编辑 CSV 后，**全量扫描所有 CSV**，检查是否有非用户原文的擅自添加（问句、征询语、agent 口吻）。

**扫描所有含全角问号「？」的行**（正式艺术文案不应出现问句）：

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$gbk = [System.Text.Encoding]::GetEncoding(936)
Get-ChildItem "apps" -Recurse -Filter *.csv -File | ForEach-Object {
  $lines = ([System.IO.File]::ReadAllText($_.FullName, $gbk)) -split "`r?`n"
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "？") { Write-Output ("{0}:{1}: {2}" -f $_.FullName, ($i + 1), $lines[$i]) }
  }
}
```

也可追加扫描可疑模式：`吗？`、`吧？`、`需要.*吗`、`是否`、`要不要`。命中后**人工判断**是否为正文正常用词（例如 memory 文案里的「需要观众走近」是正常内容，不是擅自添加）。

### 预览图生成 + 无图行渲染

- **生成 WebP 预览**：`cd apps/xie-yike ; node scripts/generate-previews.mjs`。脚本增量生成（preview 更新时间 ≥ 原图则跳过），并会自动重生成「未缩放」的旧预览（长边 > 1600px 但实际未缩放的，会被覆盖重生成）。
- **详情行无图（左文右空）**：在 `works-data.ts` 的 `details` map 中把某行 `image` 设为 `""`，`renderRow`（`components/project-details.tsx`）就不会渲染该图片列，文字保留在原位。例如 memory 项目的「总结」行：
  ```ts
  image: d.title === "总结" ? "" : (detailImages[i] ?? ""),
  ```

---

## 版本快照

### Deng Manyuan（2026-08-29）

- 作品总数：**31 件**，thumbnail & cover 100% 就位
- 分类：Paintings（2024/2025/2026）、Installations（2025/2026）、Workshops（2025/2026）、Photograph & Videos（2026）
- 主页模板：5 统一实现（8 旧 layout 值向后兼容）+ GalleryView
- 附页模板：9 通用 + 1 定制（becomingHumanCollage5）

### Xie Yike（2026-11-21）

- WholeWorks 资源库：**34 件作品**，全部使用 `galleryView` layout
- 多语言：**EN 默认 / 中文** 切换，持久化到 localStorage；项目/展览/简介文字已双语
- 内容源：`content/` 下 CSV（GBK）驱动所有项目/展览/简介文字；`details.csv` 支持 level 分级与附加图片
- Projects：4 个，全部接入 CSV 内容
  - `project-1`「回忆 / memory」：12 张 views + 16 条 details + 7 件作品
  - `project-2`「Through Our Own Filters」：6 张 views + 3 条 details（works 待指定）
  - `project-3`「Behind the Display」：9 张 views + 3 条 details（works 待指定）
  - `project-4`「Drawn into the Depths」：6 张 views + 2 条 details（works 待指定）
- Exhibitions：2 个，全部接入 CSV 内容与现场图
  - `when-everything-changes`：6 张 views + 18 件作品
  - `the-landscape-of-chaos`：5 张 views + 15 件作品
- Other Works：6 件（引用 wholeWorks）
- 详情页：Featured Works 改为 2 列网格；ProjectDetails 支持 level 分组 + 附加图片「了解更多」展开
