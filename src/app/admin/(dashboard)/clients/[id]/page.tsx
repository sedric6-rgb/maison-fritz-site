import Link from "next/link";

const CLIENT = {
  id: 1, client_number: "CBP-284751", first_name: "Jan", last_name: "Kowalski",
  email: "jan.kowalski@email.pl", phone: "+48 612 345 678", date_of_birth: "15/03/1985",
  address: "12 ul. Marszałkowska", city: "Varsovie", postal_code: "00-001", country: "Pologne",
  id_type: "Carte d'identité", id_number: "AXR 482916", status: "actif", created_at: "15/03/2022",
};

const ACCOUNTS = [
  { label: "Compte Courant", number: "PL61 1090 1014 0000 0712 1981 2874", balance: "12 847,53 PLN", type: "courant" },
  { label: "Livret Épargne", number: "PL27 1140 2004 0000 3002 0135 5387", balance: "45 230,00 PLN", type: "epargne" },
  { label: "Compte Pro", number: "PL10 1050 0099 7603 1234 5678 9012", balance: "89 415,22 PLN", type: "professionnel" },
];

const CARDS = [
  { last4: "4827", type: "Visa Gold", status: "Active", expiry: "09/2027" },
  { last4: "9153", type: "Visa Débit", status: "Active", expiry: "03/2028" },
];

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/clients" className="text-sm text-blue-600 hover:underline mb-2 inline-block">← Retour aux clients</Link>
          <h1 className="text-2xl font-bold text-gray-900">{CLIENT.first_name} {CLIENT.last_name}</h1>
          <p className="text-sm text-gray-500 font-mono">{CLIENT.client_number}</p>
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">Actif</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            <Info label="Prénom" value={CLIENT.first_name} />
            <Info label="Nom" value={CLIENT.last_name} />
            <Info label="Email" value={CLIENT.email} />
            <Info label="Téléphone" value={CLIENT.phone} />
            <Info label="Date de naissance" value={CLIENT.date_of_birth} />
            <Info label="Nationalité" value={CLIENT.country} />
            <Info label="Adresse" value={`${CLIENT.address}, ${CLIENT.postal_code} ${CLIENT.city}`} />
            <Info label="Pièce d'identité" value={`${CLIENT.id_type} — ${CLIENT.id_number}`} />
            <Info label="Client depuis" value={CLIENT.created_at} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Modifier le profil</button>
            <button className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Envoyer un message</button>
            <button className="w-full text-left px-4 py-2.5 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50">Bloquer le client</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Comptes bancaires</h2>
          <div className="space-y-3">
            {ACCOUNTS.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.label}</p>
                  <p className="text-xs font-mono text-gray-400">{a.number}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{a.balance}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Cartes bancaires</h2>
          <div className="space-y-3">
            {CARDS.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.type}</p>
                  <p className="text-xs text-gray-400">**** **** **** {c.last4} — Exp. {c.expiry}</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}
