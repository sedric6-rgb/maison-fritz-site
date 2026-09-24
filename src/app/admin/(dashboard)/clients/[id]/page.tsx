"use client";

import Link from "next/link";
import { useState, useTransition, useEffect, useCallback } from "react";
import { blockClientAction, unblockClientAction, getClientBlockedStatus } from "@/lib/actions/client-block";
import { updateClientProfile, sendClientMessage, addClientTransaction } from "@/lib/actions/client-admin";

interface ClientData {
  id: number; client_number: string; first_name: string; last_name: string;
  email: string; phone: string; date_of_birth: string;
  address: string; city: string; postal_code: string; country: string;
  status: string; created_at: string;
}
interface AccountData { id: number; label: string; account_number: string; balance: number; account_type: string; }
interface CardData { card_number_last4: string; card_type: string; status: string; expiry_date: string; }
interface TxData { executed_at: string; description: string; amount: number; type: string; }

const INIT_CLIENT: ClientData = {
  id: 1, client_number: "CBP-284751", first_name: "Jan", last_name: "Kowalski",
  email: "jan.kowalski@email.lu", phone: "+352 621 345 678", date_of_birth: "15/03/1985",
  address: "12 Av. de la Gare", city: "Luxembourg", postal_code: "1611", country: "Luxembourg",
  status: "actif", created_at: "15/03/2022",
};

const FALLBACK_ACCOUNTS: AccountData[] = [
  { id: 1, label: "Compte Courant", account_number: "LU61 0019 1014 0000 0712 1981 2874", balance: 12847.53, account_type: "courant" },
  { id: 2, label: "Livret Epargne", account_number: "LU27 0019 2004 0000 3002 0135 5387", balance: 45230.00, account_type: "epargne" },
  { id: 3, label: "Compte Pro", account_number: "LU10 0019 0099 7603 1234 5678 9012", balance: 89415.22, account_type: "professionnel" },
];

const FALLBACK_CARDS: CardData[] = [
  { card_number_last4: "4827", card_type: "Visa Gold", status: "Active", expiry_date: "09/2027" },
  { card_number_last4: "9153", card_type: "Visa Debit", status: "Active", expiry_date: "03/2028" },
];

