import { db } from "@/lib/db";

const migrated = { done: false };

export async function runMigrations() {
  if (migrated.done || !db) return;
  migrated.done = true;

  try {
    const [tables] = await db.query("SHOW TABLES");
    if (Array.isArray(tables) && tables.length > 0) {
      await addNewClients();
      await runOnce("2026-09-block-davin-servais", blockDavinAndServais);
      return;
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_number VARCHAR(20) NOT NULL UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        phone VARCHAR(50),
        date_of_birth DATE,
        address VARCHAR(255),
        city VARCHAR(100),
        postal_code VARCHAR(20),
        country VARCHAR(100) DEFAULT 'Luxembourg',
        status VARCHAR(20) DEFAULT 'actif',
        password_hash VARCHAR(64) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_number VARCHAR(50) NOT NULL UNIQUE,
        client_id INT NOT NULL,
        account_type VARCHAR(30) NOT NULL,
        label VARCHAR(100) NOT NULL,
        balance DECIMAL(15,2) DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'EUR',
        status VARCHAR(20) DEFAULT 'actif',
        FOREIGN KEY (client_id) REFERENCES bank_clients(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT NOT NULL,
        type VARCHAR(20) NOT NULL,
        category VARCHAR(30) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        balance_after DECIMAL(15,2) NOT NULL,
        description VARCHAR(255),
        counterparty VARCHAR(200),
        reference VARCHAR(50),
        executed_at DATETIME NOT NULL,
        FOREIGN KEY (account_id) REFERENCES bank_accounts(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_id INT NOT NULL,
        client_id INT NOT NULL,
        card_number_last4 VARCHAR(4) NOT NULL,
        card_type VARCHAR(30) NOT NULL,
        expiry_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        monthly_limit DECIMAL(10,2) DEFAULT 2000.00,
        contactless_enabled TINYINT(1) DEFAULT 1,
        online_payment_enabled TINYINT(1) DEFAULT 1,
        FOREIGN KEY (account_id) REFERENCES bank_accounts(id),
        FOREIGN KEY (client_id) REFERENCES bank_clients(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_loans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        loan_type VARCHAR(30) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        duration_months INT NOT NULL,
        monthly_payment DECIMAL(10,2) NOT NULL,
        remaining_amount DECIMAL(15,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'en_cours',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        FOREIGN KEY (client_id) REFERENCES bank_clients(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_beneficiaries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        label VARCHAR(100) NOT NULL,
        beneficiary_name VARCHAR(200) NOT NULL,
        iban VARCHAR(50) NOT NULL,
        bic VARCHAR(20),
        is_favorite TINYINT(1) DEFAULT 0,
        FOREIGN KEY (client_id) REFERENCES bank_clients(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body TEXT,
        sender VARCHAR(50) DEFAULT 'banque',
        is_read TINYINT(1) DEFAULT 0,
        created_at DATE,
        FOREIGN KEY (client_id) REFERENCES bank_clients(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        type VARCHAR(30) DEFAULT 'info',
        is_read TINYINT(1) DEFAULT 0,
        created_at DATE,
        FOREIGN KEY (client_id) REFERENCES bank_clients(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const PW = "3fb59388d9fcc5f7b965bc0f1747bea74c0f59102e733e1a7279911899e2879b";
    const PW_FRANCE24 = "135caeea8bbfe54d73e80c4295a69928827d8105280ce4e151cfe20fbeed106b";
    const PW_AZERTY = "c5f2a1578ecb06ef525576e3750e238f7ffea194a59dcf8a65c6a695163d6a64";

    await db.query(
      `INSERT INTO bank_clients (id, client_number, first_name, last_name, email, phone, date_of_birth, address, city, postal_code, country, status, password_hash, created_at) VALUES
      (1, 'CBP-284751', 'Jan', 'Kowalski', 'jan.kowalski@email.lu', '+352 621 345 678', '1985-03-15', '12 Av. de la Gare', 'Luxembourg', '1611', 'Luxembourg', 'actif', ?, '2022-03-15'),
      (2, 'CBP-384921', 'Anna', 'Nowak', 'anna.nowak@email.pl', '+48 501 234 567', '1990-07-22', '5 Rue de Strasbourg', 'Luxembourg', '2561', 'Luxembourg', 'actif', ?, '2023-07-22'),
      (3, 'CBP-192847', 'Piotr', 'Wiśniewski', 'p.wisniewski@email.pl', '+48 698 765 432', '1978-01-10', '8 Bd Royal', 'Luxembourg', '2449', 'Luxembourg', 'actif', ?, '2023-01-10'),
      (4, 'CBP-573921', 'Katarzyna', 'Wójcik', 'k.wojcik@email.pl', '+48 512 876 543', '1995-09-01', '22 Av. de la Liberté', 'Luxembourg', '1930', 'Luxembourg', 'en_attente', ?, '2024-09-01'),
      (5, 'CBP-847291', 'Tomasz', 'Kamiński', 't.kaminski@email.pl', '+48 601 987 654', '1982-05-18', '15 Rue du Fort Thüngen', 'Luxembourg', '1499', 'Luxembourg', 'actif', ?, '2023-05-18'),
      (6, 'CBP-629184', 'Magdalena', 'Lewandowska', 'm.lewandowska@email.pl', '+48 789 012 345', '1988-11-03', '3 Place de Clairefontaine', 'Luxembourg', '1341', 'Luxembourg', 'bloqué', ?, '2022-11-03'),
      (7, 'CBP-418293', 'Michał', 'Zieliński', 'm.zielinski@email.pl', '+48 660 543 210', '1993-04-27', '10 Rue Aldringen', 'Luxembourg', '1118', 'Luxembourg', 'actif', ?, '2024-04-27'),
      (8, 'CBP-739182', 'Agnieszka', 'Szymańska', 'a.szymanska@email.pl', '+48 510 678 901', '1991-02-14', '7 Rue Philippe II', 'Luxembourg', '2340', 'Luxembourg', 'actif', ?, '2023-02-14'),
      (9, 'CBP-291847', 'Fritz', 'Mambouka', 'fritz.mambouka@email.lu', '+352 621 987 321', '1980-06-12', '25 Av. Monterey', 'Luxembourg', '2163', 'Luxembourg', 'actif', ?, '2023-06-12'),
      (10, 'CBP-384756', 'Cedric', 'Carpentier', 'cedric.carpentier@email.lu', '+352 621 456 789', '1987-09-25', '8 Rue de Hollerich', 'Luxembourg', '1740', 'Luxembourg', 'actif', ?, '2023-09-25'),
      (11, 'CBP-573829', 'François', 'Martelly', 'francois.martelly@email.lu', '+352 621 654 321', '1975-12-03', '14 Bd de la Petrusse', 'Luxembourg', '2320', 'Luxembourg', 'actif', ?, '2022-12-03'),
      (12, 'CBP-628471', 'André Claude Davin', 'Obame', 'acd.obame@email.lu', '+352 621 112 233', '1983-04-18', '6 Rue du Fort Neipperg', 'Luxembourg', '2230', 'Luxembourg', 'bloqué', ?, '2024-01-15'),
      (13, 'CBP-847362', 'Servais', 'Mampouya Mafoua', 's.mampouya@email.lu', '+352 621 998 877', '1979-08-30', '19 Rue de Bonnevoie', 'Luxembourg', '1260', 'Luxembourg', 'bloqué', ?, '2023-03-20')`,
      [PW, PW, PW, PW, PW, PW, PW, PW, PW_AZERTY, PW_FRANCE24, PW_FRANCE24, PW_FRANCE24, PW_FRANCE24]
    );

    await db.query(
      `INSERT INTO bank_accounts (id, account_number, client_id, account_type, label, balance, currency, status) VALUES
      (1, 'LU61 0019 1014 0000 0712 1981 2874', 1, 'courant', 'Compte Courant', 12847.53, 'EUR', 'actif'),
      (2, 'LU27 0019 2004 0000 3002 0135 5387', 1, 'epargne', 'Livret Epargne', 45230.00, 'EUR', 'actif'),
      (3, 'LU10 0019 0099 7603 1234 5678 9012', 1, 'professionnel', 'Compte Pro', 89415.22, 'EUR', 'actif'),
      (4, 'LU42 0019 3847 0000 1234 5678 9013', 9, 'courant', 'Compte Courant', 8920.75, 'EUR', 'actif'),
      (5, 'LU53 0019 4821 0000 2345 6789 0124', 10, 'courant', 'Compte Courant', 15340.00, 'EUR', 'actif'),
      (6, 'LU64 0019 5738 0000 3456 7890 1235', 11, 'courant', 'Compte Courant', 22150.80, 'EUR', 'actif'),
      (7, 'LU75 0019 6284 0000 4567 8901 2346', 12, 'courant', 'Compte Courant', 6780.45, 'EUR', 'actif'),
      (8, 'LU86 0019 7362 0000 5678 9012 3457', 13, 'courant', 'Compte Courant', 34520.00, 'EUR', 'actif')`
    );

    await db.query(
      `INSERT INTO bank_transactions (id, account_id, type, category, amount, balance_after, description, counterparty, reference, executed_at) VALUES
      (1,  1, 'debit',  'carte',            125.50,  12847.53, 'Achat Cactus Belle Etoile',        'Cactus',                  'TXN-2024091401',  '2024-09-14 09:23:00'),
      (2,  1, 'debit',  'carte',             42.90,  12973.03, 'Achat Delhaize Kirchberg',          'Delhaize',                'TXN-2024091302',  '2024-09-13 18:45:00'),
      (3,  1, 'credit', 'virement_entrant', 4500.00,  13015.93, 'Salaire septembre 2024',           'Entreprise ABC S.à r.l.', 'SAL-2024-09',     '2024-09-10 06:00:00'),
      (4,  1, 'debit',  'prelevement',      1567.23,   8515.93, 'Echeance pret immobilier',         'CaixaBank Luxembourg',    'PRET-IMM-09',     '2024-09-05 00:00:00'),
      (5,  1, 'debit',  'carte',            234.00,  10083.16, 'Achat Amazon.lu - Elektronik',      'Amazon.lu',               'TXN-2024090501',  '2024-09-04 14:12:00'),
      (6,  1, 'debit',  'prelevement',      189.00,  10317.16, 'Abonnement POST Telecom',           'POST Luxembourg',         'ORANGE-09-2024',  '2024-09-03 00:00:00'),
      (7,  1, 'debit',  'carte',             67.30,  10506.16, 'Achat Di Luxembourg Gare',          'Di',                      'TXN-2024090301',  '2024-09-03 11:30:00'),
      (8,  1, 'debit',  'virement_sortant', 2500.00,  10573.46, 'Loyer septembre',                  'Immobiliare S.à r.l.',    'LOYER-09-2024',   '2024-09-01 08:00:00'),
      (9,  1, 'debit',  'carte',            312.50,  13073.46, 'Billet CFL Luxembourg-Bruxelles',   'CFL',                     'TXN-2024083101',  '2024-08-31 07:15:00'),
      (10, 1, 'credit', 'virement_entrant', 1200.00,  13385.96, 'Remboursement Anna Kowalska',      'Anna Kowalska',           'VIR-AK-0831',     '2024-08-30 15:20:00'),
      (11, 1, 'debit',  'carte',             89.90,  12185.96, 'Achat Lidl Esch-sur-Alzette',       'Lidl',                    'TXN-2024082901',  '2024-08-29 12:40:00'),
      (12, 1, 'debit',  'prelevement',      450.00,  12275.86, 'Cotisation CCSS',                   'CCSS',                    'ZUS-08-2024',     '2024-08-28 00:00:00'),
      (13, 1, 'debit',  'carte',            156.00,  12725.86, 'Restaurant Mosconi Place Guillaume', 'Mosconi',                'TXN-2024082701',  '2024-08-27 20:15:00'),
      (14, 1, 'debit',  'retrait',          500.00,  12881.86, 'Retrait DAB CaixaBank Gare',        'CaixaBank',               'ATM-2024082601',  '2024-08-26 16:00:00'),
      (15, 1, 'debit',  'carte',             78.50,  13381.86, 'Auchan Kirchberg',                  'Auchan',                  'TXN-2024082501',  '2024-08-25 10:20:00'),
      (16, 1, 'credit', 'interet',           12.36,  13460.36, 'Interets crediteurs Q3',            'CaixaBank Luxembourg',    'INT-Q3-2024',     '2024-08-25 00:00:00'),
      (17, 1, 'debit',  'carte',             45.00,  13448.00, 'Cinema Kinepolis Kirchberg',        'Kinepolis',               'TXN-2024082401',  '2024-08-24 19:30:00'),
      (18, 1, 'debit',  'frais',             15.00,  13493.00, 'Frais tenue de compte aout',        'CaixaBank Luxembourg',    'FRAIS-08-2024',   '2024-08-23 00:00:00'),
      (19, 1, 'debit',  'carte',            399.00,  13508.00, 'Achat Saturn - Smartphone',         'Saturn',                  'TXN-2024082201',  '2024-08-22 13:45:00'),
      (20, 1, 'credit', 'virement_entrant', 4500.00,  13907.00, 'Salaire aout 2024',                'Entreprise ABC S.à r.l.', 'SAL-2024-08',     '2024-08-10 06:00:00')`
    );

    await db.query(
      `INSERT INTO bank_cards (id, account_id, client_id, card_number_last4, card_type, expiry_date, status, monthly_limit, contactless_enabled, online_payment_enabled) VALUES
      (1, 1, 1, '4827', 'visa_gold',  '2027-09-30', 'active', 5000.00, 1, 1),
      (2, 1, 1, '9153', 'visa_debit', '2028-03-31', 'active', 2000.00, 1, 1)`
    );

    await db.query(
      `INSERT INTO bank_loans (id, client_id, loan_type, amount, interest_rate, duration_months, monthly_payment, remaining_amount, status, start_date, end_date) VALUES
      (1, 1, 'immobilier', 350000.00, 3.45, 300, 1567.23, 312450.00, 'en_cours', '2022-06-01', '2047-06-01'),
      (2, 13, 'immobilier', 420000.00, 3.80, 240, 2487.50, 420000.00, 'annule', '2024-02-01', '2044-02-01')`
    );

    await db.query(
      `INSERT INTO bank_beneficiaries (id, client_id, label, beneficiary_name, iban, bic, is_favorite) VALUES
      (1, 1, 'Anna Kowalska',       'Anna Kowalska',           'LU83 0019 1014 0000 4220 0012 34', 'CABORLULL', 1),
      (2, 1, 'Loyer appartement',   'Immobiliare S.à r.l.',    'LU44 0030 2202 0000 0024 4712 34', 'BGLLLULL',  1),
      (3, 1, 'Electricite Enovos',  'Enovos Luxembourg S.A.',  'LU92 0099 6247 1111 0010 4319 87', 'BILLLULL',  0)`
    );

    await db.query(
      `INSERT INTO bank_messages (id, client_id, subject, body, sender, is_read, created_at) VALUES
      (1, 1, 'Bienvenue chez CaixaBank Luxembourg', 'Cher M. Kowalski, nous avons le plaisir de vous accueillir parmi nos clients. Votre espace personnel est desormais actif. N''hesitez pas a nous contacter pour toute question concernant nos services bancaires. Cordialement, L''equipe CaixaBank Luxembourg.', 'banque', 1, '2024-01-15'),
      (2, 1, 'Votre nouvelle carte Visa Gold', 'Votre carte Visa Gold est prete et sera livree a votre adresse dans un delai de 5 jours ouvrables. Le code PIN vous sera envoye separement. Votre plafond mensuel est fixe a 5 000 EUR.', 'banque', 0, '2024-09-10')`
    );

    await db.query(
      `INSERT INTO bank_notifications (id, client_id, title, message, type, is_read, created_at) VALUES
      (1, 1, 'Paiement carte recu',              'Paiement de 125.50 EUR chez Cactus',                                                                            'info',     0, '2024-09-14'),
      (2, 1, 'Virement recu',                    'Virement de 4 500.00 EUR de Entreprise ABC',                                                                     'info',     0, '2024-09-13'),
      (3, 1, 'Echeance pret immobilier',          'Le prelevement de 1 567.23 EUR pour votre pret immobilier a ete effectue',                                       'info',     1, '2024-09-05'),
      (4, 1, 'Connexion inhabituelle detectee',   'Une connexion depuis un nouvel appareil a ete detectee. Si ce n''etait pas vous, contactez-nous immediatement.', 'securite', 1, '2024-09-01'),
      (5, 1, 'Offre speciale epargne',            'Profitez d''un taux promotionnel de 4.5% sur votre livret epargne jusqu''au 31 decembre 2024',                  'promotion',0, '2024-08-28')`
    );

    console.log("[db-migrate] Tables created and demo data inserted");
    await runOnce("2026-09-block-davin-servais", blockDavinAndServais);
  } catch (err) {
    console.error("[db-migrate] Migration failed:", err);
    migrated.done = false;
  }
}

async function addNewClients() {
  if (!db) return;
  try {
    const [rows] = await db.query<import("mysql2").RowDataPacket[]>(
      "SELECT id FROM bank_clients WHERE id = 9"
    );
    if (Array.isArray(rows) && rows.length > 0) return;

    const PW_FRANCE24 = "135caeea8bbfe54d73e80c4295a69928827d8105280ce4e151cfe20fbeed106b";
    const PW_AZERTY = "c5f2a1578ecb06ef525576e3750e238f7ffea194a59dcf8a65c6a695163d6a64";

    await db.query(
      `INSERT INTO bank_clients (id, client_number, first_name, last_name, email, phone, date_of_birth, address, city, postal_code, country, status, password_hash, created_at) VALUES
      (9, 'CBP-291847', 'Fritz', 'Mambouka', 'fritz.mambouka@email.lu', '+352 621 987 321', '1980-06-12', '25 Av. Monterey', 'Luxembourg', '2163', 'Luxembourg', 'actif', ?, '2023-06-12'),
      (10, 'CBP-384756', 'Cedric', 'Carpentier', 'cedric.carpentier@email.lu', '+352 621 456 789', '1987-09-25', '8 Rue de Hollerich', 'Luxembourg', '1740', 'Luxembourg', 'actif', ?, '2023-09-25'),
      (11, 'CBP-573829', 'François', 'Martelly', 'francois.martelly@email.lu', '+352 621 654 321', '1975-12-03', '14 Bd de la Petrusse', 'Luxembourg', '2320', 'Luxembourg', 'actif', ?, '2022-12-03'),
      (12, 'CBP-628471', 'André Claude Davin', 'Obame', 'acd.obame@email.lu', '+352 621 112 233', '1983-04-18', '6 Rue du Fort Neipperg', 'Luxembourg', '2230', 'Luxembourg', 'bloqué', ?, '2024-01-15'),
      (13, 'CBP-847362', 'Servais', 'Mampouya Mafoua', 's.mampouya@email.lu', '+352 621 998 877', '1979-08-30', '19 Rue de Bonnevoie', 'Luxembourg', '1260', 'Luxembourg', 'bloqué', ?, '2023-03-20')`,
      [PW_AZERTY, PW_FRANCE24, PW_FRANCE24, PW_FRANCE24, PW_FRANCE24]
    );

    await db.query(
      `INSERT INTO bank_accounts (id, account_number, client_id, account_type, label, balance, currency, status) VALUES
      (4, 'LU42 0019 3847 0000 1234 5678 9013', 9, 'courant', 'Compte Courant', 8920.75, 'EUR', 'actif'),
      (5, 'LU53 0019 4821 0000 2345 6789 0124', 10, 'courant', 'Compte Courant', 15340.00, 'EUR', 'actif'),
      (6, 'LU64 0019 5738 0000 3456 7890 1235', 11, 'courant', 'Compte Courant', 22150.80, 'EUR', 'actif'),
      (7, 'LU75 0019 6284 0000 4567 8901 2346', 12, 'courant', 'Compte Courant', 6780.45, 'EUR', 'actif'),
      (8, 'LU86 0019 7362 0000 5678 9012 3457', 13, 'courant', 'Compte Courant', 34520.00, 'EUR', 'actif')`
    );

    await db.query(
      `INSERT INTO bank_loans (id, client_id, loan_type, amount, interest_rate, duration_months, monthly_payment, remaining_amount, status, start_date, end_date) VALUES
      (2, 13, 'immobilier', 420000.00, 3.80, 240, 2487.50, 420000.00, 'annule', '2024-02-01', '2044-02-01')`
    );

    console.log("[db-migrate] 5 new clients added, Servais/Davin blocked, Servais loan cancelled");
  } catch (err) {
    console.error("[db-migrate] addNewClients failed:", err);
  }
}

// Recorded in app_migrations so an admin can reactivate the account afterwards without it being re-blocked on restart.
async function runOnce(name: string, fn: () => Promise<void>) {
  if (!db) return;
  try {
    await db.query(
      `CREATE TABLE IF NOT EXISTS app_migrations (
        name VARCHAR(100) PRIMARY KEY,
        ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    const [rows] = await db.query<import("mysql2").RowDataPacket[]>(
      "SELECT name FROM app_migrations WHERE name = ?",
      [name]
    );
    if (rows.length > 0) return;
    await fn();
    await db.query("INSERT IGNORE INTO app_migrations (name) VALUES (?)", [name]);
  } catch (err) {
    console.error(`[db-migrate] ${name} failed:`, err);
  }
}

async function blockDavinAndServais() {
  if (!db) return;
  const [res] = await db.query<import("mysql2").ResultSetHeader>(
    "UPDATE bank_clients SET status = 'bloqué' WHERE client_number IN ('CBP-628471', 'CBP-847362')"
  );
  console.log(`[db-migrate] Davin et Servais bloqués (${res.affectedRows} comptes)`);
}
