const blockedClients = new Set<number>();

export function isClientBlocked(clientId: number): boolean {
  return blockedClients.has(clientId);
}

export function setClientBlocked(clientId: number, blocked: boolean): void {
  if (blocked) {
    blockedClients.add(clientId);
  } else {
    blockedClients.delete(clientId);
  }
}
