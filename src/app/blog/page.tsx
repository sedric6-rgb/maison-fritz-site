import Link from "next/link";
import { listBlogPosts } from "@/lib/queries/blog";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function BlogListPage() {
  const posts = await listBlogPosts();

  return (
    <section className="py-16 sm:py-20">
      <div className="wrap">
        <p className="eyebrow">Magazine</p>
        <h1 className="mt-4">Blog</h1>
        {posts.length === 0 ? (
          <p className="mt-20 text-center text-ink-soft">Les premiers articles arrivent bientôt.</p>
        ) : (
          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[4/3] w-full overflow-hidden bg-bg-alt">
                  {post.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.cover_image_url} alt={post.title} className="img-cover img-zoom" />
                  )}
                </div>
                <p className="mt-4 text-xs text-ink-faint">{formatDate(post.published_at)}</p>
                <h2 className="mt-1 text-xl">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
