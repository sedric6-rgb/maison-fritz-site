const TXS = [
  { id: 1, date: "15/09/2024 14:23", account: "PL61...2874", type: "Carte", amount: "-125,50", counterparty: "Biedronka", ref: "CB-2024091514230001" },
  { id: 2, date: "15/09/2024 11:05", account: "PL61...2874", type: "Virement entrant", amount: "+4 500,00", counterparty: "Entreprise ABC", ref: "VIR-2024091511050002" },
  { id: 3, date: "14/09/2024 18:47", account: "PL61...2874", type: "Carte", amount: "-42,30", counterparty: "Żabka", ref: "CB-2024091418470003" },
  { id: 4, date: "14/09/2024 09:00", account: "PL61...2874", type: "Prélèvement", amount: "-1 567,23", counterparty: "Crédit Immobilier CBP", ref: "PRLV-2024091409000004" },
  { id: 5, date: "13/09/2024 16:30", account: "PL10...9012", type: "Virement sortant", amount: "-8 500,00", counterparty: "Fournisseur XYZ Sp. z o.o.", ref: "VIR-2024091316300005" },
  { id: 6, date: "13/09/2024 12:15", account: "PL27...5387", type: "Intérêt", amount: "+122,34", counterparty: "Intérêts Livret Épargne", ref: "INT-2024091312150006" },
  { id: 7, date: "12/09/2024 20:10", account: "PL61...2874", type: "Carte", amount: "-89,90", counterparty: "Allegro", ref: "CB-2024091220100007" },
  { id: 8, date: "12/09/2024 08:00", account: "PL61...2874", type: "Virement sortant", amount: "-2 800,00", counterparty: "Immobiliare Sp. z o.o.", ref: "VIR-2024091208000008" },
  { id: 9, date: "11/09/2024 15:45", account: "PL10...9012", type: "Virement entrant", amount: "+15 000,00", counterparty: "Client Projekt Alfa", ref: "VIR-2024091115450009" },
  { id: 10, date: "11/09/2024 10:30", account: "PL61...2874", type: "Retrait", amount: "-500,00", counterparty: "DAB Varsovie Centre", ref: "ATM-2024091110300010" },
  { id: 11, date: "10/09/2024 19:20", account: "PL61...2874", type: "Carte", amount: "-234,50", counterparty: "PKP Intercity", ref: "CB-2024091019200011" },
  { id: 12, date: "10/09/2024 14:00", account: "PL61...2874", type: "Prélèvement", amount: "-350,00", counterparty: "PGE Energia", ref: "PRLV-2024091014000012" },
];

export default function AdminTransactionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Suivi des opérations bancaires</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Compte</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-right px-4 py-3 font-medium text-gray-500">Montant (PLN)</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Contrepartie</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Référence</th>
          </tr></thead>
          <tbody>
            {TXS.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{tx.date}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{tx.account}</td>
                <td className="px-4 py-3 text-gray-700">{tx.type}</td>
                <td className={`px-4 py-3 text-right font-medium ${tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}>{tx.amount}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{tx.counterparty}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 hidden lg:table-cell">{tx.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
