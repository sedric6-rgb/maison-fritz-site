const ACCOUNTS = [
  { id: 1, number: "PL61 1090 1014 0000 0712 1981 2874", holder: "Jan Kowalski", type: "Courant", balance: "12 847,53", status: "actif", opened: "15/03/2022" },
  { id: 2, number: "PL27 1140 2004 0000 3002 0135 5387", holder: "Jan Kowalski", type: "Épargne", balance: "45 230,00", status: "actif", opened: "15/03/2022" },
  { id: 3, number: "PL10 1050 0099 7603 1234 5678 9012", holder: "Jan Kowalski", type: "Pro", balance: "89 415,22", status: "actif", opened: "20/06/2023" },
  { id: 4, number: "PL83 1020 1026 0000 0422 0000 1234", holder: "Anna Nowak", type: "Courant", balance: "5 621,80", status: "actif", opened: "22/07/2023" },
  { id: 5, number: "PL44 1160 2202 0000 0002 4447 1234", holder: "Piotr Wiśniewski", type: "Courant", balance: "23 105,44", status: "actif", opened: "10/01/2023" },
  { id: 6, number: "PL92 1240 6247 1111 0010 4319 8745", holder: "Katarzyna Wójcik", type: "Épargne", balance: "0,00", status: "en_attente", opened: "01/09/2024" },
  { id: 7, number: "PL15 1060 0076 0000 3310 0018 8523", holder: "Tomasz Kamiński", type: "Pro", balance: "156 420,10", status: "actif", opened: "18/05/2023" },
];

const S: Record<string, string> = { actif: "bg-green-100 text-green-700", en_attente: "bg-yellow-100 text-yellow-700", bloque: "bg-red-100 text-red-700", ferme: "bg-gray-100 text-gray-500" };
const L: Record<string, string> = { actif: "Actif", en_attente: "En attente", bloque: "Bloqué", ferme: "Fermé" };

export default function AdminComptesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comptes bancaires</h1>
          <p className="text-sm text-gray-500 mt-1">{ACCOUNTS.length} comptes</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Numéro IBAN</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Titulaire</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Solde (PLN)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Ouvert le</th>
          </tr></thead>
          <tbody>
            {ACCOUNTS.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{a.number}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{a.holder}</td>
                <td className="px-4 py-3 text-gray-500">{a.type}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{a.balance}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[a.status]}`}>{L[a.status]}</span></td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{a.opened}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
