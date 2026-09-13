import mysql from "mysql2/promise";

// Le pool est mis en cache sur `globalThis` pour survivre au rechargement à
// chaud en développement (sinon Next.js recréerait un pool à chaque
// modification de fichier, jusqu'à épuiser les connexions disponibles).
const globalForDb = globalThis as unknown as { mysqlPool?: mysql.Pool };

function createPool(): mysql.Pool {
  const url = process.env.DATABASE_URL;

  if (url) {
    return mysql.createPool(url);
  }

  // Repli sur les variables individuelles fournies par le plugin MySQL de
  // Railway, si DATABASE_URL n'est pas défini.
  return mysql.createPool({
    host: process.env.MYSQLHOST || "localhost",
    port: Number(process.env.MYSQLPORT) || 3306,
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "maison_fritz",
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export const db = globalForDb.mysqlPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = db;
}
