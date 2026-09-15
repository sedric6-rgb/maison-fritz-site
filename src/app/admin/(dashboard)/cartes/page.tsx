const CARDS = [
  { id: 1, last4: "4827", client: "Jan Kowalski", type: "Visa Gold", account: "PL61...2874", status: "active", expiry: "09/2027" },
  { id: 2, last4: "9153", client: "Jan Kowalski", type: "Visa Débit", account: "PL61...2874", status: "active", expiry: "03/2028" },
  { id: 3, last4: "3841", client: "Anna Nowak", type: "Visa Classic", account: "PL83...1234", status: "active", expiry: "12/2026" },
  { id: 4, last4: "7629", client: "Piotr Wiśniewski", type: "Visa Gold", account: "PL44...1234", status: "active", expiry: "06/2027" },
  { id: 5, last4: "1058", client: "Katarzyna Wójcik", type: "Visa Débit", account: "PL92...8745", status: "en_fabrication", expiry: "09/2028" },
  { id: 6, last4: "5294", client: "Tomasz Kamiński", type: "Visa Platinum", account: "PL15...8523", status: "active", expiry: "01/2027" },
  { id: 7, last4: "8173", client: "Magdalena Lewandowska", type: "Visa Classic", account: "PL44...7821", status: "bloquee", expiry: "05/2026" },
  { id: 8, last4: "2946", client: "Michał Zieliński", type: "Visa Débit", account: "PL29...4512", status: "active", expiry: "08/2028" },
];

const S: Record<string, string> = { active: "bg-green-100 text-green-700", bloquee: "bg-red-100 text-red-700", en_fabrication: "bg-blue-100 text-blue-700", expiree: "bg-gray-100 text-gray-500" };
const L: Record<string, string> = { active: "Active", bloquee: "Bloquée", en_fabrication: "En fabrication", expiree: "Expirée" };

export default function AdminCartesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cartes bancaires</h1>
        <p className="text-sm text-gray-500 mt-1">{CARDS.length} cartes émises</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Carte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Compte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Expiration</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {CARDS.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">**** {c.last4}</td>
                <td className="px-4 py-3 text-gray-700">{c.client}</td>
                <td className="px-4 py-3 text-gray-500">{c.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden md:table-cell">{c.account}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[c.status]}`}>{L[c.status]}</span></td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.expiry}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {c.status === "active" && <button className="text-xs text-red-600 hover:underline">Bloquer</button>}
                  {c.status === "bloquee" && <button className="text-xs text-green-600 hover:underline">Activer</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
