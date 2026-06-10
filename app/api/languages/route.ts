import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT "Id", "Language" FROM "LanguageDicts" ORDER BY "Id" ASC'
    );

    return NextResponse.json({
      success: true,
      languages: result.rows,
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
