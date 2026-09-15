"use client";

import { useState } from "react";

const CARDS = [
  { id: 1, last4: "4827", type: "Visa Gold", expiry: "09/2027", status: "active", limit: 5000, contactless: true, online: true, account: "Compte Courant" },
  { id: 2, last4: "9153", type: "Visa Débit", expiry: "03/2028", status: "active", limit: 2000, contactless: true, online: true, account: "Compte Courant" },
];

const CARD_COLORS: Record<string, string> = {
  "Visa Gold": "from-yellow-600 to-yellow-800",
  "Visa Débit": "from-blue-600 to-blue-900",
  "Visa Classic": "from-gray-600 to-gray-800",
  "Visa Platinum": "from-gray-800 to-black",
};

export default function CartesPage() {
  const [cards, setCards] = useState(CARDS);

  const toggleOption = (id: number, option: "contactless" | "online") => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, [option]: !c[option] } : c));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mes cartes bancaires</h1>
      <p className="text-sm text-gray-500 mb-6">Gérez vos cartes et paramètres de sécurité</p>

      <div className="space-y-8">
        {cards.map((card) => (
          <div key={card.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card visual */}
            <div className={`bg-gradient-to-br ${CARD_COLORS[card.type] || "from-blue-600 to-blue-900"} rounded-2xl p-6 text-white aspect-[1.586/1] max-w-[400px] flex flex-col justify-between shadow-lg`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-white/70">Caixa Banque Pologne</p>
                  <p className="text-sm font-medium mt-1">{card.type}</p>
                </div>
                <svg width="40" height="26" viewBox="0 0 40 26"><rect width="40" height="26" rx="3" fill="white" fillOpacity="0.2"/><text x="6" y="17" fill="white" fontSize="10" fontWeight="bold">VISA</text></svg>
              </div>
              <div>
                <p className="text-lg font-mono tracking-widest mb-3">•••• •••• •••• {card.last4}</p>
                <div className="flex justify-between text-xs">
                  <div><span className="text-white/60">Expiration</span><p className="font-medium">{card.expiry}</p></div>
                  <div><span className="text-white/60">Compte</span><p className="font-medium">{card.account}</p></div>
                </div>
              </div>
            </div>

            {/* Card options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Paramètres</h3>
              <div className="space-y-4">
                <Toggle label="Paiement sans contact" enabled={card.contactless} onToggle={() => toggleOption(card.id, "contactless")} />
                <Toggle label="Paiement en ligne" enabled={card.online} onToggle={() => toggleOption(card.id, "online")} />
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Plafond mensuel</label>
                  <p className="text-lg font-bold text-gray-900">{card.limit.toLocaleString("fr-FR")} PLN</p>
                </div>
                <div className="pt-3 border-t border-gray-200 flex gap-2">
                  <button className="text-xs px-4 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100">Bloquer la carte</button>
                  <button className="text-xs px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200">Opposer la carte</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${enabled ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
