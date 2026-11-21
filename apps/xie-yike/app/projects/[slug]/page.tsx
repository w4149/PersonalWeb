import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { ViewsCarousel } from "@/components/views-carousel";
import { ProjectDetails } from "@/components/project-details";
import { T } from "@/components/i18n-text";
import { projects, getProject, getProjectWorks } from "@/lib/works-data";
import { ExhibitionIntro } from "@/app/exhibitions/[slug]/exhibition-intro";
import { ScrollRestorer } from "@/app/exhibitions/[slug]/scroll-restorer";

const TITLE_FONT =
  "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} | Xie Yike`,
    description: `${project.title} by Xie Yike.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const works = getProjectWorks(project);

  return (
    <main className="min-h-screen bg-white">
      <ScrollRestorer slug={project.slug} />
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      {/* 顶部全宽封面图，等比例 */}
      <div className="w-full bg-gray-100 relative">
        <Image
          src={project.coverImage}
          alt={project.title}
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-12 md:py-16">
        {/* 基础信息（居中） */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: TITLE_FONT }}
          >
            {project.title}
          </h1>
          {(project.time || project.address) && (
            <p className="text-sm sm:text-base text-gray-500">
              {[project.time, project.address].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* 分割线 */}
        <hr className="border-gray-200 mb-12" />

        {/* Views 现场图片灯箱 */}
        <ViewsCarousel views={project.views} />

        {/* 介绍 / 前言 */}
        <ExhibitionIntro
          description={project.description}
          fullDescription={project.fullDescription}
          descriptionEn={project.descriptionEn}
          fullDescriptionEn={project.fullDescriptionEn}
          variant="project"
        />

        {/* 分割线 */}
        <hr className="border-gray-200 my-12" />

        {/* Details 图文详情 */}
        <ProjectDetails details={project.details} />

        {/* 分割线 */}
        <hr className="border-gray-200 my-12" />

        {/* 作品列表（Grid 视图） */}
        {works.length > 0 && (
          <section>
            <h2
              className="text-2xl sm:text-3xl font-medium text-gray-900 mb-8"
              style={{ fontFamily: TITLE_FONT }}
            >
              <T k="ui.featuredWorks" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {works.map((work, index) => {
                const ref = project.works[index];
                const href = `/whole-works/${ref}?from=project:${project.slug}`;
                return (
                  <div key={work.slug} className="block">
                    <div className="w-full bg-white overflow-hidden">
                      <img
                        src={work.thumbnail}
                        alt={work.title}
                        loading="lazy"
                        className="w-full h-auto block"
                      />
                    </div>
                    <div className="mt-4">
                      <h3
                        className="text-base font-medium italic text-gray-900"
                        style={{ fontFamily: TITLE_FONT }}
                      >
                        {work.displayTitle || work.title}
                      </h3>
                      {work.year && (
                        <p className="text-sm text-gray-600 mt-1">
                          {work.year}
                        </p>
                      )}
                      {href && (
                        <Link
                          href={href}
                          prefetch={false}
                          className="inline-block mt-3 px-4 py-1.5 border border-gray-300 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <T k="ui.learnMore" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 返回 */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link
            href="/#projects"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <T k="ui.backToProjects" />
          </Link>
        </div>
      </div>
    </main>
  );
}
