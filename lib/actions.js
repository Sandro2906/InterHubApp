"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

function getTextValue(formData, name) {
  return String(formData.get(name) || "").trim();
}

function parseRating(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 1 || numeric > 10) {
    throw new Error("Odgovor mora biti broj između 1 i 10.");
  }
  return Math.round(numeric);
}

export async function registerUser(formData) {
  const ime = formData.get("ime");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const linkedin_url = formData.get("linkedin_url");

  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new Error("Email već postoji.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (ime, email, password, role, linkedin_url) VALUES (?, ?, ?, ?, ?)",
    [ime, email, hashedPassword, role, linkedin_url || null]
  );

  redirect("/login");
}

export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Pogrešan email ili password.");
  }

  const user = rows[0];

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    throw new Error("Pogrešan email ili password.");
  }

  const cookieStore = await cookies();

  cookieStore.set(
    "session_user",
    encodeURIComponent(
      JSON.stringify({
        id: user.id,
        ime: user.ime,
        email: user.email,
        role: user.role,
      })
    ),
    {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    }
  );

  if (user.role === "firma") {
    redirect("/firmaDashboard");
  }

  redirect("/oglasi");
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session_user");
  redirect("/");
}

export async function updateOglas(formData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "firma") {
    redirect("/login");
  }

  const id = formData.get("id");
  const pozicija = formData.get("pozicija");
  const firma = formData.get("firma");
  const lokacija = formData.get("lokacija");
  const tip = formData.get("tip");
  const iskustvo = formData.get("iskustvo");
  const plata = formData.get("plata");
  const datum = formData.get("datum");

  const question1 = getTextValue(formData, "question1");
  const question2 = getTextValue(formData, "question2");
  const question3 = getTextValue(formData, "question3");

  if (!question1 || !question2 || !question3) {
    throw new Error("Oglas mora imati barem 3 pitanja.");
  }

  await db.query(
    `
    UPDATE oglas
    SET Pozicija = ?, Firma = ?, Lokacija = ?, Tip = ?, Iskustvo = ?, Plata = ?, Datum = ?
    WHERE OglasID = ? AND user_id = ?
    `,
    [pozicija, firma, lokacija, tip, iskustvo, plata, datum, id, user.id]
  );

  await db.query("DELETE FROM oglas_pitanje WHERE oglas_id = ?", [id]);

  await db.query(
    "INSERT INTO oglas_pitanje (oglas_id, pitanje, pozicija) VALUES (?, ?, ?)",
    [id, question1, 1]
  );
  await db.query(
    "INSERT INTO oglas_pitanje (oglas_id, pitanje, pozicija) VALUES (?, ?, ?)",
    [id, question2, 2]
  );
  await db.query(
    "INSERT INTO oglas_pitanje (oglas_id, pitanje, pozicija) VALUES (?, ?, ?)",
    [id, question3, 3]
  );

  revalidatePath(`/firmaDashboard/${id}`);
}

export async function deleteOglas(formData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "firma") {
    redirect("/login");
  }

  const id = formData.get("id");

  await db.query(
    "DELETE FROM oglas WHERE OglasID = ? AND user_id = ?",
    [id, user.id]
  );

  revalidatePath("/firmaDashboard");
  redirect("/firmaDashboard");
}

export async function createOglas(formData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "firma") {
    redirect("/login");
  }

  const pozicija = formData.get("pozicija");
  const firma = formData.get("firma");
  const lokacija = formData.get("lokacija");
  const tip = formData.get("tip");
  const iskustvo = formData.get("iskustvo");
  const plata = formData.get("plata");
  const datum = formData.get("datum");
  const question1 = getTextValue(formData, "question1");
  const question2 = getTextValue(formData, "question2");
  const question3 = getTextValue(formData, "question3");

  if (!question1 || !question2 || !question3) {
    throw new Error("Oglas mora imati barem 3 pitanja.");
  }

  const [result] = await db.query(
    `
    INSERT INTO oglas (Pozicija, Firma, Lokacija, Tip, Iskustvo, Plata, Datum, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [pozicija, firma, lokacija, tip, iskustvo, plata, datum, user.id]
  );

  const oglasId = result.insertId;

  await db.query(
    "INSERT INTO oglas_pitanje (oglas_id, pitanje, pozicija) VALUES (?, ?, ?)",
    [oglasId, question1, 1]
  );
  await db.query(
    "INSERT INTO oglas_pitanje (oglas_id, pitanje, pozicija) VALUES (?, ?, ?)",
    [oglasId, question2, 2]
  );
  await db.query(
    "INSERT INTO oglas_pitanje (oglas_id, pitanje, pozicija) VALUES (?, ?, ?)",
    [oglasId, question3, 3]
  );

  revalidatePath("/firmaDashboard");
  redirect("/firmaDashboard");
}

export async function applyToJob(formData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "osoba") {
    throw new Error("Samo korisnik kao osoba može aplicirati.");
  }

  const oglasId = formData.get("oglasId");
  const poruka = getTextValue(formData, "poruka");

  const [existing] = await db.query(
    "SELECT * FROM prijave WHERE oglas_id = ? AND user_id = ?",
    [oglasId, user.id]
  );

  if (existing.length > 0) {
    throw new Error("Već si aplicirao na ovaj oglas.");
  }

  const [questions] = await db.query(
    "SELECT id FROM oglas_pitanje WHERE oglas_id = ? ORDER BY pozicija",
    [oglasId]
  );

  if (questions.length < 3) {
    throw new Error("Oglas trenutno nema dovoljno pitanja.");
  }

  const answers = questions.map((question) => {
    const value = formData.get(`answer_${question.id}`);
    return {
      questionId: question.id,
      value: parseRating(value),
    };
  });

  const [result] = await db.query(
    "INSERT INTO prijave (oglas_id, user_id, poruka) VALUES (?, ?, ?)",
    [oglasId, user.id, poruka || null]
  );

  const prijavaId = result.insertId;

  for (const answer of answers) {
    await db.query(
      "INSERT INTO prijava_odgovor (prijava_id, pitanje_id, vrijednost) VALUES (?, ?, ?)",
      [prijavaId, answer.questionId, answer.value]
    );
  }

  revalidatePath(`/oglasi/${oglasId}`);
}

export async function updateLinkedin(formData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "osoba") {
    redirect("/");
  }

  const linkedin_url = formData.get("linkedin_url");

  await db.query(
    "UPDATE users SET linkedin_url = ? WHERE id = ?",
    [linkedin_url || null, user.id]
  );

  revalidatePath("/profil");
}