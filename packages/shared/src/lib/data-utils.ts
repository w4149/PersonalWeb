import type { WorkCategory, Work, LayoutRowSpec } from "./types";

/**
 * 通用数据查询工具函数。
 * 各站点的 works-data.ts 会导入这些函数并传入站点自己的 workCategories，
 * 再以"绑定了站点数据"的形式 re-export 给页面使用。
 */

export function getCategory(
  categories: WorkCategory[],
  slug: string
): WorkCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getWorksByYear(
  categories: WorkCategory[],
  categorySlug: string,
  year: number
): Work[] | undefined {
  const category = getCategory(categories, categorySlug);
  if (!category?.worksByYear) return undefined;
  return category.worksByYear[year];
}

export function getWork(
  categories: WorkCategory[],
  categorySlug: string,
  year: number,
  workSlug: string
): Work | undefined {
  const works = getWorksByYear(categories, categorySlug, year);
  if (!works) return undefined;
  return works.find((w) => w.slug === workSlug);
}

export function getLayoutForYear(
  categories: WorkCategory[],
  categorySlug: string,
  year: number
): LayoutRowSpec[] | undefined {
  const category = getCategory(categories, categorySlug);
  if (!category?.layoutByYear) return undefined;
  return category.layoutByYear[year];
}
