import { db } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export type ClientStatus =
  | "nouveau"
  | "contacte"
  | "qualifie"
  | "negociation"
  | "converti"
  | "perdu";

export type Client = {
  id: number;
  full_name: string;
  phone: string | null;
  email: string | null;
  status: ClientStatus;
  source: string | null;
  assigned_agent_id: number | null;
  source_lead_id: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientActivity = {
  id: number;
  client_id: number;
  type: "note" | "appel" | "email" | "rdv" | "autre";
  content: string;
  created_at: string;
};

export type ClientFollowup = {
  id: number;
  client_id: number;
  due_date: string;
  note: string | null;
  is_done: boolean;
  created_at: string;
};

// Le schéma du CRM est créé automatiquement au premier appel : cela évite
// d'avoir à exécuter une migration manuelle sur la base de production.
// Le résultat est mis en cache sur `globalThis` (comme le pool de connexion)
// pour ne s'exécuter qu'une seule fois par processus serveur.
const globalForCrm = globalThis as unknown as { crmSchemaReady?: Promise<void> };

function ensureCrmSchema(): Promise<void> {
  if (!globalForCrm.crmSchemaReady) {
    globalForCrm.crmSchemaReady = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS clients (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(191) NOT NULL,
          phone VARCHAR(64),
          email VARCHAR(191),
          status ENUM('nouveau','contacte','qualifie','negociation','converti','perdu') NOT NULL DEFAULT 'nouveau',
          source VARCHAR(191),
          assigned_agent_id INT,
          source_lead_id INT,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (assigned_agent_id) REFERENCES agents(id) ON DELETE SET NULL,
          FOREIGN KEY (source_lead_id) REFERENCES contact_leads(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      await db.query(`
        CREATE TABLE IF NOT EXISTS client_activities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          client_id INT NOT NULL,
          type ENUM('note','appel','email','rdv','autre') NOT NULL DEFAULT 'note',
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      await db.query(`
        CREATE TABLE IF NOT EXISTS client_followups (
          id INT AUTO_INCREMENT PRIMARY KEY,
          client_id INT NOT NULL,
          due_date DATE NOT NULL,
          note VARCHAR(500),
          is_done BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    })();
  }
  return globalForCrm.crmSchemaReady;
}

export type ClientFilters = {
  status?: ClientStatus;
  agentId?: number;
};

export async function listClients(filters: ClientFilters = {}): Promise<Client[]> {
  await ensureCrmSchema();
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (filters.status) {
    where.push("status = ?");
    params.push(filters.status);
  }
  if (filters.agentId != null) {
    where.push("assigned_agent_id = ?");
    params.push(filters.agentId);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM clients ${whereClause} ORDER BY updated_at DESC`,
    params
  );
  return rows as Client[];
}

export async function getClientById(id: number): Promise<Client | null> {
  await ensureCrmSchema();
  const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM clients WHERE id = ?`, [id]);
  return (rows[0] as Client) ?? null;
}

export type ClientInput = {
  full_name: string;
  phone: string;
  email: string;
  status: ClientStatus;
  source: string;
  assigned_agent_id: number | null;
  notes: string;
};

export async function createClient(
  input: ClientInput,
  sourceLeadId: number | null = null
): Promise<number> {
  await ensureCrmSchema();
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO clients (full_name, phone, email, status, source, assigned_agent_id, source_lead_id, notes)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      input.full_name,
      input.phone || null,
      input.email || null,
      input.status,
      input.source || null,
      input.assigned_agent_id,
      sourceLeadId,
      input.notes || null,
    ]
  );
  return result.insertId;
}

export async function updateClient(id: number, input: ClientInput): Promise<void> {
  await ensureCrmSchema();
  await db.query(
    `UPDATE clients SET full_name=?, phone=?, email=?, status=?, source=?, assigned_agent_id=?, notes=?
     WHERE id=?`,
    [
      input.full_name,
      input.phone || null,
      input.email || null,
      input.status,
      input.source || null,
      input.assigned_agent_id,
      input.notes || null,
      id,
    ]
  );
}

export async function deleteClient(id: number): Promise<void> {
  await ensureCrmSchema();
  await db.query(`DELETE FROM clients WHERE id = ?`, [id]);
}

export async function listClientActivities(clientId: number): Promise<ClientActivity[]> {
  await ensureCrmSchema();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM client_activities WHERE client_id = ? ORDER BY created_at DESC`,
    [clientId]
  );
  return rows as ClientActivity[];
}

export async function addClientActivity(
  clientId: number,
  type: ClientActivity["type"],
  content: string
): Promise<void> {
  await ensureCrmSchema();
  await db.query(
    `INSERT INTO client_activities (client_id, type, content) VALUES (?,?,?)`,
    [clientId, type, content]
  );
  await db.query(`UPDATE clients SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [clientId]);
}

export async function listClientFollowups(clientId: number): Promise<ClientFollowup[]> {
  await ensureCrmSchema();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM client_followups WHERE client_id = ? ORDER BY is_done ASC, due_date ASC`,
    [clientId]
  );
  return rows as ClientFollowup[];
}

export async function addFollowup(
  clientId: number,
  dueDate: string,
  note: string
): Promise<void> {
  await ensureCrmSchema();
  await db.query(
    `INSERT INTO client_followups (client_id, due_date, note) VALUES (?,?,?)`,
    [clientId, dueDate, note || null]
  );
}

export async function markFollowupDone(id: number, done: boolean): Promise<void> {
  await ensureCrmSchema();
  await db.query(`UPDATE client_followups SET is_done = ? WHERE id = ?`, [done, id]);
}

export async function deleteFollowup(id: number): Promise<void> {
  await ensureCrmSchema();
  await db.query(`DELETE FROM client_followups WHERE id = ?`, [id]);
}

export type UpcomingFollowup = ClientFollowup & { client_full_name: string };

export async function listUpcomingFollowups(limit = 8): Promise<UpcomingFollowup[]> {
  await ensureCrmSchema();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT f.*, c.full_name AS client_full_name
     FROM client_followups f
     JOIN clients c ON c.id = f.client_id
     WHERE f.is_done = FALSE
     ORDER BY f.due_date ASC
     LIMIT ?`,
    [limit]
  );
  return rows as UpcomingFollowup[];
}

export async function createClientFromLead(leadId: number): Promise<number> {
  await ensureCrmSchema();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM contact_leads WHERE id = ?`,
    [leadId]
  );
  const lead = rows[0] as
    | { id: number; lead_type: string; name: string; phone: string | null; email: string | null; message: string | null }
    | undefined;
  if (!lead) throw new Error("Demande introuvable");

  const [existing] = await db.query<RowDataPacket[]>(
    `SELECT id FROM clients WHERE source_lead_id = ?`,
    [leadId]
  );
  if (existing[0]) return (existing[0] as { id: number }).id;

  const clientId = await createClient(
    {
      full_name: lead.name,
      phone: lead.phone || "",
      email: lead.email || "",
      status: "nouveau",
      source: lead.lead_type,
      assigned_agent_id: null,
      notes: lead.message || "",
    },
    leadId
  );
  return clientId;
}

export async function getClientBySourceLeadId(leadId: number): Promise<Client | null> {
  await ensureCrmSchema();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM clients WHERE source_lead_id = ?`,
    [leadId]
  );
  return (rows[0] as Client) ?? null;
}
