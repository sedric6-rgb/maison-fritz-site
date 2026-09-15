"use client";

import { useState } from "react";

const MESSAGES = [
  { id: 1, subject: "Bienvenue chez Caixa Banque Pologne", body: "Cher M. Kowalski,\n\nNous avons le plaisir de vous accueillir parmi nos clients. Votre compte est maintenant actif et vous pouvez profiter de l'ensemble de nos services bancaires en ligne.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nVotre conseiller Caixa Banque Pologne", sender: "banque", read: true, date: "15 janv. 2024" },
  { id: 2, subject: "Votre nouvelle carte Visa Gold est prête", body: "Votre carte Visa Gold **** 4827 a été émise et sera disponible dans votre agence sous 5 jours ouvrés.\n\nPlafond mensuel : 5 000 PLN\nPaiement sans contact : Activé\n\nCordialement,\nService Cartes", sender: "banque", read: false, date: "10 sept. 2024" },
  { id: 3, subject: "Confirmation de virement", body: "Votre virement de 2 800,00 PLN vers Immobiliare Sp. z o.o. a été exécuté avec succès le 12 septembre 2024.\n\nRéférence : VIR-2024091208000008", sender: "banque", read: false, date: "12 sept. 2024" },
];

export default function MessageriePage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  const selected = MESSAGES.find((m) => m.id === selectedId);

  if (showCompose) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowCompose(false)} className="text-sm text-blue-600 hover:underline">← Retour</button>
          <h1 className="text-xl font-bold text-gray-900">Nouveau message</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Objet</label><input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea rows={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button className="bg-[#003d82] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">Envoyer</button>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Retour à la messagerie</button>
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{selected.subject}</h2>
          <p className="text-xs text-gray-500 mb-4">{selected.sender === "banque" ? "Caixa Banque Pologne" : "Vous"} — {selected.date}</p>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selected.body}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messagerie</h1>
          <p className="text-sm text-gray-500 mt-1">{MESSAGES.filter((m) => !m.read).length} message(s) non lu(s)</p>
        </div>
        <button onClick={() => setShowCompose(true)} className="inline-flex items-center gap-2 bg-[#003d82] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#002a5c]">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M12 2l2 2-8 8H4v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Nouveau message
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {MESSAGES.map((msg) => (
          <button key={msg.id} onClick={() => setSelectedId(msg.id)}
            className={`w-full text-left flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${!msg.read ? "bg-blue-50/50" : ""}`}>
            <div className={`w-2 h-2 rounded-full shrink-0 ${!msg.read ? "bg-blue-600" : "bg-transparent"}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${!msg.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>{msg.subject}</p>
              <p className="text-xs text-gray-400 truncate">{msg.body.slice(0, 80)}...</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{msg.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
