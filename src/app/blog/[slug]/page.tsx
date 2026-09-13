import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/queries/blog";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <p className="text-sm text-ink-soft">{formatDate(post.published_at)}</p>
        <h1 className="mt-2 text-4xl">{post.title}</h1>
        {post.cover_image_url && (
          <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-sm bg-bg-alt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="mt-8 whitespace-pre-line text-ink-soft">{post.content}</div>
      </div>
    </article>
  );
}
