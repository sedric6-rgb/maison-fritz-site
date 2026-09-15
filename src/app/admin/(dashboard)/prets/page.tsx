const LOANS = [
  { id: 1, client: "Jan Kowalski", type: "Immobilier", amount: "350 000", rate: "3,45%", duration: "25 ans", status: "en_cours", date: "01/06/2022" },
  { id: 2, client: "Anna Nowak", type: "Consommation", amount: "15 000", rate: "6,20%", duration: "3 ans", status: "en_cours", date: "15/01/2024" },
  { id: 3, client: "Piotr Wiśniewski", type: "Auto", amount: "45 000", rate: "4,50%", duration: "5 ans", status: "en_cours", date: "10/03/2023" },
  { id: 4, client: "Katarzyna Wójcik", type: "Immobilier", amount: "280 000", rate: "3,75%", duration: "20 ans", status: "demande", date: "05/09/2024" },
  { id: 5, client: "Tomasz Kamiński", type: "Professionnel", amount: "120 000", rate: "4,10%", duration: "7 ans", status: "approuve", date: "20/08/2024" },
  { id: 6, client: "Michał Zieliński", type: "Étudiant", amount: "8 000", rate: "2,00%", duration: "2 ans", status: "en_cours", date: "01/10/2023" },
  { id: 7, client: "Agnieszka Szymańska", type: "Consommation", amount: "25 000", rate: "5,80%", duration: "4 ans", status: "refuse", date: "12/07/2024" },
  { id: 8, client: "Magdalena Lewandowska", type: "Auto", amount: "60 000", rate: "4,30%", duration: "5 ans", status: "demande", date: "08/09/2024" },
];

const S: Record<string, string> = { en_cours: "bg-green-100 text-green-700", demande: "bg-yellow-100 text-yellow-700", approuve: "bg-blue-100 text-blue-700", refuse: "bg-red-100 text-red-700", rembourse: "bg-gray-100 text-gray-500" };
const L: Record<string, string> = { en_cours: "En cours", demande: "Demande", approuve: "Approuvé", refuse: "Refusé", rembourse: "Remboursé" };

export default function AdminPretsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crédits & Prêts</h1>
        <p className="text-sm text-gray-500 mt-1">{LOANS.length} dossiers</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Montant (PLN)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Taux</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Durée</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Date</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {LOANS.map((l) => (
              <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{l.client}</td>
                <td className="px-4 py-3 text-gray-500">{l.type}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{l.amount}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{l.rate}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{l.duration}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${S[l.status]}`}>{L[l.status]}</span></td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{l.date}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {l.status === "demande" && (
                    <>
                      <button className="text-xs text-green-600 hover:underline">Approuver</button>
                      <button className="text-xs text-red-600 hover:underline">Refuser</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
