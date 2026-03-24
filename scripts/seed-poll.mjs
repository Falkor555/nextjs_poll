import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Lecture du fichier .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

let MONGODB_URI = "";
try {
  const env = readFileSync(envPath, "utf-8");
  const match = env.match(/^MONGODB_URI=(.+)$/m);
  if (match) MONGODB_URI = match[1].trim();
} catch {
  console.error("❌  Impossible de lire .env.local");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI introuvable dans .env.local");
  process.exit(1);
}

const poll = {
  question: "Quel est votre outil préféré pour styliser une application React ?",
  choices: ["Tailwind CSS", "Sass / SCSS", "CSS Modules"],
  createdAt: new Date(),
};

const client = await MongoClient.connect(MONGODB_URI);
const db = client.db();

// Evite les doublons : supprime l'éventuel sondage existant avant d'insérer
await db.collection("polls").deleteMany({});
const result = await db.collection("polls").insertOne(poll);

console.log("✅  Sondage inséré avec l'id :", result.insertedId.toString());
await client.close();
