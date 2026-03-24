import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const db = await getDb();
  const votes = await db.collection("votes").find().toArray();
  return NextResponse.json(votes);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { choice } = await request.json();

  if (!choice)
    return NextResponse.json({ error: "Choix manquant" }, { status: 400 });

  const db = await getDb();

  // Guard clause : Vérification du vote unique
  const existingVote = await db.collection("votes").findOne({ userId: session.user.id });
  if (existingVote)
    return NextResponse.json({ error: "Vous avez déjà voté" }, { status: 403 });

  const vote = {
    choice: choice,
    createdAt: new Date(),
    userId: session.user.id,
  };
  
  await db.collection("votes").insertOne(vote);
  return NextResponse.json(vote, { status: 201 });
}