import { loginAction } from "@/lib/actions/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-sm border border-line bg-paper p-8">
        <div className="font-display text-xl font-semibold text-forest-deep">
          Maison <span className="text-ochre">Fritz</span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">Espace d&apos;administration</p>

        {error && (
          <p className="mt-4 text-sm text-terracotta">Mot de passe incorrect.</p>
        )}

        <form action={loginAction} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="next" value={next || "/admin"} />
          <div>
            <label className="field-label" htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" required className="field-input" />
          </div>
          <button type="submit" className="btn btn-primary">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
