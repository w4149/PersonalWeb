import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { WorkDetail } from "@personal-sites/shared";
import { otherWorks, getOtherWork } from "@/lib/works-data";

export function generateStaticParams() {
  return otherWorks.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getOtherWork(slug);
  if (!work) return {};
  return {
    title: `${work.title} | Xie Yike`,
    description: `${work.title} by Xie Yike.`,
  };
}

export default async function OtherWorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getOtherWork(slug);

  if (!work) {
    notFound();
  }

  const currentIndex = otherWorks.findIndex((w) => w.slug === slug);
  const prevRef = currentIndex > 0 ? otherWorks[currentIndex - 1] : null;
  const nextRef =
    currentIndex < otherWorks.length - 1 ? otherWorks[currentIndex + 1] : null;
  const prevWork = prevRef ? getOtherWork(prevRef.slug) : null;
  const nextWork = nextRef ? getOtherWork(nextRef.slug) : null;

  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24">
        <WorkDetail work={work} index={currentIndex} />

        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[12px] border-t border-gray-200 pt-8 gap-6">
          <div className="flex flex-wrap gap-4">
            {prevWork && (
              <Link
                href={`/other-works/${prevWork.slug}`}
                className="text-gray-600 hover:text-amber-700 transition-colors"
              >
                ← {prevWork.displayTitle || prevWork.title}
              </Link>
            )}
            {nextWork && (
              <Link
                href={`/other-works/${nextWork.slug}`}
                className="text-gray-600 hover:text-amber-700 transition-colors"
              >
                {nextWork.displayTitle || nextWork.title} →
              </Link>
            )}
          </div>
          <Link
            href="/#other-works"
            className="text-gray-500 hover:text-amber-700 transition-colors"
          >
            ← Back to Other Works
          </Link>
        </div>
      </div>
    </main>
  );
}
