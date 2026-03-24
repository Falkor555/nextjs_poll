import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI manquant dans les variables d'environnement");

const client = await MongoClient.connect(uri);
const db = client.db();

// ── Personnalisez votre sondage ici ─────────────────────────────────────────
const poll = {
  question: "Quelle est votre option préférée ?",
  choices: ["Option A", "Option B", "Option C"],
};
// ────────────────────────────────────────────────────────────────────────────

const existing = await db.collection("polls").findOne({});

if (existing) {
  console.log("✔ Un sondage existe déjà :", existing.question);
  console.log("  Supprimez-le dans MongoDB Compass pour en insérer un nouveau.");
} else {
  await db.collection("polls").insertOne(poll);
  console.log("✅ Sondage inséré avec succès !");
  console.log("  Question :", poll.question);
  console.log("  Choix    :", poll.choices.join(", "));
}

await client.close();
