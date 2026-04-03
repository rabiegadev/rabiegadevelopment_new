import "dotenv/config";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { users } from "../src/db/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Administrator";

  if (!url) {
    console.error("Brak DATABASE_URL");
    process.exit(1);
  }
  if (!email || !password) {
    console.error("Ustaw SEED_ADMIN_EMAIL i SEED_ADMIN_PASSWORD");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    console.log("Użytkownik już istnieje — pomijam seed:", email);
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    email,
    name,
    role: "admin",
    passwordHash,
    active: true,
  });

  console.log("Utworzono konto administratora:", email);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
