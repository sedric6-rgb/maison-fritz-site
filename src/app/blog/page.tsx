import Link from "next/link";
import { listBlogPosts } from "@/lib/queries/blog";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function BlogListPage() {
  const posts = await listBlogPosts();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <h1 className="text-4xl">Blog</h1>
        {posts.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">Les premiers articles arrivent bientôt.</p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-bg-alt">
                  {post.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <p className="mt-3 text-xs text-ink-soft">{formatDate(post.published_at)}</p>
                <h2 className="mt-1 text-lg font-semibold">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
