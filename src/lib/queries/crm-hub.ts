import { db } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const globalForCrmHub = globalThis as unknown as { crmHubSchemaReady?: Promise<void> };

function ensureCrmHubSchema(): Promise<void> {
  if (!globalForCrmHub.crmHubSchemaReady) {
    globalForCrmHub.crmHubSchemaReady = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS crm_team_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          sender_name VARCHAR(191) NOT NULL DEFAULT 'Admin',
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      await db.query(`
        CREATE TABLE IF NOT EXISTS crm_ai_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          role ENUM('user','assistant') NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    })();
  }
  return globalForCrmHub.crmHubSchemaReady;
}

export type TeamMessage = {
  id: number;
  sender_name: string;
  body: string;
  created_at: string;
};

export async function listTeamMessages(limit = 50): Promise<TeamMessage[]> {
  await ensureCrmHubSchema();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM crm_team_messages ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
  return (rows as TeamMessage[]).reverse();
}

export async function sendTeamMessage(senderName: string, body: string): Promise<number> {
  await ensureCrmHubSchema();
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO crm_team_messages (sender_name, body) VALUES (?, ?)`,
    [senderName, body]
  );
  return result.insertId;
}

export type AiMessage = {
  id: number;
  role: "user" | "assistant";
  body: string;
  created_at: string;
};

export async function listAiMessages(limit = 50): Promise<AiMessage[]> {
  await ensureCrmHubSchema();
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT * FROM crm_ai_messages ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
  return (rows as AiMessage[]).reverse();
}

export async function saveAiMessage(role: "user" | "assistant", body: string): Promise<number> {
  await ensureCrmHubSchema();
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO crm_ai_messages (role, body) VALUES (?, ?)`,
    [role, body]
  );
  return result.insertId;
}

export async function clearAiHistory(): Promise<void> {
  await ensureCrmHubSchema();
  await db.query(`DELETE FROM crm_ai_messages`);
}

export type CrmStats = {
  totalProperties: number;
  activeProperties: number;
  totalClients: number;
  newClients: number;
  pendingLeads: number;
  upcomingFollowups: number;
};

export async function getCrmStats(): Promise<CrmStats> {
  await ensureCrmHubSchema();
  const [[propRows]] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total, SUM(status='disponible') as active FROM properties`
  );
  const [[clientRows]] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total, SUM(status='nouveau') as nouveau FROM clients`
  );
  const [[leadRows]] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as c FROM contact_leads WHERE is_treated = FALSE`
  );
  const [[followupRows]] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) as c FROM client_followups WHERE is_done = FALSE`
  );
  return {
    totalProperties: Number(propRows?.total || 0),
    activeProperties: Number(propRows?.active || 0),
    totalClients: Number(clientRows?.total || 0),
    newClients: Number(clientRows?.nouveau || 0),
    pendingLeads: Number(leadRows?.c || 0),
    upcomingFollowups: Number(followupRows?.c || 0),
  };
}
