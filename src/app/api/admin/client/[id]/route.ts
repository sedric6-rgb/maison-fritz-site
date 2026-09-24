import { NextRequest, NextResponse } from "next/server";
import { getClientById, getClientAccounts, getClientCards, getAccountTransactions } from "@/lib/queries/banking";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clientId = Number(id);
  if (!clientId) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const [client, accounts, cards] = await Promise.all([
    getClientById(clientId),
    getClientAccounts(clientId),
    getClientCards(clientId),
  ]);

  const firstAccount = accounts[0];
  const transactions = firstAccount ? await getAccountTransactions(firstAccount.id, 20) : [];

  return NextResponse.json({ client, accounts, cards, transactions });
}
