import Link from "next/link";
import { listBlogPosts } from "@/lib/queries/blog";
import { deleteBlogPostAction } from "@/lib/actions/admin-blog";
import { formatDate } from "@/lib/format";

export const revalidate = 0;

export default async function AdminBlogPage() {
  const posts = await listBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Blog</h1>
        <Link href="/admin/blog/new" className="btn btn-primary">
          + Nouvel article
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-ink-soft">{formatDate(p.published_at)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <Link href={`/admin/blog/${p.id}/edit`} className="text-forest-deep underline">
                Modifier
              </Link>
              <form action={deleteBlogPostAction}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="text-terracotta underline">
                  Supprimer
                </button>
              </form>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="py-8 text-center text-ink-soft">Aucun article pour le moment.</p>
        )}
      </div>
    </div>
  );
}
