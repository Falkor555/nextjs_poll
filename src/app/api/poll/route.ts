import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await getDb();
  
  // Récupère le premier document de la collection "polls"
  const poll = await db.collection("polls").findOne({});

  if (!poll) {
    return NextResponse.json({ error: "Aucun sondage trouvé" }, { status: 404 });
  }

  return NextResponse.json(poll);
}