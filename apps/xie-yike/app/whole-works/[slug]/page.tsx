import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { WorkDetail } from "@personal-sites/shared";
import {
  wholeWorks,
  getWorkById,
  getExhibition,
  getProject,
  exhibitions,
} from "@/lib/works-data";

export function generateStaticParams() {
  return wholeWorks.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkById(slug);
  if (!work) return {};
  return {
    title: `${work.title} | Xie Yike`,
    description: `${work.title} by Xie Yike.`,
  };
}

export default async function WholeWorkDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const work = getWorkById(slug);

  if (!work) {
    notFound();
  }

  // 解析来源：from=exhibition:{slug} 或 from=project:{slug}
  let exhibitionSlug: string | null = null;
  let projectSlug: string | null = null;
  if (from) {
    if (from.startsWith("exhibition:")) {
      exhibitionSlug = from.slice("exhibition:".length);
    } else if (from.startsWith("project:")) {
      projectSlug = from.slice("project:".length);
    }
  }

  // 默认 Back 链接和导航列表
  let backHref = "/";
  let backLabel = "← Back to Home";
  let navSlugs: string[] = wholeWorks.map((w) => w.slug);

  if (exhibitionSlug) {
    const exhibition = getExhibition(exhibitionSlug);
    if (exhibition) {
      backHref = `/exhibitions/${exhibition.slug}`;
      backLabel = "← Back to Exhibition";
      navSlugs = exhibition.works;
    }
  } else if (projectSlug) {
    const project = getProject(projectSlug);
    if (project) {
      backHref = `/projects/${project.slug}`;
      backLabel = "← Back to Project";
      navSlugs = project.works;
    }
  }

  const currentIndex = navSlugs.indexOf(slug);
  const prevSlug = currentIndex > 0 ? navSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < navSlugs.length - 1 ? navSlugs[currentIndex + 1] : null;
  const prevWork = prevSlug ? getWorkById(prevSlug) : null;
  const nextWork = nextSlug ? getWorkById(nextSlug) : null;

  // 构造保持来源的链接
  const fromParam = exhibitionSlug
    ? `?from=exhibition:${exhibitionSlug}`
    : projectSlug
      ? `?from=project:${projectSlug}`
      : "";
  const prevHref = prevSlug
    ? `/whole-works/${prevSlug}${fromParam}`
    : null;
  const nextHref = nextSlug
    ? `/whole-works/${nextSlug}${fromParam}`
    : null;

  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24">
        <WorkDetail work={work} index={currentIndex} />

        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[12px] border-t border-gray-200 pt-8 gap-6">
          <div className="flex flex-wrap gap-4">
            {prevWork && prevHref && (
              <Link
                href={prevHref}
                prefetch={false}
                className="text-gray-600 hover:text-amber-700 transition-colors"
              >
                ← {prevWork.displayTitle || prevWork.title}
              </Link>
            )}
            {nextWork && nextHref && (
              <Link
                href={nextHref}
                prefetch={false}
                className="text-gray-600 hover:text-amber-700 transition-colors"
              >
                {nextWork.displayTitle || nextWork.title} →
              </Link>
            )}
          </div>
          <Link
            href={backHref}
            className="text-gray-500 hover:text-amber-700 transition-colors"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