const FALLBACK_TXS: TxData[] = [
  { executed_at: "15/09/2024", description: "Cactus", amount: 125.5, type: "debit" },
  { executed_at: "15/09/2024", description: "Entreprise ABC — Salaire", amount: 4500, type: "credit" },
  { executed_at: "14/09/2024", description: "Delhaize", amount: 42.3, type: "debit" },
  { executed_at: "14/09/2024", description: "Credit Immobilier CBL", amount: 1567.23, type: "debit" },
];

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [clientId, setClientId] = useState<number>(1);
  const [client, setClient] = useState<ClientData>(INIT_CLIENT);
  const [accounts, setAccounts] = useState<AccountData[]>(FALLBACK_ACCOUNTS);
  const [cards, setCards] = useState<CardData[]>(FALLBACK_CARDS);
  const [txs, setTxs] = useState<TxData[]>(FALLBACK_TXS);
  const [editing, setEditing] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadData = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/admin/client/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.client) setClient(data.client);
        if (data.accounts?.length) setAccounts(data.accounts);
        if (data.cards?.length) setCards(data.cards);
        if (data.transactions?.length) setTxs(data.transactions);
      }
    } catch { /* fallback to hardcoded */ }
  }, []);

  useEffect(() => {
    params.then((p) => {
      const id = Number(p.id);
      setClientId(id);
      setClient((prev) => ({ ...prev, id }));
      loadData(id);
    });
  }, [params, loadData]);

  useEffect(() => {
    getClientBlockedStatus(clientId).then((blocked) => {
      if (blocked) setClient((prev) => ({ ...prev, status: "bloqué" }));
    }).catch(() => {});
  }, [clientId]);

  const saveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      first_name: String(fd.get("first_name")),
      last_name: String(fd.get("last_name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      address: String(fd.get("address")),
      city: String(fd.get("city")),
      postal_code: String(fd.get("postal_code")),
    };
    setClient((prev) => ({ ...prev, ...data }));
    setEditing(false);
    startTransition(async () => {
      const res = await updateClientProfile(clientId, data);
      notify(res.success ? "Profil mis a jour en base" : "Profil mis a jour (mode demo)");
    });
  };

  const toggleBlock = () => {
    const wasActive = client.status === "actif";
    const msg = wasActive
      ? "Bloquer ce client ?\n\nLe client ne pourra plus acceder a son espace en ligne."
      : "Reactiver ce client ?\n\nLe client retrouvera l'acces a tous ses services.";
    if (!confirm(msg)) return;
    setClient((prev) => ({ ...prev, status: wasActive ? "bloqué" : "actif" }));
    startTransition(async () => {
      if (wasActive) {
        await blockClientAction(clientId);
        notify("Client bloque");
      } else {
        await unblockClientAction(clientId);
        notify("Client reactive");
      }
    });
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = String(fd.get("subject"));
    const body = String(fd.get("body"));
    setMsgOpen(false);
    startTransition(async () => {
      const res = await sendClientMessage(clientId, subject, body);
      notify(res.success ? "Message envoye au client" : "Message envoye (mode demo)");
    });
  };

  const addTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const type = String(fd.get("type"));
    const amount = Number(fd.get("amount"));
    const account_id = Number(fd.get("account_id"));
    const description = String(fd.get("description"));
    setTxOpen(false);
    startTransition(async () => {
      const res = await addClientTransaction(clientId, { type, amount, account_id, description });
      if (res.success) {
        notify("Transaction enregistree en base");
        loadData(clientId);
      } else {
        notify("Transaction enregistree (mode demo)");
      }
    });
  };

  const statusColor = client.status === "actif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/clients" className="text-sm text-blue-600 hover:underline mb-2 inline-block">&larr; Retour aux clients</Link>
          <h1 className="text-2xl font-bold text-gray-900">{client.first_name} {client.last_name}</h1>
          <p className="text-sm text-gray-500 font-mono">{client.client_number}</p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{client.status === "actif" ? "Actif" : "Bloque"}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {editing ? (
            <form onSubmit={saveEdit}>
              <h2 className="font-semibold text-gray-900 mb-4">Modifier le profil</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><label className="block text-gray-500 mb-1">Prenom</label><input name="first_name" defaultValue={client.first_name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Nom</label><input name="last_name" defaultValue={client.last_name} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Email</label><input name="email" type="email" defaultValue={client.email} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Telephone</label><input name="phone" defaultValue={client.phone} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Adresse</label><input name="address" defaultValue={client.address} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Ville</label><input name="city" defaultValue={client.city} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-gray-500 mb-1">Code postal</label><input name="postal_code" defaultValue={client.postal_code} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">Enregistrer</button>
                <button type="button" onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">Annuler</button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                <Info label="Prenom" value={client.first_name} /><Info label="Nom" value={client.last_name} />
                <Info label="Email" value={client.email} /><Info label="Telephone" value={client.phone} />
                <Info label="Date de naissance" value={client.date_of_birth} /><Info label="Nationalite" value={client.country} />
                <Info label="Adresse" value={`${client.address}, ${client.postal_code} ${client.city}`} />
                <Info label="Client depuis" value={client.created_at} />
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-2">
            <button onClick={() => setEditing(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Modifier le profil</button>
            <button onClick={() => setMsgOpen(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Envoyer un message</button>
            <button onClick={() => setTxOpen(true)} className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-[#003d82] hover:bg-blue-50">Nouvelle transaction</button>
            <button onClick={toggleBlock} disabled={isPending} className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm ${client.status === "actif" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"} disabled:opacity-50`}>
              {client.status === "actif" ? "Bloquer le client" : "Reactiver le client"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Comptes bancaires</h2>
          <div className="space-y-3">
            {accounts.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.label}</p>
                  <p className="text-xs font-mono text-gray-400">{a.account_number}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{a.balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</span>
              </div>
            ))}
            <p className="text-right text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
              Total : {accounts.reduce((s, a) => s + a.balance, 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Cartes bancaires</h2>
          <div className="space-y-3">
            {cards.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.card_type}</p>
                  <p className="text-xs text-gray-400">**** **** **** {c.card_number_last4} — Exp. {c.expiry_date}</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Dernieres operations</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-200">
            <th className="text-left py-2 font-medium text-gray-500">Date</th>
            <th className="text-left py-2 font-medium text-gray-500">Description</th>
            <th className="text-right py-2 font-medium text-gray-500">Montant</th>
          </tr></thead>
          <tbody>
            {txs.map((tx, i) => {
              const amt = tx.type === "credit" ? tx.amount : -tx.amount;
              return (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 text-gray-600">{tx.executed_at}</td>
                  <td className="py-2 text-gray-700">{tx.description}</td>
                  <td className={`py-2 text-right font-medium ${amt >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {amt >= 0 ? "+" : ""}{amt.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {msgOpen && (
        <Modal onClose={() => setMsgOpen(false)}>
          <form onSubmit={sendMessage} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Envoyer un message</h2>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label><input name="subject" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea name="body" rows={4} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex gap-3">
              <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">Envoyer</button>
              <button type="button" onClick={() => setMsgOpen(false)} className="text-sm text-gray-500">Annuler</button>
            </div>
          </form>
        </Modal>
      )}

      {txOpen && (
        <Modal onClose={() => setTxOpen(false)}>
          <form onSubmit={addTransaction} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Nouvelle transaction</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="type" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="credit">Credit</option><option value="debit">Debit</option><option value="virement">Virement</option><option value="prelevement">Prelevement</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Montant (EUR)</label><input name="amount" type="number" min="0.01" step="0.01" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
              <select name="account_id" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.label} — {a.account_number}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input name="description" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex gap-3">
              <button type="submit" disabled={isPending} className="bg-[#003d82] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#002a5c] disabled:opacity-50">Enregistrer</button>
              <button type="button" onClick={() => setTxOpen(false)} className="text-sm text-gray-500">Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-gray-500 text-sm">{label}</dt><dd className="font-medium text-gray-900 text-sm">{value}</dd></div>;
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
