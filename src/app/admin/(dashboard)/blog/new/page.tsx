import { createBlogPostAction } from "@/lib/actions/admin-blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-3xl">Nouvel article</h1>
      <BlogPostForm action={createBlogPostAction} />
    </div>
  );
}
