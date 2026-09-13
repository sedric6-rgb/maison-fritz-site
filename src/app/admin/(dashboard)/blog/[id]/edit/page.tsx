import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/queries/blog";
import { updateBlogPostAction } from "@/lib/actions/admin-blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(Number(id));
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-3xl">Modifier : {post.title}</h1>
      <BlogPostForm action={updateBlogPostAction} post={post} />
    </div>
  );
}
