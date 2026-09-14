import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/queries/blog";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16 sm:py-20">
      <div className="wrap-text">
        <p className="text-sm text-ink-faint">{formatDate(post.published_at)}</p>
        <h1 className="mt-3">{post.title}</h1>
        {post.cover_image_url && (
          <div className="mt-10 aspect-[16/9] w-full overflow-hidden bg-bg-alt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.title} className="img-cover" />
          </div>
        )}
        <div className="mt-10 whitespace-pre-line text-ink-soft">{post.content}</div>
      </div>
    </article>
  );
}
