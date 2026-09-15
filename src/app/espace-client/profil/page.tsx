import { getClientSession } from "@/lib/auth-client";
import { getClientById } from "@/lib/queries/banking";

export default async function ProfilPage() {
  const session = await getClientSession();
  const client = session ? await getClientById(session.clientId) : null;

  if (!client) return <p className="text-gray-500">Profil introuvable</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mon profil</h1>
      <p className="text-sm text-gray-500 mb-6">Vos informations personnelles et paramètres</p>

      <div className="space-y-6">
        <Section title="Informations personnelles">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Info label="Prénom" value={client.first_name} />
            <Info label="Nom" value={client.last_name} />
            <Info label="Date de naissance" value={client.date_of_birth} />
            <Info label="Nationalité" value={client.country} />
            <Info label="Numéro client" value={client.client_number} mono />
          </div>
        </Section>

        <Section title="Coordonnées">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Info label="Email" value={client.email} />
            <Info label="Téléphone" value={client.phone} />
            <Info label="Adresse" value={client.address} />
            <Info label="Ville" value={`${client.postal_code} ${client.city}`} />
          </div>
        </Section>

        <Section title="Sécurité">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mot de passe</p>
                <p className="text-xs text-gray-500">Dernière modification il y a 3 mois</p>
              </div>
              <button className="text-xs px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                <p className="text-xs text-gray-500">Non activée</p>
              </div>
              <button className="text-xs px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium hover:bg-green-100">Activer</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Dernière connexion</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} — Varsovie, Pologne</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Préférences de notification">
          <div className="space-y-3 text-sm">
            {["Alertes de transaction par email", "Notifications de sécurité par SMS", "Newsletter et offres"].map((label, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{label}</span>
                <div className={`relative w-11 h-6 rounded-full ${i < 2 ? "bg-blue-600" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${i < 2 ? "translate-x-5" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className={`font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
