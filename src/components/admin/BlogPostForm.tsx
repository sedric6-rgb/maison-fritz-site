import type { BlogPost } from "@/lib/queries/blog";

export function BlogPostForm({
  action,
  post,
}: {
  action: (formData: FormData) => void;
  post?: BlogPost;
}) {
  return (
    <form action={action} className="mt-6 grid max-w-2xl gap-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label className="field-label" htmlFor="title">Titre</label>
        <input id="title" name="title" required defaultValue={post?.title} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="cover_image_url">Image de couverture (URL)</label>
        <input id="cover_image_url" name="cover_image_url" defaultValue={post?.cover_image_url || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="excerpt">Résumé court</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt || ""} className="field-input" />
      </div>

      <div>
        <label className="field-label" htmlFor="content">Contenu</label>
        <textarea id="content" name="content" rows={12} required defaultValue={post?.content} className="field-input" />
      </div>

      <div>
        <button type="submit" className="btn btn-primary">
          {post ? "Enregistrer les modifications" : "Publier l'article"}
        </button>
      </div>
    </form>
  );
}
